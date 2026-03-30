import Together from "together-ai";
const together = new Together();

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  const isKimi = model === "deepseek-ai/deepseek-llm-7b-chat";

  const params = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: isKimi ? 200 : 2000,
    ...(isKimi && { chat_template_kwargs: { enable_thinking: false } }),
  } as Parameters<typeof together.chat.completions.stream>[0];

  const runner = together.chat.completions.stream(params);

  return new Response(runner.toReadableStream());
}

export const runtime = "edge";
