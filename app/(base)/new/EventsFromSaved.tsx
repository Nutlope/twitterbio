"use client";

import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { AddToCalendarButtonProps } from "@/types";

const blankEvent = {
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
} as AddToCalendarButtonProps;

export default function EventsFromSaved() {
  let data = blankEvent;
  if (typeof window !== "undefined") {
    const savedData = JSON.parse(localStorage.getItem("updatedProps") || "");
    if (savedData) {
      data = savedData.event;
    }
  }

  return <AddToCalendarCard {...data} />;
}
