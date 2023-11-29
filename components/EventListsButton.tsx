"use client";

import * as React from "react";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { List } from "@prisma/client";
import { toast } from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

type Checked = DropdownMenuCheckboxItemProps["checked"];
type EventListsButtonProps = {
  userLists: List[];
  eventId: string;
  eventLists: List[];
};

export default function EventListsButton({
  userLists,
  eventId,
  eventLists,
}: EventListsButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const listsCheckedInitialState = userLists.map((list) => {
    return eventLists.includes(list);
  });
  const [selectedLists, setSelectedLists] = React.useState<Checked[]>(
    listsCheckedInitialState
  );

  const handleSuccess = (toAdd: boolean) => {
    toast.success(toAdd ? "Event added to list." : "Event removed from list.");
    router.refresh();
  };

  const handleError = () => {
    toast.error("Your event was not saved. Please try again.");
  };

  const addEventToList = api.event.addToList.useMutation({
    onSuccess: () => handleSuccess(true),
    onError: handleError,
  });

  const removeEventFromList = api.event.removeFromList.useMutation({
    onSuccess: () => handleSuccess(false),
    onError: handleError,
  });

  const updateCheckedListAtIndex = (prev: Checked[], index: number) => {
    const next = [...prev];
    next[index] = !next[index];
    return next;
  };

  const numberOfSelectedLists = selectedLists.filter(Boolean).length;

  async function onChangeUpdateAtIndex(index: number) {
    const updatedSelectedLists = updateCheckedListAtIndex(selectedLists, index);
    const toAdd = updatedSelectedLists[index];
    const listId = userLists[index].id;
    setSelectedLists(updatedSelectedLists);

    const mutation = toAdd ? addEventToList : removeEventFromList;
    mutation.mutate({ eventId, listId });
  }

  const isLoading = addEventToList.isLoading || removeEventFromList.isLoading;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10",
            {
              "cursor-not-allowed opacity-60": isLoading,
            }
          )}
        >
          {isLoading ? (
            <span className="loading">
              <span className="bg-white" />
              <span className="bg-white" />
              <span className="bg-white" />
            </span>
          ) : (
            <>Lists ({numberOfSelectedLists}) &darr;</>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white">
        <DropdownMenuLabel>Lists</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userLists.map((list, index) => (
          <DropdownMenuCheckboxItem
            key={list.id}
            checked={selectedLists[index]}
            onCheckedChange={() => onChangeUpdateAtIndex(index)}
          >
            {list.name}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(`/list/new?afterSuccess=${pathname}`)}
        >
          New list...
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
