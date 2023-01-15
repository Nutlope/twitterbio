import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import DropDown from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

// TODO: Optimize for mobile
// TODO: Push it to Vercel github repo and deploy to Vercel
// TODO: Check lighthouse scores and optimize
// TODO: Make console.logs pretty and tell folks they can look at them, maybe through tooltip on the loading button
// TODO: Test on mobile

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<
    "Professional Vibe" | "Casual Vibe" | "Funny Vibe"
  >("Professional Vibe");
  const [generatedBios, setGeneratedBios] = useState<String>("");

  // TODO: Clean up code for this
  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Generate 2 ${vibe.substring(
          0,
          vibe.indexOf(" ")
        )} twitter bios with no hashtags based on this bio: ${bio}`,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let tempState = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const newValue = decoder
        .decode(value)
        .replaceAll("data: ", "")
        .split("\n\n")
        .filter(Boolean);

      if (tempState) {
        newValue[0] = tempState + newValue[0];
        tempState = "";
      }

      newValue.forEach((newVal) => {
        if (newVal === "[DONE]") {
          return;
        }

        try {
          const json = JSON.parse(newVal) as {
            id: string;
            object: string;
            created: number;
            choices?: {
              text: string;
              index: number;
              logprobs: null;
              finish_reason: null | string;
            }[];
            model: string;
          };

          if (!json.choices?.length) {
            throw new Error("Something went wrong.");
          }

          const choice = json.choices[0];

          setGeneratedBios((prev) => prev + choice.text);
        } catch (error) {
          tempState = newVal;
        }
      });
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Twitter Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/Nutlope/search-youtuber"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="text-6xl max-w-2xl font-bold text-slate-900">
          Generate your next Twitter bio in seconds
        </h1>
        {/* TODO: Make sure Resizable panel is centered */}
        <ResizablePanel>
          <AnimatePresence exitBeforeEnter>
            <motion.div className="max-w-xl">
              <div className="flex mt-10 items-center space-x-3">
                <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
                <p className="">
                  Copy your current bio{" "}
                  <span className="text-slate-500">
                    (or write some sentences about yourself)
                  </span>
                  .
                </p>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
                placeholder={
                  "Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js."
                }
              />
              <div className="flex mb-5 items-center space-x-3">
                <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
                <p className="">Select your vibe.</p>
              </div>
              <div className="block">
                <DropDown vibe={vibe} setVibe={setVibe} />
              </div>

              {!loading && (
                <button
                  className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                  onClick={(e) => generateBio(e)}
                >
                  Generate your bio &rarr;
                </button>
              )}
              {loading && (
                <button className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full">
                  <LoadingDots color="white" style="large" />
                </button>
              )}
            </motion.div>
            <div className="space-y-10 my-10 max-w-lg">
              {generatedBios && !loading && (
                <div className="space-y-5 flex flex-col items-center justify-center">
                  {generatedBios
                    .substring(5)
                    .split("2.")
                    .map((generatedBio) => {
                      return (
                        <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy">
                          <p>{generatedBio}</p>
                        </div>
                      );
                    })}
                </div>
              )}
              {/* TODO: Make sure to split generatedBios into two things */}
              {/* <p>
            <b>Variation 1:</b> Professional coder by day, amateur pun-smith by
            night. Come join me on my journey of turning 0s and 1s into humor!
          </p>
          <p>
            <b>Variation 2:</b> Just a programmer looking to make the world a
            funnier place one line of code at a time.
          </p> */}
            </div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
