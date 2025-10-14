import { Switch } from "@headlessui/react";
import Image from "next/image";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Toggle({ isGPT, setIsGPT }: any) {
  return (
    <div 
      className="glass-effect rounded-2xl p-6 shadow-custom transition-all duration-300"
      style={{ border: '1px solid var(--border-primary)' }}
    >
      <Switch.Group as="div" className="flex items-center justify-center">
        <Switch.Label
          as="span"
          className="mr-4 text-lg flex justify-center gap-3 items-center"
        >
          <Image
            src="/mistral-logo.jpeg"
            width={32}
            height={32}
            alt="Mistral logo"
            className={`rounded-lg transition-opacity duration-300 ${isGPT && "opacity-50"}`}
          />
          <span
            className={`font-semibold transition-colors duration-300 ${
              isGPT ? "opacity-50" : ""
            }`}
            style={{ color: isGPT ? 'var(--text-muted)' : 'var(--text-primary)' }}
          >
            Mixtral 8x7B
          </span>
        </Switch.Label>
        
        <Switch
          checked={isGPT}
          onChange={setIsGPT}
          className={classNames(
            "relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full",
            "border-2 border-transparent transition-all duration-300 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md"
          )}
          style={{
            backgroundColor: isGPT ? 'var(--accent-primary)' : 'var(--border-secondary)'
          }}
        >
          <span
            aria-hidden="true"
            className={classNames(
              isGPT ? "translate-x-6" : "translate-x-0",
              "pointer-events-none inline-block h-7 w-7 transform rounded-full",
              "shadow-lg ring-0 transition-all duration-300 ease-in-out"
            )}
            style={{
              backgroundColor: 'var(--bg-primary)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          />
        </Switch>
        
        <Switch.Label
          as="span"
          className="ml-4 text-lg flex justify-center gap-3 items-center"
        >
          <span
            className={`font-semibold transition-colors duration-300 ${
              !isGPT ? "opacity-50" : ""
            }`}
            style={{ color: !isGPT ? 'var(--text-muted)' : 'var(--text-primary)' }}
          >
            Llama 3.1 8B
          </span>
          <Image
            src="/llama-logo.webp"
            width={40}
            height={40}
            alt="Meta logo"
            className={`rounded-lg transition-opacity duration-300 ${!isGPT && "opacity-50"}`}
          />
        </Switch.Label>
      </Switch.Group>
    </div>
  );
}
