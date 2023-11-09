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
      <DropdownMenuItem>
        <Link href={`/event/${props.id}/edit`} className="flex items-center">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </DropdownMenuItem>
    </SignedIn>
  );
}
