import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { GetStaticProps, GetStaticPaths } from "next";
import { Toaster, toast } from "react-hot-toast";
import DropDown from "../../components/DropDown";
import DropDownNew from "../../components/DropDownNew";
import Footer from "../../components/Footer";
import Github from "../../components/GitHub";
import Header from "../../components/Header";
import LoadingDots from "../../components/LoadingDots";
import ResizablePanel from "../../components/ResizablePanel";

interface Props {
  schema: ToolSchema;
}

interface FormData {
  [key: string]: string | undefined;
}

const Tool: NextPage<Props> = ({ schema }) => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<"Professional" | "Casual" | "Funny">(
    "Professional"
  );
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const initialFormData = schema.fields.reduce((formData, field) => {
    formData[field.name] = field.type === "select" && field.options ? field.options[0].value : "";
    return formData;
  }, {} as FormData);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  console.log("Streamed response: ", generatedBios);

  const prompt =
    vibe === "Funny"
      ? `Generate 2 funny twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure there is a joke in there and it's a little ridiculous. Make sure each generated bio is at max 20 words and base it on this context: ${bio}${bio.slice(-1) === "." ? "" : "."
      }`
      : `Generate 2 ${vibe} twitter bios with no hashtags and clearly labeled "1." and "2.". Make sure each generated bio is at least 14 words and at max 20 words and base them on this context: ${bio}${bio.slice(-1) === "." ? "" : "."
      }`;

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>, formDataName: string) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [formDataName]: value });
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>, formDataName: string) => {
    const { value } = event.target;
    setFormData({ ...formData, [formDataName]: value });
  };

  // console.log("schema", schema);
  console.log("formData", formData)

  const formFields = schema.fields.map((field, index) => {
    let input;
    if (field.type === "select") {
      input = (
        <>
          <div className="flex mb-5 items-center space-x-3">
            <Image src={`/${index+1}-icon.png`} width={30} height={30} alt={`${index+1} icon`} />
            <p className="text-left font-medium">Select your vibe.</p>
          </div>
          <div className="block mb-5">
            <DropDownNew
              value={formData[field.name]}
              name={field.name}
              options={field.options}
              formData={formData}
              setFormData={(newFormData: SetStateAction<FormData>) => setFormData(newFormData)}
            />
            {/* <DropDownNew
              value={formData[field.name]}
              options={field.options}
              onChange={(event) => handleSelect(event, field.name)}
            /> */}
          </div>
        </>
      );
    } else {
      input = (
        <>
          <div className="flex items-center space-x-3">
            <Image
              src={`/${index+1}-icon.png`}
              width={30}
              height={30}
              alt={`${index+1} icon`}
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Copy your current bio{" "}
              <span className="text-slate-500">
                (or write a few sentences about yourself)
              </span>
              .
            </p>
          </div>
          <textarea
            value={formData[field.name]}
            onChange={(e) => { handleChange(e, field.name) }}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
            }
          />
        </>
      );
    }
    return (
      <div>
      {input}
      </div>
    )
  });

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const toolPrompt = schema.prompt;
    const payload = {
      toolName: schema.name,
      formData: formData
    }
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    console.log("Edge function returned.");

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
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/Nutlope/twitterbio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl mb-12 text-4xl max-w-2xl font-bold text-slate-900">
          Generate your next Twitter bio in seconds
        </h1>

        <div className="max-w-xl">
          {formFields}
        
          {!loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-8 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateBio(e)}
            >
              Generate your bio &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-10">
              {generatedBios && !loading && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      Your generated bios
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                    {generatedBios
                      .substring(generatedBios.indexOf("1") + 3)
                      .split("2.")
                      .map((generatedBio) => {
                        return (
                          <div
                            className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
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
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};


// export async function getStaticProps({ params: { name: any; } }) {
//   const res = await fetch(`http://localhost:3000/schema/${params.name}`);
//   const data = await res.json();
//   return { props: { schema: data }, revalidate: 6000 };
// }

// export async function getStaticPaths() {
//   const res = await fetch("http://localhost:3000/allTools");
//   const data = await res.json();
//   const paths = data.map((tool: { name: any; }) => {
//     return { params: { name: tool.name } };
//   });
//   return { paths, fallback: false, revalidate: 6000 };
// }



interface ToolSchema {
  name: string;
  display_name: string;
  fields: {
    name: string;
    type: string;
    label: string;
    required: boolean;
    options?: { value: string; label: string }[];
    placeholder?: string;
  }[];
  prompt: string;
}

interface ToolData {
  name: string;
}

//TODO should this default be blog-idea-geenrator?
export const getStaticProps: GetStaticProps<{ schema: ToolSchema }, { tool: string }> = async ({ params = { tool: "blog-idea-generator" } }) => {

  const res = await fetch(`http://localhost:5001/schema/${params.tool}`);
  const data = await res.json();
  return { props: { schema: data[0] }, revalidate: 6000 };
};

export const getStaticPaths: GetStaticPaths<{ tool: string }> = async () => {
  const res = await fetch("http://localhost:5001/allTools");
  const data = await res.json() as ToolData[];
  const paths = data.map((tool) => {
    return { params: { tool: tool.name } };
  });
  return { paths, fallback: false };
};



export default Tool;
