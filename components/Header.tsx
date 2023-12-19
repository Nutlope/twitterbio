import Link from 'next/link';
import Github from './GitHub';

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <img
          alt="header text"
          src="/write.svg"
          className="sm:w-9 sm:h-9 w-8 h-8"
        />
        <h1 className="sm:text-3xl text-2xl font-bold ml-2 tracking-tight">
          twitterbio.io
        </h1>
      </Link>
      <a
        className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100"
        href="https://github.com/Nutlope/twitterbio"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github />
        <p>Star on GitHub</p>
      </a>
    </header>
  );
}
