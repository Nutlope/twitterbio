"use client";
import { useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useChat } from "ai/react";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { trackGoal } from "fathom-client";
import {
  turndownService,
  SAMPLE_ICS,
  convertIcsToJson,
  icsJsonToAddToCalendarButtonProps,
  generateIssueTitle,
  generateIssueDescription,
} from "./page";

export default function Page() {
  const [issueStatus, setIssueStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");
  const [finished, setFinished] = useState(false);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);
  const eventRef = useRef<null | HTMLDivElement>(null);
  const textareaRef = useRef(null);

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
    onFinish() {
      setFinished(true);
    },
  });

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

  const addToCalendarButtonPropsArray = finished
    ? convertIcsToJson(lastAssistantMessage).map((icsJson) =>
        icsJsonToAddToCalendarButtonProps(icsJson)
      )
    : null;

  const isDev = process.env.NODE_ENV === "development";

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

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-12 sm:mt-20">
        <h1 className="sm:text-6xl text-4xl max-w-[708px] font-bold text-slate-900">
          Paste anything, get calendar events
        </h1>
        <p className="text-slate-500 mt-5">1,312 events generated so far.</p>
        <form className="max-w-xl w-full" onSubmit={onSubmit}>
          <div className="flex mt-10 items-center space-x-3">
            <p className="text-left font-medium">
              Paste event info{" "}
              <span className="text-slate-500">(or describe your event)</span>.
            </p>
          </div>
          <textarea
            ref={textareaRef}
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
                Currently takes 5+ seconds to make your events... hopefully
                faster soon!
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
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <output className="space-y-10 my-10">
          {finished && (
            <>
              <div className="flex justify-center gap-4 flex-wrap">
                {addToCalendarButtonPropsArray?.map((props) => (
                  <div
                    className="bg-white rounded-xl shadow-md p-4 border max-w-md"
                    key={props.name}
                  >
                    {/* Styled list of name, time, location */}
                    <p className="text-lg font-bold">{props.name}</p>
                    <p className="text-sm text-gray-500">
                      📅 {props.startDate} {props.startTime} - {props.endDate}{" "}
                      {props.endTime}
                    </p>
                    {props.recurrence && (
                      <p className="text-sm text-gray-500">
                        🔄 {props.recurrence}
                      </p>
                    )}
                    {props.location && (
                      <p className="text-sm text-gray-500">
                        📍 {props.location}
                      </p>
                    )}
                    {props.description && (
                      <p className="py-2">{props.description}</p>
                    )}
                    <div
                      className="flex justify-center p-2"
                      onClick={() => {
                        !trackedAddToCalendarGoal && trackGoal("BQ3VFDBF", 1);
                        setTrackedAddToCalendarGoal(true);
                      }}
                    >
                      <AddToCalendarButton {...props} />
                    </div>
                  </div>
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
                        addToCalendarButtonPropsArray
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
                      onClick={() => {
                        // download file from generatedEvents as .ics
                        const unescaped = lastAssistantMessage.replace(
                          /\\,/g,
                          ","
                        );
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
                  {addToCalendarButtonPropsArray?.map((props) => (
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
      </main>
      <Footer />
    </div>
  );
}
