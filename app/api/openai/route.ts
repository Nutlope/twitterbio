import OpenAI from "openai";

const openai = new OpenAI();
if (!process.env.OPENAI_API_KEY) throw new Error("Missing OpenAI env var");

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) return new Response("No prompt in the request", { status: 400 });

  const runner = openai.beta.chat.completions.stream({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
  });

  return new Response(runner.toReadableStream());
}

export const config = { runtime: "edge" };
