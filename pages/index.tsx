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
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("twitter");
  const [generatedBios, setGeneratedBios] = useState<string>("");

  // ESSENCE state
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [streamingError, setStreamingError] = useState<string>("");
  const [essayHeading, setEssayHeading] = useState<string>("");
  const [essayContent, setEssayContent] = useState<string>("");
  const [essay, setEssay] = useState({ content: "", heading: "" });
  const [tweets, setTweets] = useState<string[]>([]);

  const postsRef = useRef<null | HTMLDivElement>(null);

  // const scrollToPosts = () => {
  //   if (postsRef.current !== null) {
  //     postsRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // };

  const scrollToPosts = () => {
    if (postsRef.current !== null) {
      const lastPost = postsRef.current.lastChild as HTMLElement;
      lastPost.scrollIntoView({ behavior: "smooth" });
    }
  };

  // TODO Validation
  // number of generated tweets
  // make the dropdown vibe work

  const prompt = `Generate 2 ${vibe} twitter biographies with no hashtags and clearly labeled "1." and "2.". ${
    vibe === "funny"
      ? "Make sure there is a joke in there and it's a little ridiculous."
      : null
  }
      Make sure each generated biography is less than 160 characters, has short sentences that are found in Twitter bios, and base them on this context: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }`;

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

  //   try {
  //     const response = await fetch("/api/essayfetcher", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         url,
  //       }),
  //     });

  //     if (!response.ok) {
  //       console.error(response);
  //       throw new Error(response.statusText);
  //     }

  //     const essayBody = await response.json();

  //     if (essayBody.error) {
  //       setError(essayBody.error);
  //     }

  //     const newEssay = {
  //       ...essay,
  //       content: essayBody?.content,
  //       heading: essayBody?.heading,
  //     };
  //     setEssay(newEssay);
  //     // TODO remove above
  //     // setEssayContent(essayBody?.content);
  //     // setEssayHeading(essayBody?.heading);
  //     setLoading(false);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

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
    // console.log(generatedBios);
    // const newTweets = formatTweets(generatedBios);
    // const newTweets = [...tweets, generatedBios]

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
        <title>Essence</title>
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
              className="bg-amber-500 rounded-xl text-slate font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-purple-800/80 w-full"
              // onClick={(e) => generateBio(e)}
              // onClick={(e) => streamBabe(e)}
              onClick={debounce((e: any) => fetchEssay(e), 1000)}
            >
              Generate posts &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-amber-600 rounded-xl text-slate font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-purple-800/80 w-full"
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
                {essayHeading && (
                  <h3 className="sm:text-2xl text-lg mt-2">
                    Essay: {essayHeading}
                  </h3>
                )}
              </div>

              <div
                className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto"
                ref={postsRef}
              >
                {tweets.map((generatedPost: string, index: number) => {
                  return (
                    <GeneratedPost
                      key={`${generatedPost}-${index}`}
                      index={index}
                      generatedPost={generatedPost}
                    />
                  );
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
            className="bg-purple-500 text-white rounded-lg px-2 py-1 mr-2"
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Upvote counted");
            }}
          >
            👍
          </button>
          <button
            className="bg-gray-500 text-white rounded-lg px-2 py-1"
            onClick={(e) => {
              e.stopPropagation();
              toast.success("Downvote counted");
            }}
          >
            👎
          </button>
        </div>
        <button
          className="bg-purple-800 text-white rounded-lg px-4 py-1"
          onClick={(e) => {
            e.stopPropagation();

            navigator.clipboard.writeText(generatedPost);
            toast("Bio copied to clipboard", {
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

// const CustomTwitterButton = ({ text, index, url }) => {
//   const twitterButton = useMemo(() => {
//     return (
//       <TwitterShareButton
//         key={`tweet-button-${index}`}
//         url={url}
//         options={{ text, dataSize: 'large', size: 'large' }}
//       />
//     );
//   }, [text, index, url]);

//   return twitterButton;
// };

// function createTweets(stream: string) {
//   let tweets = [];
//   for (let i = 0; i < 3; i++) {
//     let string = (i + 1).toString();
//     let tweet = stream.substring(stream.indexOf(string) + 3);
//     tweets.push(tweet);
//   }
//   return tweets;
// }
{
  /* <div className="flex mt-10 items-center space-x-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
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
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com."
            }
          /> */
  // function formatTweets(input: string) {
  //   if (!input) {
  //     return [];
  //   }
  //   const formattedData = input
  //     .split(/ (?=Tweet \d:)/)
  //     .map((str) => str.replace(/^Tweet \d:\s*/, "").trim());
  //   return formattedData;
  // }
}

// const generateBio = async (e: any) => {
//   e.preventDefault();
//   setGeneratedBios("");
//   setLoading(true);
//   const response = await fetch("/api/generate", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       essay: bio,
//       prompt,
//       url
//     }),
//   });

//   if (!response.ok) {
//     let data = response.body
//     const reader = data.getReader();
//     const decoder = new TextDecoder();
//     throw new Error(response.statusText);
//   }

//   // This data is a ReadableStream
//   const data = response.body;
//   if (!data) {
//     return;
//   }

//   const reader = data.getReader();
//   const decoder = new TextDecoder();
//   let done = false;

//   while (!done) {
//     const { value, done: doneReading } = await reader.read();
//     done = doneReading;
//     const chunkValue = decoder.decode(value);
//     debugger
//     setGeneratedBios((prev) => prev + chunkValue);
//     console.log("TEXT", chunkValue)
//   }
//   scrollToPosts();
//   setLoading(false);
// };
