"use client";

import { SignedIn, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { DropdownMenuItem } from "./DropdownMenu";

export type EditButtonProps = {
  userId: string;
  id: string;
};

export function EditButton(props: EditButtonProps) {
  const { user } = useUser();

  if (!user || user.id !== props.userId) {
    return null;
  }

  return (
    <SignedIn>
      <Link href={`/event/${props.id}/edit`}>
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
      </Link>
    </SignedIn>
  );
}
