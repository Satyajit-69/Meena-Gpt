import fetch from "node-fetch";
import "dotenv/config";

const getGeminiResponse = async (message) => {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-3-flash-preview:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini"
    );
  } catch (err) {
    console.error("Gemini REST Error:", err);
    return "Sorry I am unable to generate response at this time ..... ";
  }
};

export default getGeminiResponse;
