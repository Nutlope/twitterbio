import { clerkClient } from "@clerk/nextjs";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import { UserInfo } from "@/components/UserInfo";
import { db } from "@/lib/db";
import { AddToCalendarButtonProps } from "@/types";

export default async function Page({
  params,
}: {
  params: { userId: string; eventId: string };
}) {
  const event = await db.event.findUnique({
    where: {
      userId: params.userId,
      id: params.eventId,
    },
    select: {
      id: true,
      event: true,
      createdAt: true,
    },
  });

  const user = await clerkClient.users.getUser(params.userId);

  return (
    <>
      {!event ? (
        <p className="text-lg text-gray-500">No event found.</p>
      ) : (
        <EventCard
          userId={params.userId}
          key={event.id}
          id={event.id}
          event={event.event as AddToCalendarButtonProps}
          createdAt={event.createdAt}
          singleEvent
        />
      )}
      <div className="p-4"></div>
      <Link
        href={`/${params.userId}/events`}
        className="flex place-items-center gap-2"
      >
        <div className="font-medium">Collected by</div>
        <UserInfo user={user} />
      </Link>
    </>
  );
}
