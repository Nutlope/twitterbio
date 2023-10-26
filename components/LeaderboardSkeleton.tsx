export default function LeaderboardSkeleton() {
  return (
    <ul role="list" className="divide-y divide-gray-100">
      {/* This part is the loading skeleton */}
      {[1, 2, 3, 4, 5].map((_, index) => (
        <li key={index}>
          <div className="group flex items-center justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="h-12 w-12 flex-none animate-pulse rounded-full bg-gray-200"></div>
              <div className="min-w-0 flex-auto">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
            <div className="w-16 animate-pulse rounded-full bg-gray-200 px-2.5 py-1"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
