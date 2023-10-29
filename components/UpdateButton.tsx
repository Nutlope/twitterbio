"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

type UpdateButtonProps = AddToCalendarButtonType & {
  id: string;
  update: boolean;
};

export function UpdateButton(props: UpdateButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onClickUpdate(id: string) {
    setIsLoading(true);

    const response = await fetch("/api/events", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: Number(id),
        event: props,
      }),
    });

    console.log(response);

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your event was not saved. Please try again.");
    }

    const event = await response.json();

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/${user?.id}/events/${event.id}`);
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
          onClick={() => onClickUpdate(props.id)}
        >
          {isLoading ? (
            <span className="loading">
              <span className="bg-white" />
              <span className="bg-white" />
              <span className="bg-white" />
            </span>
          ) : (
            "Update"
          )}
        </button>
      </SignedIn>
      <SignedOut>
        {/* TODO: Does this show up anywhere? */}
        <SignInButton
          afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/`}
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/`}
        >
          <button
            className={cn(
              "mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
            )}
          >
            Sign in to update (updates not saved)
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
