import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { FollowUserButton } from "./FollowButtons";
import { api } from "@/trpc/server";

type UserInfoProps = {
  userId?: string;
  userName?: string;
};

export async function UserInfo(props: UserInfoProps) {
  const activeUser = await currentUser();
  if (!props.userId && !props.userName) {
    return null;
  }

  let user;
  if (props.userId) {
    user = await api.user.getById.query({ id: props.userId });
  } else if (props.userName) {
    user = await api.user.getByUsername.query({ userName: props.userName });
  }

  if (!user) {
    return null;
  }

  const self = activeUser?.id === user.id;

  const following =
    activeUser?.id &&
    (await api.user.getIfFollowing.query({
      followerId: activeUser.id,
      followingId: user.id,
    }));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
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
      </div>
      {!self && (
        <div>
          <FollowUserButton userId={user.id} following={!!following} />
        </div>
      )}
    </div>
  );
}
