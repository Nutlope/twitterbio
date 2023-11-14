import { Suspense } from "react";
import AddEvent from "../AddEvent";
import EventsFromRawText from "./EventsFromRawText";
import ImageUpload from "./ImageUpload";
import EventsFromSaved from "./EventsFromSaved";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";

export const maxDuration = 60;

type Props = {
  params: {};
  searchParams: { rawText?: string; saveIntent?: boolean };
};

export default function Page({ params, searchParams }: Props) {
  if (searchParams.saveIntent) {
    return (
      <>
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
            <AddEvent />
          </Suspense>
        </>
      )}
      {searchParams.rawText && (
        <>
          <Suspense fallback={<AddToCalendarCardSkeleton />}>
            <EventsFromRawText rawText={searchParams.rawText} />
          </Suspense>
          <div className="p-4"></div>
          <ImageUpload />
        </>
      )}
    </>
  );
}
