'use client';

import { useChat } from 'ai/react';
import { useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import {
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Form() {
  const [bio, setBio] = useState('');
  const [vibe, setVibe] = useState('Professional');
  const bioRef = useRef<null | HTMLDivElement>(null);

  const onSubmit = (e: any) => {
    setBio(input);
    handleSubmit(e);
  };

  const scrollToBios = () => {
    if (bioRef.current !== null) {
      bioRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: '/api/chat',
      body: {
        vibe,
        bio,
      },
      onResponse() {
        scrollToBios();
      },
    });

  const lastMessage = messages[messages.length - 1];
  const generatedBios =
    lastMessage?.role === 'assistant' ? lastMessage.content : null;

  return (
    <section>
      <form className="mx-auto max-w-sm space-y-4" onSubmit={onSubmit}>
        <p className="text-zinc-500 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed dark:text-zinc-400">
          → Describe yourself
        </p>
        <textarea
          value={input}
          onChange={handleInputChange}
          rows={4}
          className="border border-zinc-200 rounded-lg px-4 py-4 w-full dark:border-zinc-800 focus:border-black focus:ring-black"
          placeholder={
            'e.g. Senior Developer Advocate @vercel. Tweeting about web development, AI, and React / Next.js. Writing nutlope.substack.com.'
          }
        />
        <p className="text-zinc-500 md:text-base/relaxed lg:text-sm/relaxed xl:text-base/relaxed dark:text-zinc-400">
          → Select your vibe
        </p>
        <Select
          onValueChange={(newVibe: string) => setVibe(newVibe)}
          defaultValue={vibe}
        >
          <SelectTrigger>
            <SelectValue placeholder="Professional" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select your vibe</SelectLabel>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Casual">Casual</SelectItem>
              <SelectItem value="Funny">Funny</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {isLoading ? (
          <Button disabled className="w-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            Generate Bio
          </Button>
        )}
      </form>

      <output className="space-y-10 my-10">
        {generatedBios && (
          <>
            <div>
              <h2
                className="text-2xl font-bold text-slate-900 mx-auto text-center mt-8"
                ref={bioRef}
              >
                Your generated bios
              </h2>
            </div>
            <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto">
              {generatedBios
                .substring(generatedBios.indexOf('1') + 3)
                .split('2.')
                .map((generatedBio) => {
                  return (
                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedBio);
                        toast('Bio copied to clipboard', {
                          icon: '✂️',
                        });
                      }}
                      key={generatedBio}
                    >
                      <p>{generatedBio}</p>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </output>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </section>
  );
}
