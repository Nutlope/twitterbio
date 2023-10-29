"use client";
import Link from "next/link";

export function Form({
  handleInputChange,
  handlePaste,
  input,
  isLoading,
  onSubmit,
}: {
  handleInputChange: (e: any) => void;
  handlePaste: (e: any) => Promise<void>;
  input: string;
  isLoading: boolean;
  onSubmit: (e: any) => void;
}) {
  return (
    <form className="w-full max-w-xl" onSubmit={onSubmit}>
      <div className="mt-10 flex items-center space-x-3">
        <p className="text-left font-medium">
          Paste event info{" "}
          <span className="text-slate-500">(or describe your event)</span>.
        </p>
      </div>
      <textarea
        onPaste={handlePaste}
        value={input}
        onChange={handleInputChange}
        rows={6}
        className="my-5 w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        placeholder={
          "Paste a description from a website, a text message from a friend, or anything else. Or you can describe your event."
        }
      />
      {!isLoading && (
        <>
          <button
            className="mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
            type="submit"
          >
            Generate your event &rarr;
          </button>
          <p className="mt-4 text-center">
            <span className="text-slate-500">
              Or look at a sample{" "}
              <a href="/event/4" className="font-bold text-slate-900">
                event
              </a>{" "}
              or{" "}
              <Link
                href="/user_2X9kPFHoj4O6EHsHDTHRsbxyS8X/events"
                className="font-bold text-slate-900"
              >
                list
              </Link>{" "}
              or{" "}
              <Link href="/onboarding" className="font-bold text-slate-900">
                learn more
              </Link>
              .
            </span>
          </p>
        </>
      )}
      {isLoading && (
        <>
          <button
            className="mt-8 w-full rounded-xl bg-black px-4 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
            disabled
          >
            <span className="loading">
              <span className="bg-white" />
              <span className="bg-white" />
              <span className="bg-white" />
            </span>
          </button>
          <div className="p-1"></div>
          <p className="text-center">
            <span className="text-slate-500">
              ⏳ Be patient, takes ~5 seconds/event.
            </span>
          </p>
        </>
      )}
    </form>
  );
}
