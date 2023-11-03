import Link from "next/link";
import { Metadata, ResolvingMetadata } from "next/types";
import EventCard from "@/components/EventCard";
import { UserInfo } from "@/components/UserInfo";
import { db } from "@/lib/db";
import { AddToCalendarButtonProps } from "@/types";
import { getDateInfoUTC } from "@/lib/utils";

const getEvent = async (eventId: string) => {
  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      userId: true,
      event: true,
      createdAt: true,
    },
  });
  return event;
};

type Props = {
  params: {
    eventId: string;
  };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const event = await getEvent(params.eventId);
  if (!event) {
    return {
      title: "No event found | timetime.cc",
      openGraph: {
        images: [],
      },
    };
  }

  const eventData = event.event as AddToCalendarButtonProps;
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${eventData.name} | timetime.cc`,
    openGraph: {
      title: `${eventData.name} | timetime.cc`,
      description: `(${eventData.startDate} ${eventData.startTime}-${eventData.endTime}) ${eventData.description}`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/${event.userId}/events/${event.id}`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const event = await getEvent(params.eventId);

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
