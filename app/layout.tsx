import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "../styles/globals.css";

const title = "events.ai";
const description = "Generate an event from anything using AI.";

export const metadata: Metadata = {
  metadataBase: new URL("https://events-ai.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    locale: "en_US",
    type: "website",
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
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
