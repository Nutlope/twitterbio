import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import Link from 'next/link';
import { useRouter } from "next/router";

const Home: NextPage = () => {
  /* State variables that store user input and GPT-3 results */ 
  const [loading, setLoading] = useState(false);
  const [clinicalNote, setClinicalNote] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [icdResults, setIcdResults] = useState("");

  /* Router to navigate between pages*/
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
    if (icdResults != "") {
      if (!icdResults.includes(":")) {
        alert("A formatting error has occurred!");
      }
      router.push({
        pathname: '/[codes]',
        query: {
          codes: icdResults,
          note: clinicalNote
        }
      });
    }
  }, [icdResults]);

  /* Calls CRFM api located at api/helm.py using POST method. 
     Sets the results to icdResults. setLoading is just for visual effects :D */
  const generateCodes = async (e: any) => {
    e.preventDefault();
    setIcdResults("");
    setLoading(true);

    const response = await fetch("/api/helm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clinicalNote,
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
      setIcdResults((prev) => prev + chunkValue);
    }
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>AI for Medical Coding</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Automate medical coding using GPT
        </h1>
        <p className="text-slate-500 mt-5">Works with the latest ICD-10 codes.</p>
        <div className="max-w-xl w-full">
          <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
              className="mb-5 sm:mb-0"
            />
            <p className="text-left font-medium">
              Enter your clinical notes {" "}
              <span className="text-slate-500">
                (no special formatting necessary)
              </span>
              .
            </p>
          </div>
          <textarea
            value={clinicalNote}
            onChange={(e) => setClinicalNote(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "Copy and paste the clinical note here. Please limit notes to 2000 characters."
            }
          />
          {/* <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Enter your API key below.</p>
          </div>
          <div className="block">
          <textarea
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            rows={1}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "Copy and paste your API key here"
            }
          />
            { <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />}
          </div> */}

          {!loading && (
            // <Link href={{
            //   pathname: '/[slug]',
            //   query: {slug: "/" + icdResults},
            // }}>
              <button onClick={(e) => generateCodes(e)} className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full">
                Generate ICD-10 codes &rarr;
              </button>
            // </Link>
          )}
          {loading && (
            // <Link href={{
            //   pathname: '/[slug]',
            //   query: {slug: "/" + icdResults},
            // }}    
            <button className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled>
              <LoadingDots color="white" style="large" />
              </button>
          )}
        </div>
        {/* <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {icdResults && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={clinicalNoteRef}
                >
                  Your generated ICD-10 codes
                </h2>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                {icdResults
                  .substring(icdResults.indexOf("1") + 3)
                  .split("2.")
                  .map((generatedBio) => { 
                    return (
                      <div
                        className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                        onClick={() => {
                          navigator.clipboard.writeText(icdResults);
                          toast("Bio copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={icdResults}
                      >
                        <p>{icdResults}</p>
                      </div>
                    ); 
                  })}
              </div>
            </>
          )}
        </div>*/}
      </main>
      {/* <Footer /> */}
    </div> 
  );
};

export default Home;
