import EventsError from "./EventsError";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { generatedIcsArrayToEvents } from "@/lib/utils";
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

export default async function EventsFromRawText({
  rawText,
}: {
  rawText: string;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/event/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputText: rawText }),
  });
  const json = await res.json();
  const response = json?.response?.choices?.[0]?.message?.content;
  let events = [] as AddToCalendarButtonProps[];

  try {
    events = generatedIcsArrayToEvents(response);
  } catch (e: any) {
    console.log(e);
  }

  return (
    <>
      {events.length > 0 &&
        events?.map((props, index) => (
          <AddToCalendarCard {...props} key={props.name} />
        ))}
      {events.length === 0 && (
        <>
          <EventsError rawText={rawText} response={response || undefined} />
          <div className="p-4"></div>
          <AddToCalendarCard {...blankEvent} />
        </>
      )}
    </>
  );
}
