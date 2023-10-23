import { ImageResponse } from "next/server";
// App router includes @vercel/og.
// No need to install it.

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <h1 tw="text-6xl font-bold text-slate-900 text-center">Now: ⌨️✨📅</h1>
        <p>
          Paste event info <span className="font-semibold">&rarr;</span> clean,
          calendarable event
        </p>
        <h2 tw="text-3xl font-bold text-slate-900 text-center opacity-70">
          Soon: 📣🫂🎉
        </h2>
        <p tw="text-sm opacity-70">Create, collect, curate & share events</p>
      </div>
    ),
    {
      width: 800,
      height: 400,
    }
  );
}
