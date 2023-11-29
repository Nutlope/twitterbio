import { currentUser } from "@clerk/nextjs";
import ListCard from "./ListCard";
import ListCardAdd from "./ListCardAdd";
import { api } from "@/trpc/server";

type ListCardsForUserProps = {
  userName: string;
  limit: number;
};

export default async function ListCardsForUser({
  userName,
  limit, // TODO: implement limit
}: ListCardsForUserProps) {
  const lists = await api.list.getAllForUser.query({
    userName,
  });

  const user = await currentUser();
  const isOwner = user && user.username === userName;
  const hideAll = !isOwner && lists.length === 0;
  const listsToShow = lists.filter((list) => list._count.events > 0);
  const listsToUse = isOwner ? lists : listsToShow;

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
          {isOwner && <ListCardAdd />}
          {listsToUse.map((list) => (
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
