import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next/types";
import { db } from "@/lib/db";
import { UserInfo } from "@/components/UserInfo";

const getAllUsers = async () => {
  const users = await db.user.findMany({
    orderBy: {
      username: "asc",
    },
  });
  return users;
};

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const users = await getAllUsers();
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `All users | timetime.cc`,
    openGraph: {
      title: `All users | timetime.cc`,
      description: `See all users on  timetime.cc`,
      locale: "en_US",
      url: `${process.env.NEXT_PUBLIC_URL}/users`,
      type: "article",
      images: [...previousImages],
    },
  };
}

export default async function Page() {
  const users = await getAllUsers();

  return (
    <>
      <div className="flex place-items-center">
        <div className="font-medium">All users</div>
      </div>
      <div className="p-4"></div>
      <div className="grid grid-cols-1 gap-4">
        {users.map((user) => (
          <UserInfo key={user.username} userName={user.username} />
        ))}
      </div>
      <div className="p-4"></div>
    </>
  );
}
