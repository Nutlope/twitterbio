// interface DropDownProps {
//     value: string | undefined;
//     options: { value: string; label: string }[]  | undefined;
//     onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
// }

// export default function DropDownNew({ value, options, onChange }: DropDownProps) {
//     return (
        
//         <select value={value} onChange={onChange}>
//             {options && options.map((option) => (
//                 <option key={option.value} value={option.value}>
//                     {option.label}
//                 </option>
//             ))}
//         </select>
//     );
// };


import { Menu, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

// type vibeType = "Professional" | "Casual" | "Funny";

// interface DropDownProps {
//   vibe: "Professional" | "Casual" | "Funny";
//   setVibe: (vibe: vibeType) => void;
// }

// let vibes: vibeType[] = ["Professional", "Casual", "Funny"];

interface FormData {
    [key: string]: string | undefined;
  }

  
interface DropDownProps {
  value: string | undefined;
  name: string;
  options: { value: string; label: string }[]  | undefined;
  formData: FormData
  setFormData: (newFormData: FormData) => void;
}

export default function DropDown({ value, name, options, formData, setFormData }: DropDownProps) {
  return (
    <Menu as="div" className="relative block text-left w-full">
      <div>
        <Menu.Button className="inline-flex w-full justify-between items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
          {value}
          <ChevronUpIcon
            className="-mr-1 ml-2 h-5 w-5 ui-open:hidden"
            aria-hidden="true"
          />
          <ChevronDownIcon
            className="-mr-1 ml-2 h-5 w-5 hidden ui-open:block"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className="absolute left-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          key={value}
        >
          <div className="">
            {options && options.map((option) => (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => { setFormData({ ...formData, [name]: option.value });
                }}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      value === option.value ? "bg-gray-200" : "",
                      "px-4 py-2 text-sm w-full text-left flex items-center space-x-2 justify-between"
                    )}
                  >
                    <span>{option.value}</span>
                    {value === option.value ? (
                      <CheckIcon className="w-4 h-4 text-bold" />
                    ) : null}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}


