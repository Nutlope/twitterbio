import { Comment, Event, FollowEvent, User } from "@prisma/client";
import { clsx } from "clsx";
import { EventCard } from "@/components/EventCard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordian";
import { AddToCalendarButtonProps } from "@/types";
import { collapseSimilarEvents } from "@/lib/similarEvents";

export type EventWithUser = Event & {
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
  function getVisibleEvents(events: EventWithUser[]) {
    return events.filter(
      (item) => showPrivateEvents || item.visibility === "public"
    );
  }

  const currentEventsToUse = collapseSimilarEvents(
    getVisibleEvents(currentEvents)
  );
  const pastEventsToUse = collapseSimilarEvents(getVisibleEvents(pastEvents));
  const futureEventsToUse = collapseSimilarEvents(
    getVisibleEvents(futureEvents)
  );
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
            "border-b-0": currentEventsToUse.length > 0,
          })}
        >
          <AccordionTrigger>
            <div className="flex gap-1.5">
              Past events
              <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                {pastEventsToUse.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6">
            {pastEventsToUse.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No past events.</p>
            ) : (
              <ul role="list" className="max-w-full divide-y divide-gray-100">
                {pastEventsToUse.map(({ event: item, similarEvents }) => (
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
                    similarEvents={similarEvents}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      )}
      {showCurrentEvents && currentEventsToUse.length > 0 && (
        <AccordionItem
          value="current-events"
          className="relative border-b-0 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-6 ring-1 ring-black/10 sm:rounded-2xl"
        >
          <AccordionTrigger>
            <div className="flex gap-1.5 font-semibold">
              Happening now
              <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                {currentEventsToUse.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6 rounded-xl">
            {currentEventsToUse.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No future events.</p>
            ) : (
              <ul
                role="list"
                className="max-w-full divide-y divide-gray-100 rounded-xl"
              >
                {currentEventsToUse.map(({ event: item, similarEvents }) => (
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
                    similarEvents={similarEvents}
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
          "border-b-0": futureEventsToUse.length > 0,
        })}
      >
        <AccordionTrigger>
          <div className="flex gap-1.5">
            {variant === "future-minimal"
              ? "Portland area events happening soon"
              : "Upcoming events"}
            <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
              {futureEventsToUse.length}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="-mx-6 rounded-xl">
          {futureEventsToUse.length === 0 ? (
            <p className="mx-6 text-lg text-gray-500">No future events.</p>
          ) : (
            <ul
              role="list"
              className="max-w-full divide-y divide-gray-100 rounded-xl"
            >
              {futureEventsToUse.map(({ event: item, similarEvents }) => (
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
                  similarEvents={similarEvents}
                />
              ))}
            </ul>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
