"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <div className="rounded-lg bg-indigo-50 py-4">
      <div className="w-full px-6 lg:flex lg:items-center lg:justify-between lg:px-8">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          Curious to learn more?
          <br />
          Book a free 1-1 intro call.
        </h2>
        <div className="mt-2 flex items-center gap-x-6 lg:mt-0 lg:shrink-0">
          <CTAButton />
        </div>
      </div>
    </div>
  );
}

export function CTAButton() {
  return (
    <Button asChild>
      <a
        href="https://calendly.com/jaronheard/timetime"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="mr-2">🌈</span> Let us show you how
      </a>
    </Button>
  );
}
