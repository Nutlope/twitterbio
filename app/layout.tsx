"use client";

import { Metadata } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import * as Fathom from "fathom-client";

import "../styles/globals.css";

const title = "timetime.cc";
const description = "Paste anything, get calendar events.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.timetime.cc/"),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "en_US",
    type: "website",
    images: ["https://www.timetime.cc/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    // Initialize Fathom when the app loads
    // Example: yourdomain.com
    //  - Do not include https://
    //  - This must be an exact match of your domain.
    //  - If you're using www. for your domain, make sure you include that here.
    Fathom.load(process.env.FATHOM_TRACKING_CODE || "", {
      includedDomains: ["timetime.cc", "www.timetime.cc"],
    });

    function onRouteChangeComplete() {
      Fathom.trackPageview();
    }
    // Record a pageview when route changes
    router.events.on("routeChangeComplete", onRouteChangeComplete);

    // Unassign event listener
    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
