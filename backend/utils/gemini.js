import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// choose stable model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const getGeminiResponse = async (message) => {
  try {
    const result = await model.generateContent(message);
    const reply = result.response.text();
    return reply;
  } catch (err) {
    console.log("Gemini Util Error:", err);
    return "Gemini AI failed to generate a response.";
  }
};

export default getGeminiResponse;
