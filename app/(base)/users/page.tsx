import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next/types";
import { UserInfo } from "@/components/UserInfo";
import Leaderboard from "@/components/Leaderboard";
import LeaderboardSkeleton from "@/components/LeaderboardSkeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { api } from "@/trpc/server";

export async function generateMetadata(
  {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const users = await api.user.getAll.query();
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
  const users = await api.user.getAll.query();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Top Users</CardTitle>
          <CardDescription>Most Upcoming Events</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LeaderboardSkeleton />}>
            <Leaderboard />
          </Suspense>
        </CardContent>
      </Card>
      <div className="p-4"></div>
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
