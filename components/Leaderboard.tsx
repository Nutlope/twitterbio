import { Badge } from "./ui/badge";

async function getLeaderboardUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/leaderboard`);
  return res.json();
}

export default async function Leaderboard() {
  const leaderboardUsers = await getLeaderboardUsers();

  const people = leaderboardUsers.map((user: any) => ({
    name: user.firstName + " " + user.lastName,
    userName: user.username,
    imageUrl: user.imageUrl,
    href: `/${user.id}/events`,
    eventCount: user.eventCount,
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
            <Badge>{person.eventCount} events</Badge>
          </a>
        </li>
      ))}
    </ul>
  );
}
