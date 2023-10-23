"use client";

import { AddToCalendarButton } from "add-to-calendar-button-react";
import { AddToCalendarButtonProps } from "add-to-calendar-button-react/dist/AddToCalendarButton";
import { getDateInfoUTC } from "../utils/utils";
import { DeleteButton } from "./DeleteButton";
import Link from "next/link";
import clsx from "clsx";

type EventCardProps = {
  userId: string;
  id: number;
  createdAt: Date;
  event: AddToCalendarButtonProps;
  singleEvent?: boolean;
};

function LiContainer(props: { children: React.ReactNode }) {
  return (
    <li className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      {props.children}
    </li>
  );
}

function DivContainer(props: { children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
      {props.children}
    </div>
  );
}

export default function EventCard(props: EventCardProps) {
  const { userId, id, event, singleEvent } = props;
  const startDateInfo = getDateInfoUTC(event.startDate!);
  const endDateInfo = getDateInfoUTC(event.endDate!);
  const spansMultipleDays = startDateInfo?.day !== endDateInfo?.day;

  const Container = singleEvent ? DivContainer : LiContainer;

  function NoLink(props: { children: React.ReactNode }) {
    return <div className="my-auto">{props.children}</div>;
  }

  function EventLink(props: { children: React.ReactNode }) {
    return (
      <Link href={`/${userId}/events/${id}`} className="my-auto">
        {props.children}
      </Link>
    );
  }
  const LinkOrNot = singleEvent ? NoLink : EventLink;

  return (
    <Container>
      <div
        className={clsx("flex items-stretch justify-between flex-col h-full", {
          "sm:flex-row": !singleEvent,
        })}
      >
        <LinkOrNot>
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
              <div className="p-0.5"></div>
              <div className="flex gap-2">
                <div className="items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 flex-shrink-0">
                  {event.startTime}-{event.endTime}
                </div>
                {event.location && (
                  <div
                    className={clsx(
                      "items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10 flex-shrink",
                      { "line-clamp-1": !singleEvent }
                    )}
                  >
                    📍 {event.location}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-0.5"></div>
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p
                className={clsx("mt-1 text-sm leading-6 text-gray-600", {
                  "line-clamp-2": !singleEvent,
                })}
              >
                {event.description}
              </p>
            </div>
          </div>
        </LinkOrNot>

        <div
          className={clsx("hidden flex-col justify-between items-center", {
            "sm:flex": !singleEvent,
          })}
        >
          <AddToCalendarButton
            {...(event as AddToCalendarButtonProps)}
            hideTextLabelButton
            hideTextLabelList
            size="8"
          />
          <DeleteButton id={id} />
        </div>
        <div
          className={clsx(
            "flex-shrink-0 self-center flex justify-between w-full items-center py-2",
            { "sm:hidden": !singleEvent }
          )}
        >
          <AddToCalendarButton
            {...(event as AddToCalendarButtonProps)}
            size="4"
          />
          <DeleteButton id={id} />
        </div>
      </div>
    </Container>
  );
}
