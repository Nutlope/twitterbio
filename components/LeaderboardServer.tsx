import { clerkClient } from "@clerk/nextjs";

export default async function LeaderboardServer() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/leaderboard`
  ).then((res) => res.json());
  const users = res.response;

  const people = users.map((user: any) => ({
    name: user.firstName + " " + user.lastName,
    userName: user.username,
    imageUrl: user.imageUrl,
    href: `/${user.id}/events`,
    eventCount: user.eventCount,
  }));

  return (
    <div>
      <h3 className="text-center text-lg font-medium leading-6 text-gray-900">
        Top users
      </h3>
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
                    {person.userName}
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 group-hover:bg-gray-50">
                {person.eventCount} events
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
