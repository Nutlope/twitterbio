import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

// TODO with morning brain 
// 1) Make the 1st request from UI when user clicks button
// 2) Use the results to call GPT-4 to stream the response. Should still be pretty quick

export type VibeType = "Professional" | "Casual" | "Funny";

const handler = async (req: Request, res: Response) => {
  const { prompt, url, essay, vibe } = (await req.json()) as {
    essay?: string,
    prompt?: string;
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
    Professional: "write an engaging hook for LinkedIn to promote this essay",
    Casual: "write a Twitter hook in first person voice for this essay. Keep the author's style and tone.",
    // Casual: "Create one hashtag-free tweet to promote this essay. Write as if you were the essay author. Write the tweet in the same style and voice. Do not use hashtags, mentions or links.",
    Funny: "write a playful, hilarious message post to promote this essay. Include one ridiculous detail to make it funny"
    //  first person voice (you are the author of the essay) to promote this essay. Include one or two ridiculous jokes to give it a funny vibe!"
  };
  
  let vibeType = vibe || "Casual"; // Set a default value for vibeType
  const basePrompt: string = promptMap[vibeType];
  const prefix: string = `You are a co-pilot for a successful writer. As if you were the essay author,`
  const request = `${prefix} ${basePrompt}. Essay body: ${essay}`
  
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

  const essayPayload: OpenAIStreamPayload = {
    // model: "gpt-3.5-turbo",
    model: "gpt-4",
    messages: [{ role: "user", content: request }],
    temperature: 0.7,
    top_p: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
    max_tokens: 100,
    stream: true,
    n: 1 // TODO check me
  }

  const stream = await OpenAIStream(essayPayload);
  return new Response(stream);
}

export default handler;
