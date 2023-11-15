"use client";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
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
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      onSubmit(event);
    }
  };

  return (
    <form className="grid w-full max-w-xl gap-1.5" onSubmit={onSubmit}>
      <Label htmlFor="input">
        Paste event info{" "}
        <span className="text-slate-500">(or describe your event)</span>.
      </Label>
      <Textarea
        id="input"
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        value={input}
        onChange={handleInputChange}
        rows={6}
        placeholder={
          "A description from a website, a text message, your words..."
        }
      />
      {!isLoading && (
        <>
          <Button type="submit">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate your event
          </Button>
          <p className="mt-4 text-center">
            <span className="text-slate-500">
              Or look at a sample{" "}
              <a
                href="/event/cloqaw5z80001l8086s39cxk3"
                className="font-bold text-slate-900"
              >
                event
              </a>{" "}
              or{" "}
              <Link
                href="/jaronheard/events"
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
              You can add other details while event details are being generated.
            </span>
          </p>
        </>
      )}
    </form>
  );
}
