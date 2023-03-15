import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Head from "next/head";
import Header from "../components/Header";
import Image from "next/image";
import LoadingDots from "../components/LoadingDots";
import type { NextPage } from "next";
import { Toaster, toast } from "react-hot-toast";
import { useRef, useState } from "react";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [loadingColor, setLoadingColor] = useState(false);
  const [company, setCompany] = useState("");
  const [color, setColor] = useState("");
  const [generatedSWOT, setGeneratedSWOT] = useState<String>("");
  const [generatedColor, setGeneratedColor] = useState<String>("");

  const swotRef = useRef<null | HTMLDivElement>(null);
  const regex = /\b(?:Strengths|Weaknesses|Opportunities|Threats):\s*/g;
  const regex2 = /[1-5]/;

  const scrollToSWOT = () => {
    if (swotRef.current !== null) {
      swotRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const promptSWOT = `Generate a SWOT analysis of company ${company}, divided by "Strenghts:", "Weaknesses:", "Opportunities:" and "Threats:". Each section have top 1-5 points summarized of max 125 characters. If no company is found return nothing.`;

  const promptColor = `Max 500 characters. Give some context on company ${company} `;

  const generateSWOT = async (e: any) => {
    e.preventDefault();
    setGeneratedSWOT("");
    setGeneratedColor("");
    setColor("");
    setLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptSWOT,
      }),
    });

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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedSWOT((prev) => prev + chunkValue);
    }
    scrollToSWOT();
    setLoading(false);
  };

  const generateColor = async (e: any, c: string) => {
    e.preventDefault();
    setColor(c);
    setGeneratedColor("");
    setLoadingColor(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: promptColor + c,
      }),
    });

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

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedColor((prev) => prev + chunkValue);
    }
    scrollToSWOT();
    setLoadingColor(false);
  };

  const strengthsStyle = {
    backgroundColor: "#addbd7",
  };
  const weaknessesStyle = {
    backgroundColor: "#f4b365",
  };
  const opportunitiesStyle = {
    backgroundColor: "#7ECEE4",
  };
  const threatsStyle = {
    backgroundColor: "#f07972",
  };
  const headerStyle = {
    backgroundColor: "#212529",
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center min-h-screen">
      <Head>
        <title>SWOT Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-8 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/mflodmark/swot-generator"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate your next SWOT analysis using chatGPT
        </h1>
        <div className="w-full">
          <div className="flex mt-10 items-center space-x-3 items-center">
            <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">
              Add a company name to analyse.
            </p>
          </div>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full mt-2 border-2 border-black-400 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black-400"
            placeholder={"e.g. Amazon, Apple, Alphabet."}
          />
          {!loading && !loadingColor && (
            <button
              style={headerStyle}
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              onClick={(e) => generateSWOT(e)}
            >
              Generate your SWOT &rarr;
            </button>
          )}
          {loading ||
            (loadingColor && (
              <button
                className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
                disabled
              >
                <LoadingDots color="white" style="large" />
              </button>
            ))}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedSWOT && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={swotRef}
                >
                  SWOT analysis of {company}
                </h2>
              </div>
              <div className="grid grid-rows-4 md:grid-rows-2 grid-flow-col gap-4 mx-auto">
                {!generatedSWOT.includes("general SWOT") &&
                  generatedSWOT
                    .split(regex)
                    .filter((section) => section.trim() !== "")
                    .map((swot, index) => {
                      return (
                        <div
                          className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                          style={
                            swot[0] != "1"
                              ? threatsStyle
                              : index == 0
                              ? strengthsStyle
                              : index == 1
                              ? weaknessesStyle
                              : index == 2
                              ? opportunitiesStyle
                              : threatsStyle
                          }
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `SWOT analysis of ${company}\n\n${generatedSWOT}`
                            );
                            toast("SWOT copied to clipboard", {
                              icon: "✂️",
                            });
                          }}
                          key={swot}
                        >
                          <h2
                            className="font-bold text-center"
                            key={"title" + index}
                          >
                            {swot[0] != "1"
                              ? "Invalid company"
                              : index == 0
                              ? "Strengths"
                              : index == 1
                              ? "Weaknessess"
                              : index == 2
                              ? "Opportunities"
                              : "Threats"}
                          </h2>
                          {swot
                            .split(regex2)
                            .filter((section) => section.trim() !== "")
                            .map((s, index) => (
                              <p className="p-1" key={index + 1}>
                                {s[0] == "." ? index + 1 : ""}
                                {s}
                              </p>
                            ))}
                        </div>
                      );
                    })}
              </div>
            </>
          )}
        </div>
        <div className="space-y-10 my-10">
          {generatedSWOT && !loading && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={swotRef}
                >
                  Click for more color
                </h2>
              </div>
              <div className="grid grid-rows-2 md:grid-rows-1 grid-flow-col gap-4 mx-auto">
                {["Strengths", "Weaknessess", "Opportunities", "Threats"].map(
                  (c, index) => {
                    return (
                      <div
                        style={
                          index == 0
                            ? strengthsStyle
                            : index == 1
                            ? weaknessesStyle
                            : index == 2
                            ? opportunitiesStyle
                            : threatsStyle
                        }
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border text-left"
                        onClick={(e) => generateColor(e, c)}
                      >
                        <h2 className="font-bold text-center">{c}</h2>
                        {loadingColor && color === c && (
                          <LoadingDots color="black" style="large" />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}
        </div>
        <div className="space-y-10 my-10">
          {generatedColor && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={swotRef}
                >
                  Some color on {color}
                </h2>
              </div>
              <div className="grid grid-rows-4 md:grid-rows-2 grid-flow-col gap-4 mx-auto">
                {generatedColor.split(regex).map((c, index) => {
                  return (
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                      style={
                        color === "Strengths"
                          ? strengthsStyle
                          : color === "Weaknessess"
                          ? weaknessesStyle
                          : color === "Opportunities"
                          ? opportunitiesStyle
                          : threatsStyle
                      }
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `Some color on ${company} ${color}\n\n${generatedColor}`
                        );
                        toast("Color copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                      key={c}
                    >
                      <h2
                        className="font-bold text-center"
                        key={"title" + index}
                      >
                        {color}
                      </h2>
                      <p className="p-1" key={"color"}>
                        {c}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
