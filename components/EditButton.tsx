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
  const roles = user?.unsafeMetadata.roles as string[] | undefined;
  const isOwner = user?.id === props.userId || roles?.includes("admin");

  if (!isOwner) {
    return null;
  }

  return (
    <SignedIn>
      <DropdownMenuItem asChild>
        <Link href={`/event/${props.id}/edit`}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </DropdownMenuItem>
    </SignedIn>
  );
}
