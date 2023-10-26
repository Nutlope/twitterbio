import { auth } from "@clerk/nextjs";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { db } from "@/lib/db";
import EventCard from "@/components/EventCard";
import { AddToCalendarButtonProps } from "@/types";

export default async function Page() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const events = await db.event.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      event: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
      <Header />
      <main className="mt-12 flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 sm:mt-20">
        {events.length === 0 ? (
          <p className="text-lg text-gray-500">No events found.</p>
        ) : (
          <ul role="list" className="max-w-full divide-y divide-gray-100">
            {events.map((item) => (
              <EventCard
                key={item.id}
                userId={userId}
                id={item.id}
                event={item.event as AddToCalendarButtonProps}
                createdAt={item.createdAt}
              />
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
