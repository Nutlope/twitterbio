import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next/types";
import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";
import ListCardsForUser from "@/components/ListCardsForUser";
import EventList from "@/components/EventList";

type Props = { params: { userName: string } };

const getEventsForUser = async (userName: string) => {
  const events = await db.event.findMany({
    where: {
      User: {
        username: userName,
      },
    },
    orderBy: {
      startDateTime: "asc",
    },
    include: {
      User: true,
      FollowEvent: true,
      Comment: true,
    },
  });
  return events;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const events = await getEventsForUser(params.userName);

  if (!events) {
    return {
      title: "No events found | timetime.cc",
      openGraph: {
        images: [],
      },
    };
  }

  const currentEvents = events.filter(
    (item) => item.startDateTime < new Date() && item.endDateTime > new Date()
  );
  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  const futureEventsCount = futureEvents.length;

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `@${params.userName} (${futureEventsCount} upcoming events) | timetime.cc`,
    openGraph: {
      title: `@${params.userName} (${futureEventsCount} upcoming events) | timetime.cc`,
      description: `See the events that @${params.userName} has saved on timetime.cc`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/${params.userName}/events`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const activeUser = await currentUser();
  const self = activeUser?.username === params.userName;
  const events = await getEventsForUser(params.userName);

  const pastEvents = events.filter((item) => item.startDateTime < new Date());

  const currentEvents = events.filter(
    (item) => item.startDateTime < new Date() && item.endDateTime > new Date()
  );
  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <>
      <div className="flex place-items-center gap-2">
        <div className="font-medium">Events saved by</div>
        <Suspense>
          <UserInfo userName={params.userName} />
        </Suspense>
      </div>
      <div className="p-4"></div>
      <ListCardsForUser userName={params.userName} limit={10} />
      <h2 className="text-sm font-medium text-gray-500">All Events</h2>
      <EventList
        currentEvents={currentEvents}
        pastEvents={pastEvents}
        futureEvents={futureEvents}
        hideCurator
        showPrivateEvents={self}
      />
      <div className="p-5"></div>
    </>
  );
}
