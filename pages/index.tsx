import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import DropDown from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Home: NextPage = () => {
  const [openPopover, setOpenPopover] = useState(false);

  console.log({ openPopover });

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Twitter Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4">
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
        <div className="max-w-xl">
          <div className="flex mt-8 items-center space-x-3">
            <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
            <p className="">
              Copy your current bio{" "}
              <span className="text-slate-500">
                (or write two sentences about yourself)
              </span>
              .
            </p>
          </div>
          <textarea
            rows={4}
            name="comment"
            id="comment"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm my-5"
            placeholder={
              "Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Nextjs. Writing at nutlope.substack.com."
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="">Select your vibe.</p>
          </div>
          <div className="block">
            <DropDown
              openPopover={openPopover}
              setOpenPopover={setOpenPopover}
            />
          </div>
          {/* Add some validation so this doesn't happen */}
          {/* Generate multiple variations */}
          {/* Add that resizable box  */}
          <button className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full">
            Generate your bio &rarr;
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

function Github({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
