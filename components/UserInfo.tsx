import Image from "next/image";
import Link from "next/link";
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

export async function UserInfo(props: UserInfoProps) {
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

  return (
    <Link href={`/@${user.username}/events`} className="group block shrink-0">
      <div className="flex items-center">
        <div>
          <Image
            className="inline-block h-9 w-9 rounded-full"
            src={user.imageUrl}
            alt=""
            width={375}
            height={375}
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {user.displayName}
          </p>
          <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
            @{user.username}
          </p>
        </div>
      </div>
    </Link>
  );
}
