import { AddToCalendarButtonProps } from "add-to-calendar-button-react/dist/AddToCalendarButton";
import EventCard from "../../../components/EventCard";
import Header from "../../../components/Header";
import { db } from "../../../lib/db";
import Footer from "../../../components/Footer";
import { clerkClient } from "@clerk/nextjs";
import { UserInfo } from "../../../components/UserInfo";

export default async function Page({ params }: { params: { userId: string } }) {
  const events = await db.event.findMany({
    where: {
      userId: params.userId,
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

  const user = await clerkClient.users.getUser(params.userId);

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center px-4 mt-12">
        <div className="flex place-items-center gap-2">
          <div className="font-medium">List by</div>
          <UserInfo user={user} />
        </div>{" "}
        <div className="p-2"></div>
        {events.length === 0 ? (
          <p className="text-gray-500 text-lg">No events found.</p>
        ) : (
          <ul role="list" className="divide-y divide-gray-100 max-w-full">
            {events.map((item) => (
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
      </main>
      <Footer />
    </div>
  );
}
