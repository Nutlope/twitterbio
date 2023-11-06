import { unknown } from "zod";
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

async function fetchWithTimeout(
  resource: RequestInfo,
  options = {} as RequestInit & { timeout?: number }
) {
  // timeout after 22 seconds to work around vercel timeout
  const { timeout = 22000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

export default async function EventsFromRawText({
  rawText,
}: {
  rawText: string;
}) {
  const res = await fetchWithTimeout(
    `${process.env.NEXT_PUBLIC_URL}/api/event/new`,
    {
      timeout: 22000,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputText: rawText }),
    }
  );
  const json = await res.json();
  if (!json?.response?.choices?.[0]?.message?.content) {
    return <EventsError rawText={rawText} response={json} />;
  }
  const response = json?.response?.choices?.[0]?.message?.content;
  let events = [] as AddToCalendarButtonProps[];

  try {
    events = generatedIcsArrayToEvents(response);
  } catch (e: any) {
    console.log(e);
  }

  if (events.length === 0) {
    return (
      <>
        <EventsError rawText={rawText} response={response || undefined} />
        <div className="p-4"></div>
        <AddToCalendarCard {...blankEvent} />
      </>
    );
  }

  if (events.length >= 0) {
    return (
      <>
        {events.length > 0 &&
          events?.map((props, index) => (
            <AddToCalendarCard {...props} key={props.name} />
          ))}
        {events.length === 0 && <></>}
      </>
    );
  }
}
