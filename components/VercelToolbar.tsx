import { VercelToolbar as Toolbar } from "@vercel/toolbar/next";

export function VercelToolbar() {
  // const isEmployee = useIsEmployee();
  const isDev = process.env.NODE_ENV === "development";
  const showToolbar = isDev;
  return showToolbar ? <Toolbar /> : null;
}
