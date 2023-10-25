import { AddToCalendarButtonProps } from "add-to-calendar-button-react/dist/AddToCalendarButton";
import EventCard from "../../../components/EventCard";
import Header from "../../../components/Header";
import { db } from "../../../lib/db";
import Footer from "../../../components/Footer";
import { clerkClient } from "@clerk/nextjs";
import { UserInfo } from "../../../components/UserInfo";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../../components/Accordian";

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
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center px-4 mt-12">
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
                <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-slate-100 bg-gray-600 rounded-full">
                  {pastEvents.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="-mx-6">
              {pastEvents.length === 0 ? (
                <p className="text-gray-500 text-lg">No past events.</p>
              ) : (
                <ul role="list" className="divide-y divide-gray-100 max-w-full">
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
                <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-slate-100 bg-gray-600 rounded-full">
                  {futureEvents.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="-mx-6">
              {futureEvents.length === 0 ? (
                <p className="text-gray-500 text-lg">No future events.</p>
              ) : (
                <ul role="list" className="divide-y divide-gray-100 max-w-full">
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
