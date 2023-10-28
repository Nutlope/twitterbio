"use client";

import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useChat } from "ai/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Output } from "@/components/Output";
import {
  Status,
  generatedIcsArrayToEvents,
  getLastMessages,
  reportIssue,
} from "@/lib/utils";

const LOADING_TEXTS = [
  "Conjuring your event onto the calendar",
  "Waving our magic wand over your date",
  "Hold on, we're casting a calendar spell",
  "Performing a little time alchemy",
  "Summoning your event into existence",
  "Calendar wizardry in progress",
  "A dash of magic to schedule your event",
  "Hold tight, the calendar sorcerer is at work",
  "Sprinkling some calendar fairy dust",
  "Performing calendar magic, just for you",
  "Weaving your event into the fabric of time",
  "Just a flick and swish, and your event will appear",
  "Unveiling your event with a touch of magic",
  "Inventing moments with a bit of calendar magic",
  "Chanting the calendar incantations",
  "The calendar cauldron is bubbling",
  "Ready for some calendar enchantment?",
];

export default function Page() {
  // State variables
  const [chatFinished, setChatFinished] = useState(false);
  const [issueStatus, setIssueStatus] = useState<Status>("idle");
  const [events, setEvents] = useState<AddToCalendarButtonType[] | null>(null);
  const [loadingText, setLoadingText] = useState("Fetching events...");
  const [chatEvents, setChatEvents] = useState<
    AddToCalendarButtonType[] | null
  >(null);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);

  // Hooks and utility functions
  const searchParams = useSearchParams();
  const { append, isLoading, messages } = useChat({
    onFinish(message) {
      setChatFinished(true);
    },
  });

  const { lastUserMessage, lastAssistantMessage } = getLastMessages(messages);

  // Query params and local storage
  const finished = searchParams.has("message");
  const message = searchParams.get("message") || "";
  const saveIntent = searchParams.get("saveIntent") || "";
  let saveIntentEvent = null;
  if (typeof window !== "undefined") {
    // Perform localStorage action
    saveIntentEvent = localStorage.getItem("addToCalendarButtonProps");
  }
  const saveIntentEventJson = JSON.parse(saveIntentEvent || "{}");
  const rawText = searchParams.get("rawText") || "";
  const [randomLoadingText, setRandomLoadingText] = useState("");

  const eventsToUse = saveIntent
    ? [saveIntentEventJson]
    : chatFinished
    ? chatEvents
    : events;

  const setEventsToUse = chatFinished ? setChatEvents : setEvents;

  // Effects
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * LOADING_TEXTS.length);
    setRandomLoadingText(LOADING_TEXTS[randomIndex]);
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

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
      if (events.length === 0) {
        toast.error(
          "Something went wrong. Add you event manually or try again."
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  useEffect(() => {
    if (chatFinished) {
      const events = generatedIcsArrayToEvents(lastAssistantMessage);
      if (events.length === 0) {
        toast.error(
          "Something went wrong. Add you event manually or try again."
        );
      }
      setChatEvents(events);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatFinished]);

  useEffect(() => {
    const loadingPhrases = [
      "Fetching events...",
      "Parsing with GPT-4...",
      "Generating ICS files...",
      "Almost there...",
      "Cleaning up...",
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % loadingPhrases.length;
      setLoadingText(loadingPhrases[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center gap-8">
          <p className="text-xl font-semibold text-gray-500 sm:text-2xl">
            {loadingText}
          </p>
          <h1 className="text-center text-2xl font-semibold text-gray-900 sm:text-4xl">
            🪄 {randomLoadingText} ✨
          </h1>
          <span className="loading large">
            <span className="bg-gray-900" />
            <span className="bg-gray-900" />
            <span className="bg-gray-900" />
          </span>
        </div>
      ) : (
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
          setEvents={setEventsToUse}
          setTrackedAddToCalendarGoal={setTrackedAddToCalendarGoal}
          trackedAddToCalendarGoal={trackedAddToCalendarGoal}
        />
      )}
    </>
  );
}
