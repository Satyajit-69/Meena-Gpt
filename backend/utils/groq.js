import Groq from "groq-sdk";

let groq; // Define it here

const getAIResponse = async (message) => {
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is missing!");
    return "Configuration error: API Key missing.";
  }

  // Only create the instance if it doesn't exist yet
  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: message }],
    });

    return completion.choices[0]?.message?.content || "No response";
  } catch (err) {
    console.error("Groq Error:", err);
    return "AI failed to generate a response.";
  }
};

export default getAIResponse;