import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "	gemini-3-pro-preview" });

const getGeminiResponse = async (message, useChainOfThought = true) => {
  try {
    // Add Chain of Thought prompt prefix
    const enhancedMessage = useChainOfThought
      ? `Let's think step by step.\n\n${message}`
      : message;

    const result = await model.generateContent(enhancedMessage);
    const reply = result.response.text();
    return reply;
  } catch (err) {
    console.log("Gemini Util Error:", err);
    return "Gemini AI failed to generate a response.";
  }
};

export default getGeminiResponse;