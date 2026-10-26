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

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are ShaastraAI, a knowledgeable scholarly AI assistant specializing in Sanskrit texts, ancient Indian knowledge systems (Ayurveda, Jyotisha, Vedanta), multimodal PDF RAG, and AI architectures. Answer clearly and ground your answer well:\n\nUser Question: ${prompt}`
            }
          ]
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
