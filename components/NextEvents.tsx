import Link from "next/link";
import { buttonVariants } from "./ui/button";
import EventList from "@/components/EventList";
import { api } from "@/trpc/server";

export default async function NextEvents({ limit = 5, upcoming = false } = {}) {
  const excludeCurrent = !upcoming;
  const events = await api.event.getNext.query({ limit, excludeCurrent });

  const pastEvents = events.filter((item) => item.endDateTime < new Date());

  const currentEvents = events.filter(
    (item) => item.startDateTime < new Date() && item.endDateTime > new Date()
  );
  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <div className="grid place-items-center">
      <div className="mr-auto flex place-items-center gap-2.5 px-6 font-medium">
        Portland area events happening soon
      </div>
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
