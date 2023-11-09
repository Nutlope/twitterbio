import { Suspense } from "react";
import { CalendarPlus, List, Megaphone, Share, Users, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NextEvents from "@/components/NextEvents";
import { cn } from "@/lib/utils";
import RainbowText from "@/components/RainbowText";
import makingEarthCool from "@/assets/making-earth-cool.jpeg";

const features = [
  {
    name: "Find & Add Events",
    description:
      "Discover events from other curators or add your own in just a few clicks. AI simplifies the process, making event curation quick and easy.",
    href: "#",
    icon: CalendarPlus,
  },
  {
    name: "Curate Event Lists",
    description:
      "Organize events into useful, shareable lists. Follow others curators for an event feed personalized to  your interests and the communities you care about.",
    href: "#",
    icon: List,
  },
  {
    name: "Share & Sync",
    description:
      "Easily share events and lists with others via a simple web link anyone can use. Add events or lists to your personal calendar with a click.",
    href: "#",
    icon: Share,
  },
];

const advancedFeatures = [
  {
    name: "Community First",
    description:
      "Be part of a community where value is shared, from our business model to financially supporting curators.",
    icon: Users,
  },
  {
    name: "Curator Empowerment",
    description:
      "Elevate, recognize, and value curators with tools that amplify their contributions to communities.",
    icon: Megaphone,
  },
  {
    name: "Instant Connection",
    description:
      "Leverage AI to swiftly create and share events, and get back to getting together faster.",
    icon: Zap,
  },
];

const featuredTestimonial = {
  body: "As an organizer of dance parties and environmental justice activist, I've been dreaming of making event lists this easy for years!",
  author: {
    name: "Sarah Baker",
    handle: "boogiebuffet",
    imageUrl:
      "https://www.timetime.cc/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWEJKQ0oxZDdVc05BcW9tUHhielljR0t0QmQifQ&w=750&q=75",
    logoUrl: makingEarthCool.src,
  },
};
const testimonials = [
  [
    [
      {
        body: "Screenshotting an Instagram story and turning it into a calendar event on the open web in seconds feels like getting away with something!",
        author: {
          name: "Jaron Heard",
          handle: "jaronheard",
          imageUrl:
            "https://www.timetime.cc/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWERpc3hISWJyWkZFOUFJV3VrZ21vRkJNcnAifQ&w=750&q=75",
        },
      },
      // More testimonials...
    ],
    [
      {
        body: "The commitment to community and collective growth is evident, and I'm here for it.",
        author: {
          name: "jennifer batchelor",
          handle: "jennybatch",
          imageUrl:
            "https://www.timetime.cc/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWE45MmZWcW5PdUE2T0VCalVBMVRRM3ViaEMifQ&w=750&q=75",
        },
      },
      // More testimonials...
    ],
  ],
  [
    [
      {
        body: "The personal calendar sync feature is brilliant – it keeps me organized and connected with my community's activities.",
        author: {
          name: "Josh Carr",
          handle: "joshcarr",
          imageUrl:
            "https://www.timetime.cc/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWEJJUDFzTW9JWmN4eURvU3JISERnTDFpbTQifQ&w=750&q=75",
        },
      },
      // More testimonials...
    ],
    [
      {
        body: "Even in these early stages, the vision for how this can benefit communities is clear and it's exciting to be part of.",
        author: {
          name: "Jenny M Ng",
          handle: "jenny",
          imageUrl:
            "https://www.timetime.cc/_next/image?url=https%3A%2F%2Fimg.clerk.com%2FeyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yWHJ6Smw3NWE3ckVUY0F5R2tjWW5lTWdteTkifQ&w=750&q=75",
        },
      },
      // More testimonials...
    ],
  ],
];

export default function Page() {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Clarifying our vision and intention.{" "}
              <a href="#" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div> */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Curate calendars, cultivate communities
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join us in reimagining how we discover, remember, and share
              events.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild>
                <a
                  href="https://calendly.com/jaronheard/timetime"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="mr-2">🌈</span> Let us show you how
                </a>
              </Button>
              <Button variant="link" asChild>
                <Link href="/old-landing">
                  Explore <span aria-hidden="true">→</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-red-500 via-orange-500 to-yellow-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <RainbowText className="text-base font-semibold leading-7 text-indigo-600">
              Gather around shared interests
            </RainbowText>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Calendars as common ground
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Easily discover, curate, and share events that bring us together.
              Join a network of passionate curators and participants building
              community around events that matter.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <feature.icon
                      className="h-5 w-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <div className="overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
            <div className="px-6 lg:px-0 lg:pr-4 lg:pt-4">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
                <RainbowText className="text-base font-semibold leading-7 text-indigo-600">
                  Amplify community
                </RainbowText>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Building togetherness
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  We&apos;re building an ecosystem that simplifies discovering,
                  sharing, and engaging with events. It&apos;s a space where
                  everyone has the power and tools to contribute to our shared
                  calendars and build community.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {advancedFeatures.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900">
                        <feature.icon
                          className="absolute left-1 top-1 h-5 w-5 text-gray-600"
                          aria-hidden="true"
                        />
                        {feature.name}.
                      </dt>{" "}
                      <dd className="inline">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="sm:px-6 lg:px-0">
              <div className="relative isolate overflow-hidden bg-gradient-to-br from-green-500/10 via-blue-500/10 to-indigo-500/10 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pl-16 sm:pr-0 sm:pt-16 lg:mx-0 lg:max-w-none">
                <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                  <Suspense>
                    <NextEvents limit={3} />
                  </Suspense>
                  <div className="p-4"></div>
                </div>
                <div
                  className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative isolate bg-white pb-32 pt-24 sm:pt-32">
        <div
          className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-30 blur-3xl"
          aria-hidden="true"
        >
          <div
            className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div
          className="absolute inset-x-0 top-0 -z-10 flex transform-gpu overflow-hidden pt-32 opacity-25 blur-3xl sm:pt-40 xl:justify-end"
          aria-hidden="true"
        >
          <div
            className="ml-[-22rem] aspect-[1313/771] w-[82.0625rem] flex-none origin-top-right rotate-[30deg] bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 xl:ml-0 xl:mr-[calc(50%-12rem)]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <RainbowText className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">
              Testimonials
            </RainbowText>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              People are already excited
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              *Not real quotes, but they could be!
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-gray-900 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
            <figure className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 sm:col-span-2 xl:col-start-2 xl:row-end-1">
              <blockquote className="p-6 text-lg font-semibold leading-7 tracking-tight text-gray-900 sm:p-12 sm:text-xl sm:leading-8">
                <p>{`“${featuredTestimonial.body}”`}</p>
              </blockquote>
              <figcaption className="flex flex-wrap items-center gap-4 border-t border-gray-900/10 px-6 py-4 sm:flex-nowrap">
                <img
                  className="h-10 w-10 flex-none rounded-full bg-gray-50"
                  src={featuredTestimonial.author.imageUrl}
                  alt=""
                />
                <div className="flex-auto">
                  <div className="font-semibold">
                    {featuredTestimonial.author.name}
                  </div>
                  <div className="text-gray-600">{`@${featuredTestimonial.author.handle}`}</div>
                </div>
                <img
                  className="h-10 w-auto flex-none rounded-full"
                  src={featuredTestimonial.author.logoUrl}
                  alt=""
                />
              </figcaption>
            </figure>
            {testimonials.map((columnGroup, columnGroupIdx) => (
              <div
                key={columnGroupIdx}
                className="space-y-8 xl:contents xl:space-y-0"
              >
                {columnGroup.map((column, columnIdx) => (
                  <div
                    key={columnIdx}
                    className={cn(
                      (columnGroupIdx === 0 && columnIdx === 0) ||
                        (columnGroupIdx === testimonials.length - 1 &&
                          columnIdx === columnGroup.length - 1)
                        ? "xl:row-span-2"
                        : "xl:row-start-1",
                      "space-y-8"
                    )}
                  >
                    {column.map((testimonial) => (
                      <figure
                        key={testimonial.author.handle}
                        className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-900/5"
                      >
                        <blockquote className="text-gray-900">
                          <p>{`“${testimonial.body}”`}</p>
                        </blockquote>
                        <figcaption className="mt-6 flex items-center gap-x-4">
                          <img
                            className="h-10 w-10 rounded-full bg-gray-50"
                            src={testimonial.author.imageUrl}
                            alt=""
                          />
                          <div>
                            <div className="font-semibold">
                              {testimonial.author.name}
                            </div>
                            <div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
                          </div>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Curious to learn more?
              <br />
              Book a free 1-1 intro call.
            </h2>
            <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
              <Button asChild>
                <a
                  href="https://calendly.com/jaronheard/timetime"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="mr-2">🌈</span> Let us show you how
                </a>
              </Button>
              <a
                href="#"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                <Button variant="link" asChild>
                  <Link href="/old-landing">
                    Explore <span aria-hidden="true">→</span>
                  </Link>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <footer>
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav
            className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
            aria-label="Footer"
          >
            {footerNavigation.main.map((item) => (
              <div key={item.name} className="pb-6">
                <a
                  href={item.href}
                  className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </a>
              </div>
            ))}
          </nav>
          <div className="mt-10 flex justify-center space-x-10">
            {footerNavigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-10 text-center text-xs leading-5 text-gray-500">
            &copy; 2023 timetime.cc. All rights reserved.
          </p>
        </div>
      </footer> */}
    </div>
  );
}
