import Together from "together-ai";
const together = new Together();

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const params = {
    model: "Qwen/Qwen3.5-9B",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
    chat_template_kwargs: { enable_thinking: false },
  } as Parameters<typeof together.chat.completions.stream>[0];

  const runner = together.chat.completions.stream(params);

  return new Response(runner.toReadableStream());
}

export const runtime = "edge";
