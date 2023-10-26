"use client";

import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useChat } from "ai/react";
import { trackGoal } from "fathom-client";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Form } from "./Form";
import { Output } from "./Output";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Leaderboard from "@/components/Leaderboard";
import {
  Status,
  formatDataOnPaste,
  generatedIcsArrayToEvents,
  getLastMessages,
  reportIssue,
} from "@/lib/utils";

export default function Page() {
  // State variables
  const [issueStatus, setIssueStatus] = useState<Status>("idle");
  const [finished, setFinished] = useState(false);
  const [events, setEvents] = useState<AddToCalendarButtonType[] | null>(null);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);

  // Refs
  const eventRef = useRef<null | HTMLDivElement>(null);

  // Custom hooks and utility functions
  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    messages,
  } = useChat({
    onFinish(message) {
      setFinished(true);
    },
  });

  const { lastUserMessage, lastAssistantMessage } = getLastMessages(messages);

  // Event handlers
  const handlePaste = async (e: any) => formatDataOnPaste(e, setInput);

  const onSubmit = (e: any) => {
    trackGoal("WBJDUXPZ", 1);
    setFinished(false);
    setTrackedAddToCalendarGoal(false);
    setIssueStatus("idle");
    handleSubmit(e);
  };

  // Effects
  useEffect(() => {
    if (finished) {
      const events = generatedIcsArrayToEvents(lastAssistantMessage);
      setEvents(events);
      scrollToEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const isDev = process.env.NODE_ENV === "development";

  // Helper functions
  const scrollToEvents = () => {
    if (eventRef.current !== null) {
      eventRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <Header />
      <main className="mt-12 flex w-full flex-1 flex-col items-center justify-center px-4 sm:mt-20">
        <h1 className="max-w-[708px] text-center text-4xl font-bold text-slate-900 sm:text-6xl">
          Now: ⌨️✨📅
        </h1>
        <div className="p">
          Paste event info <span className="font-semibold">&rarr;</span> clean,
          calendarable event
        </div>
        <div className="p-2"></div>
        <h2 className="max-w-[708px] text-center text-xl font-bold text-slate-900 opacity-70 sm:text-3xl">
          Soon: 📣🫂🎉
        </h2>
        <div className="p text-sm opacity-70">
          Create, collect, curate & share events
        </div>
        <Form
          handleInputChange={handleInputChange}
          handlePaste={handlePaste}
          input={input}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
        <div ref={eventRef}></div>
        <div className="p-6"></div>
        <Output
          events={events}
          finished={finished}
          isDev={isDev}
          issueStatus={issueStatus}
          setIssueStatus={setIssueStatus}
          lastAssistantMessage={lastAssistantMessage}
          lastUserMessage={lastUserMessage}
          reportIssue={reportIssue}
          setEvents={setEvents}
          setTrackedAddToCalendarGoal={setTrackedAddToCalendarGoal}
          trackedAddToCalendarGoal={trackedAddToCalendarGoal}
        />
        <Leaderboard />
        <div className="p-2"></div>
      </main>
      <Footer />
    </div>
  );
}
