import { Metadata, ResolvingMetadata } from "next/types";
import { clerkClient } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";
import { ListEditButton } from "@/components/ListEditButton";
import { ListDeleteButton } from "@/components/ListDeleteButton";
import EventList from "@/components/EventList";

type Props = { params: { listId: string } };

const getList = async (listId: string) => {
  const list = await db.list.findUnique({
    where: {
      id: listId,
    },
    select: {
      userId: true,
      name: true,
      description: true,
      events: {
        orderBy: {
          startDateTime: "asc",
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
  return list;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const list = await getList(params.listId);
  if (!list) {
    return {
      title: "No list found | timetime.cc",
    };
  }

  const user = await clerkClient.users.getUser(list.userId);
  if (!user) {
    return {
      title: "No user found | timetime.cc",
    };
  }

  const futureEvents = list.events.filter(
    (item) => item.startDateTime >= new Date()
  );
  const futureEventsCount = futureEvents.length;
  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${list.name} by @${user.username} | timetime.cc`,
    openGraph: {
      title: `${list.name} by @${user.username} (${futureEventsCount} upcoming) | timetime.cc`,
      description: `${list.description}`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/list/${params.listId}`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const list = await getList(params.listId);

  if (!list) {
    return <> </>;
  }
  const events = list.events;

  const pastEvents = events.filter((item) => item.startDateTime < new Date());

  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <>
      <div className="flex flex-col place-items-center gap-4 sm:flex-row">
        <div className="flex flex-col">
          <div className="font-medium">{list.name}</div>
          <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
            {list.description}
          </p>
        </div>
        <UserInfo userId={list.userId} />
        <ListEditButton listId={params.listId} listUserId={list.userId} />
        <ListDeleteButton listId={params.listId} listUserId={list.userId} />
      </div>
      <div className="p-2"></div>
      <EventList futureEvents={futureEvents} pastEvents={pastEvents} />
      <div className="p-5"></div>
    </>
  );
}
