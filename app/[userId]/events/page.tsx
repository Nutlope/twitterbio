import { clerkClient } from "@clerk/nextjs";
import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordian";
import { AddToCalendarButtonProps } from "@/types";
import ListCardsForUser from "@/components/ListCardsForUser";

export default async function Page({ params }: { params: { userId: string } }) {
  const events = await db.event.findMany({
    where: {
      userId: params.userId,
    },
    select: {
      id: true,
      event: true,
      createdAt: true,
      startDateTime: true,
    },
    orderBy: {
      startDateTime: "asc",
    },
  });

  const pastEvents = events.filter((item) => item.startDateTime < new Date());

  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <>
      <div className="flex place-items-center gap-2">
        <div className="font-medium">Events saved by</div>
        <Suspense>
          <UserInfo userId={params.userId} />
        </Suspense>
      </div>
      <div className="p-4"></div>
      <ListCardsForUser userId={params.userId} limit={10} />
      <h2 className="text-sm font-medium text-gray-500">All Events</h2>
      <Accordion type="multiple" className="w-full" defaultValue={["item-2"]}>
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
                    userId={params.userId}
                    id={item.id}
                    event={item.event as AddToCalendarButtonProps}
                    createdAt={item.createdAt}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="px-6">
          <AccordionTrigger>
            <div className="flex gap-1.5">
              Upcoming events
              <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                {futureEvents.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="-mx-6">
            {futureEvents.length === 0 ? (
              <p className="mx-6 text-lg text-gray-500">No future events.</p>
            ) : (
              <ul role="list" className="max-w-full divide-y divide-gray-100">
                {futureEvents.map((item) => (
                  <EventCard
                    key={item.id}
                    userId={params.userId}
                    id={item.id}
                    event={item.event as AddToCalendarButtonProps}
                    createdAt={item.createdAt}
                  />
                ))}
              </ul>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="p-5"></div>
    </>
  );
}
