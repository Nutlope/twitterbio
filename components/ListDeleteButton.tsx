"use client";

import { SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";

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

    router.push(`/@${user?.username}/events`);
  }

  const show = user && user.id === props.listUserId;

  if (!show) return null;

  return (
    <SignedIn>
      {isLoading && (
        <Button variant={"destructive"} disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      )}
      {!isLoading && (
        <Button variant={"destructive"} onClick={onClick}>
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      )}
    </SignedIn>
  );
}
