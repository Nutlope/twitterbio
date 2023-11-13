"use client";

import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useChat } from "ai/react";
import { trackGoal } from "fathom-client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Download, Share, Sparkles } from "lucide-react";
import { Form } from "@/components/Form";
import { Output } from "@/components/Output";
import {
  Status,
  cn,
  generatedIcsArrayToEvents,
  getLastMessages,
  reportIssue,
} from "@/lib/utils";
import { formatDataOnPaste } from "@/lib/turndown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddToCalendarCardSkeleton } from "@/components/AddToCalendarCardSkeleton";

function Code({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
    >
      {children}
    </code>
  );
}

export default function AddEvent() {
  // State variables
  const [issueStatus, setIssueStatus] = useState<Status>("idle");
  const [finished, setFinished] = useState(false);
  const [events, setEvents] = useState<AddToCalendarButtonType[] | null>(null);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);

  // Refs
  const eventRef = useRef<null | HTMLDivElement>(null);

  // Custom hooks and utility functions
  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    messages,
  } = useChat({
    body: {
      source: "text",
    },
    onFinish(message) {
      setFinished(true);
    },
  });

  const { lastUserMessage, lastAssistantMessage } = getLastMessages(messages);

  // Event handlers
  const handlePaste = async (e: any) => formatDataOnPaste(e, setInput);

  const onSubmit = (e: any) => {
    trackGoal("WBJDUXPZ", 1);
    setFinished(false);
    setTrackedAddToCalendarGoal(false);
    setIssueStatus("idle");
    handleSubmit(e);
  };

  // Effects
  useEffect(() => {
    if (finished) {
      const events = generatedIcsArrayToEvents(lastAssistantMessage);
      setEvents(events);
      if (events.length === 0) {
        toast.error(
          "Something went wrong. Add you event manually or try again."
        );
      }
      scrollToEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const isDev = process.env.NODE_ENV === "development";

  // Helper functions
  const scrollToEvents = () => {
    if (eventRef.current !== null) {
      eventRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-[60vh] ">
      <Tabs defaultValue="text" className="max-w-screen sm:max-w-xl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">
            <Sparkles className="mr-2 h-4 w-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="shortcut">
            <Sparkles className="mr-2 h-4 w-4" />
            Shortcut
          </TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <Card>
            <CardHeader>
              <CardTitle>Text</CardTitle>
              <CardDescription>
                Add an event by typing or pasting text in any format. We&apos;ll
                use a little AI to figure out the details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                handleInputChange={handleInputChange}
                handlePaste={handlePaste}
                input={input}
                isLoading={isLoading}
                onSubmit={onSubmit}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shortcut">
          <Card>
            <CardHeader>
              <CardTitle>Shortcut</CardTitle>
              <CardDescription>
                Add an event from the share menu on iOS or Mac. We&apos;ll use a
                little AI to figure out the details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a
                  href="https://www.icloud.com/shortcuts/1aecbd2ee98c42edb613642a1382e718"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Install timetime.cc shortcut
                </a>
              </Button>
              <div className="p-3"></div>
              <ol className="flex list-outside list-disc flex-col gap-2">
                <li>
                  Click button above, then click the <Code>Get Shortcut</Code>{" "}
                  button to add it to your devices.
                </li>
                <li>
                  Use{" "}
                  <Code>
                    <Share className="inline-block h-4 w-4" /> Share
                  </Code>{" "}
                  on any screenshot, photo, or text.
                </li>
                <li>
                  Scroll down to select <Code>Add event to timetime.cc</Code>.
                </li>
                <li>
                  Click <Code>Always Allow</Code> when prompted for permissions.
                </li>
                <li>
                  Choose <Code>New timetime.cc event</Code> from the share
                  options.
                </li>
                <li>
                  Edit the event draft and tap <Code>Save</Code>.
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <CardDescription className="italic">
                *Requires up-to-date software (iOS 17+/macOS 14+)
              </CardDescription>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Text</CardTitle>
              <CardDescription>
                Add an event manually by filling out a form.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Output
                events={[]}
                finished={true}
                isDev={isDev}
                issueStatus={issueStatus}
                setIssueStatus={setIssueStatus}
                lastAssistantMessage={"Manual entry"}
                lastUserMessage={"Manual entry"}
                hideErrorReporter={true}
                reportIssue={reportIssue}
                setEvents={setEvents}
                setTrackedAddToCalendarGoal={setTrackedAddToCalendarGoal}
                trackedAddToCalendarGoal={trackedAddToCalendarGoal}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div ref={eventRef}></div>
      {(finished || isLoading) && <div className="p-6"></div>}
      {isLoading && <AddToCalendarCardSkeleton />}
      <Output
        events={events}
        finished={finished}
        isDev={isDev}
        issueStatus={issueStatus}
        setIssueStatus={setIssueStatus}
        lastAssistantMessage={lastAssistantMessage}
        lastUserMessage={lastUserMessage}
        reportIssue={reportIssue}
        setEvents={setEvents}
        setTrackedAddToCalendarGoal={setTrackedAddToCalendarGoal}
        trackedAddToCalendarGoal={trackedAddToCalendarGoal}
      />
    </div>
  );
}
