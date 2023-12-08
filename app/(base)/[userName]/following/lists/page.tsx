import { Metadata, ResolvingMetadata } from "next/types";
import { UserInfo } from "@/components/UserInfo";
import ListCard from "@/components/ListCard";
import { FollowListButton } from "@/components/FollowButtons";
import { api } from "@/trpc/server";

type Props = { params: { userName: string } };

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const lists = await api.list.getFollowing.query({
    userName: params.userName,
  });
  const listCount = lists.length;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `@${params.userName} is following (${listCount} lists) | Soonlist`,
    openGraph: {
      title: `@${params.userName} is following (${listCount} lists)`,
      description: `See the lists @${params.userName} is following on  Soonlist`,
      url: `${process.env.NEXT_PUBLIC_URL}/${params.userName}/following/users`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const lists = await api.list.getFollowing.query({
    userName: params.userName,
  });

  return (
    <>
      <h2 className="text-sm font-medium text-gray-500">Following Lists</h2>
      <ul role="list" className="mt-3 grid gap-4">
        {lists.map((list) => (
          <div
            key={list.name}
            className="flex flex-col items-center gap-4 sm:flex-row"
          >
            <ListCard
              key={list.name}
              name={list.name}
              count={list._count.events}
              id={list.id}
            />
            <FollowListButton listId={list.id} following={true} />
            <UserInfo userName={list.User.username} />
          </div>
        ))}
      </ul>
      <div className="p-8"></div>
    </>
  );
}
