"use client";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { trackGoal } from "fathom-client";
import { Bug, Check, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";
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
  hideErrorReporter,
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
  hideErrorReporter?: boolean;
  reportIssue: (
    title: string,
    description: string,
    setIssueStatus: any
  ) => Promise<void>;
  setEvents: (events: AddToCalendarButtonType[] | null) => void;
  setTrackedAddToCalendarGoal: (trackedAddToCalendarGoal: boolean) => void;
  trackedAddToCalendarGoal: boolean;
}) {
  const firstInputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    // If finished is true, focus on the input
    if (finished && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [finished]);

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
                  firstInputRef={index === 0 ? firstInputRef : undefined}
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
                  firstInputRef={index === 0 ? firstInputRef : undefined}
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
          {!hideErrorReporter && (
            <>
              {issueStatus === "submitting" && (
                <Button
                  className="fixed bottom-5 right-3 z-50"
                  variant="destructive"
                  disabled
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              )}
              {issueStatus === "idle" && (
                <Button
                  variant="destructive"
                  className="fixed bottom-5 right-3 z-50 "
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
                  <Bug className="mr-2 h-4 w-4" /> Report issue
                </Button>
              )}
              {issueStatus === "success" && (
                <Button
                  variant="destructive"
                  className="fixed bottom-5 right-3 z-50 "
                  disabled
                >
                  <Check className="mr-2 h-4 w-4" /> Reported
                </Button>
              )}
            </>
          )}
          {/* {isDev && (
            <div className="mt-20 grid gap-4">
              <div className="max-w-screen mx-auto flex flex-col items-center justify-center space-y-8 sm:max-w-xl">
                <div className="cursor-pointer rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
                  <p>Prompt</p>
                  <p>{lastUserMessage}</p>
                </div>
              </div>
              <div className="max-w-screen mx-auto flex flex-col items-center justify-center space-y-8 sm:max-w-xl">
                <div
                  className="cursor-pointer rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100"
                  key={lastAssistantMessage}
                >
                  <p>Generated by ChatGPT</p>
                  <code className="word-break">{lastAssistantMessage}</code>
                </div>
              </div>
              <div className="max-w-screen mx-auto flex flex-col items-center justify-center space-y-8 sm:max-w-xl">
                <div className="cursor-pointer rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
                  <p>ICSJson</p>
                  <code className="word-break">
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
                  className="max-w-screen mx-auto flex flex-col items-center justify-center space-y-8 sm:max-w-xl"
                  key={`code-${props.name}`}
                >
                  <div className="cursor-pointer rounded-xl border bg-white p-4 shadow-md transition hover:bg-gray-100">
                    <p>AddToCalendarButtonProps</p>
                    <code className="word-break">
                      {JSON.stringify(props, null, 2)}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )} */}
        </>
      )}
    </output>
  );
}
