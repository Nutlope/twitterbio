"use client";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { trackGoal } from "fathom-client";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import {
  Status,
  convertIcsToJson,
  generateIssueDescription,
  generateIssueTitle,
} from "@/lib/utils";

export function Output({
  events,
  finished,
  isDev,
  issueStatus,
  setIssueStatus,
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
  setIssueStatus: (status: Status) => void;
  lastAssistantMessage: string;
  lastUserMessage: string;
  reportIssue: (
    title: string,
    description: string,
    setIssueStatus: any
  ) => Promise<void>;
  setEvents: (events: AddToCalendarButtonType[] | null) => void;
  setTrackedAddToCalendarGoal: (trackedAddToCalendarGoal: boolean) => void;
  trackedAddToCalendarGoal: boolean;
}) {
  const eventsAreValid = finished && events && events.length > 0;
  const blankEvents = [
    {
      options: [
        "Apple",
        "Google",
        "iCal",
        "Microsoft365",
        "MicrosoftTeams",
        "Outlook.com",
        "Yahoo",
      ] as
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
      buttonStyle: "text" as const,
      name: "Manual entry" as const,
      description: "" as const,
      location: "" as const,
      startDate: "today" as const,
      endDate: "" as const,
      startTime: "" as const,
      endTime: "" as const,
      timeZone: "" as const,
    } as AddToCalendarButtonType,
  ];

  return (
    <output className="">
      {finished && (
        <>
          {eventsAreValid && (
            <div className="flex flex-wrap justify-center gap-4">
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
                  update={false}
                />
              ))}
            </div>
          )}
          {!eventsAreValid && (
            <div className="flex flex-wrap justify-center gap-4">
              {blankEvents?.map((props, index) => (
                <AddToCalendarCard
                  {...props}
                  key={props.name}
                  onClick={() => {
                    !trackedAddToCalendarGoal && trackGoal("BQ3VFDBF", 1);
                    setTrackedAddToCalendarGoal(true);
                  }}
                  setAddToCalendarButtonProps={(props) => {
                    const newArray = [...blankEvents];
                    newArray[index] = props;
                    setEvents(newArray);
                  }}
                  update={false}
                />
              ))}
            </div>
          )}
          {issueStatus === "submitting" && (
            <button
              className="fixed bottom-5 right-3 z-50 w-40 rounded-xl bg-red-700 px-4 py-2 font-medium text-white"
              disabled
            >
              <span className="loading">
                <span className="bg-white" />
                <span className="bg-white" />
                <span className="bg-white" />
              </span>
            </button>
          )}
          {issueStatus === "idle" && (
            <button
              className="fixed bottom-5 right-3 z-50 w-40 rounded-xl bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800"
              onClick={() =>
                reportIssue(
                  generateIssueTitle(lastUserMessage),
                  generateIssueDescription(
                    lastUserMessage,
                    lastAssistantMessage,
                    convertIcsToJson(lastAssistantMessage),
                    events
                  ),
                  setIssueStatus("submitting")
                )
              }
            >
              Report issue &rarr;
            </button>
          )}
          {issueStatus === "submitted" && (
            <button
              className="fixed bottom-5 right-3 z-50 w-40 rounded-xl bg-red-700 px-4 py-2 font-medium text-white"
              disabled
            >
              ✔︎ Reported
            </button>
          )}
          {isDev && (
            <>
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-8">
                <div className="cursor-pointer rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
                  <p>Prompt</p>
                  <p>{lastUserMessage}</p>
                </div>
              </div>
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-8">
                <div
                  className="cursor-pointer rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100"
                  key={lastAssistantMessage}
                >
                  <p>Generated by ChatGPT</p>
                  <code>{lastAssistantMessage}</code>
                </div>
              </div>
              <div className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-8">
                <div className="cursor-pointer rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
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
                  className="mx-auto flex max-w-xl flex-col items-center justify-center space-y-8"
                  key={`code-${props.name}`}
                >
                  <div className="cursor-pointer rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
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
