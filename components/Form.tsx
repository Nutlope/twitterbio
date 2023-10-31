"use client";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { FormLabel } from "./ui/form";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

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
    <form className="grid w-full max-w-xl gap-1.5" onSubmit={onSubmit}>
      <Label htmlFor="input">
        Paste event info{" "}
        <span className="text-slate-500">(or describe your event)</span>.
      </Label>
      <Textarea
        id="input"
        onPaste={handlePaste}
        value={input}
        onChange={handleInputChange}
        rows={6}
        placeholder={
          "Paste a description from a website, a text message from a friend, or anything else. Or you can describe your event."
        }
      />
      {!isLoading && (
        <>
          <Button type="submit">Generate your event &rarr;</Button>
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
          <Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
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
