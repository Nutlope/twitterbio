import { Calendar } from "lucide-react";
import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const dynamic = "force-dynamic";

export const runtime = "edge";

export async function GET() {
  // Make sure the font exists in the specified path:
  const fontDataBold = await fetch(
    new URL("../../../assets/Geist-Bold.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());
  const fontDataNormal = await fetch(
    new URL("../../../assets/Geist-Regular.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        tw="w-full h-full flex flex-col items-center justify-center bg-white"
        style={{
          backgroundImage:
            "linear-gradient(to top right, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1), rgba(99, 102, 241, 0.1))",
          backgroundSize: "400px 400px",
        }}
      >
        <div tw="absolute top-4 left-4 text-4xl font-bold text-slate-900 tracking-tight flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            /* @ts-expect-error  */
            tw="text-slate-900 h-8 w-8"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <div tw="ml-2">Soonlist</div>
          <div tw="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs bg-slate-100 ml-1">
            Preview
          </div>
        </div>
        <h1 tw="mt-16 text-6xl font-bold text-slate-900 text-center tracking-tight">
          Curate calendars,
        </h1>
        <h1 tw="text-6xl font-bold text-slate-900 text-center tracking-tight -mt-5">
          cultivate communities
        </h1>
        <p tw="text-2xl -mt-3 text-slate-600">
          Join us in reimagining how we discover, remember, and share events.
        </p>
        <p tw="text-6xl -mt-1 text-slate-600">🌈</p>
      </div>
    ),
    {
      width: 800,
      height: 400,
      emoji: "noto",
      fonts: [
        {
          name: "Geist",
          data: fontDataBold,
          style: "normal",
          weight: 700,
        },
        {
          name: "Geist",
          data: fontDataNormal,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
