"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "./ui/button";
import { CardDescription } from "./ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

type ListUpdateButtonProps = {
  id: string;
  name: string;
  description: string;
  afterSuccess?: string;
};

export default function ListUpdateButton(props: ListUpdateButtonProps) {
  const router = useRouter();
  const updateList = api.list.update.useMutation({
    onError: () => {
      toast.error("Your list was not saved. Please try again.");
    },
    onSuccess: ({ id }) => {
      toast.success("List saved.");
      router.refresh();
      router.push(`/list/${id}`);
    },
  });

  return (
    <>
      <SignedIn>
        <button
          className={cn(
            "mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10",
            {
              "cursor-not-allowed opacity-60": updateList.isLoading,
            }
          )}
          onClick={() =>
            updateList.mutate({
              listId: props.id,
              name: props.name,
              description: props.description,
            })
          }
          disabled={updateList.isLoading}
        >
          {updateList.isLoading ? (
            <span className="loading">
              <span className="bg-white" />
              <span className="bg-white" />
              <span className="bg-white" />
            </span>
          ) : (
            "Update"
          )}
        </button>
      </SignedIn>
      <SignedOut>
        {/* TODO: Redirect somewhere meaningful */}
        <SignInButton
          afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/`}
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/`}
        >
          <Button>Sign in to update</Button>
        </SignInButton>
        <CardDescription className="italic">
          *TODO: Will not save your progress
        </CardDescription>
      </SignedOut>
    </>
  );
}
