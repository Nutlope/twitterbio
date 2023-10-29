"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { SignedIn, useUser } from "@clerk/nextjs";
import { TrashIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

export type DeleteButtonProps = {
  userId: string;
  id: number;
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

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/${user?.id}/events`);
  }

  if (!user || user.id !== props.userId) {
    return null;
  }

  return (
    <SignedIn>
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={cn("p-2", {
          "cursor-not-allowed opacity-60": isLoading,
        })}
      >
        <TrashIcon className="h-6 w-6 text-red-600 hover:text-red-700" />
      </button>
    </SignedIn>
  );
}
