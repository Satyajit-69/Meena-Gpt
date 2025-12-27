import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const client = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const getGeminiResponse = async (message) => {
  try {
    const response = await client.models.generateContent({
      model: "gemini-1.5-flash", // use stable model
      contents: [
        {
          role: "user",
          parts: [{ text: message }],
        },
      ],
    });

    // ✅ Correct way to extract text
    return response.candidates?.[0]?.content?.parts?.[0]?.text
      || "No response generated.";
  } catch (err) {
    console.error("Gemini Error:", err.message);

    // graceful fallback
    if (err.message?.includes("Quota")) {
      return "⚠️ AI usage limit reached. Please try again later.";
    }

    return "⚠️ Gemini AI is temporarily unavailable.";
  }
};

export default getGeminiResponse;
