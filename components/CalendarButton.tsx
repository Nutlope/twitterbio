"use client";

import { atcb_action } from "add-to-calendar-button";
import { CalendarPlus } from "lucide-react";
import { DropdownMenuItem } from "./DropdownMenu";
import { AddToCalendarButtonProps } from "@/types";

type CalendarButtonProps = {
  event: AddToCalendarButtonProps;
};

export function CalendarButton(props: CalendarButtonProps) {
  return (
    <DropdownMenuItem>
      <button
        className="flex items-center"
        onClick={() => atcb_action(props.event)}
      >
        <CalendarPlus className="mr-2 h-4 w-4" />
        Add to Calendar
      </button>
    </DropdownMenuItem>
  );
}
