import { clerkClient } from "@clerk/nextjs";
import Link from "next/link";
import { UserInfo } from "@/components/UserInfo";
import { db } from "@/lib/db";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
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
      {event && event.event ? (
        <AddToCalendarCard
          {...(event.event as AddToCalendarButtonProps)}
          key={event.id}
          update
          updateId={params.eventId}
        />
      ) : (
        <p className="text-lg text-gray-500">No event found.</p>
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
