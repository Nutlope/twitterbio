import { Suspense } from "react";
import AddEvent from "../AddEvent";
import Leaderboard from "@/components/Leaderboard";
import LeaderboardSkeleton from "@/components/LeaderboardSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NextEvents from "@/components/NextEvents";

export default function Page() {
  return (
    <>
      <div className="max-w-xl">
        <Suspense fallback={<LeaderboardSkeleton />}>
          <NextEvents upcoming />
        </Suspense>
      </div>
      <div className="p-6"></div>
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
    </>
  );
}
