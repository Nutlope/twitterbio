import { Suspense } from "react";
import EventsFromRawText from "./EventsFromRawText";
import Loading from "./Loading";

export const maxDuration = 60;

type Props = {
  params: {};
  searchParams: { rawText?: string };
};

export default function Page({ params, searchParams }: Props) {
  return (
    <div>
      {searchParams.rawText && (
        <Suspense fallback={<Loading rawText={searchParams.rawText} />}>
          <EventsFromRawText rawText={searchParams.rawText} />
        </Suspense>
      )}
    </div>
  );
}
