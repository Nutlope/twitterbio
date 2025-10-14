import Link from "next/link";
import Github from "./GitHub";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header 
      className="flex justify-between items-center w-full mt-5 pb-7 sm:px-4 px-2 
                 border-b-2 transition-colors duration-300"
      style={{ borderColor: 'var(--border-primary)' }}
    >
      <Link href="/" className="flex space-x-3 items-center hover-scale">
        <img
          alt="header text"
          src="/write-adaptive.svg"
          className="sm:w-9 sm:h-9 w-8 h-8"
        />
        <h1 
          className="sm:text-3xl text-2xl font-bold ml-2 tracking-tight gradient-text"
        >
          twitterbio.io
        </h1>
      </Link>
      
      <div className="flex items-center space-x-3">
        <ThemeToggle />
        <a
          className="flex max-w-fit items-center justify-center space-x-2 
                     rounded-full px-4 py-2 text-sm shadow-custom hover-scale
                     transition-all duration-300 hover:shadow-custom-lg"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)',
            border: '1px solid'
          }}
          href="https://github.com/Nutlope/twitterbio"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github />
          <p>Star on GitHub</p>
        </a>
      </div>
    </header>
  );
}
