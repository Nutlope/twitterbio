"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="mx-auto max-w-5xl">
        <Header />
      </div>
      {children}
      <div className="mx-auto max-w-5xl">
        <Footer />
      </div>
    </div>
  );
}
