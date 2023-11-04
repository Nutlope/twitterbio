import { db } from "@/lib/db";

export type LeaderboardUsers = Awaited<ReturnType<typeof getLeaderboardUsers>>;

async function getLeaderboardUsers(excludeUsers: string[], currentDate: Date) {
  return db.user.findMany({
    where: {
      id: {
        notIn: excludeUsers,
      },
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      imageUrl: true,
      _count: {
        select: {
          events: {
            where: {
              startDateTime: {
                gt: currentDate,
              },
            },
          },
        },
      },
    },
    orderBy: {
      events: {
        _count: "desc",
      },
    },
  });
}

export async function GET(req: Request) {
  const excludeUsers = ["user_2X3xAXHdaKKG8RLZqm72wb119Yj"];
  const currentDate = new Date();

  const leaderboardUsers = await getLeaderboardUsers(excludeUsers, currentDate);

  const sortedLeaderboardUsers = leaderboardUsers
    .sort((a, b) => b._count.events - a._count.events)
    .slice(0, 5)
    .filter((user) => user._count.events > 0);

  // Return the response message
  return Response.json(sortedLeaderboardUsers);
}
