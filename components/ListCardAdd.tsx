import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { clsx } from "clsx";
import Link from "next/link";

export default function ListCardAdd() {
  return (
    <Link
      href={`/list/new`}
      className="group col-span-1 flex rounded-md shadow-sm"
    >
      <div
        className={clsx(
          "bg-gray-900 group-hover:bg-gray-600",
          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white h-full"
        )}
      >
        <PlusCircleIcon className="h-6 w-6" />
      </div>
      <div className="flex h-full flex-1 items-center truncate rounded-r-md border-y border-r border-dashed border-gray-200 bg-white">
        <div className="flex-initial truncate px-4 py-2 text-sm">
          <p className="font-medium text-gray-900 group-hover:text-gray-600">
            New List
          </p>
          <p className="text-gray-500">Organize events</p>
        </div>
      </div>
    </Link>
  );
}
