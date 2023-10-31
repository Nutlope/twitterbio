import { currentUser } from "@clerk/nextjs";
import ListCard from "./ListCard";
import ListCardAdd from "./ListCardAdd";
import { db } from "@/lib/db";

type ListCardsForUserProps = {
  userId: string;
  limit: number;
};

export default async function ListCardsForUser({
  userId,
  limit,
}: ListCardsForUserProps) {
  const lists = await db.list.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      name: true,
      description: true,
      _count: {
        select: { events: true },
      },
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
    take: limit,
  });

  const user = await currentUser();
  const showAdd = user && user.id === userId;
  const hideAll = !showAdd && lists.length === 0;

  if (!lists || hideAll) {
    return <> </>;
  }

  return (
    <>
      <div className="w-full px-6">
        <h2 className="text-sm font-medium text-gray-500">Featured Lists</h2>
        <ul
          role="list"
          className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {showAdd && <ListCardAdd />}
          {lists.map((list) => (
            <ListCard
              key={list.name}
              name={list.name}
              count={list._count.events}
              id={list.id}
            />
          ))}
        </ul>
      </div>
      <div className="p-8"></div>
    </>
  );
}
