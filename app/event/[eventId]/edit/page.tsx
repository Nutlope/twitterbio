import { clerkClient } from "@clerk/nextjs";
import Link from "next/link";
import { UserInfo } from "@/components/UserInfo";
import { db } from "@/lib/db";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { AddToCalendarButtonProps } from "@/types";
import EventListsButton from "@/components/EventListsButton";

export default async function Page({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await db.event.findUnique({
    where: {
      id: params.eventId,
    },
    select: {
      id: true,
      userId: true,
      event: true,
      createdAt: true,
      eventList: true,
    },
  });

  if (!event) {
    return <p className="text-lg text-gray-500">No event found.</p>;
  }

  const lists = await db.list.findMany({
    where: {
      userId: event.userId,
    },
  });

  return (
    <>
      {event && event.event ? (
        <>
          <AddToCalendarCard
            {...(event.event as AddToCalendarButtonProps)}
            key={event.id}
            update
            updateId={params.eventId}
          >
            <EventListsButton
              userLists={lists}
              eventId={params.eventId}
              eventLists={event.eventList}
            />
          </AddToCalendarCard>
        </>
      ) : (
        <p className="text-lg text-gray-500">No event found.</p>
      )}
      <div className="p-4"></div>
      <Link
        href={`/${event.userId}/events`}
        className="flex place-items-center gap-2"
      >
        <div className="font-medium">Collected by</div>
        <UserInfo userId={event.userId} />
      </Link>
    </>
  );
}
