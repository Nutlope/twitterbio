import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";
import { ListEditButton } from "@/components/ListEditButton";
import { ListDeleteButton } from "@/components/ListDeleteButton";
import EventList from "@/components/EventList";

export default async function Page({ params }: { params: { listId: string } }) {
  const list = await db.list.findUnique({
    where: {
      id: params.listId,
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
