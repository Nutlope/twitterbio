"use client";

import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useChat } from "ai/react";
import { trackGoal } from "fathom-client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Form } from "../../components/Form";
import { Output } from "../../components/Output";
import {
  Status,
  generatedIcsArrayToEvents,
  getLastMessages,
  reportIssue,
} from "@/lib/utils";
import { formatDataOnPaste } from "@/lib/turndown";

export default function AddEvent() {
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
    body: {
      source: "text",
    },
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
      if (events.length === 0) {
        toast.error(
          "Something went wrong. Add you event manually or try again."
        );
      }
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
    <>
      <Form
        handleInputChange={handleInputChange}
        handlePaste={handlePaste}
        input={input}
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
      <div ref={eventRef}></div>
      {finished && <div className="p-6"></div>}
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
    </>
  );
}
