import { Suspense } from "react";
import AddEvent from "../AddEvent";
import EventsFromRawText from "./EventsFromRawText";
import Loading from "./Loading";
import ImageUpload from "./ImageUpload";

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
          <Suspense fallback={<Loading rawText={searchParams.rawText} />}>
            <EventsFromRawText rawText={searchParams.rawText} />
          </Suspense>
        </>
      )}
    </>
  );
}
