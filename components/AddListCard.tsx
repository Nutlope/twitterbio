"use client";

import React, { useMemo, useState } from "react";
import ListSaveButton from "./ListSaveButton";
import ListUpdateButton from "./ListUpdateButton";

type AddListCardProps = {
  name: string;
  description: string;
  update?: boolean;
  updateId?: string;
  afterSuccess?: string;
};

export default function AddListCard({ ...initialProps }: AddListCardProps) {
  const [name, setName] = useState(initialProps.name);
  const [description, setDescription] = useState(initialProps.description);

  const updatedProps = useMemo(
    () => ({
      name,
      description,
    }),
    [name, description]
  );

  return (
    <div className="mt-10 grid max-w-xl grid-cols-1 gap-x-6 gap-y-8 rounded-xl border bg-white p-4 shadow-md sm:grid-cols-6">
      <div className="col-span-full">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          List
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
        {!initialProps.update && (
          <ListSaveButton
            afterSuccess={initialProps.afterSuccess}
            {...updatedProps}
          />
        )}
        {initialProps.update && (
          <ListUpdateButton id={initialProps.updateId!} {...updatedProps} />
        )}
      </div>
    </div>
  );
}
