import { Suspense } from "react";
import AddEvent from "../AddEvent";
import EventsFromRawText from "./EventsFromRawText";
import ImageUpload from "./ImageUpload";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";

export const maxDuration = 60;

type Props = {
  params: {};
  searchParams: { rawText?: string };
};

export default function Page({ params, searchParams }: Props) {
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
          <ImageUpload />
          <div className="p-4"></div>
          <Suspense fallback={<AddToCalendarCardSkeleton />}>
            <EventsFromRawText rawText={searchParams.rawText} />
          </Suspense>
        </>
      )}
    </>
  );
}
