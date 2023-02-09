// import type { NextRequest } from "next/server";

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("Missing env var from OpenAI");
// }

// export const config = {
//   runtime: "edge",
// };

// const handler = async (req: NextRequest): Promise<Response> => {
//   const { toolName, formData } = (await req.json()) as {
//     toolName: string;
//     formData: { [key: string]: string };
// };

// if (!prompt) {
//   return new Response("No prompt in the request", { status: 400 });
// }

// // const payload = {
// //   model: "text-davinci-003",
// //   prompt,
// //   temperature: 0.7,
// //   top_p: 1,
// //   frequency_penalty: 0,
// //   presence_penalty: 0,
// //   max_tokens: 200,
// //   stream: true,
// //   n: 1,
// // };

// const payload = await fetch('http://localhost:5001/toolModel', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     toolName: toolName,
//     formValues: formData
//   })
// });
// const response = await payload.json();
// console.log("response", response)
// if (response.error) {
//   throw new Error(response.error);
// }

// const res = await fetch("https://api.openai.com/v1/completions", {
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
//   },
//   method: "POST",
//   body: JSON.stringify(payload),
// });

// const data = res.body;

// return new Response(data, {
//   headers: { "Content-Type": "application/json; charset=utf-8" },
// });
// };

// export default handler;


// const handler = async (req: NextRequest): Promise<Response> => {
//   req.json().then(async (body) => {
//     const { toolName, formData } = body;

//     if (!toolName) {
//       return new Response("No toolName in the request", { status: 400 });
//     }

//     await fetch('http://localhost:5001/toolModel', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         toolName: toolName,
//         formValues: formData
//       })
//     }).then(payloadResponse => payloadResponse.json())
//       .then(async payload => {
//         if (payload.error) {
//           return new Response(payload.error, { status: 500 });
//         }

//         const res = await fetch("https://api.openai.com/v1/completions", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
//           },
//           method: "POST",
//           body: JSON.stringify(payload),
//         });
//       })
//       .catch((error) => {
//         console.log(error)
//         return new Response(error.message, { status: 500 });
//       });
//   });
// };


// export default handler;


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