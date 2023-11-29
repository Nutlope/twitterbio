"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import { Button } from "./ui/button";
import { CardDescription } from "./ui/card";
import { api } from "@/trpc/react";

type ListSaveButtonProps = {
  name: string;
  description: string;
  afterSuccess?: string;
};

export default function ListSaveButton(props: ListSaveButtonProps) {
  const router = useRouter();
  const createList = api.list.create.useMutation({
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
        {createList.isLoading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )}
        {!createList.isLoading && (
          <Button
            onClick={() =>
              createList.mutate({
                name: props.name,
                description: props.description,
              })
            }
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        )}
      </SignedIn>
      <SignedOut>
        {/* TODO: Redirect somewhere meaningful */}
        <SignInButton
          afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/`}
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/`}
        >
          <Button>Sign in to save</Button>
        </SignInButton>
        <CardDescription className="italic">
          *TODO: Will not save your progress
        </CardDescription>
      </SignedOut>
    </>
  );
}
