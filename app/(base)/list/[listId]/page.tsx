import { Metadata, ResolvingMetadata } from "next/types";
import { currentUser } from "@clerk/nextjs";
import { UserInfo } from "@/components/UserInfo";
import { ListEditButton } from "@/components/ListEditButton";
import { ListDeleteButton } from "@/components/ListDeleteButton";
import EventList from "@/components/EventList";
import { FollowListButton } from "@/components/FollowButtons";
import { api } from "@/trpc/server";

type Props = { params: { listId: string } };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const list = await api.list.get.query({ listId: params.listId });

  if (!list) {
    return {
      title: "No list found | timetime.cc",
    };
  }

  const futureEvents = list.events.filter(
    (item) => item.startDateTime >= new Date()
  );
  const futureEventsCount = futureEvents.length;
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${list.name} by @${list.User.username} | timetime.cc`,
    openGraph: {
      title: `${list.name} by @${list.User.username} (${futureEventsCount} upcoming) | timetime.cc`,
      description: `${list.description}`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/list/${params.listId}`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const user = await currentUser();
  const list = await api.list.get.query({ listId: params.listId });

  if (!list) {
    return <> </>;
  }
  const events = list.events;

  const pastEvents = events.filter((item) => item.endDateTime < new Date());

  const currentEvents = events.filter(
    (item) => item.startDateTime < new Date() && item.endDateTime > new Date()
  );
  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  const isOwner = user && user.id === list.userId;
  const following =
    user && list.FollowList.find((item) => item.userId === user.id);

  return (
    <>
      <div className="flex flex-col place-items-center gap-4 sm:flex-row">
        <div className="flex place-items-center gap-4">
          <div className="flex flex-col">
            <div className="font-medium">{list.name}</div>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
              {list.description}
            </p>
          </div>
          <UserInfo userId={list.userId} />
        </div>
        <div className="flex place-items-center gap-4">
          <ListEditButton listId={params.listId} listUserId={list.userId} />
          <ListDeleteButton listId={params.listId} listUserId={list.userId} />
        </div>
      </div>
      {!isOwner && (
        <>
          <div className="p-2"></div>
          <FollowListButton listId={params.listId} following={!!following} />
        </>
      )}
      <div className="p-2"></div>
      <EventList
        currentEvents={currentEvents}
        futureEvents={futureEvents}
        pastEvents={pastEvents}
        showPrivateEvents={!!isOwner}
      />
      <div className="p-5"></div>
    </>
  );
}
