import Link from "next/link";
import { UserInfo } from "@/components/UserInfo";
import { db } from "@/lib/db";
import { AddToCalendarCard } from "@/components/AddToCalendarCard";
import { AddToCalendarButtonProps } from "@/types";
import EventListsButton from "@/components/EventListsButton";
import { extractFilePath } from "@/lib/utils";
import ImageUpload from "@/app/(base)/new/ImageUpload";

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
      User: {
        select: {
          username: true,
          lists: true,
        },
      },
    },
  });

  if (!event) {
    return <p className="text-lg text-gray-500">No event found.</p>;
  }

  const eventData = event.event as AddToCalendarButtonProps;
  const savedFilePath = eventData?.images?.[0]
    ? extractFilePath(eventData?.images?.[0])
    : undefined;

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
              userLists={event.User.lists}
              eventId={params.eventId}
              eventLists={event.eventList}
            />
          </AddToCalendarCard>
          <div className="p-4"></div>
          <ImageUpload savedFilePath={savedFilePath} />
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
