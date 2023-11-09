import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next/types";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";
import EventList from "@/components/EventList";

type Props = { params: { userName: string } };

const getSavedEvents = async (userName: string) => {
  const user = await db.user.findUnique({
    where: {
      username: userName,
    },
    select: {
      id: true,
    },
  });
  const events = await db.event.findMany({
    where: {
      FollowEvent: {
        some: {
          User: {
            username: userName,
          },
        },
      },
    },
    orderBy: {
      startDateTime: "asc",
    },
    include: {
      User: {
        select: {
          username: true,
        },
      },
    },
  });
  return events;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const events = await getSavedEvents(params.userName);

  if (!events) {
    return {
      title: "No events found | timetime.cc",
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
    title: `@${params.userName}'s saved (${futureEventsCount} upcoming events) | timetime.cc`,
    openGraph: {
      title: `@${params.userName}'s saved (${futureEventsCount} upcoming events) | timetime.cc`,
      description: `See the events that @${params.userName} has saved on  timetime.cc`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/${params.userName}/saved`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const events = await getSavedEvents(params.userName);

  const pastEvents = events.filter((item) => item.startDateTime < new Date());

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
      <h2 className="text-sm font-medium text-gray-500">All Events</h2>
      <EventList pastEvents={pastEvents} futureEvents={futureEvents} />
      <div className="p-5"></div>
    </>
  );
}
