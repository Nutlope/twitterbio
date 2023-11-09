import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next/types";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";

type Props = { params: { userName: string } };

const getFollowingUsers = async (userName: string) => {
  const users = await db.followUser.findMany({
    where: {
      Follower: {
        username: userName,
      },
    },
    select: {
      Following: {
        select: {
          username: true,
        },
      },
    },
  });
  return users;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const users = await getFollowingUsers(params.userName);
  const userCount = users.length;
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `@${params.userName} is following (${userCount} upcoming events) | timetime.cc`,
    openGraph: {
      title: `@${params.userName} is following (${userCount} upcoming events) | timetime.cc`,
      description: `See the users @${params.userName} is following on  timetime.cc`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/${params.userName}/following/users`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page({ params }: Props) {
  const users = await getFollowingUsers(params.userName);

  return (
    <>
      <div className="flex place-items-center gap-2">
        <div className="font-medium">Users followed by</div>
        <Suspense>
          <UserInfo userName={params.userName} />
        </Suspense>
      </div>
      <div className="p-4"></div>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <UserInfo
            key={user.Following.username}
            userName={user.Following.username}
          />
        ))}
      </div>
      <div className="p-4"></div>
    </>
  );
}
