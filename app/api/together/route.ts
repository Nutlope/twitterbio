import Together from "together-ai";
const together = new Together();

if (!process.env.TOGETHER_API_KEY) throw new Error("Missing Together env var");

export async function POST(req: Request) {
  const { prompt, model } = await req.json();

  const isReasoningModel = model === "Qwen/Qwen3.5-9B";

  // @ts-expect-error chat_template_kwargs disables thinking for reasoning models
  const runner = together.chat.completions.stream({
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: isReasoningModel ? 200 : 2000,
    ...(isReasoningModel && { chat_template_kwargs: { enable_thinking: false } }),
  });

  return new Response(runner.toReadableStream());
}

export const runtime = "edge";
