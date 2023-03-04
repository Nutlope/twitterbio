import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDownNew from "../../components/DropDownNew";
import LoadingDots from "../../components/LoadingDots";
import ResizablePanel from "../../components/ResizablePanel";
import prisma from "../../lib/prisma";
import { useRouter } from "next/router";

interface Props {
  tool_name: string;
  display_name: string;
  fields: Array<{
    field_name: string;
    type: string;
    label: string;
    required: boolean;
    options: { value: string; label: string }[] | undefined;
    placeholder: string | undefined;
    command: string;
  }>;
  prompt: string;
}

interface FormData {
  [key: string]: string | undefined;
}

const Tool: NextPage<Props> = ({ tool_name, display_name, fields, prompt }) => {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<"Professional" | "Casual" | "Funny">(
    "Professional"
  );
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const [generatedBios2, setGeneratedBios2] = useState<String>("");
  const initialFormData = fields.reduce((formData, field) => {
    formData[field.field_name] =
      field.type === "select" && Array.isArray(field.options)
        ? field.options[0].value
        : "";
    return formData;
  }, {} as FormData);
  //TODO is it ok to have it as type string instead of String?
  const [generatedResponsesList, setGeneratedResponsesList] = useState<
    string[]
  >([]);

  const [formData, setFormData] = useState<FormData>(initialFormData);

  console.log("Streamed response: ", generatedResponsesList);

  const handleSelect = (
    event: React.ChangeEvent<HTMLSelectElement>,
    formDataName: string
  ) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [formDataName]: value });
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    formDataName: string
  ) => {
    const { value } = event.target;
    setFormData({ ...formData, [formDataName]: value });
  };

  const router = useRouter();
  const { tool } = router.query;

  // console.log("schema", schema);
  console.log("formData", formData);

  const formFields = fields.map((field, index) => {
    let input;
    if (field.type === "select") {
      input = (
        <>
          <div className="flex items-center mb-5 space-x-3">
            <Image
              src={`/${index + 1}-icon.png`}
              width={30}
              height={30}
              alt={`${index + 1} icon`}
            />
            <p className="font-medium text-left">{field.command}</p>
          </div>
          <div className="block mb-5">
            <DropDownNew
              value={formData[field.field_name]}
              name={field.field_name}
              options={field.options}
              formData={formData}
              setFormData={(newFormData: SetStateAction<FormData>) =>
                setFormData(newFormData)
              }
            />
          </div>
        </>
      );
    } else {
      input = (
        <>
          <div className="flex items-center space-x-3">
            <Image
              src={`/${index + 1}-icon.png`}
              width={30}
              height={30}
              alt={`${index + 1} icon`}
              className="mb-5 sm:mb-0"
            />
            <p className="font-medium text-left">
              {field.command}{" "}
              {/*              
              {/ . /} */}
            </p>
          </div>
          <textarea
            value={formData[field.field_name]}
            onChange={(e) => {
              handleChange(e, field.field_name);
            }}
            rows={4}
            className="w-full my-5 border-gray-300 rounded-md shadow-sm focus:border-black focus:ring-black"
            placeholder={
              field.placeholder
                ? field.placeholder
                : `Enter your ${field.field_name} here`
            }
          />
        </>
      );
    }
    return <div>{input}</div>;
  });

  const generateBio = async (e: any) => {
    console.log(formData);
    e.preventDefault();
    setGeneratedResponsesList([]);
    setLoading(true);
    if (tool === "blog-idea-generator") {
      formData.prompt_description = `
                    Target audience: ${formData.target_audience!} 
                    Description: ${formData.description}
                    Product name: ${formData.product_name}
                          `
        .trimStart()
        .trimEnd();
    }
    console.log(formData.prompt_description);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formData.prompt_description,
        toolName: tool,
      }),
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
            setGeneratedResponsesList((prev) => [...prev, choice.text]);
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

    setLoading(false);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center max-w-5xl min-h-screen py-2 mx-auto">
        <Head>
          <title>Twitter Generator</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="flex flex-col items-center justify-center flex-1 w-full px-4 mt-12 text-center sm:mt-20">
          <h1 className="max-w-2xl mb-12 text-4xl font-bold text-slate-900 sm:text-6xl">
            Generate your {display_name} in seconds
          </h1>

          <div className="min-w-[77%] max-w-xl">
            {formFields}

            {!loading && (
              <button
                className="w-full px-4 py-2 mt-8 font-medium text-white bg-black rounded-xl hover:bg-black/80 sm:mt-8"
                onClick={(e) => generateBio(e)}
              >
                Create Content &rarr;
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
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
          <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
          <ResizablePanel>
            <AnimatePresence mode="wait">
              <motion.div className="my-10 space-y-10">
                {generatedResponsesList && !loading && (
                  <>
                    <div>
                      <h2 className="mx-auto text-3xl font-bold text-slate-900 sm:text-4xl">
                        Your results
                      </h2>
                    </div>
                    <div className="flex flex-col items-center justify-center max-w-xl mx-auto space-y-8">
                      {generatedResponsesList.map((generatedResponse) => {
                        const trimmedResponse = generatedResponse
                          .replace(/^.*\n\n/, "")
                          .trim()
                          .replace(/\\n/g, "\n");
                        return (
                          trimmedResponse !== "" && (
                            <div
                              className="p-4 transition bg-white border shadow-md cursor-copy rounded-xl hover:bg-gray-100"
                              onClick={() => {
                                navigator.clipboard.writeText(trimmedResponse);
                                toast("Bio copied to clipboard", {
                                  icon: "✂️",
                                });
                              }}
                              key={trimmedResponse}
                            >
                              <p>{trimmedResponse}</p>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </ResizablePanel>
        </main>
      </div>
    </Layout>
  );
};

interface ToolSchema {
  tool_name: string;
  display_name: string;
  fields: {
    field_name: string;
    type: string;
    label: string;
    required: boolean;
    options?: { value: string; label: string }[];
    placeholder?: string;
    command: string;
  }[];
  prompt: string;
}

const ToolSchemaConverter = (tool: {
  tool_id: number;
  tool_name: string;
  display_name: string;
  prompt: string;
  status: string;
  created_by: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  long_markdown_description?: string;
  tags?: string;
  example_response?: string;
  n_responses?: number;
  stop: string;
  fields: any[];
}): ToolSchema => {
  return {
    tool_name: tool.tool_name,
    display_name: tool.display_name,
    fields: tool.fields.map((field: any) => {
      return {
        field_name: field.field_name,
        type: field.type,
        label: field.label,
        required: field.required,
        options: field.options,
        placeholder: field.placeholder,
        command: field.command,
      };
    }),
    prompt: tool.prompt,
  };
};

// export const getStaticProps: GetStaticProps<{ schema: tool }, { tool: string }> = async ({ params = { tool: "blog-idea-generator" } }) => {

//   const data = await prisma.tool.findFirst({ where: { tool_name: params.tool } }) as tool
//   return { props: { schema: data }, revalidate: 6000 };
// };

// export const getStaticPaths: GetStaticPaths<{ tool: string }> = async () => {
//   // const res = await fetch("http://localhost:300/api/allTools");
//   // const data = await res.json() as ToolData[];
//   const data = await prisma.tool.findMany() as ToolData[]
//   const paths = data.map((tool) => {
//     return { params: { tool: tool.tool_name } };
//   });
//   return { paths, fallback: true};
// };

// export const getStaticProps: GetStaticProps<{ schema: ToolSchema }, { tool: string }> = async ({ params = { tool: "blog-idea-generator" } }) => {
//   const data = await prisma.tool.findFirst({ where: { tool_name: params.tool }, select: { ...tool, fields: true }}) as tool | null;
//   if (!data) {
//     throw new Error('Tool not found');
//   }
//   const schema = ToolSchemaConverter.convert(data);

//   // const fields = await prisma.field.findFirst({ where: { tool_id: data.tool_id } });
//   // if (!fields) {
//   //   throw new Error('Tool not found');
//   // }
//   // const schema: ToolSchema = {
//   //   tool_name: data.tool_name,
//   //   display_name: data.display_name,
//   //   fields: fields,
//   //   prompt: data.prompt,
//   // };
//   return { props: { schema }, revalidate: 6000 };
// };

// export const getStaticPaths: GetStaticPaths<{ tool: string }> = async () => {
//   const data = await prisma.tool.findMany();
//   const paths = data.map((tool) => {
//     return { params: { tool: tool.tool_name } };
//   });
//   return { paths, fallback: true};
// };

import { NextPageContext } from "next";
import Layout from "../../components/layout";

interface ToolProps {
  tool_name: string;
  display_name: string;
  fields: {
    field_name: string;
    type: string;
    label: string;
    required: boolean;
    options: any;
    placeholder: string | null;
    command: string;
  }[];
  prompt: string;
}

export async function getServerSideProps(
  context: any
): Promise<{ props: ToolProps }> {
  const { tool } = context.params;
  console.log(tool);

  const data = await prisma.tool.findFirst({
    where: {
      tool_name: tool,
    },
    include: {
      field: true,
    },
  });
  if (!data) {
    throw new Error("Tool not found");
  }
  return {
    props: {
      tool_name: data.tool_name,
      display_name: data.display_name,
      fields: data.field.map(
        (field: {
          field_name: any;
          type: any;
          label: any;
          required: any;
          options: any;
          placeholder: any;
          command: any;
        }) => {
          return {
            field_name: field.field_name,
            type: field.type,
            label: field.label,
            required: field.required,
            options: field.options,
            placeholder: field.placeholder,
            command: field.command,
          };
        }
      ),
      prompt: data.prompt,
    },
  };
}

export default Tool;
