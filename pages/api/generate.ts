import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import { VibeType } from "../../components/DropDown";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const handler = async (req: Request, res: Response) => {
  const { url, essay, vibe } = (await req.json()) as {
    essay?: string,
    url?: string;
    vibe?: VibeType;
  };

  if (!url) {
    return new Response("No url in the request", { status: 400 });
  }

  if(!essay) {
    return new Response("No essay in the request", {status: 400})
  }

  type PromptMap = {
    [key in VibeType]: string;
  };
  
  const promptMap: PromptMap = {
    professional: "write an engaging hook for LinkedIn to promote this essay",
    casual: "write a Twitter hook in first person voice for this essay. Keep the author's style and tone.",
    // Casual: "Create one hashtag-free tweet to promote this essay. Write as if you were the essay author. Write the tweet in the same style and voice. Do not use hashtags, mentions or links.",
    funny: "write a playful, hilarious message post to promote this essay. Include one ridiculous detail to make it funny"
    //  first person voice (you are the author of the essay) to promote this essay. Include one or two ridiculous jokes to give it a funny vibe!"
  };
  
  
  // const basePrompt: string = promptMap[vibeType];
  // const prefix: string = `You are a co-pilot for a successful writer. As if you were the essay author,`
  // const request = `${prefix} ${basePrompt}. Essay body: ${essay}`
  
  let vibeType = vibe || "twitter"; 
  const { temperature, max_tokens, message } = getPlatformSettings(vibeType, essay);

const essayPayload: OpenAIStreamPayload = {
  model: "gpt-4",
  messages: [{ role: "user", content: message }],
  temperature,
  top_p: 1,
  max_tokens,
  stream: true,
  n: 1,
};

console.log("PAYLOAD", essayPayload)

  // const essayPayload: OpenAIStreamPayload = {
  //   model: "gpt-4", // gpt-3.5-turbo
  //   messages: [{ role: "user", content: request }],
  //   temperature: 0.7,
  //   top_p: 1,
  //   max_tokens: 100,
  //   stream: true,
  //   n: 1 // TODO check me
  // }

  const stream = await OpenAIStream(essayPayload);
  return new Response(stream);
}

export default handler;


function getPlatformSettings(platform: VibeType, essayBody: string) {
  const platformConfigs = {
    professional: {
      temperature: 0.5,
      max_tokens: 250,
      message: `Write a LinkedIn post about this essay in the first-person perspective, as if the author is speaking. Preserve the author's voice and minimize the use of hashtags and emojis. Aim for virality:`,
    },
    twitter: {
      temperature: 0.7,
      max_tokens: 60,
      message: `Create a short and catchy tweet in the first-person perspective about this essay, as if the author is speaking. Maintain the author's voice and limit hashtags and emojis. Use a maximum of two emojis. Make it engaging for increased virality:`,
      // message: `Create a short and catchy tweet in the first-person perspective about this essay, as if the author is speaking. Maintain the author's voice and limit hashtags and emojis, using no more than one emoji. Make it engaging for increased virality:`,
    },
    funny: {
      temperature: 0.9,
      max_tokens: 200,
      message: `Write a light-hearted and funny post in the first-person perspective about this essay, as if the author is speaking. Stay true to the author's voice and avoid excessive use of hashtags and emojis. Aim for a viral effect:`,
    },
  };

  if (!platformConfigs.hasOwnProperty(platform)) {
    throw new Error(`Invalid platform: ${platform}`);
  }

  const message = `${platformConfigs[platform].message} ${essayBody}`;

  return {
    ...platformConfigs[platform],
    message,
  };
}



// const request = `Create one hashtag-free tweet to promote this essay. Write as if you were the essay author. Write the tweet in the same style and voice. Do not use hashtags, mentions or links.`
  // const promptMap = {
  //   professional: "Promote this essay for a LinkedIn audience. Write it in the style and tone of the author. Use first person voice.",
  //   casual: "Create one hashtag-free tweet to promote this essay. Write as if you were the essay author. Write the tweet in the same style and voice. Do not use hashtags, mentions or links.",
  //   funny: "Pretend you are the author of this essay - write a message to promote this essay. Include one or two ridiculous jokes to give it a funny vibe!"
  // }

  
  // let vibeType = vibe || "Casual"; // Set a default value for vibeType
  // const basePrompt: string = promptMap[vibeType];
  
  // let vibeType = vibe?.toLowerCase()
  // const basePrompt: string = promptMap[vibeType] 
    // const request = `Create one hashtag-free tweet to promote this essay. Write as if you were the essay author in the same style and voice. Do not use hashtags, mentions or links. Delimit the response with Tweet1: X, Tweet 2: Y etc. Essay body: ${essay}`
  // const request = `You are a helpful social media guru. No hashtags whatsoever. Using the following essay text, generate 3 promotional Tweets that are likely to go viral. Make sure they capture the essence of the essay. Write the tweets in a first-person voice with the tone and style of the essay:\n\n${essay}\n`;