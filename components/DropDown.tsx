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

export type VibeType = "Professional" | "Casual" | "Funny";

interface DropDownProps {
  vibe: VibeType;
  setVibe: (vibe: VibeType) => void;
}

let vibes: VibeType[] = ["Professional", "Casual", "Funny"];

export default function DropDown({ vibe, setVibe }: DropDownProps) {
  return (
    <Menu as="div" className="relative block text-left w-full">
      <div>
        <Menu.Button 
          className="inline-flex w-full justify-between items-center rounded-xl 
                     px-4 py-3 text-lg shadow-custom hover-scale
                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)',
            border: '2px solid'
          }}
        >
          {vibe}
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
          className="absolute left-0 z-10 mt-2 w-full origin-top-right 
                     rounded-xl shadow-custom-lg ring-1 ring-gray-300 ring-opacity-5 
                     focus:outline-none overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-secondary)'
          }}
          key={vibe}
        >
          <div>
            {vibes.map((vibeItem) => (
              <Menu.Item key={vibeItem}>
                {({ active }) => (
                  <button
                    onClick={() => setVibe(vibeItem)}
                    className={classNames(
                      "px-4 py-3 text-lg w-full text-left flex items-center space-x-2 justify-between transition-colors duration-200",
                      active ? "opacity-80" : "",
                      vibe === vibeItem ? "font-semibold" : ""
                    )}
                    style={{
                      backgroundColor: active ? 'var(--bg-tertiary)' : 'transparent',
                      color: vibe === vibeItem ? 'var(--accent-primary)' : 'var(--text-primary)'
                    }}
                  >
                    <span>{vibeItem}</span>
                    {vibe === vibeItem ? (
                      <CheckIcon 
                        className="w-5 h-5" 
                        style={{ color: 'var(--accent-primary)' }}
                      />
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
