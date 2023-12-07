import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next/types";
import { UserInfo } from "@/components/UserInfo";
import EventList from "@/components/EventList";
import { api } from "@/trpc/server";

type Props = { params: { userName: string } };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const events = await api.event.getSavedForUser.query({
    userName: params.userName,
  });

  if (!events) {
    return {
      title: "No events found | Soonlist",
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
    title: `@${params.userName}'s saved (${futureEventsCount} upcoming events) | Soonlist`,
    openGraph: {
      title: `@${params.userName}'s saved (${futureEventsCount} upcoming events)`,
      description: `See the events that @${params.userName} has saved on  Soonlist`,
      url: `${process.env.NEXT_PUBLIC_URL}/${params.userName}/saved`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const events = await api.event.getSavedForUser.query({
    userName: params.userName,
  });

  const pastEvents = events.filter((item) => item.endDateTime < new Date());

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
      <h2 className="text-sm font-medium text-gray-500">All Events</h2>
      <EventList
        currentEvents={currentEvents}
        pastEvents={pastEvents}
        futureEvents={futureEvents}
        hideCurator
      />
      <div className="p-5"></div>
    </>
  );
}
