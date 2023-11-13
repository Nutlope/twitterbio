import { Event, User } from "@prisma/client";
import { clsx } from "clsx";
import EventCard from "@/components/EventCard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordian";
import { AddToCalendarButtonProps } from "@/types";

type EventWithUser = Event & {
  User: User;
};

export default function EventList({
  futureEvents,
  pastEvents,
  variant,
  hideCurator,
}: {
  futureEvents: EventWithUser[];
  pastEvents: EventWithUser[];
  variant?: "future-minimal";
  hideCurator?: boolean;
}) {
  const showPastEvents = variant !== "future-minimal";

  return (
    <Accordion type="multiple" className="w-full" defaultValue={["item-2"]}>
      {showPastEvents && (
        <AccordionItem value="item-1" className="px-6 opacity-80">
          <AccordionTrigger>
            <div className="flex gap-1.5">
              Past events
              <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                {pastEvents.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6">
            {pastEvents.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No past events.</p>
            ) : (
              <ul role="list" className="max-w-full divide-y divide-gray-100">
                {pastEvents.map((item) => (
                  <EventCard
                    key={item.id}
                    User={item.User}
                    id={item.id}
                    event={item.event as AddToCalendarButtonProps}
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
        value="item-2"
        className={clsx("px-6", { "border-b-0": futureEvents.length > 0 })}
      >
        <AccordionTrigger>
          <div className="flex gap-1.5">
            {variant === "future-minimal"
              ? "Portland area events happening soon"
              : "Upcoming events"}
            <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
              {futureEvents.length}
            </span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="-mx-6 rounded-xl">
          {futureEvents.length === 0 ? (
            <p className="mx-6 text-lg text-gray-500">No future events.</p>
          ) : (
            <ul
              role="list"
              className="max-w-full divide-y divide-gray-100 rounded-xl"
            >
              {futureEvents.map((item) => (
                <EventCard
                  key={item.id}
                  User={item.User}
                  id={item.id}
                  event={item.event as AddToCalendarButtonProps}
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
