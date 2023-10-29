"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export function SaveButton(props: AddToCalendarButtonType) {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event: props,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your event was not saved. Please try again.");
    }

    const event = await response.json();

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/event/${event.id}`);
  }

  return (
    <>
      <SignedIn>
        <button
          className={cn(
            "mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10",
            {
              "cursor-not-allowed opacity-60": isLoading,
            }
          )}
          onClick={onClick}
        >
          {isLoading ? (
            <span className="loading">
              <span className="bg-white" />
              <span className="bg-white" />
              <span className="bg-white" />
            </span>
          ) : (
            "Save"
          )}
        </button>
      </SignedIn>
      <SignedOut>
        {/* TODO: instead convert from the AddToCalendarButtonProps */}
        <SignInButton
          afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/new?saveIntent=true`}
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/onboarding?saveIntent=true`}
        >
          <button
            className={cn(
              "mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
            )}
          >
            Sign in to save
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
