import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2500 }}
      />
      <Header />
      <main className="my-12 flex w-full flex-1 flex-col items-center justify-center sm:my-20 sm:px-4">
        {children}
      </main>
      <Footer cta />
    </div>
  );
}
