"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";

export default function Header() {
  const { user } = useUser();

  return (
    <header className="mt-5 flex w-full items-center justify-between border-b-2 px-2 pb-7 sm:px-4">
      <Link href="/" className="flex space-x-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-10 w-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
          />
        </svg>

        <h1 className="ml-2 text-2xl font-bold tracking-tight sm:text-4xl">
          timetime.cc
        </h1>
      </Link>
      {/* Link to events */}
      <div className="flex place-items-center gap-4">
        <ClerkLoading>
          <div className="flex place-items-center gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <Link
              href={`/${user?.id}/events`}
              className=" font-bold text-black hover:text-black/80"
            >
              Events
            </Link>
            <div className="h-8 w-8">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
}
