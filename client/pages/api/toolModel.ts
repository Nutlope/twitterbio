import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma';

function replaceVariables(prompt: any, variables: Object[]) {
  let newPrompt = prompt;
  for (const key in variables) {
    if (variables.hasOwnProperty(key)) {
      const value = variables[key];
      newPrompt = newPrompt.replace(`{{${key}}}`, value);
    }
  }
  return newPrompt;
}

function validatePrompt(prompt: string) {
  const regex = /{{([^}]+)}}/g;
  const match = prompt.match(regex);
  return !match;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { toolName, formData } = req.body;
    
    const result = await prisma.tool.findMany({
      where: { tool_name: toolName }
    });

    if (result.length == 0) {
      return res.status(400).send({ error: 'Error fetching prompt' });
    }

    console.log('prrsp', result[0]);

    const model = result[0];
    const promptWithVariables = model.prompt;

    const newPrompt = replaceVariables(promptWithVariables, formData);
    const isValid = validatePrompt(newPrompt);

    console.log("prompt is", newPrompt);

    if (!isValid) {
      return res.status(400).send({ error: 'Error parsing prompt' });
    }

    const payload = {
      model: "text-davinci-003",
      prompt: newPrompt,
      temperature: model.temperature,
      max_tokens: model.max_tokens,
      top_p: model.top_p,
      frequency_penalty: model.frequency_penalty,
      presence_penalty: model.presence_penalty,
      n: 2,
      stream: true,
      stop: JSON.parse(model.stop!.toString())!
    }

    return res.send(JSON.stringify(payload));
  } catch (error) {
    return res.status(500).json(error);
  }
}

export default handler;
