"use client";

import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Check, Loader2, Plus } from "lucide-react";
import { Button } from "./ui/button";

export function FollowEventButton({
  eventId,
  following,
}: {
  eventId: string;
  following: boolean;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function followUnfollowEvent() {
    setIsLoading(true);

    const response = await fetch("/api/events/follow", {
      method: following ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: eventId,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your event was not saved. Please try again.");
    }

    const event = await response.json();

    // This forces a cache invalidation.
    router.refresh();
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
          <Button onClick={followUnfollowEvent}>
            {following && (
              <>
                <Check className="mr-2 h-4 w-4" />
                Following Event
              </>
            )}
            {!following && (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Follow Event
              </>
            )}
          </Button>
        )}
      </SignedIn>
      <SignedOut>
        {/* TODO: instead convert from the AddToCalendarButtonProps */}
        <SignInButton
          afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/${pathName}`}
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/${pathName}`}
        >
          <Button>Sign in to follow</Button>
        </SignInButton>
      </SignedOut>
    </>
  );
}

export function FollowUserButton({
  userId,
  following,
}: {
  userId: string;
  following: boolean;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function followUnfollowUser() {
    setIsLoading(true);

    const response = await fetch("/api/users/follow", {
      method: following ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followingId: userId,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("User follow/unfollow failed. Please try again.");
    }

    const user = await response.json();

    // This forces a cache invalidation.
    router.refresh();
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
          <Button onClick={followUnfollowUser}>
            {following && (
              <>
                <Check className="mr-2 h-4 w-4" />
                Following
              </>
            )}
            {!following && (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Follow
              </>
            )}
          </Button>
        )}
      </SignedIn>
    </>
  );
}

export function FollowListButton({
  listId,
  following,
}: {
  listId: string;
  following: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function followUnfollowList() {
    setIsLoading(true);

    const response = await fetch("/api/lists/follow", {
      method: following ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listId: listId,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("User follow/unfollow failed. Please try again.");
    }

    const user = await response.json();

    // This forces a cache invalidation.
    router.refresh();
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
          <Button onClick={followUnfollowList}>
            {following && (
              <>
                <Check className="mr-2 h-4 w-4" />
                Following List
              </>
            )}
            {!following && (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Follow List
              </>
            )}
          </Button>
        )}
      </SignedIn>
    </>
  );
}
