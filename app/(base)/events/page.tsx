import EventList from "@/components/EventList";
import { db } from "@/lib/db";

export default async function Page({ params }: { params: { userId: string } }) {
  const events = await db.event.findMany({
    orderBy: {
      startDateTime: "asc",
    },
    include: {
      User: true,
    },
  });

  const pastEvents = events.filter((item) => item.startDateTime < new Date());

  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <>
      <div className="p-4"></div>
      <h2 className="text-sm font-medium text-gray-500">All Events</h2>
      <EventList futureEvents={futureEvents} pastEvents={pastEvents} />
      <div className="p-5"></div>
    </>
  );
}
