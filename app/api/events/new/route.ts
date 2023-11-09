import { OpenAI } from "openai";
import { getPrompt } from "@/lib/prompts";

// Create an OpenAI API client (that's edge friendly!)
const config = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(config);

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { inputText } = await req.json();

  const prompt = getPrompt();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",

    messages: [
      {
        role: "system",
        content: prompt.text,
      },
      {
        role: "user",
        content: inputText,
      },
    ],
  });

  // Return the response message
  return Response.json({ response });
}
