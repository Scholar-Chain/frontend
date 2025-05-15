'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Journal } from '@/types'

export default function Home() {
  // state untuk data & loading
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // filter state
  const [search, setSearch] = useState('')
  // const [minPrice, setMinPrice] = useState<number | ''>('')
  // const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [scopeFilter, setScopeFilter] = useState<string[]>([])
  const [publisherFilter, setPublisherFilter] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'default' | 'priceAsc' | 'priceDesc'>('default')
  const [accessToken, setAccessToken] = useState<string | null>(null)



  // ambil token dari sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem('access_token')
    if (token) {
      setAccessToken(token)
      // console.log(token)
    } 
  }, [])

  // ambil data sekali ketika mount
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/journals`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) {
          // API bisa saja mereturn { data: [...] } atau langsung array
          const list: Journal[] = Array.isArray(data)
            ? data
            : data.data ?? data.journals ?? []
          setJournals(list)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // daftar unik untuk checkbox
  const allScopes = useMemo(() => {
    // ambil semua array scope, lalu flatten & dedup
    return Array.from(new Set(journals.flatMap(j => j.scope)))
  }, [journals])
  
  // const allPublishers = useMemo(
  //   () => Array.from(new Set(journals.map((j) => j.publisher_name))),
  //   [journals]
  // )

  // helper untuk toggle checkbox
  const toggle = (
    arr: string[],
    setArr: (v: string[]) => void,
    val: string
  ) =>
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val])

  // filter + search
  const filtered = useMemo(() => {
    let items = journals.filter((j) => {
      // search di title / scope / publisher
      if (
        search &&
        ![j.name, j.publisher_name]
          .some((f) => f.toLowerCase().includes(search.toLowerCase()))
      ) {
        return false
      }
      if (scopeFilter.length > 0) {
        const hasAny = j.scope.some(s => scopeFilter.includes(s))
        if (!hasAny) return false
      }
      // price range
      // if (minPrice !== '' && j.price < minPrice) return false
      // if (maxPrice !== '' && j.price > maxPrice) return false
      // if (
      //   publisherFilter.length > 0 &&
      //   !publisherFilter.includes(j.publisher_name)
      // )
      
      //   return false
      return true
    });
    // sort
    if (sortBy === 'priceAsc') {
      items = items.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'priceDesc') {
      items = items.sort((a, b) => b.price - a.price)
    }
    // default sort
    else {
      items = items.sort((a, b) => a.name.localeCompare(b.name))
    }
    return items
  }, [journals, search, scopeFilter, publisherFilter, sortBy])

  return (
    <div className="px-28 py-20">
      <h1 className="text-5xl font-bold text-center">
        &quot;Knowledge is power — but ownership is protection. Secure your
        authorship with immutable proof.&quot;
      </h1>

      {
        !accessToken &&
        <div className="flex justify-center items-center gap-8 mt-8">
          <Link
            href="/login"
            className="bg-white px-10 py-3 rounded-lg text-black font-bold text-xl hover:opacity-90"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white px-10 py-3 rounded-lg text-black font-bold text-xl hover:opacity-90"
          >
            Register
          </Link>
        </div>
      }

      <span className="text-xl font-bold text-center block mt-12">
        Login → Create Wallet → Choose Journals → Submit → Pay → Review →
        Published to NFT
      </span>

      {/* Search & clear */}
      <div className="mt-12 flex items-center gap-4">
        <input
          type="text"
          placeholder="Cari jurnal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2"
        />
        <button
          onClick={() => setSearch('')}
          className="bg-blue-500 text-white px-4 py-2 rounded-full font-bold hover:opacity-90"
        >
          Clear
        </button>
      </div>

      {/* jika loading / error */}
      {loading && (
        <p className="mt-8 text-center text-gray-500">Loading jurnal...</p>
      )}
      {error && (
        <p className="mt-8 text-center text-red-600">
          Gagal load jurnal: {error}
        </p>
      )}

      {/* konten utama */}
      {!loading && !error && (
        <div className="mt-8 flex gap-8">
          {/* daftar jurnal */}
          <div className="flex-1 space-y-6 text-black">
            {filtered.map((j) => (
              <div
                key={j.id}
                className="bg-white rounded-lg shadow flex overflow-hidden"
              >
                <img
                  src={j.thumbnail_url}
                  alt={j.name}
                  className="w-32 object-cover"
                />
                <div className="flex-1 p-4">
                  <h2 className="font-bold text-lg">{j.name}</h2>
                  <p className="mt-2 text-sm">
                    {/* <span className="font-semibold">Scope:</span> {j.scope} */}
                    <span className="font-semibold">Scope:</span>{' '}
                    {j.scope.join(', ')}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold">Price:</span> Rp.{' '}
                    {j.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-end pr-4 pb-4">
                  <Link href={`/submit/${j.id}`}>
                    <button className="rounded bg-yellow-400 px-4 py-2 font-bold hover:opacity-90">
                      Submit
                    </button>
                  </Link>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-white">
                Tidak ada jurnal ditemukan.
              </p>
            )}
          </div>

          {/* sidebar filter */}
          <aside className="w-64 space-y-6 text-white">
            {/* Sort */}
            <div>
              <h3 className="font-semibold mb-2">Sorting</h3>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="sort"
                  value="default"
                  checked={sortBy === 'default'}
                  onChange={() => setSortBy('default')}
                />
                Default
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="sort"
                  value="priceAsc"
                  checked={sortBy === 'priceAsc'}
                  onChange={() => setSortBy('priceAsc')}
                />
                Harga Terendah
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="sort"
                  value="priceDesc"
                  checked={sortBy === 'priceDesc'}
                  onChange={() => setSortBy('priceDesc')}
                />
                Harga Tertinggi
              </label>
            </div>


            {/* Filter Scope */}
            <div>
              <h3 className="font-semibold mb-2">Scope</h3>
              {allScopes.map(sc => (
                <label key={sc} className="flex items-center gap-2 text-sm">
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
            {/* <div>
              <h3 className="font-semibold mb-2">Publisher</h3>
              {allPublishers.map((pub) => (
                <label key={pub} className="flex items-center gap-2 text-sm">
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
            </div> */}

            {/* Filter Price */}
            {/* <div>
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
            </div> */}
          </aside>
        </div>
      )}
    </div>
  )
}
