"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
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

    // This forces a cache invalidation.
    router.refresh();

    router.push(props.afterSuccess ? props.afterSuccess : `/list/${list.id}`);
  }

  return (
    <>
      <SignedIn>
        <button
          className={cn(
            "mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10",
            {
              "cursor-not-allowed opacity-60": isLoading,
            }
          )}
          onClick={onClick}
        >
          {isLoading ? (
            <span className="loading">
              <span className="bg-white" />
              <span className="bg-white" />
              <span className="bg-white" />
            </span>
          ) : (
            "Save"
          )}
        </button>
      </SignedIn>
      <SignedOut>
        {/* TODO: Redirect somewhere meaningful */}
        <SignInButton
          afterSignInUrl={`${process.env.NEXT_PUBLIC_URL}/`}
          afterSignUpUrl={`${process.env.NEXT_PUBLIC_URL}/`}
        >
          <button
            className={cn(
              "mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
            )}
          >
            Sign in to save
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
}
