import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return new Response("Missing image URL", {
      status: 400,
    });
  }

  try {
    const imageResponse = await fetch(url);

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch the image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();

    return new Response(Buffer.from(imageBuffer), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": imageResponse.headers.get("content-type")!,
        "Cache-Control": "public, max-age=31557600",
      },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return new Response("Error proxying image", {
      status: 500,
    });
  }
}
