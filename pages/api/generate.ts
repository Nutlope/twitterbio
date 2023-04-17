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

const handler = async (req: Request, res: Response) => {
  const { prompt, url, essay } = (await req.json()) as {
    essay?: string,
    prompt?: string;
    url?: string;
  };

  // if (!prompt) {
  //   return new Response("No prompt in the request", { status: 400 });
  // }

  if (!url) {
    return new Response("No url in the request", { status: 400 });
  }

  if(!essay) {
    return new Response("No essay in the request", {status: 400})
  }
  
  const request = `You are a helpful social media guru. No hashtags whatsoever. Using the following essay text, generate 3 promotional Tweets that are likely to go viral. Make sure they capture the essence of the essay. Write the tweets in a first-person voice with the tone and style of the essay:\n\n${essay}\n`;

  const essayPayload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: request }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 400,
    stream: true,
    n: 1 // TODO check me
  }

  const stream = await OpenAIStream(essayPayload);
  return new Response(stream);
}
  

interface Essay {
  heading: string;
  content: string;
}

async function fetchEssay(url: string) {
  try {
		if(!url) {
			return {heading: "", content: ""}
		}	
    
    const response = await fetch(url)
    const html = await response.text();
    const $ = cheerio.load(html);
    
    let content: string | undefined = '';
    let heading: string | undefined = '';

		const publishedPost = $('.single-post')
    const draftPost = $('.post-editor');
		
    if (publishedPost.length) {
      content = publishedPost
        ?.first()
        ?.prop('innerText')
        ?.trim();
      heading = $('.post-title')?.first()?.prop('innerText')?.trim();
    } else if (draftPost.length) {
      content = draftPost
        ?.first()
        ?.prop('innerText')
        ?.trim();
      heading = $('.page-title')?.first()?.prop('innerText')?.trim();
    } else {
      console.log('No matching content found.');
      return {heading: "", content: ""}
    }

    const result = {
      heading: heading,
      content: content
    };
    return result;
  } catch (error) {
    console.error('Error fetching essay:', error);
  }
}

export default handler;
