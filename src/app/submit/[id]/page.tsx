'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt 
} from 'wagmi'
import abi from '@/abi/ScholarChain.json'

import { keccak256, toBytes } from 'viem'         // ← pakai Viem
import { JournalDetail } from '@/types/journal'
import { liskSepolia } from "wagmi/chains";
const CONTRACT_ADDRESS = '0X'+process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const CONTRACT_ABI = abi;

export default function SubmitPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }

  const [journal, setJournal] = useState<JournalDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  // 1. Load journal detail…
  useEffect(() => {
    const token = sessionStorage.getItem('access_token')
    if (!token) return router.push('/login')

    fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/journals/${id}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }
    )
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then((data: JournalDetail) => setJournal(data))
      .catch(() => setError('Gagal memuat data jurnal'))
      .finally(() => setLoading(false))

      // get user data
      const userJson = sessionStorage.getItem('user')
      if (userJson) {
        const user = JSON.parse(userJson)
        setUserData(user)
      }
  }, [id, router, setLoading, setError])

  if (loading) return <p className="p-8 text-center">Loading...</p>
  if (error) return <p className="p-8 text-center text-red-600">{error}</p>
  if (!journal) return <p className="p-8 text-center">Jurnal tidak ditemukan.</p>

  // 2. Generate keccak256 hash via Viem
  const articleIdHash = keccak256(toBytes(String(userData?.author?.id) + userData?.author?.email + journal.id))

  // 3. Prepare write config (Sepolia chainId 11155111)
  // const result = useSimulateContract({
  //   address: CONTRACT_ADDRESS,
  //   abi: CONTRACT_ABI,
  //   functionName: 'createSubmission',
  //   args: [articleIdHash],
  //   chainId: liskSepolia.id,
  // })

  // 4. Execute tx
  // const { write, isLoading: isTxLoading, data: txData } =
  //   useContractWrite(config)

  // 5. Wait for confirmation
  // const { isSuccess } = useWaitForTransaction({ hash: txData?.hash })

  // useEffect(() => {
  //   if (isSuccess) {
  //     alert('On-chain submission berhasil!')
  //     router.push('/') // atau halaman lain
  //   }
  // }, [isSuccess, router])

  return (
    // <div className="p-8 max-w-3xl mx-auto flex gap-8">
    //   {/* … tampilkan detail jurnal seperti sebelum … */}

    //   <button
    //     onClick={() => write?.()}
    //     disabled={!write || isTxLoading}
    //     className="mt-6 rounded bg-blue-600 px-6 py-3 text-white font-bold hover:opacity-90 disabled:opacity-50"
    //   >
    //     {isTxLoading ? 'Submitting…' : 'Submit On-Chain'}
    //   </button>
    // </div>
    <></>
  )
}
