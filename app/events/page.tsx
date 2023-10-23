import { auth } from "@clerk/nextjs";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { db } from "../../lib/db";
import EventCard from "../../components/EventCard";
import { AddToCalendarButtonProps } from "add-to-calendar-button-react/dist/AddToCalendarButton";

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
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center px-4 mt-12 sm:mt-20">
        {events.length === 0 ? (
          <p className="text-gray-500 text-lg">No events found.</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-100 max-w-full">
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
