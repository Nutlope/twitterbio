import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next/types";
import { clerkClient } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";
import ListCardsForUser from "@/components/ListCardsForUser";
import EventList from "@/components/EventList";

const getEventsForUser = async (userId: string) => {
  const events = await db.event.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      startDateTime: "asc",
    },
  });
  return events;
};

type Props = { params: { userId: string } };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const events = await getEventsForUser(params.userId);
  const user = await clerkClient.users.getUser(params.userId);

  if (!events || !user) {
    return {
      title: "No user found | timetime.cc",
      openGraph: {
        images: [],
      },
    };
  }

  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );
  const futureEventsCount = futureEvents.length;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `@${user.username} (${futureEventsCount} upcoming events) | timetime.cc`,
    openGraph: {
      title: `@${user.username} (${futureEventsCount} upcoming events) | timetime.cc`,
      description: `See the events that @${user.username} has saved on timetime.cc`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/${params.userId}/events`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const events = await getEventsForUser(params.userId);

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
      <EventList pastEvents={pastEvents} futureEvents={futureEvents} />
      <div className="p-5"></div>
    </>
  );
}
