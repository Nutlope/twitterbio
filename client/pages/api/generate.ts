


import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';
import axios from 'axios';
import { replaceVariables, validatePrompt } from "../../lib/util";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { toolName, prompt, formValues } = req.body;

  console.log(formValues);

  // if (!prompt) {
  //   return new Response("No prompt in the request", { status: 400 });
  // }


  try {
    const modelResponse = await prisma.tool.findMany({
      where: { tool_name: toolName }
    });

    if (modelResponse.length === 0) {
      return res.status(400).json({ error: 'Error fetching prompt' });
    }

    console.log("prrsp", modelResponse[0]);

    const model = modelResponse[0];
    console.log("prompt", prompt);

    const promptWithVariables = replaceVariables(prompt, formValues);
    console.log("variables", promptWithVariables);
    const isValid = validatePrompt(promptWithVariables);

    if (!isValid) {
      console.log('invalid');
      return res.status(400).send({ error: 'Error parsing prompt' });
    }
    console.log("stop", model.stop);

    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: "text-davinci-003",
        prompt: promptWithVariables,
        temperature: model.temperature,
        max_tokens: model.max_tokens,
        top_p: model.top_p,
        frequency_penalty: model.frequency_penalty,
        presence_penalty: model.presence_penalty,
        n: model.n_responses,
        stop: model.stop!
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        }
      });

      console.log("response", response.data.choices[0].text)
      // const splitResponse = splitList(response.data.choices[0].text)
      // console.log("splitList", splitResponse);
      // res.send(splitResponse);

      //deletes newline at the end (I think)
      //const allOutputs = response.data.choices.map((choice: any) => choice.text.trim().replace(/\\n/g, "\n"));
      
      const choices = response.data.choices;
      let i = 0;
      for (const choice of choices) {
        choices[i].text = choices[i].text.replaceAll('\\n', '');
        i++;
      }

      console.log("all", choices);
      return res.status(200).json(choices);

    } catch (error) {
      console.error(error);
      return res.status(500).send(error);
    }

  } catch (error) {
    return res.status(500).json({ error: 'Internal error' });
  }
};

export default handler;