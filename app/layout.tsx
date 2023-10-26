import { Metadata } from "next";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import Fathom from "@/components/Fathom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

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
          <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center py-2">
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 2000 }}
            />
            <Header />
            <main className="my-12 flex w-full flex-1 flex-col items-center justify-center px-4 sm:my-20">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
