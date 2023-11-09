"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/Accordian";

export default function EventsError({
  rawText,
  response,
}: {
  rawText: string;
  response?: any;
}) {
  return (
    <Accordion type="single" collapsible className="max-w-full">
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="flex gap-2 rounded-md bg-red-50 p-4">
          <div>Magic event didn&apos;t work 🥲</div>
        </AccordionTrigger>
        <AccordionContent>
          {/* display raw text in code style */}
          <div className="rounded-md bg-gray-100 p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Raw text:</span> {rawText}
            </p>
            {response && (
              <>
                <div className="p-1"></div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Magic response:</span>{" "}
                  {`${response}`}
                </p>
              </>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
