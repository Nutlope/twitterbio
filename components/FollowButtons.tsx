"use client";

import { SignedIn } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Check, Loader2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenuItem } from "./DropdownMenu";

export function FollowEventDropdownButton({
  eventId,
  following,
}: {
  eventId: string;
  following?: boolean;
}) {
  const router = useRouter();
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

    if (following) {
      toast.success("Event unsaved.");
    }

    if (!following) {
      toast.success("Event saved.");
    }

    // This forces a cache invalidation.
    router.refresh();
  }

  return (
    <>
      <SignedIn>
        <DropdownMenuItem onSelect={followUnfollowEvent} disabled={isLoading}>
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

// export function FollowEventButton({
//   eventId,
//   following,
// }: {
//   eventId: string;
//   following: boolean;
// }) {
//   const router = useRouter();
//   const pathName = usePathname();
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   async function followUnfollowEvent() {
//     setIsLoading(true);

//     const response = await fetch("/api/events/follow", {
//       method: following ? "DELETE" : "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         eventId: eventId,
//       }),
//     });

//     setIsLoading(false);

//     if (!response?.ok) {
//       return toast.error("Your event was not saved. Please try again.");
//     }

//     const event = await response.json();

//     // This forces a cache invalidation.
//     router.refresh();
//   }

//   return (
//     <>
//       <SignedIn>
//         {isLoading && (
//           <Button disabled size="sm">
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Please wait
//           </Button>
//         )}
//         {!isLoading && (
//           <Button onClick={followUnfollowEvent} size="sm">
//             {following && (
//               <>
//                 <Check className="mr-2 h-4 w-4" />
//                 Event Saved
//               </>
//             )}
//             {!following && (
//               <>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Save Event
//               </>
//             )}
//           </Button>
//         )}
//       </SignedIn>
//       <SignedOut>
//         {/* TODO: instead convert from the AddToCalendarButtonProps */}
//         <SignInButton
//           afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/${pathName}`}
//           afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/${pathName}`}
//         >
//           <Button>Sign in to follow</Button>
//         </SignInButton>
//       </SignedOut>
//     </>
//   );
// }

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

    if (following) {
      toast.success("Unfollowed user.");
    }

    if (!following) {
      toast.success("Followed user.");
    }

    // This forces a cache invalidation.
    router.refresh();
  }

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
          <Button onClick={followUnfollowUser} size="sm">
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

    if (following) {
      toast.success("Unfollowed list.");
    }

    if (!following) {
      toast.success("Followed list.");
    }

    // This forces a cache invalidation.
    router.refresh();
  }

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
          <Button onClick={followUnfollowList} size="sm">
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
