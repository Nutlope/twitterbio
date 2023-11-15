import { Metadata } from "next";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Fathom from "@/components/Fathom";
import { CroppedImageProvider } from "@/context/CroppedImageContext";
import { FormProvider } from "@/context/FormContext";

const title = "timetime.cc";
const description = "Create, collect, curate & share events";

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
    images: [
      {
        url: "/api/og",
        width: 800,
        height: 400,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FormProvider>
      <CroppedImageProvider>
        <ClerkProvider>
          <html lang="en">
            <Fathom />
            <body>{children}</body>
          </html>
        </ClerkProvider>
      </CroppedImageProvider>
    </FormProvider>
  );
}
