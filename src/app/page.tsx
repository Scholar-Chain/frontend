// src/app/page.tsx
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ConnectButton } from '@xellar/kit'
import { Journal } from '@/types'


// contoh data statis
const JOURNALS: Journal[] = [
  {
    id: '1',
    name: 'Jurnal Ilmiah',
    price: 100000,
    scope: 'Ilmu Komputer',
    path: '/jurnal-ilmiah',
    thumbnail: '/img/journal/image.jpg',
    publisher_name: 'Publisher A',
  }
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  // const [sintaFilter, setSintaFilter] = useState<number[]>([])

  // filter & search
  const filtered = useMemo(() => {
    return JOURNALS.filter((j) => {
      if (
        search &&
        !j.name.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }
      if (minPrice !== '' && j.price < minPrice) return false
      if (maxPrice !== '' && j.price > maxPrice) return false
      // if (
      //   sintaFilter.length > 0 &&
      //   !sintaFilter.includes(j.sintaLevel)
      // ) {
      //   return false
      // }
      return true
    })
  }, [search, minPrice, maxPrice])

  // toggle sinta checkbox
  // const toggleSinta = (level: number) => {
  //   setSintaFilter((prev) =>
  //     prev.includes(level)
  //       ? prev.filter((x) => x !== level)
  //       : [...prev, level]
  //   )
  // }

  return (
    <div className="px-28 py-20">
      {/* Header utama */}
      <h1 className="text-5xl font-bold text-center">
        "Knowledge is power — but ownership is protection. Secure your
        authorship with immutable proof."
      </h1>
      <div className="flex justify-center items-center gap-8 mt-8">
        <Link
          href="/login"
          className="bg-white px-10 py-3 rounded-lg text-black font-bold text-xl transition hover:opacity-90"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="bg-white px-10 py-3 rounded-lg text-black font-bold text-xl transition hover:opacity-90"
        >
          Register
        </Link>
      </div>
      <span className="text-xl font-bold text-center block mt-12">
        Login → Create Wallet → Choose Journals → Submit → Pay → Review →
        Published to NFT
      </span>

      {/* Search + Connect */}
      <div className="mt-12 flex items-center gap-4">
        <input
          type="text"
          placeholder="Cari jurnal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:opacity-90"
          onClick={() => setSearch('')}
        >
          Clear
        </button>
      </div>

      {/* Main content */}
      <div className="mt-8 flex gap-8">
        {/* List jurnal */}
        <div className="flex-1 space-y-6 text-black">
          {filtered.map((j) => (
            <div
              key={j.id}
              className="bg-white rounded-lg shadow flex overflow-hidden"
            >
              <img
                src={j.thumbnail}
                alt={j.name}
                className="w-32 object-cover"
              />
              <div className="flex-2 p-4">
                <h2 className="font-bold text-lg">
                  {j.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {j.scope}
                </p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Scope:</span>{' '}
                  {j.scope}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold">Publisher:</span>{' '}
                  {j.publisher_name}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold">Price:</span> Rp.{' '}
                  {j.price.toLocaleString()}
                </p>
                {/* <div className="mt-3 flex items-center gap-2">
                  <img
                    src="/icons/sinta-logo.png"
                    alt="Sinta"
                    className="w-6"
                  />
                  <span className="bg-yellow-300 rounded-full px-2 text-xs">
                    {j.sintaLevel}
                  </span>
                </div> */}
              </div>
              <div className="flex flex-row justify-end items-end">
                <button className="m-4 rounded bg-yellow-400 px-4 py-2 font-bold hover:opacity-90">
                  Submit
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-black">
              Tidak ada jurnal ditemukan.
            </p>
          )}
        </div>

        {/* Sidebar filter */}
        <aside className="w-64 space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Sorting</h3>
            <label className="flex items-center gap-2">
              <input type="radio" name="sort" />
              Default
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="sort" />
              Harga Terendah
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="sort" />
              Harga Tertinggi
            </label>
          </div>

          {/* <div>
            <h3 className="font-semibold mb-2">Sinta</h3>
            {[1, 2, 3, 4, 5, 6].map((lvl) => (
              <label
                key={lvl}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={sintaFilter.includes(lvl)}
                  onChange={() => toggleSinta(lvl)}
                />
                Sinta {lvl}
              </label>
            ))}
          </div> */}

          <div>
            <h3 className="font-semibold mb-2">Price</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice === '' ? '' : minPrice}
                onChange={(e) =>
                  setMinPrice(
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                className="w-1/2 rounded border px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice === '' ? '' : maxPrice}
                onChange={(e) =>
                  setMaxPrice(
                    e.target.value === '' ? '' : Number(e.target.value)
                  )
                }
                className="w-1/2 rounded border px-2 py-1 text-sm"
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
