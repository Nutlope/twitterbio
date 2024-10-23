import Together from "together-ai";

const together = new Together();
if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  const { prompt } = await req.json();

  if (!prompt) return new Response("No prompt in the request", { status: 400 });

  const runner = together.chat.completions.stream({
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
  });

  return new Response(runner.toReadableStream());
}

export const runtime = "edge";
