import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { kv } from "@vercel/kv";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const key = JSON.stringify(messages); // come up with a key based on the request

  // Get current date in Month, Day, Year format
  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const day = today.getDate();
  const year = today.getFullYear();

  // Check if we have a cached response
  const cached = await kv.get(key);
  if (cached) {
    return new Response(cached as any);
  }

  const userMessages = messages.filter(
    (message: { role: string }) => message.role === "user"
  );
  const lastUserMessage =
    userMessages?.[userMessages.length - 1]?.content || null;

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-4",

    stream: true,
    messages: [
      {
        role: "system",
        content: `You parse calendar events from the provided text into iCal format based on the following information:
        - For calculating relative dates/times, it is currently ${month} ${day}, ${year}
        - Include timezone (use America/Los Angles if not specified)
        - Always include an end time
        - Always include a SUMMARY
        - Include contact information in description
        - Do not include timezone for full day events
        - Do not include placeholders or extraneous text
        - Exclude PRODID, VERSION, CALSCALE, and METHOD from the output
        - If the event is a flight, format the SUMMARY as: ✈️ [Flight Number] ([Departure Airport Code] to [Arrival Airport Code])
        `,
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
      // Cache the response. Note that this will also cache function calls.
      await kv.set(key, completion);
      await kv.expire(key, 60 * 60);
    },
  });

  return new StreamingTextResponse(stream);
}
