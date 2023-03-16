import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Head from "next/head";
import Header from "../components/Header";
import type { NextPage } from "next";
import { Toaster } from "react-hot-toast";
import { useRef, useState } from "react";
import GeneratedSwot from "../components/GeneratedSwot";
import GeneratedColor from "../components/GeneratedColor";
import GenerateColor from "../components/GenerateColor";
import GenerateSwot from "../components/GenerateSwot";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [loadingColor, setLoadingColor] = useState(false);
  const [company, setCompany] = useState("");
  const [color, setColor] = useState("");
  const [generatedSWOT, setGeneratedSWOT] = useState<String>("");
  const [generatedColor, setGeneratedColor] = useState<String>("");

  const swotRef = useRef<null | HTMLDivElement>(null);

  const scrollToSWOT = () => {
    if (swotRef.current !== null) {
      swotRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const promptSWOT = `Generate a SWOT analysis of company ${company}, divided by "Strenghts:", "Weaknesses:", "Opportunities:" and "Threats:". Each section have top 1-5 points summarized of max 300 characters. If no company is found return nothing.`;

  const promptColor = `Max 1000 characters. Give some context on company ${company} `;

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
        <GenerateSwot
          company={company}
          loading={loading}
          loadingColor={loadingColor}
          setCompany={setCompany}
          generateSWOT={generateSWOT}
        ></GenerateSwot>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <GeneratedSwot
          generatedSWOT={generatedSWOT}
          company={company}
          swotRef={swotRef}
          strengthsStyle={strengthsStyle}
          weaknessesStyle={weaknessesStyle}
          opportunitiesStyle={opportunitiesStyle}
          threatsStyle={threatsStyle}
        ></GeneratedSwot>
        <GenerateColor
          generatedSWOT={generatedSWOT}
          loadingColor={loadingColor}
          loading={loading}
          generateColor={generateColor}
          color={color}
          strengthsStyle={strengthsStyle}
          weaknessesStyle={weaknessesStyle}
          opportunitiesStyle={opportunitiesStyle}
          threatsStyle={threatsStyle}
          swotRef={swotRef}
        ></GenerateColor>
        <GeneratedColor
          generatedColor={generatedColor}
          company={company}
          color={color}
          swotRef={swotRef}
          strengthsStyle={strengthsStyle}
          weaknessesStyle={weaknessesStyle}
          opportunitiesStyle={opportunitiesStyle}
          threatsStyle={threatsStyle}
        ></GeneratedColor>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
