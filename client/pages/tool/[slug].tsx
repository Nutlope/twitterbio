import { useState } from "react";
import Layout from "../../components/layout";
import Balancer from "react-wrap-balancer";
import { AnimatePresence, motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "../../lib/constants";

import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../../components/shared/DropDown";
import LoadingDots from "../../components/shared/LoadingDots";
import { NextPage } from "next";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/router";
const prisma = new PrismaClient();

const ToolPage: NextPage = ({ data }: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<"Professional" | "Casual" | "Funny">(
    "Professional"
  );
  const { slug } = router?.query;
  const [generatedBios, setGeneratedBios] = useState<String>("");

  // console.log("prompt data", data?.prompt);

  const prompt =
    vibe === "Funny"
      ? `Generate 2 funny twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated bio is at max 20 words and base it on this context: ${bio}${
          bio.slice(-1) === "." ? "" : "."
        }`
      : `Generate 2 ${vibe} twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure each generated bio is at least 14 words and at max 20 words and base them on this context: ${bio}${
          bio.slice(-1) === "." ? "" : "."
        }`;

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
        prompt,
        toolName: slug,
      }),
    });
    // console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
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
      try {
        const newValue = JSON.parse(decoder.decode(value));

        console.log(newValue);

        if (tempState) {
          newValue[0] = tempState + newValue[0];
          tempState = "";
        }

        newValue.forEach((newVal: string) => {
          if (newVal === "[DONE]") {
            return;
          }

          try {
            const json = newVal as unknown as {
              text: string;
              index: number;
              logprobs: null;
              finish_reason: null | string;
            };

            const choice = json;
            console.log(`text ${choice.text}`);
            setGeneratedBios((prev) => prev + choice.text);
          } catch (error) {
            console.error(error);
            tempState = newVal;
          }
        });
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    setLoading(false);
  };

  return (
    <Layout>
      <motion.div
        className="max-w-xl px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="font-display bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center text-4xl font-bold capitalize tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>{data?.display_name}</Balancer>
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer>18,167 bios generated so far.</Balancer>
        </motion.p>
        <motion.div
          className="flex items-center justify-center mx-auto mt-6 space-x-5"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <div className="w-full max-w-xl">
            <div className="flex items-center mt-10 space-x-3">
              <Image
                src="/1-black.png"
                width={30}
                height={30}
                alt="1 icon"
                className="mb-5 sm:mb-0"
              />
              <p className="font-medium text-left">
                Copy your current bio{" "}
                <span className="text-slate-500">
                  (or write a few sentences about yourself)
                </span>
                .
              </p>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full my-5 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
              placeholder={
                "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
              }
            />
            <div className="flex items-center mb-5 space-x-3">
              <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
              <p className="font-medium text-left">Select your vibe.</p>
            </div>
            <div className="block">
              <DropDown
                vibe={vibe}
                setVibe={(
                  newVibe:
                    | string
                    | ((
                        prevState: "Professional" | "Casual" | "Funny"
                      ) => "Professional" | "Casual" | "Funny")
                ) => setVibe(newVibe)}
              />
            </div>

            {!loading && (
              <button
                className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl hover:bg-black/80 sm:mt-10"
                onClick={(e) => generateBio(e)}
              >
                Generate your bio &rarr;
              </button>
            )}
            {loading && (
              <button
                className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl hover:bg-black/80 sm:mt-10"
                disabled
              >
                <LoadingDots color="white" style="large" />
              </button>
            )}
          </div>
        </motion.div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <AnimatePresence mode="wait">
          <motion.div className="my-10 space-y-10">
            {generatedBios && (
              <>
                <div>
                  <h2 className="mx-auto text-3xl font-bold text-slate-900 sm:text-4xl">
                    Your generated bios
                  </h2>
                </div>
                <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-8">
                  {generatedBios
                    .substring(generatedBios.indexOf("1") + 3)
                    .split("2.")
                    .map((generatedBio) => {
                      return (
                        <div
                          className="p-4 transition bg-white border shadow-md cursor-copy rounded-xl hover:bg-gray-100"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedBio);
                            toast("Bio copied to clipboard", {
                              icon: "✂️",
                            });
                          }}
                          key={generatedBio}
                        >
                          <p>{generatedBio}</p>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
};

export default ToolPage;
export const getStaticProps = async (params: { slug: any }) => {
  const toolName = params?.slug;
  const data = await prisma.tool.findFirst({
    where: { tool_name: toolName },
  });
  if (!data) {
    throw new Error("Tool not found");
  }
  //   const schema = ToolSchemaConverter.convert(data);

  // const fields = await prisma.field.findFirst({ where: { tool_id: data.tool_id } });
  // if (!fields) {
  //   throw new Error('Tool not found');
  // }
  // const schema: ToolSchema = {
  //   tool_name: data.tool_name,
  //   display_name: data.display_name,
  //   fields: fields,
  //   prompt: data.prompt,
  // };

  return { props: { data }, revalidate: 1 };
};

export async function getStaticPaths() {
  const data = await prisma.tool.findMany();

  const paths = data.map(({ tool_name }) => {
    return { params: { slug: tool_name } };
  });
  return {
    paths: paths,
    fallback: "blocking",
  };
}
