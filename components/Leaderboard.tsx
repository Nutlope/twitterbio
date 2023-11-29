import { Badge } from "./ui/badge";
import { api } from "@/trpc/server";

export default async function Leaderboard() {
  const leaderboardUsers = await api.user.getTopUsersByUpcomingEvents.query({
    limit: 5,
  });

  const people = leaderboardUsers.map((user) => ({
    name: user.displayName,
    userName: user.username,
    imageUrl: user.imageUrl,
    href: `/${user.username}/events`,
    eventCount: user._count.events,
  }));

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {people.map((person: any) => (
        <li key={person.userName}>
          <a
            href={person.href}
            className="group flex items-center justify-between gap-x-6 py-5"
          >
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                src={person.imageUrl}
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {person.name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  @{person.userName}
                </p>
              </div>
            </div>
            <Badge className="whitespace-nowrap">
              {person.eventCount} events
            </Badge>
          </a>
        </li>
      ))}
    </ul>
  );
}
