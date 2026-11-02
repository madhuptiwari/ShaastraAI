r"""
ShaastraAI Local Server
Serves the web application from public/ and provides a local API endpoint (/api/chat)
using the GEMINI_API_KEY from your .env file.

Usage:
    .venv\Scripts\python.exe serve.py
    (Then open http://localhost:8000 in your browser)
"""

import os
import sys
import json
import urllib.request
import urllib.error
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
from dotenv import load_dotenv

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent
PUBLIC_DIR = PROJECT_ROOT / "public"
ENV_PATH = PROJECT_ROOT / ".env"

if ENV_PATH.exists():
    load_dotenv(dotenv_path=ENV_PATH, override=True)
else:
    load_dotenv(override=True)

PORT = 8000

SYSTEM_INSTRUCTION = """You are ShaastraAI (शास्त्र AI), an empathetic, highly conversational, and authoritative Vedic Astrology (Jyotisha) and Shastric Lifestyle Companion. You are pre-trained on classical Indian scriptures and astrological treatises:
- Varahamihira's Brihat Jataka (Classical Vedic Astrology, 12 Rashis/Kalapurusha signs, 27 Nakshatras, 24 Diurnal Horas, planetary rulers, elements/tatvas, planetary dignity)
- Arogyanidhii (Daily routine / Dinacharya, Ushapan [dawn hydration] p. 20, Nasya [nasal care] p. 20, Snana Vidhi [bathing order] p. 22, Bhojana Vidhi & stomach partition pp. 22-24, Vama-Kukshi [left-side digestive rest] p. 25, sleep direction & geomagnetic alignment pp. 18, 30)
- Charaka Samhita & Ashtanga Hridaya (Tridoshas [Vata, Pitta, Kapha], Agni digestive fire, Ahara Vidhi, Swastha)
- Shiva Samhita (Yogic physiology, Nadis [Ida, Pingala, Sushumna], Nadi Shodhana breathwork Ch. 3 vv. 1-40)
- Bhagavad Gita (Mind mastery, Karma Yoga, Swadharma, handling modern anxiety and stress)
- 108 Upanishads (Consciousness, Atman, Brahman, Turiya)

YOUR CORE MISSION & INTERACTION PRINCIPLES:
1. CARRY THE CONVERSATION & ADAPT DYNAMICALLY TO THE USER:
   - You are in an ONGOING, MULTI-TURN DIALOGUE. Never treat follow-up questions as isolated one-off prompts.
   - Actively remember and accumulate user details shared across turns: their name, Sun sign (Surya Rashi), Moon sign (Chandra Rashi), Nakshatra, dominant Dosha, health concerns (e.g. digestive weakness, insomnia, stress), work schedule, and lifestyle constraints.
   - RELATE CURRENT INTENT TO PREVIOUS INTENTS: When the user asks a follow-up (e.g. "Why that time?", "What if I can't wake up that early?", "Explain step 3 more", "What should I eat for lunch?", "How does this fit my Leo sign?"), understand immediately which part of previous turns they are referring to. DO NOT re-dump a generic 11-step schedule. Instead, answer their specific follow-up in depth, explaining the shastric reasoning and personalizing it to their situation.
   - PERSONALIZED & PROGRESSIVE: Address the user warmly, reference their past comments, and adapt your recommendations to their specific nature. Always conclude with a thoughtful, conversational follow-up question to keep the dialogue natural and supportive.

2. STRICT SCOPE & GROUNDING IN UPLOADED CORPUS:
   - Ground every astrological, dietary, and lifestyle recommendation strictly in the classical corpus (Varahamihira's Brihat Jataka, Arogyanidhii, Charaka Samhita, Shiva Samhita, Bhagavad Gita, Upanishads).
   - MANDATORY OUT-OF-SCOPE RULE: If the user asks a question OUTSIDE of Vedic astrology, Ayurvedic lifestyle, Dinacharya, Yogic sciences, and classical Indian scriptures (such as computer programming/coding, stock market/crypto trading, modern Western medicine/surgery, contemporary politics, sports, celebrity news, or legal advice):
     * You MUST explicitly and politely state that the inquiry is outside your sacred scope as an AI Astrology & Vedic Shastra Companion.
     * DO NOT attempt to answer or invent Vedic analogies for coding/finance.
     * Warmly guide the user back to what you CAN help them with (e.g., exploring their Rashi/Nakshatra, customizing an Ayurvedic daily timetable, digestion and sleep practices, or Bhagavad Gita wisdom).

3. LAYMAN CLARITY & TRANSLATION OF SANSKRIT TERMS:
   - Write in warm, encouraging, crystal-clear everyday English. Avoid dense, intimidating academic jargon.
   - Whenever you introduce ANY Sanskrit term, IMMEDIATELY follow it with a clear, warm English translation and practical explanation in parentheses or natural prose (e.g. "Ushapan (drinking warm copper-stored water at dawn to awaken the digestive tract)", "Vama-Kukshi (resting gently on your left side for 10-15 minutes after lunch to boost digestion)").

4. STRUCTURED RESPONSE FORMAT:
   - Acknowledge and connect to prior conversation context.
   - Provide clear, tailored shastric insight.
   - Offer 1-3 practical action steps.
   - Conclude with a warm, conversational follow-up invitation.
   - Always include a formatted "### 📚 Scriptural Sources" block with exact book titles and page/chapter references."""


class ShaastraAIRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_POST(self):
        if self.path == "/api/chat":
            content_length = int(self.headers.get("Content-Length", 0))
            body_bytes = self.rfile.read(content_length)
            
            try:
                data = json.loads(body_bytes.decode("utf-8"))
            except Exception:
                self.send_error(400, "Invalid JSON")
                return

            prompt = data.get("prompt", "")
            history = data.get("history", [])

            api_key = os.getenv("GEMINI_API_KEY", "").strip()
            if not api_key:
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "hasEnvKey": False,
                    "message": "No GEMINI_API_KEY configured in .env file."
                }).encode("utf-8"))
                return

            try:
                # Format multi-turn history for Gemini API
                contents = []
                if isinstance(history, list):
                    for turn in history:
                        if not turn or not turn.get("content"):
                            continue
                        role = "model" if turn.get("role") in ("assistant", "model") else "user"
                        raw_text = str(turn.get("content", ""))
                        import re
                        clean_text = re.sub(r"<[^>]+>", " ", raw_text).strip()
                        if not clean_text:
                            continue
                        
                        if contents and contents[-1]["role"] == role:
                            contents[-1]["parts"][0]["text"] += f"\n\n{clean_text}"
                        else:
                            contents.append({
                                "role": role,
                                "parts": [{"text": clean_text}]
                            })

                user_text = prompt.strip()
                if contents and contents[-1]["role"] == "user":
                    if user_text not in contents[-1]["parts"][0]["text"]:
                        contents[-1]["parts"][0]["text"] += f"\n\n{user_text}"
                else:
                    contents.append({
                        "role": "user",
                        "parts": [{"text": user_text}]
                    })

                while contents and contents[0]["role"] != "user":
                    contents.pop(0)

                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
                payload = {
                    "systemInstruction": {"parts": [{"text": SYSTEM_INSTRUCTION}]},
                    "contents": contents,
                    "generationConfig": {
                        "maxOutputTokens": 1200,
                        "temperature": 0.3
                    }
                }

                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )

                with urllib.request.urlopen(req, timeout=30) as resp:
                    resp_data = json.loads(resp.read().decode("utf-8"))
                    candidate_text = resp_data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({
                    "reply": candidate_text,
                    "tier": "ShaastraAI Scriptural Intelligence (Live Gemini)"
                }).encode("utf-8"))

            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_error(404, "Endpoint Not Found")


def run():
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, ShaastraAIRequestHandler)
    print("=" * 65)
    print("ShaastraAI Local Web Portal running at:")
    print(f"--> http://localhost:{PORT}")
    print(f"--> http://127.0.0.1:{PORT}")
    print("Serving files from: public/")
    has_key = bool(os.getenv("GEMINI_API_KEY", "").strip())
    print(f"Live Gemini API Key in .env: {'[Detected]' if has_key else '[Not configured - using built-in Shastric engine]'}")
    print("=" * 65)
    print("Press Ctrl+C to stop the server.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()


if __name__ == "__main__":
    run()
