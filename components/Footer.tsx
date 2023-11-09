import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mb-3 mt-5 flex h-16 w-full flex-col items-center justify-between space-y-3 px-3 pt-4 text-center sm:mb-0 sm:h-20 sm:flex-row sm:pt-2">
      <div className="font-medium">
        <span className="text-red-500">C</span>
        <span className="text-orange-500">o</span>
        <span className="text-yellow-500">m</span>
        <span className="text-green-500">m</span>
        <span className="text-blue-500">u</span>
        <span className="text-indigo-500">n</span>
        <span className="text-purple-500">i</span>
        <span className="text-red-500">t</span>
        <span className="text-orange-500">y</span>
        <span className="text-yellow-500">-</span>
        <span className="text-green-500">P</span>
        <span className="text-blue-500">o</span>
        <span className="text-indigo-500">w</span>
        <span className="text-purple-500">e</span>
        <span className="text-red-500">r</span>
        <span className="text-orange-500">e</span>
        <span className="text-yellow-500">d</span> (🧑‍💻 by{" "}
        <a
          href="https://www.jaronheard.com"
          target="_blank"
          className="font-bold underline-offset-2 transition hover:underline"
        >
          Jaron{" "}
        </a>
        )
      </div>
      <div className="flex space-x-4 pb-4 sm:pb-0">
        <Link
          href="mailto:jaronheard@gmail.com"
          className="group"
          aria-label="Email"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
          >
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
        </Link>
        <Link
          href="https://github.com/jaronheard/timetime.cc"
          className="group"
          aria-label="GitHub"
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 fill-slate-500 group-hover:fill-slate-700"
          >
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
          </svg>
        </Link>
      </div>
    </footer>
  );
}
