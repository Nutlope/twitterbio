"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import { Button } from "./ui/button";
import { CardDescription } from "./ui/card";
import { cn } from "@/lib/utils";

type ListSaveButtonProps = {
  name: string;
  description: string;
  afterSuccess?: string;
};

export default function ListSaveButton(props: ListSaveButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onClick() {
    setIsLoading(true);

    const response = await fetch("/api/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: props.name,
        description: props.description,
      }),
    });

    setIsLoading(false);

    if (!response?.ok) {
      console.log(response);
      return toast.error("Your list was not saved. Please try again.");
    }

    const list = await response.json();

    toast.success("List saved.");

    // This forces a cache invalidation.
    router.refresh();

    router.push(props.afterSuccess ? props.afterSuccess : `/list/${list.id}`);
  }

  return (
    <>
      <SignedIn>
        {isLoading && (
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        )}
        {!isLoading && (
          <Button onClick={onClick}>
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
