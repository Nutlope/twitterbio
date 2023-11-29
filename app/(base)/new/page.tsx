import { Suspense } from "react";
import { currentUser } from "@clerk/nextjs";
import AddEvent from "../AddEvent";
import EventsFromRawText from "./EventsFromRawText";
import ImageUpload from "./ImageUpload";
import EventsFromSaved from "./EventsFromSaved";
import { YourDetails } from "./YourDetails";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";
import { api } from "@/trpc/server";

export const maxDuration = 60;

type Props = {
  params: {};
  searchParams: { rawText?: string; saveIntent?: boolean; filePath?: string };
};

export default async function Page({ params, searchParams }: Props) {
  const user = await currentUser();
  const username = user?.username;
  const lists =
    username &&
    (await api.list.getAllForUser.query({
      userName: username,
    }));

  if (searchParams.saveIntent) {
    return (
      <>
        <YourDetails lists={lists || undefined} />
        <div className="p-4"></div>
        <Suspense fallback={<AddToCalendarCardSkeleton />}>
          <EventsFromSaved />
        </Suspense>
        <div className="p-4"></div>
        <ImageUpload />
      </>
    );
  }

  return (
    <>
      {!searchParams.rawText && (
        <>
          <Suspense>
            <AddEvent lists={lists || undefined} />
          </Suspense>
        </>
      )}
      {searchParams.rawText && (
        <>
          <YourDetails lists={lists || undefined} />
          <div className="p-4"></div>
          <ImageUpload filePath={searchParams.filePath} />
          <div className="p-4"></div>
        </>
      )}
      {searchParams.rawText && (
        <Suspense fallback={<AddToCalendarCardSkeleton />}>
          <EventsFromRawText rawText={searchParams.rawText} />
        </Suspense>
      )}
    </>
  );
}
