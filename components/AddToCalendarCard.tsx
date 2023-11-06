"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AddToCalendarButton,
  AddToCalendarButtonType,
} from "add-to-calendar-button-react";
import { SaveButton } from "./SaveButton";
import { UpdateButton } from "./UpdateButton";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";

type AddToCalendarCardProps = AddToCalendarButtonType & {
  update?: boolean;
  updateId?: string;
  onClick?: any;
  children?: React.ReactNode;
  setAddToCalendarButtonProps?: (props: AddToCalendarButtonType) => void;
};

export function AddToCalendarCard({
  setAddToCalendarButtonProps: setAddToCalendarButtonProps,
  ...initialProps
}: AddToCalendarCardProps) {
  const [name, setName] = useState(initialProps.name);
  const [location, setLocation] = useState(initialProps.location);
  const [description, setDescription] = useState(initialProps.description);
  const [startDate, setStartDate] = useState(initialProps.startDate);
  const [startTime, setStartTime] = useState(initialProps.startTime);
  const [endDate, setEndDate] = useState(initialProps.endDate);
  const [endTime, setEndTime] = useState(initialProps.endTime);
  const [link, setLink] = useState("");

  const updatedProps = useMemo(
    () => ({
      ...initialProps,
      name,
      location,
      description: link
        ? description + "\n\n" + `[url]${link}|More Info[/url]`
        : description,
      startDate,
      startTime,
      endDate,
      endTime,
    }),
    [
      initialProps,
      name,
      location,
      link,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
    ]
  );

  // save updatedProps to localStorage
  useEffect(() => {
    localStorage.setItem("updatedProps", JSON.stringify(updatedProps));
  }, [updatedProps]);

  // // load updatedProps from localStorage
  // useEffect(() => {
  //   const data = localStorage.getItem("updatedProps");
  //   if (data) {
  //     setAddToCalendarButtonProps(JSON.parse(data));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Card className="">
      <CardContent className="grid max-w-lg grid-cols-1 gap-6 py-4 shadow-md sm:grid-cols-6">
        <div
          className="col-span-full flex justify-center"
          onClick={initialProps?.onClick}
        >
          {initialProps.children || <AddToCalendarButton {...updatedProps} />}
        </div>
        <div className="col-span-full">
          <Label htmlFor="name">Event</Label>
          <Input
            type="text"
            name="name"
            id="name"
            className="font-bold"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="startDate">Start Date</Label>
          <div>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="time"
              name="startTime"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="endDate">Start Date</Label>
          <div>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <input
              type="time"
              name="endTime"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="col-span-full">
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-span-full">
          <Label
            htmlFor="description"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="location">Source Link (optional)</Label>
          <Input
            type="url"
            name="link"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="col-span-full">
          {!initialProps.update && <SaveButton {...updatedProps} />}
          {initialProps.update && (
            <UpdateButton id={initialProps.updateId!} {...updatedProps} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
