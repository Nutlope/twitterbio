import { Suspense } from "react";
import AddEvent from "./AddEvent";
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
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Now:<span className="tracking-wider"> 📱✨📅</span>
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Event info <span className="font-semibold">&rarr;</span> clean,
        calendarable event
      </p>
      <div className="p-2"></div>
      <div className="scale-90 opacity-70">
        <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Soon:<span className="tracking-wider"> 📣🫂🎉</span>
        </h2>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Create, collect, curate & share events
        </p>
      </div>
      <div className="p-6"></div>
      <AddEvent />
      <div className="p-6"></div>
      <div className="max-w-xl">
        <Suspense fallback={<LeaderboardSkeleton />}>
          <NextEvents />
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
