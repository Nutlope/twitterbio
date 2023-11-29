"use client";

import { SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";

type ListDeleteButtonProps = {
  listUserId: string;
  listId: string;
};

export function ListDeleteButton(props: ListDeleteButtonProps) {
  const router = useRouter();
  const { user } = useUser();
  const deleteList = api.list.delete.useMutation({
    onError: () => {
      toast.error("Your list was not deleted. Please try again.");
    },
    onSuccess: ({ id }) => {
      toast.success("List deleted.");
      router.refresh();
      router.push(`/${user?.username}/events`);
    },
  });

  const show = user && user.id === props.listUserId;

  if (!show) return null;

  return (
    <SignedIn>
      {deleteList.isLoading && (
        <Button variant={"destructive"} disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </Button>
      )}
      {!deleteList.isLoading && (
        <Button
          variant={"destructive"}
          onClick={() =>
            deleteList.mutate({
              listId: props.listId,
            })
          }
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      )}
    </SignedIn>
  );
}
