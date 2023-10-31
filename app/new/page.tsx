"use client";

import * as Bytescale from "@bytescale/sdk";
import { AddToCalendarButtonType } from "add-to-calendar-button-react";
import { useChat } from "ai/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Cropper, { Area } from "react-easy-crop";
import { Trash, Upload } from "lucide-react";
import { UploadButton } from "@bytescale/upload-widget-react";
import { Output } from "@/components/Output";
import {
  Status,
  generatedIcsArrayToEvents,
  getLastMessages,
  reportIssue,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";

const LOADING_TEXTS = [
  "Conjuring your event onto the calendar",
  "Waving our magic wand over your date",
  "Hold on, we're casting a calendar spell",
  "Performing a little time alchemy",
  "Summoning your event into existence",
  "Calendar wizardry in progress",
  "A dash of magic to schedule your event",
  "Hold tight, the calendar sorcerer is at work",
  "Sprinkling some calendar fairy dust",
  "Performing calendar magic, just for you",
  "Weaving your event into the fabric of time",
  "Just a flick and swish, and your event will appear",
  "Unveiling your event with a touch of magic",
  "Inventing moments with a bit of calendar magic",
  "Chanting the calendar incantations",
  "The calendar cauldron is bubbling",
  "Ready for some calendar enchantment?",
];

export default function Page() {
  // State variables
  const [chatFinished, setChatFinished] = useState(false);
  const [issueStatus, setIssueStatus] = useState<Status>("idle");
  const [events, setEvents] = useState<AddToCalendarButtonType[] | null>(null);
  const [loadingText, setLoadingText] = useState("Fetching events...");
  const [chatEvents, setChatEvents] = useState<
    AddToCalendarButtonType[] | null
  >(null);
  const [trackedAddToCalendarGoal, setTrackedAddToCalendarGoal] =
    useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropArea, setCropArea] = useState<Area>({
    x: 0,
    y: 0,
    width: 640,
    height: 1138,
  });

  // Hooks and utility functions
  const searchParams = useSearchParams();
  const { append, isLoading, messages } = useChat({
    onFinish(message) {
      setChatFinished(true);
    },
  });
  const { lastUserMessage, lastAssistantMessage } = getLastMessages(messages);

  // Query params and local storage
  const finished = searchParams.has("message");
  const message = searchParams.get("message") || "";
  const [filePath, setFilePath] = useState(searchParams.get("filePath") || "");
  const imageUrl = filePath
    ? Bytescale.UrlBuilder.url({
        accountId: "12a1yek",
        filePath: filePath,
        options: {
          transformation: "preset",
          transformationPreset: "jpg;w=640",
        },
      })
    : "";
  const saveIntent = searchParams.get("saveIntent") || "";
  let saveIntentEvent = null;
  if (typeof window !== "undefined") {
    // Perform localStorage action
    saveIntentEvent = localStorage.getItem("updatedProps");
  }
  const saveIntentEventJson = JSON.parse(saveIntentEvent || "{}");
  const rawText = searchParams.get("rawText") || "";
  const [randomLoadingText, setRandomLoadingText] = useState("");

  const whichEvents = saveIntent
    ? [saveIntentEventJson]
    : chatFinished
    ? chatEvents
    : events;

  // add image urls to events
  const eventsToUse =
    whichEvents?.map((event) => {
      return {
        ...event,
        images: imageUrl ? [imageUrl] : undefined,
      };
    }) || null;

  const setEventsToUse = chatFinished ? setChatEvents : setEvents;

  const onCropComplete = (croppedArea: any, croppedAreaPixels: Area) => {
    setCropArea(croppedAreaPixels);
  };

  // Effects
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * LOADING_TEXTS.length);
    setRandomLoadingText(LOADING_TEXTS[randomIndex]);
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  useEffect(() => {
    if (rawText) {
      append({ role: "user", content: rawText });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (finished) {
      const events = generatedIcsArrayToEvents(message);
      setEvents(events);
      if (events.length === 0) {
        toast.error(
          "Something went wrong. Add you event manually or try again."
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  useEffect(() => {
    if (chatFinished) {
      const events = generatedIcsArrayToEvents(lastAssistantMessage);
      if (events.length === 0) {
        toast.error(
          "Something went wrong. Add you event manually or try again."
        );
      }
      setChatEvents(events);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatFinished]);

  useEffect(() => {
    const loadingPhrases = [
      "Fetching events...",
      "Parsing with GPT-4...",
      "Generating ICS files...",
      "Almost there...",
      "Cleaning up...",
    ];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % loadingPhrases.length;
      setLoadingText(loadingPhrases[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <>
      <>
        <p className="block text-sm font-medium leading-6 text-gray-900">
          Image <span className="text-gray-500">(optional)</span>
        </p>
        <div className="relative h-64 w-36">
          {imageUrl && (
            <Cropper
              image={imageUrl}
              crop={crop}
              zoom={zoom}
              aspect={9 / 16}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="p-2"></div>
        <div className="flex gap-4">
          <UploadButton
            options={{
              apiKey: "public_12a1yekATNiLj4VVnREZ8c7LM8V8",
              editor: {
                images: {
                  crop: true,
                  cropRatio: 9 / 16,
                  preview: true,
                },
              },
            }}
            onComplete={(files) => {
              if (files.length > 0) {
                setFilePath(files[0].filePath);
              }
            }}
          >
            {({ onClick }) => (
              <Button onClick={onClick}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            )}
          </UploadButton>
          {imageUrl && (
            <Button variant="destructive" onClick={() => setFilePath("")}>
              <Trash className="mr-2 h-4 w-4" />
              Delete Image
            </Button>
          )}
        </div>
      </>
      {isLoading ? (
        <div className="flex flex-col items-center gap-8">
          <p className="text-xl font-semibold text-gray-500 sm:text-2xl">
            {loadingText}
          </p>
          <h1 className="text-center text-2xl font-semibold text-gray-900 sm:text-4xl">
            🪄 {randomLoadingText} ✨
          </h1>
          <span className="loading large">
            <span className="bg-gray-900" />
            <span className="bg-gray-900" />
            <span className="bg-gray-900" />
          </span>
        </div>
      ) : (
        <Output
          events={eventsToUse}
          finished={finished || !!saveIntent || chatFinished}
          isDev={isDev}
          issueStatus={issueStatus}
          setIssueStatus={setIssueStatus}
          lastAssistantMessage={chatFinished ? lastAssistantMessage : message}
          lastUserMessage={
            chatFinished ? lastUserMessage : "Generated from message"
          }
          reportIssue={reportIssue}
          setEvents={setEventsToUse}
          setTrackedAddToCalendarGoal={setTrackedAddToCalendarGoal}
          trackedAddToCalendarGoal={trackedAddToCalendarGoal}
        />
      )}
    </>
  );
}
