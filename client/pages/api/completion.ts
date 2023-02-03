import type { NextApiRequest, NextApiResponse } from "next";


export const config = {
    runtime: "edge",
  };
  
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).send("No prompt in the request");
    }

    const payload = {
        model: "text-davinci-003",
        prompt,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 200,
        stream: true,
        n: 1,
    };

    try {
        const res = await fetch("https://api.openai.com/v1/completions", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        const data = res.body;

        return new Response(data, {
            headers: { "Content-Type": "application/json; charset=utf-8" },
        });
    } catch (err) {
        res.status(500).send(err);
    }
}

export default handler;