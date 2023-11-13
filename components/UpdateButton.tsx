"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import { Button } from "./ui/button";
import { CardDescription } from "./ui/card";

type UpdateButtonProps = AddToCalendarButtonType & {
  id: string;
  update?: boolean;
};

export function UpdateButton(props: UpdateButtonProps) {
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
        id: id,
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

    router.push(`/event/${event.id}`);
  }

  return (
    <>
      <SignedIn>
        {isLoading && (
          <Button className="w-full" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )}
        {!isLoading && (
          <Button className="w-full" onClick={() => onClickUpdate(props.id)}>
            <Save className="mr-2 h-4 w-4" /> Update
          </Button>
        )}
      </SignedIn>
      <SignedOut>
        {/* TODO: Does this show up anywhere? */}
        <SignInButton
          afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/`}
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/`}
        >
          <Button className="w-full">Sign in to update</Button>
        </SignInButton>
        <CardDescription className="italic">
          *TODO: Will not save your progress
        </CardDescription>
      </SignedOut>
    </>
  );
}
