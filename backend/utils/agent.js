

import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});




const apiKey = process.env.OPENAI_API_KEY;

const client = new OpenAI({
  apiKey: apiKey,
});
const response = await client.responses.create({
  model: "gpt-5.5",
  instructions: "You are a coding assistant that talks like a pirate",
  input: "Are semicolons optional in JavaScript?",
});

console.log(response.output_text);
