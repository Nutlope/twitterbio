import { ImageResponse } from "next/og";
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
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <h1 tw="text-7xl font-bold text-slate-900 text-center">Now: ⌨️✨📅</h1>
        <p>Paste event info ➡️ clean, calendarable event</p>
        <h2 tw="text-4xl font-bold text-slate-900 text-center opacity-70">
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
