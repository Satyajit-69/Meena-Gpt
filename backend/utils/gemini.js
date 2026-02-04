import { GoogleGenAI } from "@google/genai";

let genAI;

const getAIResponse = async (message) => {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is missing!");
    return "Configuration error: API key missing.";
  }

  if (!genAI) {
    genAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: message,
    });
     //return the response as text format
    return result.text || "No response generated.";
  } catch (err) {
    console.error("Gemini Error:", err);
    return "AI failed to generate a response.";
  }
};

export default getAIResponse;
