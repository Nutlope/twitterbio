"use client";

import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useChat } from "ai/react";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { trackGoal } from "fathom-client";
import { AddToCalendarCard } from "../components/AddToCalendarCard";
import {
  convertIcsToJson,
  turndownService,
  SAMPLE_ICS,
  generateIssueTitle,
  generateIssueDescription,
  generatedIcsArrayToEvents,
} from "../utils/utils";

type Status = "idle" | "submitting" | "submitted" | "error";

function Form({
  handleInputChange,
  handlePaste,
  input,
  isLoading,
  onSubmit,
}: {
  handleInputChange: (e: any) => void;
  handlePaste: (e: any) => Promise<void>;
  input: string;
  isLoading: boolean;
  onSubmit: (e: any) => void;
}) {
  return (
    <form className="max-w-xl w-full" onSubmit={onSubmit}>
      <div className="flex mt-10 items-center space-x-3">
        <p className="text-left font-medium">
          Paste event info{" "}
          <span className="text-slate-500">(or describe your event)</span>.
        </p>
      </div>
      <textarea
        onPaste={handlePaste}
        value={input}
        onChange={handleInputChange}
        rows={4}
        className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-5"
        placeholder={
          "Paste a description from a website, a text message from a friend, or anything else. Or you can describe your event."
        }
      />
      <div className="flex items-center space-x-3">
        <p className="text-left">
          <span className="text-slate-500">
            ⏳ Be patient, takes ~5 seconds/event.
          </span>
        </p>
      </div>

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
  );
}

function Output({
  events,
  finished,
  isDev,
  issueStatus,
  lastAssistantMessage,
  lastUserMessage,
  reportIssue,
  setEvents,
  setTrackedAddToCalendarGoal,
  trackedAddToCalendarGoal,
}: {
  events: AddToCalendarButtonType[] | null;
  finished: boolean;
  isDev: boolean;
  issueStatus: Status;
  lastAssistantMessage: string;
  lastUserMessage: string;
  reportIssue: (title: string, description: string) => Promise<void>;
  setEvents: (events: AddToCalendarButtonType[] | null) => void;
  setTrackedAddToCalendarGoal: (trackedAddToCalendarGoal: boolean) => void;
  trackedAddToCalendarGoal: boolean;
}) {
  return (
    <output className="space-y-10 my-10">
      {finished && (
        <>
          <div className="flex justify-center gap-4 flex-wrap">
            {events?.map((props, index) => (
              <AddToCalendarCard
                {...props}
                key={props.name}
                onClick={() => {
                  !trackedAddToCalendarGoal && trackGoal("BQ3VFDBF", 1);
                  setTrackedAddToCalendarGoal(true);
                }}
                setAddToCalendarButtonProps={(props) => {
                  const newArray = [...events];
                  newArray[index] = props;
                  setEvents(newArray);
                }}
              />
            ))}
          </div>
          {issueStatus === "submitting" && (
            <button
              className="bg-red-700 z-50 rounded-xl text-white font-medium px-4 py-2 w-40 fixed bottom-5 right-3"
              disabled
            >
              <span className="loading">
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
                <span style={{ backgroundColor: "white" }} />
              </span>
            </button>
          )}
          {issueStatus === "idle" && (
            <button
              className="bg-red-700 z-50 rounded-xl text-white font-medium px-4 py-2 hover:bg-red-800 w-40 fixed bottom-5 right-3"
              onClick={() =>
                reportIssue(
                  generateIssueTitle(lastUserMessage),
                  generateIssueDescription(
                    lastUserMessage,
                    lastAssistantMessage,
                    convertIcsToJson(lastAssistantMessage),
                    events
                  )
                )
              }
            >
              Report issue &rarr;
            </button>
          )}
          {issueStatus === "submitted" && (
            <button
              className="bg-red-700 z-50 rounded-xl text-white font-medium px-4 py-2 w-40 fixed bottom-5 right-3"
              disabled
            >
              ✔︎ Reported
            </button>
          )}
          {isDev && (
            <>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border">
                  <p>Prompt</p>
                  <p>{lastUserMessage}</p>
                </div>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div
                  className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border"
                  key={lastAssistantMessage}
                >
                  <p>Generated by ChatGPT</p>
                  <code>{lastAssistantMessage}</code>
                </div>
              </div>
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border">
                  <p>ICSJson</p>
                  <code>
                    {JSON.stringify(
                      convertIcsToJson(lastAssistantMessage),
                      null,
                      2
                    )}
                  </code>
                </div>
              </div>
              {events?.map((props) => (
                <div
                  className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto"
                  key={`code-${props.name}`}
                >
                  <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border">
                    <p>AddToCalendarButtonProps</p>
                    <code>{JSON.stringify(props, null, 2)}</code>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </output>
  );
}

export default function Page() {
  const [issueStatus, setIssueStatus] = useState<Status>("idle");
  const [finished, setFinished] = useState(false);
  const [events, setEvents] = useState<AddToCalendarButtonType[] | null>(null);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);
  const eventRef = useRef<null | HTMLDivElement>(null);

  const scrollToEvents = () => {
    if (eventRef.current !== null) {
      eventRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    messages,
  } = useChat({
    onResponse() {
      scrollToEvents();
    },
    onFinish(message) {
      setFinished(true);
    },
  });

  // set events when changing from not finished to finished
  useEffect(() => {
    if (finished) {
      const events = generatedIcsArrayToEvents(lastAssistantMessage);
      setEvents(events);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const handlePaste = async (e: any) => {
    // Check if the clipboard contains HTML
    if (e.clipboardData && e.clipboardData.types.indexOf("text/html") > -1) {
      e.preventDefault();

      // Get HTML content from clipboard
      const htmlContent = e.clipboardData.getData("text/html");

      // Convert to markdown
      const markdownText = turndownService.turndown(htmlContent);

      // set input to markdown
      setInput(markdownText);
    }
  };

  const onSubmit = (e: any) => {
    trackGoal("WBJDUXPZ", 1);
    setFinished(false);
    setTrackedAddToCalendarGoal(false);
    setIssueStatus("idle");
    handleSubmit(e);
  };

  const reportIssue = async (title: string, description: string) => {
    setIssueStatus("submitting");
    const response = await fetch("/api/bug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    const data = await response.json();

    if (data.issue.success) {
      trackGoal("B2ZT84YS", 0);
      console.log("Successfully created issue:", data.issue);
      setIssueStatus("submitted");
    } else {
      console.log("Error creating issue:", data);
      setIssueStatus("error");
    }
  };

  const userMessages = messages.filter((message) => message.role === "user");
  const assistantMessages = messages.filter(
    (message) => message.role === "assistant"
  );

  const lastUserMessage =
    userMessages?.[userMessages.length - 1]?.content || "";
  // const lastAssistantMessage =
  //   assistantMessages?.[userMessages.length - 1]?.content || null;
  const lastAssistantMessage =
    assistantMessages?.[userMessages.length - 1]?.content || SAMPLE_ICS;

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900 text-center">
          Paste anything, get calendar events
        </h1>
        <p className="text-slate-500 mt-5">1,312 events generated so far.</p>
        <Form
          handleInputChange={handleInputChange}
          handlePaste={handlePaste}
          input={input}
          isLoading={isLoading}
          onSubmit={onSubmit}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <Output
          events={events}
          finished={finished}
          isDev={isDev}
          issueStatus={issueStatus}
          lastAssistantMessage={lastAssistantMessage}
          lastUserMessage={lastUserMessage}
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
