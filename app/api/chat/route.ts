import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userMessages = messages.filter(
    (message: { role: string }) => message.role === "user"
  );
  const lastUserMessage =
    userMessages?.[userMessages.length - 1]?.content || null;

  console.log("this is the last user message", lastUserMessage);

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "user",
        content: `Translate the following into iCal format. If the year is not specified, pick the closest future date from September 23, 2023. Do not include any explanation or extra words.

        ${lastUserMessage}`,
      },
    ],
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
