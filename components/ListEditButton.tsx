"use client";

import { SignedIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Edit } from "lucide-react";
import { buttonVariants } from "./ui/button";
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
      <Link href={`/list/${props.listId}/edit`} className={buttonVariants()}>
        <Edit className="mr-2 h-4 w-4" /> Edit
      </Link>
    </SignedIn>
  );
}
