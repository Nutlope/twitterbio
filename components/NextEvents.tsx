import EventList from "@/components/EventList";
import { db } from "@/lib/db";

export default async function NextEvents() {
  const events = await db.event.findMany({
    orderBy: {
      startDateTime: "asc",
    },
    where: {
      startDateTime: {
        gte: new Date(),
      },
    },
    take: 5,
  });

  const pastEvents = events.filter((item) => item.startDateTime < new Date());

  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <>
      <EventList
        futureEvents={futureEvents}
        pastEvents={pastEvents}
        variant="future-minimal"
      />
    </>
  );
}
