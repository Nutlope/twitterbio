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


import type { NextRequest } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest): Promise<Response> => {
  const { toolName, formData } = (await req.json()) as {
    toolName: string;
    formData: { [key: string]: string };
  };

  // if (!prompt) {
  //   return new Response("No prompt in the request", { status: 400 });
  // }
  const prompt = "test"

  // const payload = {
  //   model: "text-davinci-003",
  //   prompt,
  //   temperature: 0.7,
  //   top_p: 1,
  //   frequency_penalty: 0,
  //   presence_penalty: 0,
  //   max_tokens: 200,
  //   stream: true,
  //   n: 1,
  // };


  const payload = await fetch('http://localhost:5001/toolModel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      toolName,
      formData
    })
  })
  .then(res => res.json())
  .then(data => data)
  .catch(err => console.log(err))

  console.log("payload is ", payload)


  const res = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });


  const data = res.body;
  // const data = "e"

  return new Response(data, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};

export default handler;