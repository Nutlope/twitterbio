import { Metadata, ResolvingMetadata } from "next/types";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { EventCard } from "@/components/EventCard";
import { UserInfo } from "@/components/UserInfo";
import { db } from "@/lib/db";
import { AddToCalendarButtonProps } from "@/types";
import { FollowEventButton } from "@/components/FollowButtons";

const getEvent = async (eventId: string) => {
  const event = await db.event.findUnique({
    where: {
      id: eventId,
    },
    select: {
      id: true,
      event: true,
      createdAt: true,
      userId: true,
      User: true,
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
  const hasAllImages = eventData.images && eventData.images.length === 4;
  const allImages = hasAllImages ? eventData.images?.slice(0, 3) : undefined;

  return {
    title: `${eventData.name} | timetime.cc`,
    openGraph: {
      title: `${eventData.name} | timetime.cc`,
      description: `(${eventData.startDate} ${eventData.startTime}-${eventData.endTime}) ${eventData.description}`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/events/${event.id}`,
      type: "article",
      images: allImages || (await parent).openGraph?.images || [],
    },
  };
}

export default async function Page({ params }: Props) {
  const user = await currentUser();
  const event = await getEvent(params.eventId);
  const following = await db.followEvent.findFirst({
    where: {
      userId: user?.id,
      eventId: params.eventId,
    },
  });
  const isCreator = user?.id === event?.userId;
  const eventData = event?.event as AddToCalendarButtonProps;
  const fullImageUrl = eventData.images?.[3];

  if (!event) {
    return <p className="text-lg text-gray-500">No event found.</p>;
  }
  return (
    <>
      {!isCreator && (
        <>
          <FollowEventButton eventId={params.eventId} following={!!following} />
          <div className="p-4"></div>
        </>
      )}
      <EventCard
        User={event.User}
        key={event.id}
        id={event.id}
        event={event.event as AddToCalendarButtonProps}
        createdAt={event.createdAt}
        singleEvent
        hideCurator
      />
      {fullImageUrl && (
        <>
          <div className="p-2"></div>
          <Image
            src={fullImageUrl}
            className="mx-auto h-auto w-2/3 object-cover sm:w-1/3"
            alt=""
            width={640}
            height={480}
          />
        </>
      )}
      <div className="p-4"></div>
      <div className="flex place-items-center gap-2">
        <div className="font-medium">Collected by</div>
        <UserInfo userId={event.userId} />
      </div>
    </>
  );
}
