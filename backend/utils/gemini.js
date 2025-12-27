import { GoogleGenerativeAI } from "@google/genai";
import "dotenv/config";

const client = new GoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const getGeminiResponse = async (message) => {
  try {
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
    });

    return response.text;
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Gemini AI failed to generate a response.";
  }
};

export default getGeminiResponse;
