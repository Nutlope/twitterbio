import { Loader2 } from "lucide-react";
import { InputDescription } from "./ui/input";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Label } from "./ui/label";

export function AddToCalendarCardSkeleton() {
  return (
    <Card className="max-w-screen sm:max-w-xl">
      <CardContent className="grid grid-cols-1 gap-6 py-6 shadow-md sm:grid-cols-6">
        <CardTitle className="col-span-full flex items-center justify-between">
          Event Details <Loader2 className="h-6 w-6 animate-spin" />
        </CardTitle>
        <div className="col-span-full">
          <Label htmlFor="name">Event</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="col-span-full">
          <Label htmlFor="startDate">Start Date</Label>
          <Skeleton className="h-[26px] w-[250px]" />
        </div>
        <div className="col-span-full">
          <Label htmlFor="endDate">End Date</Label>
          <Skeleton className="h-[26px] w-[250px]" />
        </div>
        <div className="col-span-full">
          <Label htmlFor="location">Location</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="col-span-full">
          <Label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </Label>
          <Skeleton className="h-[138px] w-full" />
          <div className="p-0.5"></div>
          <InputDescription>
            Uses html psuedocode for formatting. [br] = line break,
            [url]link|link.com[/url] = link.{" "}
            <a
              href="https://add-to-calendar-button.com/configuration#:~:text=for%20Microsoft%20services.-,description,-String"
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 underline"
            >
              More info
            </a>
          </InputDescription>
        </div>
        <div className="col-span-full">
          <Label htmlFor="location">Source Link (optional)</Label>
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-[104px]" />
          <Skeleton className="h-10 w-[162px]" />
        </div>
      </CardContent>
    </Card>
  );
}
