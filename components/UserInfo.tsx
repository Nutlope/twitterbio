import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { FollowUserButton } from "./FollowButtons";
import { db } from "@/lib/db";

type UserInfoProps = {
  userId?: string;
  userName?: string;
};

async function getUserInfoById(userId: string) {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}

async function getUserInfoByUserName(userName: string) {
  const user = await db.user.findUnique({
    where: {
      username: userName,
    },
  });

  return user;
}

async function getFollowing(followerId: string, followingId: string) {
  const user = await db.followUser.findUnique({
    where: {
      followerId_followingId: {
        followerId,
        followingId,
      },
    },
  });

  return user;
}

export async function UserInfo(props: UserInfoProps) {
  const activeUser = await currentUser();
  if (!props.userId && !props.userName) {
    return null;
  }

  let user;
  if (props.userId) {
    user = await getUserInfoById(props.userId);
  } else if (props.userName) {
    user = await getUserInfoByUserName(props.userName);
  }

  if (!user) {
    return null;
  }

  const self = activeUser?.id === user.id;

  const following =
    activeUser?.id && (await getFollowing(activeUser?.id, user.id));

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link href={`/${user.username}/events`}>
        <Image
          className="inline-block h-9 w-9 rounded-full"
          src={user.imageUrl}
          alt=""
          width={375}
          height={375}
        />
      </Link>
      <Link href={`/${user.username}/events`} className="group">
        <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
          {user.displayName}
        </p>
        <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
          @{user.username}
        </p>
      </Link>
      {!self && (
        <div>
          <FollowUserButton userId={user.id} following={!!following} />
        </div>
      )}
    </div>
  );
}
