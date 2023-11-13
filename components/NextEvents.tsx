import Link from "next/link";
import { buttonVariants } from "./ui/button";
import EventList from "@/components/EventList";
import { db } from "@/lib/db";

export default async function NextEvents({ limit = 5 } = {}) {
  const events = await db.event.findMany({
    include: {
      User: true,
    },
    orderBy: {
      startDateTime: "asc",
    },
    where: {
      startDateTime: {
        gte: new Date(),
      },
    },
    take: limit,
  });

  const pastEvents = events.filter((item) => item.endDateTime < new Date());

  const currentEvents = events.filter(
    (item) => item.startDateTime < new Date() && item.endDateTime > new Date()
  );
  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <div className="grid place-items-center">
      <EventList
        currentEvents={currentEvents}
        futureEvents={futureEvents}
        pastEvents={pastEvents}
        variant="future-minimal"
      />
      <Link href="/events" className={buttonVariants({ variant: "link" })}>
        See all events
      </Link>
    </div>
  );
}
