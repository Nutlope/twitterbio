"use client";

import { Share } from "lucide-react";
import { toast } from "react-hot-toast";
import { DropdownMenuItem } from "./DropdownMenu";

export type ShareButtonProps = {
  eventId: string;
};

export function ShareButton(props: ShareButtonProps) {
  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Event Details",
          text: `Check out this event: ${props.eventId}`,
          url: `${process.env.NEXT_PUBLIC_URL}/event/${props.eventId}`,
        });
        console.log("Event shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that do not support the Share API
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_URL}/event/${props.eventId}`
      );
      toast("Event URL copied to clipboard!");
    }
  };

  return (
    <DropdownMenuItem onSelect={handleShareClick}>
      <Share className="mr-2 h-4 w-4" />
      Share
    </DropdownMenuItem>
  );
}
