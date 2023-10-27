import React from "react";
import { CheckCircleIcon, CurrencyDollarIcon } from "@heroicons/react/20/solid";
import OnboardingContinueButton from "./OnboardingContinueButton";
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
        <p className="mt-6 max-w-xl text-xl leading-8">
          To allow individuals and organizations to easily curate, collect and
          share events in a way that allows for more cross-pollination,
          community, and coalition building towards our collective liberation,
          through a non-extractive and community-owned platform … and seamlessly
          integrate with our digital calendars.
        </p>
        <div className="bg-white pt-16">
          <RainbowText className="text-base font-semibold leading-7">
            Features
          </RainbowText>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Using timetime.cc
          </h2>
          <p className="mt-6 max-w-xl text-xl leading-8">
            At the core, timetime.cc is a way to collect, curate and share
            events, and seamlessly add them to your calendar.
          </p>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            Adding events
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
                        Share text or an image to the shortcut. Use the share
                        icon from any screenshot, image, or selected text to
                        invoke the shortcut. Choose{" "}
                        <code>New timetime.cc event</code> from near the bottom
                        of the list of options.
                      </li>
                      <li>
                        The shortcut will generate a calendar event draft that
                        you can modify as needed. Once you&apos;re satisfied,
                        tap <code>Save</code> to save it to your list of events.
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
                  Paste Event Details:
                </strong>{" "}
                Create editable calendar events by pasting event data in any
                format from the home page.
              </span>
            </li>
          </ul>
          <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
            Customize, Calendar, and Share
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
                the way to a shareable calendar event, but you can edit it
                before saving
              </span>
            </li>
            <li className="flex gap-x-3">
              <CheckCircleIcon
                className="mt-1 h-5 w-5 flex-none text-gray-600"
                aria-hidden="true"
              />
              <span>
                <strong className="font-semibold text-gray-900">
                  Add to Calendar:
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
                  Share Links:
                </strong>{" "}
                From your saved event page or your events list, use the share
                icon or copy the url to share with friends.
              </span>
            </li>
          </ul>
        </div>
        <div className="bg-white pt-16">
          <div className="mx-auto max-w-xl text-base leading-7 text-gray-700">
            <RainbowText className="text-base font-semibold leading-7">
              Transparency
            </RainbowText>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Building in Public
            </h2>
            <p className="mt-6 text-xl leading-8">
              We believe in the power of transparency and community engagement.
              That&apos;s why we&apos;re building in public, open-source,
              towards community ownership.
            </p>
            <h3 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
              Business Model
            </h3>
            <p className="mt-6">
              We want are exploring sources of revenue that support our goal of
              community ownership. Our three best ideas:
            </p>
            <ul role="list" className="mt-8 max-w-xl space-y-8 text-gray-600">
              <li className="flex gap-x-3">
                <CurrencyDollarIcon
                  className="mt-1 h-5 w-5 flex-none text-gray-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Members Support Curators:
                  </strong>{" "}
                  timetime.cc users can financially support event curators
                  through tips/subscriptions, and timetime.cc takes a cut to
                  support development.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CurrencyDollarIcon
                  className="mt-1 h-5 w-5 flex-none text-gray-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Free/Supporter Monthly Subscriptions:
                  </strong>{" "}
                  Some features are just available to paying members. We want
                  most members to be able to use timetime.cc for free, so this
                  would be more advanced features or customizations.
                </span>
              </li>
              <li className="flex gap-x-3">
                <CurrencyDollarIcon
                  className="mt-1 h-5 w-5 flex-none text-gray-600"
                  aria-hidden="true"
                />
                <span>
                  <strong className="font-semibold text-gray-900">
                    Commercial Events:
                  </strong>{" "}
                  We could find ways to monetize larger, commercial events to
                  make timetime.cc free for smaller or non-commercial events.
                </span>
              </li>
            </ul>
            <h3 className="mt-12 text-2xl font-bold tracking-tight text-gray-900">
              Collaborative Open Source
            </h3>
            <p className="mt-6">
              timetime.cc is more than a platform; it&apos;s a collaborative
              endeavor. We&apos;re open-source, meaning{" "}
              <a
                href="https://www.icloud.com/shortcuts/1aecbd2ee98c42edb613642a1382e718"
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                our codebase is publicly available
              </a>{" "}
              , allowing anyone to contribute, inspect, or adapt it.
            </p>
          </div>
        </div>
        <OnboardingContinueButton />
      </div>
    </div>
  );
}
