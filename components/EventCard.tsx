"use client";

import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/nextjs";
import { FollowEvent, User, Comment } from "@prisma/client";
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
import { ConditionalWrapper } from "./ConditionalWrapper";
import { FollowEventDropdownButton } from "./FollowButtons";
import { Badge } from "./ui/badge";
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
  FollowEvent: FollowEvent[];
  Comment: Comment[];
  id: string;
  createdAt: Date;
  event: AddToCalendarButtonProps;
  visibility: "public" | "private";
  singleEvent?: boolean;
  hideCurator?: boolean;
};

function EventDateDisplay({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const startDateInfo = getDateInfoUTC(startDate);
  const endDateInfo = getDateInfoUTC(endDate);
  const showMultiDay = showMultipleDays(startDateInfo, endDateInfo);
  const showNightIcon =
    endsNextDayBeforeMorning(startDateInfo, endDateInfo) && !showMultiDay;
  return (
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
  );
}

function EventDetails({
  id,
  name,
  startTime,
  endTime,
  location,
  singleEvent,
}: {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  location?: string;
  singleEvent?: boolean;
}) {
  return (
    <div>
      <ConditionalWrapper
        condition={!singleEvent}
        wrapper={(children) => <Link href={`/event/${id}`}>{children}</Link>}
      >
        <h3
          className={cn(
            "text-lg font-semibold leading-6 text-gray-900 sm:text-xl",
            {
              "md:line-clamp-1 line-clamp-2 md:break-all break-words":
                !singleEvent,
            }
          )}
        >
          {name}
        </h3>
      </ConditionalWrapper>
      <div className="p-1"></div>
      <div className="flex gap-2">
        <div className="shrink-0 items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {startTime}-{endTime}
        </div>
        {location && (
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${location}`}
            className={cn(
              "shrink items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
              { "line-clamp-1 break-all": !singleEvent }
            )}
          >
            📍 {location}
          </Link>
        )}
      </div>
    </div>
  );
}

function EventDescription({
  description,
  singleEvent,
}: {
  description: string;
  singleEvent?: boolean;
}) {
  return (
    <div className="flex min-w-0 gap-x-4">
      <div className="min-w-0 flex-auto" suppressHydrationWarning>
        <p
          className={cn("mt-1 text-sm leading-6 text-gray-600", {
            "line-clamp-2": !singleEvent,
          })}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: translateToHtml(description!),
            }}
          ></span>
        </p>
      </div>
    </div>
  );
}

function EventActionButton({
  User,
  event,
  id,
  isOwner,
  isFollowing,
}: {
  User: User;
  event: AddToCalendarButtonProps;
  id: string;
  isOwner: boolean;
  isFollowing?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border bg-white transition-colors hover:bg-muted">
        <EllipsisVerticalIcon className="h-8 w-8" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <CalendarButton event={event} id={id} username={User.username} />
        <FollowEventDropdownButton eventId={id} following={isFollowing} />
        <ShareButton event={event} id={id} />
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
  );
}

function EventCuratedBy({
  username,
  comment,
}: {
  username: string;
  comment?: Comment;
}) {
  return (
    <div className="flex items-center gap-2">
      <p className="whitespace-nowrap text-xs font-medium text-gray-500">
        Collected by{" "}
        <Link
          href={`/${username}/events`}
          className="font-bold text-gray-900"
        >{`@${username}`}</Link>
      </p>
      {comment && (
        <Badge className="inline-flex" variant="outline">
          <span className="line-clamp-1">&ldquo;{comment.content}&rdquo;</span>
        </Badge>
      )}
    </div>
  );
}

function CuratorComment({ comment }: { comment?: Comment }) {
  return (
    <div className="flex items-center gap-2">
      {comment && (
        <Badge className="inline-flex" variant="outline">
          <span>&ldquo;{comment.content}&rdquo;</span>
        </Badge>
      )}
    </div>
  );
}

export function EventCard(props: EventCardProps) {
  const { user } = useUser();
  const { User, FollowEvent, id, event, singleEvent, visibility } = props;
  const isOwner = user?.id === User.id;
  const isFollowing = !!FollowEvent.find((item) => item.userId === user?.id);
  const comment = props.Comment.findLast((item) => item.userId === user?.id);

  return (
    <li className="relative grid px-4 py-5 sm:px-6">
      {visibility === "private" && (
        <>
          <Badge className="max-w-fit" variant="destructive">
            Unlisted Event
          </Badge>
          <div className="p-1"></div>
        </>
      )}
      <div className="flex items-center gap-4 pr-8">
        <EventDateDisplay
          startDate={event.startDate!}
          endDate={event.endDate!}
        />
        <EventDetails
          id={id}
          name={event.name!}
          startTime={event.startTime!}
          endTime={event.endTime!}
          location={event.location}
          singleEvent={singleEvent}
        />
      </div>
      <div className="p-1"></div>
      <EventDescription
        description={event.description!}
        singleEvent={singleEvent}
      />
      <div className="absolute right-4 top-5 sm:right-6">
        <EventActionButton
          User={User}
          event={event}
          id={id}
          isOwner={isOwner}
          isFollowing={isFollowing}
        />
      </div>
      {singleEvent && (
        <>
          <div className="p-1"></div>
          <CuratorComment comment={comment} />
        </>
      )}
      {!props.hideCurator && (
        <>
          <div className="p-1"></div>
          <EventCuratedBy username={User.username} comment={comment} />
        </>
      )}
    </li>
  );
}
