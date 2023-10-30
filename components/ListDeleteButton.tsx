"use client";

import { SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

type ListDeleteButtonProps = {
  listUserId: string;
  listId: string;
};

export function ListDeleteButton(props: ListDeleteButtonProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/lists", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.listId,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your list was not deleted. Please try again.");
    }

    const list = await response.json();

    // This forces a cache invalidation.
    router.refresh();

    router.push(`/${user?.id}/events`);
  }

  const show = user && user.id === props.listUserId;

  if (!show) return null;

  return (
    <SignedIn>
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={cn(
          "w-20 rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80",
          {
            "cursor-not-allowed opacity-60": isLoading,
          }
        )}
      >
        Delete
      </button>
    </SignedIn>
  );
}
