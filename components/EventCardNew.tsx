"use client";

import Link from "next/link";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { SignedIn, useUser } from "@clerk/nextjs";
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
import { FollowEventButton, FollowEventDropdownButton } from "./FollowButtons";
import { Badge } from "./ui/badge";
import { EventWithUser } from "./EventList";
import { Button } from "./ui/button";
import {
  translateToHtml,
  getDateInfoUTC,
  cn,
  showMultipleDays,
  endsNextDayBeforeMorning,
  eventTimesAreDefined,
  timeFormat,
} from "@/lib/utils";
import { AddToCalendarButtonProps } from "@/types";
import { SimilarityDetails } from "@/lib/similarEvents";

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
  showOtherCurators?: boolean;
  similarEvents?: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
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

function EventDateDisplaySimple({
  startDate,
  endDate,
  startTime,
  endTime,
}: {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}) {
  if (!startDate || !endDate) {
    console.error("startDate or endDate is missing");
    return null;
  }

  const startDateInfo = getDateInfoUTC(startDate);
  const endDateInfo = getDateInfoUTC(endDate);
  const showMultiDay = showMultipleDays(startDateInfo, endDateInfo);
  const showNightIcon =
    endsNextDayBeforeMorning(startDateInfo, endDateInfo) && !showMultiDay;
  const showTimeRange = eventTimesAreDefined(startTime, endTime);

  if (!startDateInfo || !endDateInfo) {
    console.error("startDateInfo or endDateInfo is missing");
    return null;
  }

  // Assuming getDateInfoUTC provides hours and minutes as well
  // Adjust the formatting based on the actual structure of startDateInfo and endDateInfo
  const formattedStartDate = `${startDateInfo.dayOfWeek.toUpperCase()}, ${startDateInfo.monthName
    .substring(0, 3)
    .toUpperCase()} ${startDateInfo.day}`;

  const formattedTimes = showTimeRange
    ? `${timeFormat(startTime)}-${timeFormat(endTime)}`
    : "";
  return (
    <span>
      {formattedStartDate} {formattedTimes}
      {showTimeRange && showNightIcon && "🌛"}
    </span>
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
      <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border bg-black transition-colors hover:bg-black">
        <EllipsisVerticalIcon className="h-8 w-8 text-white" />
        <span className="sr-only">Open</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <CalendarButton
          type="dropdown"
          event={event}
          id={id}
          username={User.username}
        />
        <FollowEventDropdownButton eventId={id} following={isFollowing} />
        <ShareButton type="dropdown" event={event} id={id} />
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
  similarEvents,
}: {
  username: string;
  comment?: Comment;
  similarEvents?: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
}) {
  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-xs font-medium text-gray-500">
        Collected by{" "}
        <Link
          href={`/${username}/events`}
          className="font-bold text-gray-900"
        >{`@${username}`}</Link>
        {similarEvents && similarEvents.length > 0 && (
          <SimilarEventsSummary
            similarEvents={similarEvents}
            curatorUsername={username}
          />
        )}
      </p>
      {comment && (
        <Badge className="inline" variant="outline">
          &ldquo;{comment.content}&rdquo;
        </Badge>
      )}
    </div>
  );
}

function SimilarEventsForSingleEvent({
  similarEvents,
}: {
  similarEvents: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
}) {
  return (
    <p className="whitespace-nowrap text-xs font-medium text-gray-500">
      Similar events by{" "}
      <SimilarEventsSummary similarEvents={similarEvents} singleEvent />
    </p>
  );
}

function SimilarEventsSummary({
  similarEvents,
  curatorUsername,
  singleEvent,
}: {
  similarEvents: {
    event: EventWithUser;
    similarityDetails: SimilarityDetails;
  }[];
  curatorUsername?: string;
  singleEvent?: boolean;
}) {
  // Create a map to group events by username
  const eventsByUser = new Map<string, EventWithUser[]>();

  // Iterate over similarEvents and populate the map
  similarEvents.forEach(({ event }) => {
    const userEvents = eventsByUser.get(event.User.username) || [];
    userEvents.push(event);
    eventsByUser.set(event.User.username, userEvents);
  });

  // Convert the map to an array of JSX elements
  const userEventLinks = Array.from(eventsByUser).map(
    ([username, events], index) => (
      <span key={username}>
        {/* {username !== curatorUsername && (
          <>
            {!singleEvent && ", "}
            <Link
              href={`${username}/events`}
              className="font-bold text-gray-900"
            >
              @{username}
            </Link>
          </>
        )} */}
        {events.map((event, eventIndex) => (
          <sup key={event.id}>
            <Link
              href={`/event/${event.id}`}
              className="font-bold text-gray-900"
            >
              {eventIndex + 1}
              {events.length > 1 && eventIndex !== events.length - 1 && ", "}
            </Link>
          </sup>
        ))}
      </span>
    )
  );

  return <> and others {userEventLinks}</>;
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
  const roles = user?.unsafeMetadata.roles as string[] | undefined;
  const isSelf = user?.id === User.id;
  const isOwner = isSelf || roles?.includes("admin");
  const isFollowing = !!FollowEvent.find((item) => item.userId === user?.id);
  const comment = props.Comment.findLast((item) => item.userId === user?.id);
  // always show curator if !isSelf
  const showOtherCurators = !isSelf && props.showOtherCurators;
  const showCurator = showOtherCurators || !props.hideCurator;
  console.log("event", event);

  return (
    <div className="relative mx-6 py-6">
      {visibility === "private" && (
        <>
          <Badge className="max-w-fit" variant="destructive">
            Unlisted Event
          </Badge>
        </>
      )}
      <div className="flex flex-col border-b border-gray-200 py-4">
        <div>
          <div className="text-sm font-bold uppercase text-gray-600">
            <EventDateDisplaySimple
              startDate={event.startDate}
              startTime={event.startTime}
              endTime={event.endTime}
              endDate={event.endDate}
            />
          </div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            {event.name}
          </h1>
          {event.location && (
            <Link
              className="mt-1 max-w-2xl border-b border-gray-200 text-sm text-gray-500 hover:border-gray-900 hover:text-gray-900"
              href={`https://www.google.com/maps/search/?api=1&query=${event.location}`}
            >
              📍 {event.location}
            </Link>
          )}
          <div className="p-1"></div>
          <EventCuratedBy
            username={User.username}
            comment={comment}
            similarEvents={props.similarEvents}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <ShareButton type="button" event={event} id={id} />
          <CalendarButton
            type="button"
            event={event}
            id={id}
            username={User.username}
          />
          <FollowEventButton eventId={id} following={isFollowing} />
        </div>
      </div>
      <div className="p-1"></div>
      <EventDescription
        description={event.description!}
        singleEvent={singleEvent}
      />
      <div className="absolute right-2 top-6">
        {isOwner && (
          <SignedIn>
            <EventActionButton
              User={User}
              event={event}
              id={id}
              isOwner={!!isOwner}
              isFollowing={isFollowing}
            />
          </SignedIn>
        )}
      </div>
    </div>
  );
}
