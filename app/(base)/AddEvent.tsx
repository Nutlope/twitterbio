"use client";

import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useChat } from "ai/react";
import { trackGoal } from "fathom-client";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Form } from "@/components/Form";
import { Output } from "@/components/Output";
import {
  Status,
  generatedIcsArrayToEvents,
  getLastMessages,
  reportIssue,
} from "@/lib/utils";
import { formatDataOnPaste } from "@/lib/turndown";

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
    <>
      <Form
        handleInputChange={handleInputChange}
        handlePaste={handlePaste}
        input={input}
        isLoading={isLoading}
        onSubmit={onSubmit}
      />
      <div ref={eventRef}></div>
      {finished && <div className="p-6"></div>}
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
    </>
  );
}

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

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="account">Text</TabsTrigger>
        <TabsTrigger value="password">iOS Shortcut</TabsTrigger>
        <TabsTrigger value="password">Image</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
