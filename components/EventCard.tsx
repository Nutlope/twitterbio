"use client";

import { Prisma } from "@prisma/client";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import { AddToCalendarButtonProps } from "add-to-calendar-button-react/dist/AddToCalendarButton";

type EventCardProps = {
  id: number;
  createdAt: Date;
  event: AddToCalendarButtonProps;
};

export default function EventCard(props: EventCardProps) {
  const { id, event } = props;

  return (
    <li
      key={id}
      className="flex items-center justify-between gap-x-6 py-5 max-w-xl"
    >
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {event.name}
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            {event.startDate} {event.startTime} - {event.endDate}{" "}
            {event.endTime}
          </p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
            {event.description}
          </p>
        </div>
      </div>
      <AddToCalendarButton
        {...(event as AddToCalendarButtonProps)}
        hideTextLabelButton
        hideTextLabelList
        size="8"
      />
    </li>
  );
}
