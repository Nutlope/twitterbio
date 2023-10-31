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
import { ListEditButton } from "@/components/ListEditButton";
import { ListDeleteButton } from "@/components/ListDeleteButton";

export default async function Page({ params }: { params: { listId: string } }) {
  const list = await db.list.findUnique({
    where: {
      id: params.listId,
    },
    select: {
      userId: true,
      name: true,
      description: true,
      events: {
        orderBy: {
          startDateTime: "asc",
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!list) {
    return <> </>;
  }
  const events = list.events;

  const pastEvents = events.filter((item) => item.startDateTime < new Date());

  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <>
      <div className="flex flex-col place-items-center gap-4 sm:flex-row">
        <div className="flex flex-col">
          <div className="font-medium">{list.name}</div>
          <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
            {list.description}
          </p>
        </div>
        <UserInfo userId={list.userId} />
        <ListEditButton listId={params.listId} listUserId={list.userId} />
        <ListDeleteButton listId={params.listId} listUserId={list.userId} />
      </div>
      <div className="p-2"></div>
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
                    userId={item.userId}
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
                    userId={item.userId}
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
