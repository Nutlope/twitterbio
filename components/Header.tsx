import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex justify-between items-center w-full mt-5 border-b-2 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-3">
        <Image
          alt="header text"
          src="/trumpetLogo.jpg"
          className="sm:w-12 sm:h-12 w-8 h-8"
          width={32}
          height={32}
        />
        <h1 className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight">
          Trumpet.ai
        </h1>
      </Link>
      <a href="https://github.com/yizeshen7" target="_blank" rel="noreferrer">
        <Image
          alt="Profile pic"
          src="/profile.png"
          className="sm:w-12 sm:h-[48px] w-12 h-[48px]"
          width={48}
          height={48}
        />
      </a>
    </header>
  );
}
