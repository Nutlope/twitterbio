import { Metadata } from "next";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Fathom from "@/components/Fathom";

const title = "timetime.cc";
const description = "Paste anything, get calendar events.";

// eslint-disable-next-line react-refresh/only-export-components
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
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Fathom />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
