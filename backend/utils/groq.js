import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing in environment variables");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getAIResponse = async (message) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: message }],
    });

    return completion.choices[0]?.message?.content || "No response";
  } catch (err) {
    console.error("Groq Error:", err);
    return "AI failed to generate a response.";
  }
};

export default getAIResponse;
