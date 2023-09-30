"use client";

import { useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useChat } from "ai/react";
import ICAL from "ical.js";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import TurndownService from "turndown";

const turndownService = new TurndownService();

const SAMPLE_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
DTSTART;TZID=PDT:20231004T191500
DTEND;TZID=PDT:20231004T204500
RRULE:FREQ=WEEKLY;COUNT=5
SUMMARY:Yoga Foundations Workshop at People's Yoga
END:VEVENT
END:VCALENDAR
`;

type ICSJson = {
  startDate: string;
  endDate: string;
  summary: string;
  location: string;
  details: string;
  rrule: { freq?: string; count?: number };
  timezone?: string;
};

function convertIcsToJson(icsData: any) {
  // Parse the .ics data
  const jcalData = ICAL.parse(icsData);
  const comp = new ICAL.Component(jcalData);

  // Initialize an array to hold the events
  const events: ICSJson[] = [];

  // Iterate over each event component
  comp.getAllSubcomponents("vevent").forEach((vevent: any) => {
    const event = new ICAL.Event(vevent);

    // Extract data from the event
    const summary = event.summary;
    const location = event.location || undefined;
    const startDate = event.startDate.toString();
    const endDate = event.endDate.toString();
    const details = event.description || undefined;
    const rrule = event.component.getFirstPropertyValue("rrule");
    const timezone = event.startDate.timezone;

    // Create a JSON object for the event and add it to the array
    events.push({
      summary,
      location,
      startDate,
      endDate,
      details,
      rrule,
      timezone,
    });
  });

  // You can now work with this JSON object or stringify it
  return events;
}

function icsJsonToAddToCalendarButtonProps(icsJson: ICSJson) {
  const input = icsJson;
  const { summary, location } = icsJson;
  const description = icsJson.details;
  const startDate = input.startDate.split("T")[0];
  const startTime = input.startDate.split("T")[1].substring(0, 5);
  const endDate = input.endDate.split("T")[0];
  const endTime = input.endDate.split("T")[1].substring(0, 5);
  const timeZone = input.timezone;
  const rrule = input.rrule;

  return {
    options: ["Apple", "Google"] as
      | (
          | "Apple"
          | "Google"
          | "iCal"
          | "Microsoft365"
          | "MicrosoftTeams"
          | "Outlook.com"
          | "Yahoo"
        )[]
      | undefined,
    buttonStyle: "text" as const, // default, 3d, flat, round, neumorphism, text, date, custom, none
    name: summary,
    description: description,
    location: location,
    startDate: startDate,
    endDate: endDate,
    startTime: startTime,
    endTime: endTime,
    timeZone: timeZone,
    recurrence: rrule?.freq || undefined,
    recurrence_count: rrule?.count || undefined,
  };
}

export default function Page() {
  const [finished, setFinished] = useState(false);
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
    setFinished(false);
    handleSubmit(e);
  };

  const userMessages = messages.filter((message) => message.role === "user");
  const assistantMessages = messages.filter(
    (message) => message.role === "assistant"
  );

  const lastUserMessage =
    userMessages?.[userMessages.length - 1]?.content || null;
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
              "Paste a description from a website, a text message form a friend, or anything else. Or you can describe your event."
            }
          />
          <div className="flex items-center space-x-3">
            <p className="text-left">
              <span className="text-slate-500">
                Currently takes about 5 seconds to make your event... hopefully
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
                    <div className="flex justify-center p-2">
                      <AddToCalendarButton {...props} />
                    </div>
                  </div>
                ))}
              </div>
              {true && (
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
