import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { vibe, bio } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `Generate 2 ${vibe} twitter biographies with no hashtags and clearly labeled "1." and "2.". ${
          vibe === 'Funny'
            ? "Make sure there is a joke in there and it's a little ridiculous."
            : null
        }
          Make sure each generated biography is less than 160 characters, has short sentences that are found in Twitter bios, and base them on this context: ${bio}${
          bio.slice(-1) === '.' ? '' : '.'
        }`,
      },
    ],
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
