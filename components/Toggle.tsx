import { Switch } from '@headlessui/react';
import Image from 'next/image';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Toggle({ isGPT, setIsGPT }: any) {
  return (
    <Switch.Group as="div" className="flex items-center">
      <Switch.Label
        as="span"
        className="mr-3 text-sm flex justify-center gap-2 items-center"
      >
        <Image
          src="/mistral-logo.jpeg"
          width={25}
          height={25}
          alt="1 icon"
          className={`${isGPT && 'opacity-50'}`}
        />
        <span
          className={`font-medium ${isGPT ? 'text-gray-400' : 'text-gray-900'}`}
        >
          Mixtral
        </span>{' '}
      </Switch.Label>
      <Switch
        checked={isGPT}
        onChange={setIsGPT}
        className={classNames(
          isGPT ? 'bg-black' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            isGPT ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label
        as="span"
        className="ml-3 text-sm flex justify-center gap-2 items-center"
      >
        <span
          className={`font-medium ${
            !isGPT ? 'text-gray-400' : 'text-gray-900'
          }`}
        >
          GPT-3.5
        </span>{' '}
        <Image
          src="/openai-logo.jpeg"
          width={30}
          height={30}
          alt="OpenAI logo"
          className={`${!isGPT && 'opacity-50'}`}
        />
      </Switch.Label>
    </Switch.Group>
  );
}
