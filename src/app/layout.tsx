import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Web3Provider } from '@/components/Web3Provider'
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Scholar Chain",
  description: "Scholar Chain by Neuron Nusantara Teknologi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className=""
      >
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <Web3Provider>
            <Navbar />
            <main className="min-h-screen w-full bg-primary-gradient flex flex-col justify-center items-center text-white px-28 gap-18">
              {children}
            </main>
          </Web3Provider>
        </Suspense>
      </body>
    </html>
  );
}
