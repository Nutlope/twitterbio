import { Suspense } from "react";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";
import ListCardsForUser from "@/components/ListCardsForUser";
import EventList from "@/components/EventList";

export default async function Page({ params }: { params: { userId: string } }) {
  const events = await db.event.findMany({
    where: {
      userId: params.userId,
    },
    orderBy: {
      startDateTime: "asc",
    },
  });

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
