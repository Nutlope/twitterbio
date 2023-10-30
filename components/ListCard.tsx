import { clsx } from "clsx";
import Link from "next/link";

const colors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
];

const getInitialsFromString = (str: string) => {
  // limit to 2 initials
  const initials = str.match(/\b\w/g) || [];
  return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
};

const getRainbowColorFromString = (initials: string) => {
  return colors[initials.charCodeAt(0) % colors.length];
};

export default function ListCard(props: {
  name: string;
  id: string;
  count: number;
}) {
  return (
    <li>
      <Link
        href={`/list/${props.id}`}
        className="col-span-1 flex rounded-md shadow-sm"
      >
        <div
          className={clsx(
            getRainbowColorFromString(props.name),
            "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white"
          )}
        >
          {getInitialsFromString(props.name)}
        </div>
        <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-200 bg-white">
          <div className="flex-1 truncate px-4 py-2 text-sm">
            <p className="font-medium text-gray-900 hover:text-gray-600">
              {props.name}
            </p>
            <p className="text-gray-500">{props.count} events</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
