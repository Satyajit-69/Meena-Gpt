
import "dotenv/config";
import OpenAI from "openai";

let genAI;

const getAIResponse = async (message) => {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is missing!");
    return "Configuration error: API key missing.";
  }

  if (!genAI) {
    genAI = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  try {
    const result = await genAI.responses.create({
      model: "gpt-5.5",
      instructions: "You are a coding assistant and your name is MEENA . Understand the question that the user is asking and answer properly",
      input: message,
    });

    return result.output_text || "No response generated.";
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    return "AI failed to generate a response.";
  }
};

export default getAIResponse;
