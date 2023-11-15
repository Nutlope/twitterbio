import { Comment, Event, FollowEvent, User } from "@prisma/client";
import { clsx } from "clsx";
import RainbowText from "./RainbowText";
import { EventCard } from "@/components/EventCard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordian";
import { AddToCalendarButtonProps } from "@/types";

type EventWithUser = Event & {
  User: User;
  FollowEvent: FollowEvent[];
  Comment: Comment[];
};

export default function EventList({
  currentEvents,
  futureEvents,
  pastEvents,
  variant,
  hideCurator,
  showPrivateEvents,
}: {
  currentEvents: EventWithUser[];
  futureEvents: EventWithUser[];
  pastEvents: EventWithUser[];
  variant?: "future-minimal";
  hideCurator?: boolean;
  showPrivateEvents?: boolean;
}) {
  const publicCurrentEvents = currentEvents.filter(
    (item) => item.visibility === "public"
  );
  const publicFutureEvents = futureEvents.filter(
    (item) => item.visibility === "public"
  );
  const publicPastEvents = pastEvents.filter(
    (item) => item.visibility === "public"
  );
  const currentEventsToShow = showPrivateEvents
    ? currentEvents
    : publicCurrentEvents;
  const futureEventsToShow = showPrivateEvents
    ? futureEvents
    : publicFutureEvents;
  const pastEventsToShow = showPrivateEvents ? pastEvents : publicPastEvents;
  const showPastEvents = variant !== "future-minimal";
  const showCurrentEvents = true;

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={["current-events", "future-events"]}
    >
      {showPastEvents && (
        <AccordionItem
          value="past-events"
          className={clsx("px-6 opacity-80", {
            "border-b-0": currentEventsToShow.length > 0,
          })}
        >
          <AccordionTrigger>
            <div className="flex gap-1.5">
              Past events
              <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                {pastEventsToShow.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6">
            {pastEventsToShow.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No past events.</p>
            ) : (
              <ul role="list" className="max-w-full divide-y divide-gray-100">
                {pastEventsToShow.map((item) => (
                  <EventCard
                    key={item.id}
                    User={item.User}
                    FollowEvent={item.FollowEvent}
                    Comment={item.Comment}
                    id={item.id}
                    event={item.event as AddToCalendarButtonProps}
                    visibility={item.visibility}
                    createdAt={item.createdAt}
                    hideCurator={hideCurator}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
      {showCurrentEvents && currentEventsToShow.length > 0 && (
        <AccordionItem
          value="current-events"
          className="relative border-b-0 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-6 ring-1 ring-black/10 sm:rounded-2xl"
        >
          <AccordionTrigger>
            <div className="flex gap-1.5 font-semibold">
              Happening now
              <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                {currentEventsToShow.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6 rounded-xl">
            {currentEventsToShow.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No future events.</p>
            ) : (
              <ul
                role="list"
                className="max-w-full divide-y divide-gray-100 rounded-xl"
              >
                {currentEventsToShow.map((item) => (
                  <EventCard
                    key={item.id}
                    User={item.User}
                    FollowEvent={item.FollowEvent}
                    Comment={item.Comment}
                    id={item.id}
                    event={item.event as AddToCalendarButtonProps}
                    visibility={item.visibility}
                    createdAt={item.createdAt}
                    hideCurator={hideCurator}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem
        value="future-events"
        className={clsx("px-6", {
          "border-b-0": futureEventsToShow.length > 0,
        })}
      >
        <AccordionTrigger>
          <div className="flex gap-1.5">
            {variant === "future-minimal"
              ? "Portland area events happening soon"
              : "Upcoming events"}
            <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
              {futureEventsToShow.length}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="-mx-6 rounded-xl">
          {futureEventsToShow.length === 0 ? (
            <p className="mx-6 text-lg text-gray-500">No future events.</p>
          ) : (
            <ul
              role="list"
              className="max-w-full divide-y divide-gray-100 rounded-xl"
            >
              {futureEventsToShow.map((item) => (
                <EventCard
                  key={item.id}
                  User={item.User}
                  FollowEvent={item.FollowEvent}
                  Comment={item.Comment}
                  id={item.id}
                  event={item.event as AddToCalendarButtonProps}
                  visibility={item.visibility}
                  createdAt={item.createdAt}
                  hideCurator={hideCurator}
                />
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
