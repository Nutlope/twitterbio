import { clerkClient } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const users = await clerkClient.users.getUserList();

  const usersWithExclude = users.filter(
    (user) => user.username !== "jaronhearddev"
  );

  const eventCountForUsers = await db.event.groupBy({
    by: ["userId"],
    where: {
      endDateTime: {
        gt: new Date().toISOString(),
      },
    },
    _count: {
      _all: true,
    },
  });

  const usersWithEventCount = usersWithExclude.map((user) => {
    const eventCount = eventCountForUsers.find(
      (eventCount) => eventCount.userId === user.id
    );

    return {
      ...user,
      eventCount: eventCount?._count?._all || 0,
    };
  });

  const usersWithEventCountSorted = usersWithEventCount.sort(
    (a, b) => b.eventCount - a.eventCount
  );

  const usersWithEventCountGreaterThanZero = usersWithEventCountSorted
    .filter((user) => user.eventCount > 0)
    .slice(0, 5);

  // Return the response message
  return Response.json(usersWithEventCountGreaterThanZero);
}
