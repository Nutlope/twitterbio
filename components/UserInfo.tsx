import { clerkClient } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

type UserInfoProps = {
  userId: string;
};

export async function UserInfo(props: UserInfoProps) {
  const user = await clerkClient.users.getUser(props.userId);

  if (!user) {
    return null;
  }

  return (
    <Link href={`/${user.id}/events`} className="group block shrink-0">
      <div className="flex items-center">
        {user.imageUrl && (
          <div>
            <Image
              className="inline-block h-9 w-9 rounded-full"
              src={user.imageUrl}
              alt=""
              width={375}
              height={375}
            />
          </div>
        )}
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
            @{user.username}
          </p>
        </div>
      </div>
    </Link>
  );
}
