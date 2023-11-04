import { ImageResponse } from "next/og";
// App router includes @vercel/og.
// No need to install it.

export const dynamic = "force-dynamic";

export const runtime = "edge";

export async function GET() {
  // Make sure the font exists in the specified path:
  const fontDataBold = await fetch(
    new URL("../../../assets/Geist-Black.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());
  const fontDataNormal = await fetch(
    new URL("../../../assets/Geist-Regular.otf", import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col items-center justify-center bg-white">
        <h1 tw="text-7xl font-bold text-slate-900 text-center tracking-tight">
          Now:<span tw="tracking-wider"> 📱✨📅</span>
        </h1>
        <p tw="text-2xl -mt-3">Event info ➡️ clean, calendarable event</p>
        <h2 tw="text-6xl font-bold text-slate-900 text-center opacity-70 tracking-tight">
          Soon:<span tw="tracking-wider"> 📣🫂🎉</span>
        </h2>
        <p tw="text-xl -mt-3 opacity-70">
          Create, collect, curate & share events
        </p>
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
