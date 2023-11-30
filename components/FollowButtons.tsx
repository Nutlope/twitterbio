"use client";

import { SignedIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Check, Loader2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenuItem } from "./DropdownMenu";
import { api } from "@/trpc/react";

export function FollowEventDropdownButton({
  eventId,
  following,
}: {
  eventId: string;
  following?: boolean;
}) {
  const router = useRouter();
  const follow = api.event.follow.useMutation({
    onError: () => {
      toast.error("Event not saved. Please try again.");
    },
    onSuccess: () => {
      toast.success("Event saved.");
      router.refresh();
    },
  });
  const unfollow = api.event.unfollow.useMutation({
    onError: () => {
      toast.error("Event not unsaved. Please try again.");
    },
    onSuccess: () => {
      toast.success("Event unsaved.");
      router.refresh();
    },
  });
  const isLoading = follow.isLoading || unfollow.isLoading;

  return (
    <>
      <SignedIn>
        <DropdownMenuItem
          onSelect={() =>
            following
              ? unfollow.mutate({ id: eventId })
              : follow.mutate({ id: eventId })
          }
          disabled={isLoading}
        >
          {isLoading && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          )}
          {!isLoading && following && (
            <>
              <Check className="mr-2 h-4 w-4" />
              Event Saved
            </>
          )}
          {!isLoading && !following && (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Save Event
            </>
          )}
        </DropdownMenuItem>
      </SignedIn>
    </>
  );
}

export function FollowEventButton({
  eventId,
  following,
}: {
  eventId: string;
  following?: boolean;
}) {
  const router = useRouter();
  const follow = api.event.follow.useMutation({
    onError: () => {
      toast.error("Event not saved. Please try again.");
    },
    onSuccess: () => {
      toast.success("Event saved.");
      router.refresh();
    },
  });
  const unfollow = api.event.unfollow.useMutation({
    onError: () => {
      toast.error("Event not unsaved. Please try again.");
    },
    onSuccess: () => {
      toast.success("Event unsaved.");
      router.refresh();
    },
  });
  const isLoading = follow.isLoading || unfollow.isLoading;

  return (
    <>
      <SignedIn>
        <Button
          onSelect={() =>
            following
              ? unfollow.mutate({ id: eventId })
              : follow.mutate({ id: eventId })
          }
          disabled={isLoading}
          variant="ghost"
        >
          {isLoading && (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          )}
          {!isLoading && following && (
            <>
              <Check className="mr-2 h-4 w-4" />
              Event Saved
            </>
          )}
          {!isLoading && !following && (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Save Event
            </>
          )}
        </Button>
      </SignedIn>
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
  const follow = api.user.follow.useMutation({
    onError: () => {
      toast.error("User not followed. Please try again.");
    },
    onSuccess: () => {
      toast.success("Followed user.");
      router.refresh();
    },
  });
  const unfollow = api.user.unfollow.useMutation({
    onError: () => {
      toast.error("User not unfollowed. Please try again.");
    },
    onSuccess: () => {
      toast.success("User unfollowed.");
      router.refresh();
    },
  });
  const isLoading = follow.isLoading || unfollow.isLoading;
  return (
    <>
      <SignedIn>
        {isLoading && (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )}
        {!isLoading && (
          <Button
            onClick={() =>
              following
                ? unfollow.mutate({ followingId: userId })
                : follow.mutate({ followingId: userId })
            }
            size="sm"
          >
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
  const follow = api.list.follow.useMutation({
    onError: () => {
      toast.error("List not saved. Please try again.");
    },
    onSuccess: () => {
      toast.success("List saved.");
      router.refresh();
    },
  });
  const unfollow = api.list.unfollow.useMutation({
    onError: () => {
      toast.error("List not unsaved. Please try again.");
    },
    onSuccess: () => {
      toast.success("List unsaved.");
      router.refresh();
    },
  });
  const isLoading = follow.isLoading || unfollow.isLoading;

  return (
    <>
      <SignedIn>
        {isLoading && (
          <Button disabled size="sm">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )}
        {!isLoading && (
          <Button
            onClick={() =>
              following
                ? unfollow.mutate({ listId: listId })
                : follow.mutate({ listId: listId })
            }
            size="sm"
          >
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
