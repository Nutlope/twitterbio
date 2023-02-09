import Link from "next/link";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import Balancer from "react-wrap-balancer";

export default function Card({
  displayName,
  slug,
  large,
}: {
  displayName: string;
  slug: string;
  large?: boolean;
}) {
  return (
    <Link href={`/tool/${slug}`} passHref>
      <div
        className={`relative col-span-1 flex h-40 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md ${
          large ? "md:col-span-2" : ""
        }`}
      >
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl font-bold text-transparent capitalize font-display bg-gradient-to-br from-black to-stone-500 bg-clip-text md:text-3xl md:font-normal">
            <Balancer>{displayName}</Balancer>
          </h2>
          {/* <div className="-mt-2 leading-normal prose-sm text-gray-500 md:prose">
          <Balancer>
            <ReactMarkdown
              components={{
                a: ({ node, ...props }) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                    className="font-medium text-gray-800 underline transition-colors"
                  />
                ),
                code: ({ node, ...props }) => (
                  <code
                    {...props}
                    // @ts-ignore (to fix "Received `true` for a non-boolean attribute `inline`." warning)
                    inline="true"
                    className="rounded-sm bg-gray-100 px-1 py-0.5 font-mono font-medium text-gray-800"
                  />
                ),
              }}
            >
              {description}
            </ReactMarkdown>
          </Balancer>
        </div> */}
        </div>
      </div>
    </Link>
  );
}
