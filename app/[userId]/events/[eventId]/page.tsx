import { clerkClient } from "@clerk/nextjs";
import Link from "next/link";
import EventCard from "@/components/EventCard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { UserInfo } from "@/components/UserInfo";
import { db } from "@/lib/db";
import { AddToCalendarButtonProps } from "@/types";

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
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
      <Header />
      <main className="mt-12 flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 sm:mt-20">
        {!event ? (
          <p className="text-lg text-gray-500">No event found.</p>
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
