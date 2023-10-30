import Link from "next/link";
import EventCard from "@/components/EventCard";
import { UserInfo } from "@/components/UserInfo";
import { db } from "@/lib/db";
import { AddToCalendarButtonProps } from "@/types";

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
    },
  });

  if (!event) {
    return <p className="text-lg text-gray-500">No event found.</p>;
  }
  return (
    <>
      <EventCard
        userId={event.userId}
        key={event.id}
        id={event.id}
        event={event.event as AddToCalendarButtonProps}
        createdAt={event.createdAt}
        singleEvent
      />
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
