"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { DeleteButton } from "./DeleteButton";
import { EditButton } from "./EditButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./DropdownMenu";
import { CalendarButton } from "./CalendarButton";
import { ShareButton } from "./ShareButton";
import {
  translateToHtml,
  getDateInfoUTC,
  cn,
  showMultipleDays,
  endsNextDayBeforeMorning,
} from "@/lib/utils";
import { AddToCalendarButtonProps } from "@/types";

type EventCardProps = {
  User: User;
  id: string;
  createdAt: Date;
  event: AddToCalendarButtonProps;
  singleEvent?: boolean;
  hideCurator?: boolean;
};

function LiContainer(props: { children: React.ReactNode }) {
  return <li className="px-4 py-5 sm:px-6">{props.children}</li>;
}

function DivContainer(props: { children: React.ReactNode }) {
  return <div className="px-4 py-5 sm:px-6">{props.children}</div>;
}

function NoLink(props: { children: React.ReactNode; id: string }) {
  return <div className="my-auto">{props.children}</div>;
}

function EventLink(props: { children: React.ReactNode; id: string }) {
  return (
    <Link href={`/event/${props.id}`} className="my-auto">
      {props.children}
    </Link>
  );
}

export default function EventCard(props: EventCardProps) {
  const { user } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const { User, id, event, singleEvent } = props;
  const isOwner = user?.id === User.id;
  const startDateInfo = getDateInfoUTC(event.startDate!);
  const endDateInfo = getDateInfoUTC(event.endDate!);
  const showMultiDay = showMultipleDays(startDateInfo, endDateInfo);
  const showNightIcon =
    endsNextDayBeforeMorning(startDateInfo, endDateInfo) && !showMultiDay;
  const fullImageUrl = event?.images?.[3];

  const Container = singleEvent ? DivContainer : LiContainer;

  const LinkOrNot = singleEvent ? NoLink : EventLink;

  return (
    <Container>
      <div
        className={cn(
          "relative flex h-full flex-col items-center justify-between",
          {
            "sm:flex-row": !singleEvent,
          }
        )}
      >
        <LinkOrNot id={id}>
          <div className="flex items-center">
            <div className="flex shrink-0 flex-row gap-1">
              <div className="relative grid h-14 w-14 place-items-center rounded-md bg-gradient-to-b from-gray-900 to-gray-600">
                <span className="text-xs font-semibold uppercase text-white">
                  {startDateInfo?.monthName.substring(0, 3)}
                </span>
                <span className="-mt-2 text-2xl font-extrabold text-white">
                  {startDateInfo?.day}
                </span>
                <span className="-mt-2 text-xs font-light uppercase text-white">
                  {startDateInfo?.dayOfWeek.substring(0, 3)}
                </span>
                {showNightIcon && (
                  <div className="absolute -right-2 -top-2 text-2xl">🌛</div>
                )}
              </div>
              {showMultiDay && (
                <div className="grid h-14 w-14 place-items-center rounded-md bg-gradient-to-b from-gray-900 to-gray-600">
                  <span className="text-xs font-semibold uppercase text-white">
                    {endDateInfo?.monthName.substring(0, 3)}
                  </span>
                  <span className="-mt-2 text-2xl font-extrabold text-white">
                    {endDateInfo?.day}
                  </span>
                  <span className="-mt-2 text-xs font-light uppercase text-white">
                    {endDateInfo?.dayOfWeek.substring(0, 3)}
                  </span>
                </div>
              )}
            </div>
            <div className="-mt-1 ml-4 mr-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                {event.name}
              </h3>
              <div className="p-0.5"></div>
              <div className="flex gap-2">
                <div className="shrink-0 items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {event.startTime}-{event.endTime}
                </div>
                {event.location && (
                  <div
                    className={cn(
                      "shrink items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
                      { "line-clamp-1": !singleEvent }
                    )}
                  >
                    📍 {event.location}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="p-1"></div>
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto" suppressHydrationWarning>
              <p
                className={cn("mt-1 text-sm leading-6 text-gray-600", {
                  "line-clamp-2": !singleEvent,
                })}
              >
                {/* only render on client to prevent hydration errors */}
                {isClient && !singleEvent && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translateToHtml(event.description!),
                    }}
                  ></span>
                )}
                {isClient && singleEvent && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: translateToHtml(event.description!),
                    }}
                  ></span>
                )}
              </p>
            </div>
          </div>
          {!props.hideCurator && !singleEvent && (
            <>
              <div className="p-1"></div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-medium text-gray-500">
                  Collected by{" "}
                  <Link
                    href={`/${User.username}/events`}
                    className="font-bold text-gray-900"
                  >{`@${User.username}`}</Link>
                </p>
              </div>
            </>
          )}
        </LinkOrNot>
        <DropdownMenu>
          <DropdownMenuTrigger className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
            <EllipsisVerticalIcon className="h-8 w-8" />
            <span className="sr-only">Open</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <CalendarButton event={event} />
            <ShareButton eventId={id} />
            {isOwner && (
              <>
                <DropdownMenuSeparator />
                <EditButton userId={User.id} id={id} />
                <DropdownMenuSeparator />
                <DeleteButton userId={User.id} id={id} />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {fullImageUrl && singleEvent && (
        <>
          <div className="p-2"></div>
          <Image
            src={fullImageUrl}
            className="mx-auto h-auto w-2/3 object-cover sm:w-1/3"
            alt=""
            width={640}
            height={480}
          />
        </>
      )}
    </Container>
  );
}
