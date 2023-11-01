import Link from "next/link";
import { buttonVariants } from "./ui/button";
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
    <div className="grid place-items-center">
      <EventList
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
