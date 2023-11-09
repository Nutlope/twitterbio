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
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const listsCheckedInitialState = userLists.map((list) => {
    return eventLists.includes(list);
  });
  const [selectedLists, setSelectedLists] = React.useState<Checked[]>(
    listsCheckedInitialState
  );
  const updateCheckedListAtIndex = (prev: Checked[], index: number) => {
    const next = [...prev];
    next[index] = !next[index];
    return next;
  };

  const numberOfSelectedLists = selectedLists.filter(Boolean).length;
  const afterSuccessEncoded = encodeURIComponent(pathname);

  async function onChangeUpdateAtIndex(index: number) {
    setIsLoading(true);
    const updatedSelectedLists = updateCheckedListAtIndex(selectedLists, index);
    const toAdd = updatedSelectedLists[index];
    const listId = userLists[index].id;
    const endpoint = toAdd ? "/api/events/list/add" : "/api/events/list/remove";
    setSelectedLists(updatedSelectedLists);

    console.log(eventId, listId);

    const response = await fetch(endpoint, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventId: eventId,
        listId: listId,
      }),
    });

    console.log(response);

    setIsLoading(false);

    if (!response?.ok) {
      return toast.error("Your event was not saved. Please try again.");
    }

    const event = await response.json();

    // This forces a cache invalidation.
    router.refresh();
  }

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
