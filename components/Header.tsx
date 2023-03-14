import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const headerStyle = {
    backgroundColor: "#212529",
  };
  const titleStyle = {
    color: "#efa251",
  };
  return (
    <header
      style={headerStyle}
      className="flex justify-between items-center w-full border-b-2 pb-7 sm:px-4 px-2"
    >
      <Link href="/" className="flex space-x-3">
        <Image
          alt="header text"
          src="/logo.png"
          className="sm:w-20 sm:h-20 w-8 h-8"
          width={54}
          height={54}
        />
        <h1
          style={titleStyle}
          className="sm:text-4xl text-2xl font-bold ml-2 tracking-tight"
        >
          swot-generator.com
        </h1>
      </Link>
    </header>
  );
}
