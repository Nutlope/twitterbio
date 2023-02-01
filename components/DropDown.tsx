import { Menu, Transition } from '@headlessui/react'
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid'
import { Fragment } from 'react'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export type VibeType =
  | 'Professional'
  | 'Engineer'
  | 'Designer'
  | 'Doctor'
  | 'Lawyer'
  | 'Military'
  | 'Musician'
  | 'Artist'
  | 'Writer'
  | 'Casual'
  | 'Funny'

interface DropDownProps {
  vibe: VibeType
  setVibe: (vibe: VibeType) => void
}

let vibes: VibeType[] = [
  'Professional',
  'Engineer',
  'Designer',
  'Doctor',
  'Lawyer',
  'Military',
  'Musician',
  'Artist',
  'Writer',
  'Casual',
  'Funny',
]

export default function DropDown({ vibe, setVibe }: DropDownProps) {
  return (
    <Menu as='div' className='relative block w-full text-left'>
      <div>
        <Menu.Button className='inline-flex items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black'>
          {vibe}
          <ChevronUpIcon
            className='w-5 h-5 ml-2 -mr-1 ui-open:hidden'
            aria-hidden='true'
          />
          <ChevronDownIcon
            className='hidden w-5 h-5 ml-2 -mr-1 ui-open:block'
            aria-hidden='true'
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items
          className='absolute left-0 z-10 w-full mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
          key={vibe}
        >
          <div className=''>
            {vibes.map((vibeItem) => (
              <Menu.Item key={vibeItem}>
                {({ active }) => (
                  <button
                    onClick={() => setVibe(vibeItem)}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      vibe === vibeItem ? 'bg-gray-200' : '',
                      'px-4 py-2 text-sm w-full text-left flex items-center space-x-2 justify-between'
                    )}
                  >
                    <span>{vibeItem}</span>
                    {vibe === vibeItem ? (
                      <CheckIcon className='w-4 h-4 text-bold' />
                    ) : null}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
