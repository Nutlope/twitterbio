"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LoadingDots from "../components/LoadingDots";
import Toggle from "../components/Toggle";
import { ChatCompletionStream } from "together-ai/lib/ChatCompletionStream";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [vibe, setVibe] = useState<VibeType>("Professional");
  const [generatedBios, setGeneratedBios] = useState<String>("");
  const [isLlama, setIsLlama] = useState(false);

  const bioRef = useRef<null | HTMLDivElement>(null);

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const prompt = `Generate 3 ${
    vibe === "Casual" ? "relaxed" : vibe === "Funny" ? "silly" : "Professional"
  } twitter biographies with no hashtags and clearly labeled "1.", "2.", and "3.". Only return these 3 twitter bios, nothing else. ${
    vibe === "Funny" ? "Make the biographies humerous" : ""
  }Make sure each generated biography is less than 300 characters, has short sentences that are found in Twitter bios, and feel free to use this context as well: ${bio}${
    bio.slice(-1) === "." ? "" : "."
  }`;

  const generateBio = async (e: any) => {
    e.preventDefault();
    setGeneratedBios("");
    setLoading(true);
    const response = await fetch("/api/together", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: isLlama
          ? "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo"
          : "mistralai/Mixtral-8x7B-Instruct-v0.1",
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const runner = ChatCompletionStream.fromReadableStream(response.body!);
    runner.on("content", (delta) => setGeneratedBios((prev) => prev + delta));

    scrollToBios();
    setLoading(false);
  };

  return (
    <div 
      className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen px-4 liquid-bg"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center mt-12 sm:mt-20">
        {/* Stats Badge */}
        <div 
          className="glass-anamorphic rounded-2xl py-3 px-8 text-sm mb-8 hover-scale 
                     transition-all duration-300 shadow-custom float-animation"
          style={{ 
            color: 'var(--text-secondary)',
            animationDelay: '0s'
          }}
        >
          <span className="font-bold gradient-text">126,657</span> bios generated so far
        </div>

        {/* Main Title */}
        <h1 
          className="sm:text-6xl text-4xl max-w-4xl font-bold mb-4 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Generate your next{" "}
          <span className="gradient-text">Twitter bio</span>{" "}
          using AI
        </h1>
        
        <p 
          className="text-xl sm:text-2xl max-w-2xl mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          Create professional, engaging Twitter bios in seconds with the power of AI
        </p>

        {/* Model Toggle */}
        <div className="mb-12 float-animation" style={{ animationDelay: '2s' }}>
          <Toggle isGPT={isLlama} setIsGPT={setIsLlama} />
        </div>

        {/* Main Form */}
        <div className="max-w-2xl w-full">
          {/* Step 1 */}
          <div className="flex mt-10 items-center space-x-4 mb-6">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-full 
                         font-bold text-white shadow-custom glass-anamorphic"
              style={{ 
                background: 'var(--gradient-primary)',
                transform: 'perspective(1000px) rotateX(2deg) rotateY(-1deg)'
              }}
            >
              1
            </div>
            <p 
              className="text-left font-medium text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Drop in your job{" "}
              <span style={{ color: 'var(--text-secondary)' }}>(or your favorite hobby)</span>
            </p>
          </div>
          
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full rounded-2xl p-6 text-lg shadow-custom-lg 
                       transition-all duration-300 focus:shadow-custom-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       glass-anamorphic hover-scale mb-8"
            style={{
              color: 'var(--text-primary)',
              resize: 'none'
            }}
            placeholder="e.g. Amazon CEO"
          />
          
          {/* Step 2 */}
          <div className="flex mb-6 mt-10 items-center space-x-4">
            <div 
              className="flex items-center justify-center w-12 h-12 rounded-full 
                         font-bold text-white shadow-custom glass-anamorphic"
              style={{ 
                background: 'var(--gradient-primary)',
                transform: 'perspective(1000px) rotateX(2deg) rotateY(-1deg)'
              }}
            >
              2
            </div>
            <p 
              className="text-left font-medium text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Select your vibe
            </p>
          </div>
          
          <div className="mb-10">
            <DropDown vibe={vibe} setVibe={(newVibe) => setVibe(newVibe)} />
          </div>
          
          {/* Generate Button */}
          {loading ? (
            <button
              className="w-full rounded-2xl font-medium px-8 py-5 text-lg 
                         shadow-custom-lg transition-all duration-300 glass-anamorphic"
              style={{
                background: 'var(--gradient-primary)',
                color: 'white'
              }}
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          ) : (
            <button
              className="w-full rounded-2xl font-medium px-8 py-5 text-lg 
                         shadow-custom hover-scale hover:shadow-custom-lg
                         transition-all duration-300 glass-anamorphic prismatic-border"
              style={{
                background: 'var(--gradient-primary)',
                color: 'white'
              }}
              onClick={(e) => generateBio(e)}
            >
              Generate your bio ✨
            </button>
          )}
        </div>
        
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        
        {/* Divider */}
        <div 
          className="w-full max-w-2xl h-px my-16 glass-effect"
          style={{ height: '2px' }}
        />
        
        {/* Generated Results */}
        <div className="space-y-10 my-10 w-full max-w-4xl">
          {generatedBios && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold mx-auto mb-8 gradient-text"
                  ref={bioRef}
                >
                  Your generated bios
                </h2>
              </div>
              <div className="grid gap-8 md:grid-cols-1 max-w-3xl mx-auto">
                {generatedBios
                  .substring(generatedBios.indexOf("1") + 3)
                  .split(/2\.|3\./)
                  .map((generatedBio, index) => {
                    return (
                      <div
                        className="glass-anamorphic rounded-3xl p-8 hover-scale 
                                   transition-all duration-300 cursor-copy
                                   shadow-custom hover:shadow-custom-lg float-animation"
                        style={{
                          animationDelay: `${index * 0.5}s`,
                          animationDuration: '8s'
                        }}
                        onClick={() => {
                          navigator.clipboard.writeText(generatedBio);
                          toast("Bio copied to clipboard", {
                            icon: "✂️",
                          });
                        }}
                        key={index}
                      >
                        <p 
                          className="text-lg leading-relaxed"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {generatedBio}
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
}
