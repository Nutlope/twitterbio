import { Suspense } from "react";
import AddEvent from "./AddEvent";
import Leaderboard from "@/components/Leaderboard";
import LeaderboardSkeleton from "@/components/LeaderboardSkeleton";

export default function Page() {
  return (
    <>
      <h1 className="max-w-[708px] text-center text-4xl font-bold text-slate-900 sm:text-6xl">
        Now: ⌨️✨📅
      </h1>
      <div className="p">
        Paste event info <span className="font-semibold">&rarr;</span> clean,
        calendarable event
      </div>
      <div className="p-2"></div>
      <h2 className="max-w-[708px] text-center text-xl font-bold text-slate-900 opacity-70 sm:text-3xl">
        Soon: 📣🫂🎉
      </h2>
      <div className="text-sm opacity-70">
        Create, collect, curate & share events
      </div>
      <AddEvent />
      <div className="p-6"></div>
      <h3 className="text-center text-lg font-bold leading-6 text-gray-900">
        Top users
      </h3>
      <Suspense fallback={<LeaderboardSkeleton />}>
        <Leaderboard />
      </Suspense>
    </>
  );
}
