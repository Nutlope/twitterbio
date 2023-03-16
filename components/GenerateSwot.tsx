import Image from "next/image";
import LoadingDots from "./LoadingDots";

export default function GenerateSwot(props: any) {
  const { company, loading, loadingColor, setCompany, generateSWOT } = props;

  const headerStyle = {
    backgroundColor: "#212529",
  };

  return (
    <div className="w-full">
      <div className="flex mt-10 items-center space-x-3 items-center">
        <Image src="/1-black.png" width={30} height={30} alt="1 icon" />
        <p className="text-left font-medium">Add a company name to analyse.</p>
      </div>
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full mt-2 border-2 border-black-400 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black-400"
        placeholder={"e.g. Amazon, Apple, Alphabet."}
      />
      {!loading && !loadingColor && (
        <button
          style={headerStyle}
          className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
          onClick={(e) => generateSWOT(e)}
        >
          Generate your SWOT &rarr;
        </button>
      )}
      {loading && (
        <button
          className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
          disabled
        >
          <LoadingDots color="white" style="large" />
        </button>
      )}
      {loadingColor && (
        <button
          className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-10 mt-8 hover:bg-black/80 w-full"
          disabled
        >
          <LoadingDots color="white" style="large" />
        </button>
      )}
    </div>
  );
}
