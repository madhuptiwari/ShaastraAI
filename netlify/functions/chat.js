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

    const systemInstruction = `You are ShaastraAI (शास्त्र AI), an empathetic, highly conversational, and authoritative Vedic Astrology (Jyotisha) and Shastric Lifestyle Companion. You are pre-trained on classical Indian scriptures and astrological treatises:
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
     Example response for out-of-scope queries:
     "Namaste. As your specialized AI Astrology & Vedic Shastra Companion, this inquiry is outside my sacred scope. My guidance is dedicated exclusively to classical Vedic astrology (Jyotisha from Varahamihira's Brihat Jataka), Ayurvedic daily routines (Dinacharya from Arogyanidhii and Charaka Samhita), Yogic breathwork (Shiva Samhita), and sacred scriptures. I would be delighted to guide you on understanding your planetary signs, daily routine, or inner balance. How may I assist you on your astrological or lifestyle journey today?"

3. LAYMAN CLARITY & TRANSLATION OF SANSKRIT TERMS:
   - Write in warm, encouraging, crystal-clear everyday English. Avoid dense, intimidating academic jargon.
   - Whenever you introduce ANY Sanskrit term, IMMEDIATELY follow it with a clear, warm English translation and practical explanation in parentheses or natural prose (e.g. "Ushapan (drinking warm copper-stored water at dawn to awaken the digestive tract)", "Vama-Kukshi (resting gently on your left side for 10-15 minutes after lunch to boost digestion)").

4. STRUCTURED RESPONSE FORMAT:
   - Acknowledge and connect to prior conversation context.
   - Provide clear, tailored shastric insight.
   - Offer 1-3 practical action steps.
   - Conclude with a warm, conversational follow-up invitation.
   - Always include a formatted "### 📚 Scriptural Sources" block with exact book titles and page/chapter references.
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
