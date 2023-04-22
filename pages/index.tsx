import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef, useState, useEffect, useMemo, MouseEventHandler } from "react";
import { toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import LoadingDots from "../components/LoadingDots";
import { TwitterShareButton } from "react-twitter-embed";
import debounce from "lodash.debounce";

import { postAPI } from "../utils/fetch";
import { streamingAPI } from "../utils/streaming";

function isURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [vibe, setVibe] = useState<VibeType>("twitter");
  const [generatedBios, setGeneratedBios] = useState<string>("");

  // ESSENCE state
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [streamingError, setStreamingError] = useState<string>("");

  const [essay, setEssay] = useState({ content: "", heading: "" });
  const [tweets, setTweets] = useState<string[]>([]);

  const postsRef = useRef<null | HTMLDivElement>(null);

  const scrollToPosts = () => {
    if (postsRef.current !== null) {
      const lastPost = postsRef?.current?.lastChild as HTMLElement;
      lastPost?.scrollIntoView({ behavior: "smooth" });
    }
  };

  function isSubstackDraft(url: string) {
    const pattern = /^https:\/\/[\w.-]+\/publish\/post\/\d+$/;
    return pattern.test(url);
  }

  const isValidURL = (url: string) => {
    if (!isURL(url)) {
      setError("Please enter a valid Substack URL.");
      return false;
    } else if (isSubstackDraft(url)) {
      setError("Please enter a published post. We don't work with drafts yet.");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const fetchEssay = async (e: any) => {
    // Clear existing tweets and generatedBios
    setGeneratedBios("");
    setTweets([]);

    if (!isValidURL(url)) {
      return;
    }

    e.preventDefault();
    setLoading(true);

    const { data, error } = await postAPI({
      url: "/api/essayfetcher",
      data: { url },
    });

    if (error) {
      console.error(error);
      setError(error);
    }

    const newEssay = {
      ...essay,
      content: data?.content,
      heading: data?.heading,
    };

    setEssay(newEssay);
    setLoading(false);
  };

  const checkAndStreamBabe = async () => {
    const { content, heading } = essay;
    if (content && heading) {
      await streamBabe(); // generate posts
    }
  };

  useEffect(() => {
    // checkAndStreamBabe();
    callStreamingAPI();
  }, [essay.content, essay.heading]);

  const callStreamingAPI = () => {
    if (essay.content) {
      streamingAPI({
        url: "/api/generate",
        onDataChunk: (chunk) => {
          setGeneratedBios((prev) => prev + chunk);
        },
        onDataEnd: () => {
          setLoading(false);
          scrollToPosts();
        },
        onError: (error: any) => {
          console.error("Streaming API error:", error);
          setStreamingError(error);
        },
        options: {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vibe,
            essay: essay.content,
            url,
          }),
        },
      });
    }
  };

  // not used atm

  const streamBabe = async () => {
    setGeneratedBios("");
    setLoading(true);

    const { data, error } = await postAPI({
      url: "/api/generate",
      data: {
        vibe,
        essay: essay?.content,
        url,
      },
      timeout: Infinity,
    });

    if (error) {
      setLoading(false);
      console.error("Error:", error);
      return;
    }

    const responseBody = data;
    if (!responseBody) {
      return;
    }

    const reader = responseBody.getReader();
    const decoder = new TextDecoder("utf-8");

    reader
      .read()
      .then(function process({ done, value }: { done: boolean; value: any }) {
        if (done) {
          setLoading(false);
          scrollToPosts();
          return;
        }

        if (value) {
          const decodedValue = decoder.decode(value, { stream: !done });
          setGeneratedBios((prev) => prev + decodedValue);
          // scrollToPosts();
        }
        reader.read().then(process);
      });
  };

  // TODO might be irrelevant
  useEffect(() => {
    const tweets = createTweets(generatedBios);
    setTweets(tweets);
    // setTweets([...tweets, newTweets])
  }, [generatedBios]);

  // useEffect(() => {
  //   if (postsRef.current !== null) {
  //     postsRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [generatedBios]);

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>Essence - we capture the essence of your essays</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Share your insights with the world
        </h1>
        <p className="text-slate-500 mt-5">
          Spend your time writing banger essays...we'll handle the tweets.
        </p>
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
              Paste your essay link here — Substack only pls!
            </p>
          </div>
          <div className="flex flex-col">
            <input
              className="focus:ring-purple-500 focus:border-purple-500 block w-full pl-4 pr-3 py-2 my-5 border border-gray-300 rounded-md leading-5 bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 sm:text-sm transition duration-150 ease-in-out"
              type="search"
              name="url"
              autoComplete="url"
              value={url}
              placeholder="Paste your essay link here"
              onChange={(e) => setUrl(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {streamingError && (
              <p className="text-red-500 text-sm mt-1">{streamingError}</p>
            )}
          </div>

          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">Select your vibe.</p>
          </div>
          <div className="block">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>

          {!loading && (
            <button
              className="bg-purple-900 rounded-xl text-white text-slate font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-purple-700/80 w-full"
              // onClick={(e) => generateBio(e)}
              // onClick={(e) => streamBabe(e)}
              onClick={debounce((e: any) => fetchEssay(e), 1000)}
            >
              Generate posts &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-purple-900 rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-purple-700/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>

        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <div className="space-y-10 my-10">
          {generatedBios && (
            <>
              <div>
                <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                  Your generated posts
                </h2>
                {essay?.heading && (
                  <h3 className="sm:text-2xl text-lg mt-2">
                    Essay: {essay.heading}
                  </h3>
                )}
              </div>

              <div
                className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto"
                ref={postsRef}
              >
                {tweets.map((generatedPost: string, index: number) => {
                  if (index < 3) {
                    return (
                      <GeneratedPost
                        key={`${generatedPost}-${index}`}
                        index={index}
                        generatedPost={generatedPost}
                      />
                    );
                  }
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const GeneratedPost = ({
  generatedPost,
  index,
}: {
  generatedPost: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [generatedPost]);

  return (
    <div
      className="bg-white rounded-xl shadow-md p-8 hover:bg-gray-100 transition cursor-copy border text-center"
      ref={ref}
      key={`${generatedPost}-${index}`}
    >
      <p>{generatedPost}</p>
      <div className="flex justify-between mt-4">
        <div className="flex justify-center">
          <button
            className="bg-yellow-400 text-white rounded-lg px-2 py-1 mr-2"
            onClick={(e) => {
              e.stopPropagation();
              console.log("yam");
              toast.success("Upvote counted");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M1 8.25a1.25 1.25 0 112.5 0v7.5a1.25 1.25 0 11-2.5 0v-7.5zM11 3V1.7c0-.268.14-.526.395-.607A2 2 0 0114 3c0 .995-.182 1.948-.514 2.826-.204.54.166 1.174.744 1.174h2.52c1.243 0 2.261 1.01 2.146 2.247a23.864 23.864 0 01-1.341 5.974C17.153 16.323 16.072 17 14.9 17h-3.192a3 3 0 01-1.341-.317l-2.734-1.366A3 3 0 006.292 15H5V8h.963c.685 0 1.258-.483 1.612-1.068a4.011 4.011 0 012.166-1.73c.432-.143.853-.386 1.011-.814.16-.432.248-.9.248-1.388z" />
            </svg>
          </button>
          <button
            className="bg-yellow-400 text-white rounded-lg px-2 py-1"
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Downvote counted");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M18.905 12.75a1.25 1.25 0 01-2.5 0v-7.5a1.25 1.25 0 112.5 0v7.5zM8.905 17v1.3c0 .268-.14.526-.395.607A2 2 0 015.905 17c0-.995.182-1.948.514-2.826.204-.54-.166-1.174-.744-1.174h-2.52c-1.242 0-2.26-1.01-2.146-2.247.193-2.08.652-4.082 1.341-5.974C2.752 3.678 3.833 3 5.005 3h3.192a3 3 0 011.342.317l2.733 1.366A3 3 0 0013.613 5h1.292v7h-.963c-.684 0-1.258.482-1.612 1.068a4.012 4.012 0 01-2.165 1.73c-.433.143-.854.386-1.012.814-.16.432-.248.9-.248 1.388z" />
            </svg>
          </button>
        </div>
        <button
          className="bg-purple-900 text-white rounded-lg px-4 py-1"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(generatedPost);
            toast("Post copied to clipboard", {
              icon: "✂️",
            });
          }}
        >
          Copy
        </button>
      </div>
    </div>
  );
};

function createTweets(stream: string) {
  const tweetRegex = /(\d+\.\s)([^]*?)(?=\s\d+\.|$)/g;
  const tweets = [];
  let match;

  while ((match = tweetRegex.exec(stream)) !== null) {
    const tweet = match[2].trim();
    tweets.push(tweet);
  }

  return tweets;
}

export default Home;
