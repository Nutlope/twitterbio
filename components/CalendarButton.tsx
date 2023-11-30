"use client";

import { atcb_action } from "add-to-calendar-button";
import { CalendarPlus } from "lucide-react";
import { DropdownMenuItem } from "./DropdownMenu";
import { Button } from "./ui/button";
import { AddToCalendarButtonProps } from "@/types";

type CalendarButtonProps = {
  event: AddToCalendarButtonProps;
  id: string;
  username: string;
  type: "button" | "dropdown";
};

export function CalendarButton(props: CalendarButtonProps) {
  const eventForCalendar = { ...props.event };
  eventForCalendar.description = `${props.event.description}[br][br]Collected by [url]${process.env.NEXT_PUBLIC_URL}/${props.username}/events|@${props.username}[/url] on [url]${process.env.NEXT_PUBLIC_URL}/event/${props.id}|timetime.cc[/url]`;

  if (props.type === "dropdown") {
    return (
      <DropdownMenuItem>
        <button
          className="flex items-center"
          onClick={() => atcb_action(eventForCalendar)}
        >
          <CalendarPlus className="mr-2 h-4 w-4" />
          Add to Calendar
        </button>
      </DropdownMenuItem>
    );
  }

  if (props.type === "button") {
    return (
      <Button
        className="flex items-center"
        onClick={() => atcb_action(eventForCalendar)}
        variant={"secondary"}
      >
        <CalendarPlus className="mr-2 h-4 w-4" />
        Add to Calendar
      </Button>
    );
  }
}
