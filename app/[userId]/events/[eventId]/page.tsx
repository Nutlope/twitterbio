import { AddToCalendarButtonProps } from "add-to-calendar-button-react/dist/AddToCalendarButton";
import EventCard from "../../../../components/EventCard";
import Header from "../../../../components/Header";
import { db } from "../../../../lib/db";
import Footer from "../../../../components/Footer";
import { clerkClient } from "@clerk/nextjs";
import { UserInfo } from "../../../../components/UserInfo";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { userId: string; eventId: string };
}) {
  const event = await db.event.findUnique({
    where: {
      userId: params.userId,
      id: Number(params.eventId),
    },
    select: {
      id: true,
      event: true,
      createdAt: true,
    },
  });

  const user = await clerkClient.users.getUser(params.userId);

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center px-4 mt-12 sm:mt-20">
        {!event ? (
          <p className="text-gray-500 text-lg">No event found.</p>
        ) : (
          <EventCard
            userId={params.userId}
            key={event.id}
            id={event.id}
            event={event.event as AddToCalendarButtonProps}
            createdAt={event.createdAt}
            singleEvent
          />
        )}
        <div className="p-4"></div>
        <Link
          href={`/${params.userId}/events`}
          className="flex place-items-center gap-2"
        >
          <div className="font-medium">Collected by</div>
          <UserInfo user={user} />
        </Link>
      </main>
      <Footer />
    </div>
  );
}
