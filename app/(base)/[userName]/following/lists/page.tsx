import { Metadata, ResolvingMetadata } from "next/types";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";
import ListCard from "@/components/ListCard";
import { FollowListButton } from "@/components/FollowButtons";

type Props = { params: { userName: string } };

const getFollowingLists = async (userName: string) => {
  const user = await db.user.findUnique({
    where: {
      username: userName,
    },
    select: {
      id: true,
    },
  });
  const lists = await db.list.findMany({
    where: {
      FollowList: {
        some: {
          User: {
            username: userName,
          },
        },
      },
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
      User: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      updatedAt: "asc",
    },
  });

  return lists;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const users = await getFollowingLists(params.userName);
  const userCount = users.length;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `@${params.userName} is following (${userCount} lists) | timetime.cc`,
    openGraph: {
      title: `@${params.userName} is following (${userCount} lists) | timetime.cc`,
      description: `See the lists @${params.userName} is following on  timetime.cc`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/${params.userName}/following/users`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const lists = await getFollowingLists(params.userName);

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
