/**
 * Netlify Serverless Function: Secure Gemini API Proxy
 * Allows answering queries on Netlify using GEMINI_API_KEY from environment variables
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

    const systemInstruction = `You are ShaastraAI (शास्त्र AI), an authoritative, scholarly AI assistant specializing in classical Indian knowledge systems (Ayurveda, Jyotisha, Vedanta, Yoga, and Sanskrit shastras) and multimodal RAG, grounded directly in the user's uploaded Shastric corpus (including Arogyanidhii.pdf, Varahamihira's Brihat Jataka, Shiva Samhita, 108 Upanishads, and Bhagavad Gita).

When users ask for personalized guidance, such as crafting a daily routine (Dinacharya) based on their name, sun sign (Surya Rashi), moon sign (Chandra Rashi), nakshatra, or dosha:
1. Provide a detailed, chronologically structured Vedic schedule (from Brahma Muhurta 4:30 AM to Nidra 10:00 PM).
2. Integrate classical Ayurvedic principles and exact citations from the uploaded corpus:
   - Arogyanidhii (p. 20): Ushapan (500–1250ml copper vessel water before dawn) and Pratimarsa Nasya (2 drops warm sesame oil/Anu taila in nostrils to protect eyes, hair, and senses).
   - Arogyanidhii (p. 22): Snana Vidhi (Pour water on head first to protect cerebral blood vessels and eyes; wetting feet first drives heat upwards to the brain).
   - Arogyanidhii (pp. 22–24): Bhojana Vidhi (Kindle Jatharagni with fresh ginger + rock salt; partition stomach into 1/2 solid, 1/4 liquid, 1/4 empty; maintain a strict 6-hour gap between heavy meals).
   - Arogyanidhii (p. 25): Post-meal 10-min Vajrasana + 10–15 min Vama-Kukshi (left lateral rest to activate Surya Nadi/Pingala) + Agastya digestive mantra ("Agastir Madhavaścaiva...").
   - Arogyanidhii (pp. 18, 30): Sleep orientation (Head strictly East or South; never North due to magnetic field repulsion causing cardiac/mental agitation).
   - Shiva Samhita (Ch. 3, vv. 1–40): Nadi Shodhana balancing Ida (cooling lunar) and Pingala (heating solar) channels.
   - Varahamihira's Brihat Jataka (Ch. 1-2): 12 Kalapurusha anatomical signs, 4 Maha-Tatvas, and the 24-Hora diurnal planetary sequence.
3. Align the routine with their Astrological element (Agni/Fire, Prithvi/Earth, Vayu/Air, Jala/Water), ruling planet, and Nakshatra dosha (Vata, Pitta, Kapha), tailoring oil types, diet, pranayama, and optimal work hours (Horas).
4. If they have not yet provided their specific name, sun sign, or nakshatra, provide the master classical Dinacharya schedule, explain the sign/nakshatra customization rules, and invite them to share their specific details for instant personalization.
Ground your answer with classical Sanskrit terms and shastric citations. Format cleanly with clear headings and bullet points.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
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
        tier: "Tier 2: Google Gemini 2.5 Flash [Netlify Edge Function]"
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
