// Fathom.tsx
"use client";

import { load, trackPageview } from "fathom-client";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    load(process.env.FATHOM_TRACKING_CODE || "", {
      includedDomains: ["timetime.cc", "www.timetime.cc"],
    });
  }, []);

  useEffect(() => {
    trackPageview();

    // Record a pageview when route changes
  }, [pathname, searchParams]);

  return null;
}

export default function Fathom() {
  return (
    <Suspense fallback={null}>
      <TrackPageView />
    </Suspense>
  );
}
