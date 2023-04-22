import cheerio from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.body;
  console.log("URLL RECEIVED", url);

  // Check that the URL is valid
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!url || !urlRegex.test(url.toString())) {
    return res.status(400).json({ message: "Invalid URL" });
  }

  // Call the fetchEssay function
  // const result = await fetchEssay(url.toString());
  const result = await fetchEssay(url);

  // Return the result
  res.status(200).json(result);
}

async function fetchEssay(url: string) {
  try {
    if (!url) {
      return { heading: "", content: "", error: "URL is missing" };
    }

    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    let content: string | undefined = "";
    let heading: string | undefined = "";
    let error: string = "";

    const publishedPost = $(".single-post");
    const draftPost = $(".post-editor");

    if (publishedPost.length) {
      content = publishedPost?.first()?.prop("innerText")?.trim();
      heading = $(".post-title")?.first()?.prop("innerText")?.trim();
    } else if (draftPost.length) {
      content = draftPost?.first()?.prop("innerText")?.trim();

      heading = $(".page-title")?.first()?.prop("innerText")?.trim();
    } else {
      console.log("No matching content found.");
      error =
        "Hmmm no content found. Can you double check the URL? Make sure it's a Substack newsletter";
      heading = "";
      content = "";
    }

    const result = {
      heading: heading,
      content: content,
      error: error,
    };
    return result;
  } catch (error) {
    console.error("Error fetching essay:", error);
  }
}
