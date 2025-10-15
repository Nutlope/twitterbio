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
          className="inline-flex w-full justify-between items-center rounded-2xl 
                     px-6 py-4 text-lg shadow-custom hover-scale
                     transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
                     glass-anamorphic"
          style={{
            color: 'var(--text-primary)'
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
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95 translate-y-[-10px]"
        enterTo="transform opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="transform opacity-100 scale-100 translate-y-0"
        leaveTo="transform opacity-0 scale-95 translate-y-[-10px]"
      >
        <Menu.Items
          className="absolute left-0 z-10 mt-3 w-full origin-top-center 
                     rounded-2xl shadow-custom-lg glass-anamorphic
                     focus:outline-none overflow-hidden backdrop-blur-xl"
          key={vibe}
        >
          <div>
            {vibes.map((vibeItem, index) => (
              <Menu.Item key={vibeItem}>
                {({ active }) => (
                  <button
                    onClick={() => setVibe(vibeItem)}
                    className={classNames(
                      "px-6 py-4 text-lg w-full text-left flex items-center space-x-2 justify-between transition-all duration-300 hover-scale",
                      active ? "transform scale-105" : "",
                      vibe === vibeItem ? "font-semibold" : "",
                      index === 0 ? "rounded-t-2xl" : "",
                      index === vibes.length - 1 ? "rounded-b-2xl" : ""
                    )}
                    style={{
                      backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      color: vibe === vibeItem ? 'var(--accent-primary)' : 'var(--text-primary)',
                      backdropFilter: active ? 'blur(20px)' : 'none'
                    }}
                  >
                    <span className={vibe === vibeItem ? 'gradient-text' : ''}>{vibeItem}</span>
                    {vibe === vibeItem ? (
                      <CheckIcon 
                        className="w-5 h-5 animate-pulse" 
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
