"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AddToCalendarButton,
  AddToCalendarButtonType,
} from "add-to-calendar-button-react";
import { SaveButton } from "./SaveButton";

type AddToCalendarCardProps = AddToCalendarButtonType & {
  onClick: any;
  setAddToCalendarButtonProps: (props: AddToCalendarButtonType) => void;
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

  // load updatedProps from localStorage
  useEffect(() => {
    const data = localStorage.getItem("updatedProps");
    if (data) {
      setAddToCalendarButtonProps(JSON.parse(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-10 grid max-w-lg grid-cols-1 gap-x-6 gap-y-8 rounded-xl border bg-white p-4 shadow-md sm:grid-cols-6">
      <div
        className="col-span-full flex justify-center"
        onClick={initialProps?.onClick}
      >
        <AddToCalendarButton {...updatedProps} />
      </div>
      <div className="col-span-full">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Event
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              name="name"
              id="name"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-lg font-bold text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="col-span-full">
        <label
          htmlFor="startDate"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Start Date
        </label>
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
      <div className="col-span-full">
        <label
          htmlFor="endDate"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          End Date
        </label>
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
      <div className="col-span-full">
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Location
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              name="location"
              id="location"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="col-span-full">
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Description
        </label>
        <div className="mt-2">
          <textarea
            id="description"
            name="description"
            rows={4}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="col-span-full">
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Source Link (optional)
        </label>
        <div className="mt-2">
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="url"
              name="link"
              id="link"
              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>
        <SaveButton {...updatedProps} />
      </div>
    </div>
  );
}
