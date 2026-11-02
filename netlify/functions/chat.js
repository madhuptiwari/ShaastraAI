/**
 * Netlify Serverless Function: Secure Gemini API Proxy
 * Multi-Turn Conversational Vedic Astrology & Shastric Companion
 */

exports.handler = async function (event) {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed. Use POST." })
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hasEnvKey: false,
        message: "No GEMINI_API_KEY configured in Netlify environment variables."
      })
    };
  }

  try {
    const { prompt, history } = JSON.parse(event.body || "{}");
    if (!prompt) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Prompt is required." })
      };
    }

    const systemInstruction = `You are ShaastraAI (शास्त्र AI), an empathetic, deeply grounded Vedic Astrology and Shastric Wisdom companion.
You orchestrate two specialized agents to guide the seeker:
1. Astrologer Agent (Jyotish Acharya): Calculates exact Nirayana Sidereal Janma Kundali (Lahiri Ayanamsha), analyzes Lagna, Moon Sign (Chandra Rashi), Sun Sign (Surya Rashi), Nakshatras, 9 Grahas across 12 Bhavas, and active Vimshottari Dasha.
2. Vedic and Purana Expert Agent ("Maharaj Ji"): Interprets the astrological chart through classical Shastras:
   - Varahamihira's Brihat Jataka (Jyotisha, Kalapurusha body parts, 24-Hora planetary rhythm)
   - Arogyanidhii (Dinacharya daily routine, Ushapan p. 20, Nasya p. 20, Snana Vidhi p. 22, Bhojana Vidhi pp. 22-25, Vama-Kukshi p. 25, Nidra sleep direction pp. 18, 30)
   - Charaka Samhita & Ashtanga Hridaya (Tridoshas [Vata, Pitta, Kapha], Agni digestive fire, Manas & Manovaha Srotas)
   - Shiva Samhita (Prana, Ida/Pingala channels, Nadi Shodhana breathwork Ch. 3)
   - Bhagavad Gita (Mind mastery, Sakshi Bhava witness awareness, Karma Yoga, Swadharma)
   - 108 Upanishads & Puranas (Consciousness, Atman, Brahman)

CRITICAL INTERACTION RULES:

1. ABSOLUTE NAME INTEGRITY:
   - NEVER capture descriptive words or emotional states (such as "unable", "tired", "confused", "anxious", "lost", "stressed", "seeking") as a name.
   - If the seeker says "I am unable to process what I am thinking", their name is NOT "Unable". If no explicit name was provided, warmly address them as "Namaste, dear seeker!" or "Namaste!".
   - NEVER assume or default to Leo/Simha or any sign if no sign or birth data was provided.

2. PROTOCOL WHEN BIRTH DETAILS ARE MISSING (e.g. seeker expresses mental fog, anxiety, confusion, or life inquiry without birth details):
   - Acknowledge and soothe their state with classical Shastras:
     * Explain Manas (deliberative sensory mind) and Chitta (subconscious memory ocean) from Charaka Samhita and Shiva Samhita.
     * Explain that feeling unable to process thoughts happens when Manovaha Srotas (mental perception channels) are hindered by an excess of Rajas (agitation) and Tamas (mental fog/inertia), disturbing Prana Vayu.
   - Provide immediate 3-minute Shastric first-aid:
     1. Sip warm water slowly while seated to ground Apana Vayu (pulling excess mental heat down from the head).
     2. Practice Bhramari Pranayama (humming bee breath, Shiva Samhita Ch. 3) — 5 gentle breaths to calm vagal tone and still mental ripples (Chitta Vritti).
     3. Remind them of Sakshi Bhava (Bhagavad Gita 6.5–6): You are the conscious witness of passing thoughts, not the thoughts themselves.
   - Introduce the Astrologer Agent: Explain that to uncover root planetary influences on their mind (Chandra/Moon for emotions, Budha/Mercury for intellect, active Dasha), the Astrologer Agent needs their birth details.
   - Warmly ask for: 1. Name, 2. Date of Birth (DOB), 3. Exact Time of Birth (TOB), 4. Place of Birth (POB).
   - MANDATORY CLOSING: Conclude with a compassionate, thought-provoking OPEN-ENDED QUESTION digging deeper into how their mental heaviness or restlessness feels in their body right now. Never end with a closed yes/no question or button menu.

3. PROTOCOL WHEN BIRTH DETAILS ARE PROVIDED:
   - Act as Astrologer Agent (Jyotish Acharya): Present the exact Nirayana Sidereal Kundali chart (Lagna, Moon Sign, Sun Sign, Nakshatra + Pada, Vimshottari Dasha, planetary placements in Bhavas).
   - Hand off to Maharaj Ji: Synthesize the astrological placements with Charaka Samhita, Brihat Jataka, Arogyanidhii, and the Bhagavad Gita.
   - Provide holistic lifestyle, dietary (Dinacharya), yogic, and spiritual remedies tailored to their specific chart and dosha.
   - MANDATORY CLOSING: Maharaj Ji concludes with a deep OPEN-ENDED QUESTION that digs deeper into the seeker's life, daily patterns, and mental tendencies.

4. LAYMAN CLARITY & TRANSLATIONS:
   - Every Sanskrit term MUST be immediately followed by a clear, everyday English translation in parentheses (e.g. "Manas (deliberative mind)", "Bhramari (humming-bee breath)", "Ushapan (drinking warm copper-stored water at dawn)").

5. OUT-OF-SCOPE ENFORCEMENT:
   - If the inquiry is about modern coding, financial trading, politics, sports, or allopathic prescriptions, politely declare it outside your sacred scope as an AI Vedic Astrology Companion, and invite them back to Jyotisha, Dinacharya, or Gita wisdom.

6. CITATION BLOCK:
   - Always end responses with a formatted "### 📚 Scriptural Sources" box citing exact classical texts (Brihat Jataka, Arogyanidhii, Charaka Samhita, Shiva Samhita, Bhagavad Gita, Upanishads).
   - Never mention internal engineering jargon (tokens, API keys, FAISS, Bedrock, tiers).`;

    // Build multi-turn conversational contents array for Gemini API
    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history) {
        if (!turn || !turn.content) continue;
        const role = turn.role === "assistant" || turn.role === "model" ? "model" : "user";
        // Clean text: strip HTML tags and normalize whitespace
        const cleanText = String(turn.content)
          .replace(/<[^>]+>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (!cleanText) continue;

        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          contents[contents.length - 1].parts[0].text += `\n\n${cleanText}`;
        } else {
          contents.push({
            role: role,
            parts: [{ text: cleanText }]
          });
        }
      }
    }

    // Ensure the conversation ends with the current user prompt
    const userPromptText = prompt.trim();
    if (contents.length > 0 && contents[contents.length - 1].role === "user") {
      if (!contents[contents.length - 1].parts[0].text.includes(userPromptText)) {
        contents[contents.length - 1].parts[0].text += `\n\n${userPromptText}`;
      }
    } else {
      contents.push({
        role: "user",
        parts: [{ text: userPromptText }]
      });
    }

    // Gemini API requires the first turn to be from "user"
    while (contents.length > 0 && contents[0].role !== "user") {
      contents.shift();
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: contents,
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: 0.3
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Gemini API returned an error", details: errText })
      };
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: candidateText,
        tier: "ShaastraAI Scriptural Intelligence (Grounded Guidance)"
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
