import { clerkClient } from "@clerk/nextjs";
import EventCard from "@/components/EventCard";
import Header from "@/components/Header";
import { db } from "@/lib/db";
import Footer from "@/components/Footer";
import { UserInfo } from "@/components/UserInfo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordian";
import { AddToCalendarButtonProps } from "@/types";

export default async function Page({ params }: { params: { userId: string } }) {
  const events = await db.event.findMany({
    where: {
      userId: params.userId,
    },
    select: {
      id: true,
      event: true,
      createdAt: true,
      startDateTime: true,
    },
    orderBy: {
      startDateTime: "asc",
    },
  });

  const user = await clerkClient.users.getUser(params.userId);

  const pastEvents = events.filter((item) => item.startDateTime < new Date());

  const futureEvents = events.filter(
    (item) => item.startDateTime >= new Date()
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
      <Header />
      <main className="mt-12 flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4">
        <div className="flex place-items-center gap-2">
          <div className="font-medium">List by</div>
          <UserInfo user={user} />
        </div>{" "}
        <div className="p-2"></div>
        <Accordion type="multiple" className="w-full" defaultValue={["item-2"]}>
          <AccordionItem value="item-1" className="px-6 opacity-80">
            <AccordionTrigger>
              <div className="flex gap-1.5">
                Past events
                <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                  {pastEvents.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="-mx-6">
              {pastEvents.length === 0 ? (
                <p className="mx-6 text-lg text-gray-500">No past events.</p>
              ) : (
                <ul role="list" className="max-w-full divide-y divide-gray-100">
                  {pastEvents.map((item) => (
                    <EventCard
                      key={item.id}
                      userId={params.userId}
                      id={item.id}
                      event={item.event as AddToCalendarButtonProps}
                      createdAt={item.createdAt}
                    />
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="px-6">
            <AccordionTrigger>
              <div className="flex gap-1.5">
                Upcoming events
                <span className="mr-2 inline-flex items-center justify-center rounded-full bg-gray-600 px-2 py-1 text-xs font-bold leading-none text-slate-100">
                  {futureEvents.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="-mx-6">
              {futureEvents.length === 0 ? (
                <p className="mx-6 text-lg text-gray-500">No future events.</p>
              ) : (
                <ul role="list" className="max-w-full divide-y divide-gray-100">
                  {futureEvents.map((item) => (
                    <EventCard
                      key={item.id}
                      userId={params.userId}
                      id={item.id}
                      event={item.event as AddToCalendarButtonProps}
                      createdAt={item.createdAt}
                    />
                  ))}
                </ul>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
