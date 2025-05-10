// src/app/page.tsx
// import Link from 'next/link'
import { ConnectButton } from '@xellar/kit'
export default function Home() {
  return (
    <main className="min-h-screen w-full bg-primary-gradient flex flex-col justify-center items-center text-white px-28 gap-18">
      <h1 className="text-5xl font-bold text-center">
        "Knowledge is power — but ownership is protection. Secure your authorship with immutable proof."
      </h1>

      <div className="flex justify-center items-center gap-8 mt-8">
        <ConnectButton />
      </div>

      <span className="text-xl font-bold text-center mt-12">
        Login → Create Wallet → Choose Journals → Submit → Pay → Review → Published to NFT
      </span>
    </main>
)
}
