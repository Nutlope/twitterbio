"use client";

import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import Header from "../components/Header";
import { useChat } from "ai/react";
import ICAL from "ical.js";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import test from "node:test";
import { set } from "react-hook-form";

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
    const location = event.location;
    const startDate = event.startDate.toString();
    const endDate = event.endDate.toString();
    const details = event.description;
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
    name: summary,
    description: description,
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
    location: location,
    startDate: startDate,
    endDate: endDate,
    startTime: startTime,
    endTime: endTime,
    timeZone: timeZone,
    recurrence: rrule.freq,
    recurrence_count: rrule.count,
  };
}

function generateGoogleCalendarURL(event: {
  startDate: string;
  endDate: string;
  summary: string;
  location: string;
  details: string;
}) {
  const start = encodeURIComponent(event.startDate);
  const end = encodeURIComponent(event.endDate);
  const summary = encodeURIComponent(event.summary);
  const location = encodeURIComponent(event.location);
  const details = encodeURIComponent(event.details);

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export default function Page() {
  const [event, setEvent] = useState<{
    startDate: string;
    endDate: string;
    summary: string;
    location: string;
    details: string;
  } | null>(null);
  const [googleCalendarUrl, setGoogleCalendarUrl] = useState<string | null>(
    null
  );
  const [finished, setFinished] = useState(false);
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
      onFinish() {
        setFinished(true);
      },
    });

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

  const addToCalendarButtonProps = finished
    ? icsJsonToAddToCalendarButtonProps(
        convertIcsToJson(lastAssistantMessage)[0]
      )
    : null;

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
          {finished && (
            <>
              <div className="flex justify-center">
                <AddToCalendarButton
                  {...addToCalendarButtonProps}
                ></AddToCalendarButton>
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
              <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
                <div className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-pointer border">
                  <p>AddToCalendarButton</p>
                  <code>
                    {JSON.stringify(addToCalendarButtonProps, null, 2)}
                  </code>
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
