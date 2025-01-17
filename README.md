# [twitterbio.io](https://www.twitterbio.io/)

This project generates Twitter (X) bios for you using Together AI.

[![Twitter Bio Generator](./public/screenshot.png)](https://www.twitterbio.io)

## How it works

This project uses both [Mixtral 8x7B](https://api.together.xyz/playground/chat/mistralai/Mixtral-8x7B-Instruct-v0.1) and [Llama 3.1 8B](https://api.together.xyz/playground/chat/meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo) with streaming to generate a Twitter bio. It constructs a prompt based on the form and user input, sends it either to the [Together.ai](https://togetherai.link/) API, then streams the response back to the application.

If you'd like to see how I built an older version of this app with GPT 3.5, check out the [video](https://youtu.be/JcE-1xzQTE0) or [blog post](https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions).

## Running Locally

1. Create a `.env` file, make an account at [Together.ai](https://togetherai.link/), and add your API key under `TOGETHER_API_KEY`
2. Run the application with `npm run dev` and it will be available at `http://localhost:3000`.

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Nutlope/twitterbio&env=TOGETHER_API_KEY&project-name=twitter-bio-generator&repo-name=twitterbio)
