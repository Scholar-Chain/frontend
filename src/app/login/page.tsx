'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/Button'
import Input from '@/components/Input'

const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email wajib diisi' })
    .email({ message: 'Format email tidak valid' }),
  password: z
    .string()
    .nonempty({ message: 'Password wajib diisi' })
    .min(8, { message: 'Password minimal 8 karakter' }),
})
type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginData) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) {
      alert(result.message || 'Login gagal')
      return
    }
    router.push('/')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-between px-28 py-20">
        <div className="flex-1 pr-16 text-white hidden md:flex flex-col gap-4 items-center justify-center text-center">
          <h1 className="text-5xl font-bold">Scholar Chain</h1>
          <p className="text-lg leading-relaxed">
            Dengan smart contract dan NFT, Scholar Chain menjamin naskah Anda
            tak hanya aman, tapi juga tak bisa disalahgunakan — akhir dari
            praktik predator dalam penerbitan ilmiah.
          </p>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg text-black">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Login</h2>

            <Input
              type="email"
              placeholder="Email"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              type="password"
              placeholder="Password"
              {...register('password')}
              error={errors.password?.message}
            />

            <Button className="w-full" loading={isSubmitting} type="submit">
              LOGIN
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-500">Belum punya akun?</span>
              <Link href="/register" className="block mt-2">
                <Button variant="secondary" className="w-full">
                  REGISTER
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>

      <div className="py-8 text-center text-white text-xl font-bold">
        Login → Create Wallet → Choose Journals → Submit → Pay → Review → Published
        to NFT
      </div>
    </div>
  )
}
