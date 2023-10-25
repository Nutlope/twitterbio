"use client";
import { Suspense } from "react";
import LeaderboardServer from "./LeaderboardServer";

export default function Leaderboard({
  ServerComponent = LeaderboardServer,
}: any) {
  return (
    <Suspense fallback={<div></div>}>
      <ServerComponent />
    </Suspense>
  );
}
