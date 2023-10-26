"use client";

import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useChat } from "ai/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Output } from "../Output";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {
  Status,
  generatedIcsArrayToEvents,
  getLastMessages,
  reportIssue,
} from "@/lib/utils";

export default function Page() {
  // State variables
  const [chatFinished, setChatFinished] = useState(false);
  const [issueStatus, setIssueStatus] = useState<Status>("idle");
  const [events, setEvents] = useState<AddToCalendarButtonType[] | null>(null);
  const [chatEvents, setChatEvents] = useState<
    AddToCalendarButtonType[] | null
  >(null);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);

  // Hooks and utility functions
  const searchParams = useSearchParams();
  const { append, messages } = useChat({
    onFinish(message) {
      setChatFinished(true);
    },
  });

  const { lastUserMessage, lastAssistantMessage } = getLastMessages(messages);

  // Query params and local storage
  const finished = searchParams.has("message");
  const message = searchParams.get("message") || "";
  const saveIntent = searchParams.get("saveIntent") || "";
  const saveIntentEvent = localStorage.getItem("addToCalendarButtonProps");
  const saveIntentEventJson = JSON.parse(saveIntentEvent || "{}");
  const rawText = searchParams.get("rawText") || "";

  const eventsToUse = saveIntent
    ? [saveIntentEventJson]
    : chatFinished
    ? chatEvents
    : events;

  // Effects
  useEffect(() => {
    if (rawText) {
      append({ role: "user", content: rawText });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (finished) {
      const events = generatedIcsArrayToEvents(message);
      setEvents(events);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  useEffect(() => {
    if (chatFinished) {
      const events = generatedIcsArrayToEvents(lastAssistantMessage);
      setChatEvents(events);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatFinished]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
      <Header />
      <main className="mt-12 flex w-full flex-1 flex-col items-center justify-center px-4 sm:mt-20">
        <Output
          events={eventsToUse}
          finished={finished || !!saveIntent || chatFinished}
          isDev={isDev}
          issueStatus={issueStatus}
          setIssueStatus={setIssueStatus}
          lastAssistantMessage={chatFinished ? lastAssistantMessage : message}
          lastUserMessage={
            chatFinished ? lastUserMessage : "Generated from message"
          }
          reportIssue={reportIssue}
          setEvents={setEvents}
          setTrackedAddToCalendarGoal={setTrackedAddToCalendarGoal}
          trackedAddToCalendarGoal={trackedAddToCalendarGoal}
        />
      </main>
      <Footer />
    </div>
  );
}
