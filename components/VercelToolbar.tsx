"use client";

import { useUser } from "@clerk/nextjs";
import { VercelToolbar as Toolbar } from "@vercel/toolbar/next";

export function VercelToolbar() {
  const { user } = useUser();
  const roles = user?.unsafeMetadata.roles as string[] | undefined;
  const toolbar = roles?.includes("toolbar");
  const isDev = process.env.NODE_ENV === "development";
  const showToolbar = isDev || toolbar;
  return showToolbar ? <Toolbar /> : null;
}
