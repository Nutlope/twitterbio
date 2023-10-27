import React from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import RainbowText from "@/components/RainbowText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordian";

export default function Page() {
  return (
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        <RainbowText className="text-base font-semibold leading-7">
          Get Started
        </RainbowText>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Welcome to timetime.cc
        </h1>
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
          Our Vision
        </h2>
        <p
          className="mt-6 max-w-xl text-xl leading-8
        "
        >
          To enable individuals and groups to curate, share, and unite around
          events for fun and liberation, through a community-focused,
          non-extractive platform that easily integrates with digital calendars.
        </p>
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
          Two ways to add events
        </h2>
        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
          <li className="flex flex-col gap-4">
            <div className="flex gap-x-3">
              <CheckCircleIcon
                className="mt-1 h-5 w-5 flex-none text-gray-600"
                aria-hidden="true"
              />
              <span>
                <strong className="font-semibold text-gray-900">
                  iOS/MacOS Shortcut:{" "}
                </strong>
                Capture events from Instagram stories or anywhere else.{" "}
                <a
                  href="https://www.icloud.com/shortcuts/1aecbd2ee98c42edb613642a1382e718"
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download the shortcut here
                </a>
                .
              </span>
            </div>
            <Accordion type="multiple" className="-mt-4 w-full">
              <AccordionItem value="instructions" className="px-6 opacity-80">
                <AccordionTrigger>
                  <div className="flex gap-1.5">Instructions</div>
                </AccordionTrigger>
                <AccordionContent className="mx-6">
                  <ol className="flex list-outside list-decimal flex-col gap-4">
                    <li>
                      Visit{" "}
                      <a
                        href="https://www.icloud.com/shortcuts/1aecbd2ee98c42edb613642a1382e718"
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        this link
                      </a>{" "}
                      and click the <code>Get Shortcut</code> button to add it
                      to your devices.
                    </li>
                    <li>
                      Share text or an image to the shortcut. Use the share icon
                      from any screenshot, image, or selected text to invoke the
                      shortcut. Choose <code>New timetime.cc event</code> from
                      near the bottom of the list of options.
                    </li>
                    <li>
                      The shortcut will generate a calendar event draft that you
                      can modify as needed. Once you&apos;re satisfied, tap{" "}
                      <code>Save</code> to save it to your list of events.
                    </li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>

          <li className="flex gap-x-3">
            <CheckCircleIcon
              className="mt-1 h-5 w-5 flex-none text-gray-600"
              aria-hidden="true"
            />
            <span>
              <strong className="font-semibold text-gray-900">
                Manual Input:
              </strong>{" "}
              Create editable calendar events by pasting your event data. Add
              them to your list at your convenience.
            </span>
          </li>
        </ul>
        <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
          Customize, calendar, and share
        </h2>
        <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
          <li className="flex gap-x-3">
            <CheckCircleIcon
              className="mt-1 h-5 w-5 flex-none text-gray-600"
              aria-hidden="true"
            />
            <span>
              <strong className="font-semibold text-gray-900">
                Customize:
              </strong>{" "}
              timetime.cc will take your image or text and get you 90-100% of
              the way to a shareable calendar event, but you can edit it before
              saving
            </span>
          </li>
          <li className="flex gap-x-3">
            <CheckCircleIcon
              className="mt-1 h-5 w-5 flex-none text-gray-600"
              aria-hidden="true"
            />
            <span>
              <strong className="font-semibold text-gray-900">
                Add to calendar:
              </strong>{" "}
              Click the add to calendar button to add it to your calendar.
            </span>
          </li>
          <li className="flex gap-x-3">
            <CheckCircleIcon
              className="mt-1 h-5 w-5 flex-none text-gray-600"
              aria-hidden="true"
            />
            <span>
              <strong className="font-semibold text-gray-900">
                Share link:
              </strong>{" "}
              From your saved event page or your events list, use the share icon
              or copy the url to share with friends.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
