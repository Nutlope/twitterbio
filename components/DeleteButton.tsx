"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SignedIn, useUser } from "@clerk/nextjs";
import { TrashIcon } from "@heroicons/react/24/solid";
import { DropdownMenuItem } from "./DropdownMenu";
import { cn } from "@/lib/utils";

export type DeleteButtonProps = {
  userId: string;
  id: string;
};

export function DeleteButton(props: DeleteButtonProps) {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/events", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.id,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your event was not deleted. Please try again.");
    }

    const event = await response.json();

    toast.success("Event deleted.");

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/${user?.username}/events`);
  }

  if (!user || user.id !== props.userId) {
    return null;
  }

  return (
    <SignedIn>
      <DropdownMenuItem
        onSelect={onClick}
        disabled={isLoading}
        className="text-red-600"
      >
        <TrashIcon className="mr-2 h-4 w-4" />
        Delete
      </DropdownMenuItem>
    </SignedIn>
  );
}
