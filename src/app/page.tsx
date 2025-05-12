'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
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
  },
  {
    id: '2',
    name: 'Journal of Education, Humaniora',
    price: 200000,
    scope: 'Filsafat, Hukum, Sosial',
    path: '/jurnal-sains',
    thumbnail: '/img/journal/image2.jpg',
    publisher_name: 'Publisher B',
  },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [scopeFilter, setScopeFilter] = useState<string[]>([])
  const [publisherFilter, setPublisherFilter] = useState<string[]>([])

  // daftar unik scope + publisher untuk checkbox
  const allScopes = useMemo(
    () => Array.from(new Set(JOURNALS.map((j) => j.scope))),
    []
  )
  const allPublishers = useMemo(
    () => Array.from(new Set(JOURNALS.map((j) => j.publisher_name))),
    []
  )

  // filter & search
  const filtered = useMemo(() => {
    return JOURNALS.filter((j) => {
      // search di name, scope, publisher
      if (
        search &&
        ![j.name, j.scope, j.publisher_name]
          .some((field) =>
            field.toLowerCase().includes(search.toLowerCase())
          )
      ) {
        return false
      }
      // price
      if (minPrice !== '' && j.price < minPrice) return false
      if (maxPrice !== '' && j.price > maxPrice) return false
      // scope filter
      if (scopeFilter.length > 0 && !scopeFilter.includes(j.scope))
        return false
      // publisher filter
      if (
        publisherFilter.length > 0 &&
        !publisherFilter.includes(j.publisher_name)
      )
        return false

      return true
    })
  }, [search, minPrice, maxPrice, scopeFilter, publisherFilter])

  // toggle helper
  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) => {
    setArr(
      arr.includes(v)
        ? arr.filter((x) => x !== v)
        : [...arr, v]
    )
  }

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

      {/* Search + Clear */}
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
                <h2 className="font-bold text-lg">{j.name}</h2>
                <p className="text-sm text-gray-600">{j.scope}</p>
                <p className="mt-2 text-sm">
                  <span className="font-semibold">Scope:</span> {j.scope}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold">Publisher:</span>{' '}
                  {j.publisher_name}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold">Price:</span> Rp.{' '}
                  {j.price.toLocaleString()}
                </p>
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
        <aside className="w-64 space-y-6 text-white">
          {/* Sorting */}
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

          {/* Filter Scope */}
          <div>
            <h3 className="font-semibold mb-2">Scope</h3>
            {allScopes.map((sc) => (
              <label
                key={sc}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={scopeFilter.includes(sc)}
                  onChange={() => toggle(scopeFilter, setScopeFilter, sc)}
                />
                {sc}
              </label>
            ))}
          </div>

          {/* Filter Publisher */}
          <div>
            <h3 className="font-semibold mb-2">Publisher</h3>
            {allPublishers.map((pub) => (
              <label
                key={pub}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={publisherFilter.includes(pub)}
                  onChange={() =>
                    toggle(publisherFilter, setPublisherFilter, pub)
                  }
                />
                {pub}
              </label>
            ))}
          </div>

          {/* Filter Price */}
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
