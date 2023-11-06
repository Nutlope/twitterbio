import { Suspense } from "react";
import EventsFromRawText from "./EventsFromRawText";
import Loading from "./Loading";

type Props = {
  params: {};
  searchParams: { rawText?: string };
};

export default function Page({ params, searchParams }: Props) {
  return (
    <>
      {searchParams.rawText && (
        <Suspense fallback={<Loading rawText={searchParams.rawText} />}>
          <EventsFromRawText rawText={searchParams.rawText} />
        </Suspense>
      )}
    </>
  );
}
