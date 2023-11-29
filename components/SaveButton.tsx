"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "./ui/button";
import { useCroppedImageContext } from "@/context/CroppedImageContext";
import { useFormContext } from "@/context/FormContext";
import { api } from "@/trpc/react";

type SaveButtonProps = {
  event: AddToCalendarButtonType;
  notes?: string;
  visibility: "public" | "private";
  lists: Record<string, string>[];
};

export function SaveButton(props: SaveButtonProps) {
  const router = useRouter();
  const params = useSearchParams();
  const filePath = params.get("filePath") || "";
  const { setCroppedImagesUrls } = useCroppedImageContext();
  const { setFormData } = useFormContext();
  const updateEvent = api.event.create.useMutation({
    onError: () => {
      toast.error("Your event was not saved. Please try again.");
    },
    onSuccess: ({ id }) => {
      toast.success("Event saved.");
      // Clear context state
      setCroppedImagesUrls({});
      setFormData({
        notes: "",
        visibility: "public",
        lists: [],
      });
      router.refresh();
      router.push(`/event/${id}`);
    },
  });

  return (
    <>
      <SignedIn>
        {updateEvent.isLoading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )}
        {!updateEvent.isLoading && (
          <Button
            onClick={() =>
              updateEvent.mutate({
                event: props.event,
                comment: props.notes,
                visibility: props.visibility,
                lists: props.lists,
              })
            }
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Publish
          </Button>
        )}
      </SignedIn>
      <SignedOut>
        {/* TODO: instead convert from the AddToCalendarButtonProps */}
        <SignInButton
          afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/new?saveIntent=true&filePath=${filePath}`}
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/new?saveIntent=true&filePath=${filePath}`}
        >
          <Button
            onClick={() => {
              localStorage.setItem("updatedProps", JSON.stringify(props));
            }}
          >
            Sign in to publish
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
