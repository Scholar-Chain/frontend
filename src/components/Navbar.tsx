'use client'

import { useState, useEffect, FC } from 'react'
import Link from 'next/link'
import { NavItem } from '@/types'
import Image from 'next/image'
// import { ConnectButton } from '@xellar/kit'
import AuthConnectButton from '@/components/AuthConnectButton'

const items: NavItem[] = [
  { label: 'Publisher', to: '/publisher' },
  { label: 'Partnership', to: '/partnership' },
]

const Navbar: FC = () => {
  const [hasBg, setHasBg] = useState(false)
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasBg(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem('access_token')
    const user = sessionStorage.getItem('user')
    setIsAuth(!!token && !!user)
  }, [])

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10 transition-colors duration-300 ${
        hasBg ? 'bg-dark-blue-500' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto py-3 flex justify-between items-center">
        <Link href="/">
          <Image src="/img/logo.png" alt="Logo" width={300} height={150} />
        </Link>
        <nav className="flex space-x-6 items-center">
          {items.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className="text-white/70 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          {isAuth && (
            <AuthConnectButton />
          ) }
        </nav>
      </div>
    </div>
  )
}

export default Navbar
