"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import { Button } from "./ui/button";
import { useCroppedImageContext } from "@/context/CroppedImageContext";
import { useFormContext } from "@/context/FormContext";

type UpdateButtonProps = {
  event: AddToCalendarButtonType;
  id: string;
  update?: boolean;
  notes?: string;
  visibility: "public" | "private";
  lists: Record<string, string>[];
};

export function UpdateButton(props: UpdateButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setCroppedImagesUrls } = useCroppedImageContext();
  const { setFormData } = useFormContext();

  async function onClickUpdate(id: string) {
    setIsLoading(true);

    const response = await fetch("/api/events", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        event: props.event,
        comment: props.notes,
        visibility: props.visibility,
        lists: props.lists,
      }),
    });

    console.log(response);

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your event was not saved. Please try again.");
    }

    const event = await response.json();

    toast.success("Event updated.");

    // Clear context state
    setCroppedImagesUrls({});
    setFormData({
      notes: "",
      visibility: "public",
      lists: [],
    });

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/event/${event.id}`);
  }

  return (
    <>
      <SignedIn>
        {isLoading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )}
        {!isLoading && (
          <Button onClick={() => onClickUpdate(props.id)}>
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
          <Button>Sign in to update</Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
