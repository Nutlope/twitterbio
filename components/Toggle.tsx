import { Switch } from "@headlessui/react";
import Image from "next/image";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function Toggle({ isGPT, setIsGPT }: any) {
  return (
    <div 
      className="glass-anamorphic rounded-3xl p-8 shadow-custom hover-scale
                 transition-all duration-300 float-animation"
      style={{ animationDelay: '1s' }}
    >
      <Switch.Group as="div" className="flex items-center justify-center">
        <Switch.Label
          as="span"
          className="mr-6 text-lg flex justify-center gap-4 items-center"
        >
          <Image
            src="/mistral-logo.jpeg"
            width={36}
            height={36}
            alt="Mistral logo"
            className={`rounded-xl transition-all duration-500 ${isGPT && "opacity-50 scale-90"}`}
          />
          <span
            className={`font-semibold transition-all duration-500 ${
              isGPT ? "opacity-50 scale-95" : ""
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
            "relative inline-flex h-10 w-20 flex-shrink-0 cursor-pointer rounded-full",
            "border-2 border-transparent transition-all duration-500 ease-in-out",
            "focus:outline-none focus:ring-4 focus:ring-offset-2 shadow-custom hover-scale",
            "glass-anamorphic"
          )}
          style={{
            backgroundColor: isGPT ? 'var(--accent-primary)' : 'var(--border-secondary)',
            transform: isGPT ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          <span
            aria-hidden="true"
            className={classNames(
              isGPT ? "translate-x-10" : "translate-x-0",
              "pointer-events-none inline-block h-8 w-8 transform rounded-full",
              "shadow-custom-lg ring-2 ring-white ring-opacity-30 transition-all duration-500 ease-in-out",
              isGPT ? "rotate-180" : "rotate-0"
            )}
            style={{
              backgroundColor: 'var(--bg-primary)',
              background: isGPT 
                ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                : 'var(--bg-primary)'
            }}
          />
        </Switch>
        
        <Switch.Label
          as="span"
          className="ml-6 text-lg flex justify-center gap-4 items-center"
        >
          <span
            className={`font-semibold transition-all duration-500 ${
              !isGPT ? "opacity-50 scale-95" : ""
            }`}
            style={{ color: !isGPT ? 'var(--text-muted)' : 'var(--text-primary)' }}
          >
            Llama 3.1 8B
          </span>
          <Image
            src="/llama-logo.webp"
            width={44}
            height={44}
            alt="Meta logo"
            className={`rounded-xl transition-all duration-500 ${!isGPT && "opacity-50 scale-90"}`}
          />
        </Switch.Label>
      </Switch.Group>
    </div>
  );
}
