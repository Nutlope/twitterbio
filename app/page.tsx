"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import { useChat } from "ai/react";

export default function Page() {
  const eventRef = useRef<null | HTMLDivElement>(null);

  const scrollToEvents = () => {
    if (eventRef.current !== null) {
      eventRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      onResponse() {
        scrollToEvents();
      },
    });

  const onSubmit = (e: any) => {
    handleSubmit(e);
  };

  const userMessages = messages.filter((message) => message.role === "user");
  const assistantMessages = messages.filter(
    (message) => message.role === "assistant"
  );

  const lastUserMessage =
    userMessages?.[userMessages.length - 1]?.content || null;
  const lastAssistantMessage =
    assistantMessages?.[userMessages.length - 1]?.content || null;

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <a
          className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
          href="https://github.com/jaronheard/events.ai"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Generate an event from anything using AI
        </h1>
        <p className="text-slate-500 mt-5">42,069 events generated so far.</p>
        <form className="max-w-xl w-full" onSubmit={onSubmit}>
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              Paste event info{" "}
              <span className="text-slate-500">(or describe your event)</span>.
            </p>
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
            placeholder={
              "e.g. Join us for a virtual event on Thursday, October 14th at 2:00pm ET. We'll be discussing the future of AI and how it will impact our lives."
            }
          />

          {!isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              type="submit"
            >
              Generate your event &rarr;
            </button>
          )}
          {isLoading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
              </span>
            </button>
          )}
        </form>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <output className="space-y-10 my-10">
          {lastAssistantMessage && (
            <>
              <div>
                <h2
                  className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto"
                  ref={eventRef}
                >
                  Your generated event
                </h2>
                <p className="text-slate-500 mt-1">
                  Click to add to your calendar!
                </p>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border"
                  onClick={() => {
                    // download file from generatedEvents as .ics
                    const unescaped = lastAssistantMessage.replace(/\\,/g, ",");
                    const element = document.createElement("a");
                    const file = new Blob([unescaped], {
                      type: "text/calendar",
                    });
                    element.href = URL.createObjectURL(file);
                    element.download = "event.ics";
                    document.body.appendChild(element); // Required for this to work in FireFox
                    element.click();
                  }}
                  key={lastAssistantMessage}
                >
                  <code>{lastAssistantMessage}</code>
                </div>
              </div>
            </>
          )}
        </output>
      </main>
      <Footer />
    </div>
  );
}
