"use client";

import React, { useState } from "react";
import {
  AddToCalendarButton,
  AddToCalendarButtonType,
} from "add-to-calendar-button-react";

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

  const updatedProps = {
    ...initialProps,
    name,
    location,
    description,
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 border max-w-lg mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
              className="block text-lg font-bold flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-500 col-span-full">
        📅 {initialProps.startDate} {initialProps.startTime} -{" "}
        {initialProps.endDate} {initialProps.endTime}
      </p>
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
      <div
        className="col-span-full flex justify-center"
        onClick={initialProps?.onClick}
      >
        <AddToCalendarButton {...updatedProps} />
      </div>
    </div>
  );
}