"use client";

import { SignedIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ListEditButtonProps = {
  listUserId: string;
  listId: string;
};

export function ListEditButton(props: ListEditButtonProps) {
  const { user } = useUser();

  const show = user && user.id === props.listUserId;

  if (!show) return null;

  return (
    <SignedIn>
      <Link
        href={`/list/${props.listId}/edit`}
        className={cn(
          "w-16 rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80"
        )}
      >
        Edit
      </Link>
    </SignedIn>
  );
}
