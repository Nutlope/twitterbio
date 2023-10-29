"use client";

import { SignedIn, useUser } from "@clerk/nextjs";
import { PencilIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

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
        <PencilIcon className="h-6 w-6 text-blue-600 hover:text-blue-700" />
      </Link>
    </SignedIn>
  );
}
