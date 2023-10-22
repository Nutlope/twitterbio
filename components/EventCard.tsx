"use client";

import { AddToCalendarButton } from "add-to-calendar-button-react";
import { AddToCalendarButtonProps } from "add-to-calendar-button-react/dist/AddToCalendarButton";
import { getDateInfo } from "../utils/utils";
import { DeleteButton } from "./DeleteButton";

type EventCardProps = {
  id: number;
  createdAt: Date;
  event: AddToCalendarButtonProps;
};

export default function EventCard(props: EventCardProps) {
  const { id, event } = props;
  const startDateInfo = getDateInfo(event.startDate!);
  const endDateInfo = getDateInfo(event.endDate!);
  const spansMultipleDays = startDateInfo?.day !== endDateInfo?.day;

  return (
    <li
      key={id}
      className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6"
    >
      <div className="flex items-stretch justify-between sm:flex-row flex-col h-full">
        <div className="my-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex flex-row gap-1">
              <div className="h-14 w-14 grid place-items-center bg-gradient-to-b from-gray-900 to-gray-600 rounded-md">
                <span className="text-white text-xs font-semibold uppercase">
                  {startDateInfo?.monthName.substring(0, 3)}
                </span>
                <span className="text-white text-2xl font-extrabold -mt-2">
                  {startDateInfo?.day}
                </span>
                <span className="text-white text-xs font-light -mt-2 uppercase">
                  {startDateInfo?.dayOfWeek.substring(0, 3)}
                </span>
              </div>
              {spansMultipleDays && (
                <div className="h-14 w-14 grid place-items-center bg-gradient-to-b from-gray-900 to-gray-600 rounded-md">
                  <span className="text-white text-xs font-semibold uppercase">
                    {endDateInfo?.monthName.substring(0, 3)}
                  </span>
                  <span className="text-white text-2xl font-extrabold -mt-2">
                    {endDateInfo?.day}
                  </span>
                  <span className="text-white text-xs font-light -mt-2 uppercase">
                    {endDateInfo?.dayOfWeek.substring(0, 3)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4 -mt-1">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {event.name}
              </h3>
              <div className="flex gap-2">
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {event.startTime}-{event.endTime}
                </span>
                {event.location && (
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    📍 {event.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-600">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col justify-between items-center">
          <AddToCalendarButton
            {...(event as AddToCalendarButtonProps)}
            hideTextLabelButton
            hideTextLabelList
            size="8"
          />
          <DeleteButton id={id} />
        </div>
        <div className="flex-shrink-0 self-center sm:hidden flex justify-between w-full items-center">
          <AddToCalendarButton
            {...(event as AddToCalendarButtonProps)}
            size="4"
          />
          <DeleteButton id={id} />
        </div>
      </div>
    </li>
  );
}
