// src/components/AuthConnectButton.tsx
'use client'

import { useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { ConnectButton } from '@xellar/kit'

export default function AuthConnectButton() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  useEffect(() => {
    // jika halaman belum ready
    if (typeof window === 'undefined') return
    if (isConnected || address) return

    // Ambil user & token dari sessionStorage
    const accessToken = sessionStorage.getItem('access_token')
    const userJson = sessionStorage.getItem('user')
    if (!accessToken || !userJson) return

    const { name, email, username } = JSON.parse(userJson)

    // Jika user sudah punya wallet_address dan itu beda dengan yang terconnect,
    // maka langsung disconnect
    // settimeout
    // untuk menunggu wallet connect selesai
    // setTimeout(() => {
    //   if (author.wallet_address && address !== author.wallet_address) {
    //     disconnect()
    //     alert(
    //       'Wallet address already registered. Please use the registered wallet address.'
    //     );
    //     return
    //   }
    // }, 1000)

    // Kalau belum pernah set atau sama, lanjut update profile
    fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name,
        author: { wallet_address: address },
        email,
        username,
        _method: 'PUT',
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal update profile')
        return res.json()
      })
      .then((data) => {
        sessionStorage.setItem('user', JSON.stringify(data))
        console.log('Profile updated', data)
      })
      .catch((err) => console.error(err))
  }, [isConnected, address, disconnect])

  return <ConnectButton.Custom>
    {({ account, disconnect, openConnectModal }) => {
      return (
        <div className='mt-3'>
          {isConnected ? (
            <button
              onClick={disconnect}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {account?.address}
            </button>
          ) : (
            <button
              onClick={openConnectModal}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )
    }}
  </ConnectButton.Custom>
}
