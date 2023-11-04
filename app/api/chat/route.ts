import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";
import { db } from "@/lib/db";
import { getPrompt } from "@/lib/prompts";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  const { messages, source } = await req.json();
  const key = JSON.stringify(messages); // come up with a key based on the request
  const requestStart = new Date();
  const cached = await kv.get(key);
  if (cached) {
    return new Response(cached as any);
  }

  const prompt = getPrompt();

  const userMessages = messages.filter(
    (message: { role: string }) => message.role === "user"
  );
  const lastUserMessage =
    userMessages?.[userMessages.length - 1]?.content || null;

  // Create a new requestResponse in the database, but don't await it
  const requestResponse = await db.requestResponse.create({
    data: {
      modelInput: {
        promptVersion: prompt.version,
        message: lastUserMessage,
      },
      modelStatus: "pending",
      source: source,
    },
    select: {
      id: true,
    },
  });

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-4",

    stream: true,
    messages: [
      {
        role: "system",
        content: prompt.text,
      },
      {
        role: "user",
        content: lastUserMessage,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      let errors = [];

      // Cache the response. Note that this will also cache function calls.
      kv.set(key, completion).catch((error) => errors.push(error));
      kv.expire(key, 60 * 60).catch((error) => errors.push(error));

      // calculate time from initial request to completion
      const time = new Date().getTime() - requestStart.getTime();

      db.requestResponse
        .update({
          where: { id: requestResponse.id },
          data: {
            modelOutput: { text: completion },
            modelCompletionTime: time,
            modelStatus: "success",
          },
        })
        .catch((error) => console.log(error));
    },
  });

  return new StreamingTextResponse(stream);
}
