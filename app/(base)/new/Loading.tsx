"use client";

import { useEffect, useState } from "react";

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

const PROGRESS_TEXTS = [
  "Braiding time's threads...",
  "Cosmic wheels turning...",
  "Sands of time flowing...",
  "Weaving moments together...",
  "Time's fabric stretching...",
  "Ticking towards togetherness...",
  "Futures unfolding now...",
  "Aligning celestial patterns...",
  "Shaping moments meticulously...",
  "Orchestrating temporal symphony...",
  "Chronology falling into place...",
  "Navigating temporal streams...",
  "Warping through time zones...",
  "Sequencing historical sequences...",
  "Crafting the future carefully...",
];

export default function Loading({ rawText }: { rawText: string }) {
  // State variables
  const [loadingText, setLoadingText] = useState(
    "Sketching temporal canvas..."
  );

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % PROGRESS_TEXTS.length;
      setLoadingText(PROGRESS_TEXTS[index]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // base on rawText length, pick a random loading text
  const randomLoadingText =
    LOADING_TEXTS[rawText.length % LOADING_TEXTS.length];

  return (
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
  );
}
