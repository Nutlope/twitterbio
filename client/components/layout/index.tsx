import { FADE_IN_ANIMATION_SETTINGS } from "../../lib/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";

import Link from "next/link";
import { ReactNode } from "react";
import useScroll from "../../lib/hooks/use-scroll";
import Meta from "./meta";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { useRouter } from "next/router";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const router = useRouter()
  return (
    <>
      <Meta {...meta} />
      <SignInModal />
      {/* <div className="fixed w-full h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100" /> */}
      <div
        className={`fixed top-0 w-full ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="flex items-center justify-between h-16 max-w-screen-xl mx-5 font-bold uppercase xl:mx-auto">
          <Link href="/" className="flex items-center text-2xl font-display">
            {/* <Image
              src="/logo.png"
              alt="Precedent logo"
              width="30"
              height="30"
              className="mr-2 rounded-sm"
            ></Image> */}
            <p>Toolchest</p>
          </Link>
          <div>
            <AnimatePresence>
              {!session && status !== "loading" ? (
                <motion.button
                  className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                  onClick={() => setShowSignInModal(true)}
                  {...FADE_IN_ANIMATION_SETTINGS}
                >
                  Sign In
                </motion.button>
              ) : (
                <UserDropdown />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <main className={`flex flex-col items-center justify-center w-full ${router?.pathname === '/dashboard' ? "py-16" : "py-32"} `}>
        {children}
      </main>
      <div className="absolute w-full py-5 text-center bg-white border-t border-gray-200">
        <p className="text-gray-500">© 2023 All rights reserved.</p>
      </div>
    </>
  );
}
