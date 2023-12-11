import { Configuration, OpenAIApi } from 'openai-edge';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { vibe, bio } = await req.json();
  console.log('Am i being invoked?')

  // Ask OpenAI for a streaming completion given the prompt
  /*
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
  */

    /*

      // {
      //   "role": "user",
      //   "content": "1.What is the biggest obstacle you faced?:Being homeless.2.What internal struggles were you experiencing:Having no faith in myself.3.What external struggles were you experiencing?:No family support.Struggling to get food just to live.4.What was the event that changed everything for you?:Meeting a mentor in a coffee shop.5Where did you get guidance from?:My mentor shared quotes from books that led me to get my first million.6.What was the result/happy ending?:Becoming a loan officer at the age of 30"
      // }
  
    */

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        "role": "user",
        "content": "Use this example and understand its structure to create similar posts. \n\nGetting laid off turned out pretty well for me.\n\nBack in 2008, I found myself jobless for the 3rd time in 3 years.\n\nFeeling lost and unsure about my future was a total wake-up call.\n\nSo, I decided to take a step back, reassess my skills, and look for new opportunities.\n\nAs lost as I was, I made one really good choice:\n\nI connected with mentors, friends, and colleagues who had been down a similar path.\n\nThey helped me navigate the job market, find the right connections, and get my foot in the door at a company in NYC.\n\nIt worked.\n\nI landed the job of my dreams in 2009.\n\nThis is when I started to understand the power of people & networking.\n\nThey were crucial to my success.\n\nToday, I work for myself.\n\nBut, I still carry the lessons from networking that I learned back in 2008.\n\nIf you're tough situation, always remember that people are your best weapon against setbacks.\n\nSo, don't forget to lean on your network.\n\nAnd if you don't have one?\n\nThere's never been a better time to start building one here on LinkedIn.\n\nI put together a few notes on how I built strong relationships here on LinkedIn."
      },
      {
        "role": "user",
        "content": "1.What was your pivotal challenge or setback?: Being homeless in 2021 after losing my job. \n\n 2.How did you pivot or respond to that challenge? I started reading books at the local library and understood the value of hard work & equity. \n\n3.What was the positive outcome? I started changing up & taking care of myself, going to the gym, smiling to people/asking how they were and started with gratitude. This led me to pivot into a high-paying sales career focused on edtech. \n\n4.What's the key lesson or advice you want to share, and do you have a resource or call-to-action related to it? When struggling in life - follow success. It'll be written by the actions of successful people & within the stories of books they share  "
      }
    ],
    temperature: 0.4,
    max_tokens: 450,
    top_p: 1,
    frequency_penalty: 0.1,
    presence_penalty: 0.1,
  });
/*
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        "role": "user",
        "content": "Use this example and understand its structure to create similar posts. \n\nGetting laid off turned out pretty well for me.\n\nBack in 2008, I found myself jobless for the 3rd time in 3 years.\n\nFeeling lost and unsure about my future was a total wake-up call.\n\nSo, I decided to take a step back, reassess my skills, and look for new opportunities.\n\nAs lost as I was, I made one really good choice:\n\nI connected with mentors, friends, and colleagues who had been down a similar path.\n\nThey helped me navigate the job market, find the right connections, and get my foot in the door at a company in NYC.\n\nIt worked.\n\nI landed the job of my dreams in 2009.\n\nThis is when I started to understand the power of people & networking.\n\nThey were crucial to my success.\n\nToday, I work for myself.\n\nBut, I still carry the lessons from networking that I learned back in 2008.\n\nIf you're tough situation, always remember that people are your best weapon against setbacks.\n\nSo, don't forget to lean on your network.\n\nAnd if you don't have one?\n\nThere's never been a better time to start building one here on LinkedIn.\n\nI put together a few notes on how I built strong relationships here on LinkedIn."
      },
      {
        "role": "user",
        "content": "1.What was your pivotal challenge or setback?: Being homeless in 2021 after losing my job.2.How did you pivot or respond to that challenge? I started reading books at the local library and understood the value of hard work & equity.3.What was the positive outcome? I started changing up & taking care of myself, going to the gym, smiling to people/asking how they were and started with gratitude. This led me to pivot into a high-paying sales career focused on edtech. 4.What's the key lesson or advice you want to share, and do you have a resource or call-to-action related to it? When struggling in life - follow success. It'll be written by the actions of successful people & within the stories of books they share  "
      }
  
    ],
    temperature: 0.4,
    max_tokens: 450,
    top_p: 1,
    frequency_penalty: 0.1,
    presence_penalty: 0.1,
  });
  */

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
