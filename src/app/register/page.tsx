'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'
import Input from '@/components/Input'   // ← import Input

/** 1. Schema validasi dengan Zod */
const registerSchema = z
  .object({
    firstName: z.string().nonempty({ message: 'Nama depan wajib diisi' }),
    middleName: z.string().optional(),
    lastName: z.string().nonempty({ message: 'Nama belakang wajib diisi' }),
    username: z.string().nonempty({ message: 'Username wajib diisi' }),
    password: z
      .string()
      .nonempty({ message: 'Password wajib diisi' })
      .min(8, { message: 'Password minimal 8 karakter' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Konfirmasi password wajib diisi' }),
    email: z
      .string()
      .nonempty({ message: 'Email wajib diisi' })
      .email({ message: 'Format email tidak valid' }),
    affiliation: z.string().nonempty({ message: 'Afiliasi wajib diisi' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password dan konfirmasi harus sama',
  })

type RegisterData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterData) {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const result = await res.json()
    if (!res.ok) {
      alert(result.message || 'Registrasi gagal')
      return
    }
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Konten utama: kiri teks, kanan form */}
      <div className="flex justify-between px-28 py-10">
        {/* Kiri */}
        <div className="flex-1 pr-16 text-white hidden md:flex flex-col gap-4 items-center justify-center text-center">
          <h1 className="text-5xl font-bold mb-4">Scholar Chain</h1>
          <p className="text-lg leading-relaxed">
            Dengan smart contract dan NFT, Scholar Chain menjamin naskah Anda
            tak hanya aman, tapi juga tak bisa disalahgunakan — akhir dari
            praktik predator dalam penerbitan ilmiah.
          </p>
        </div>

        {/* Kanan: form register */}
        <div className="w-full max-w-md bg-white rounded-2xl px-4 py-2 shadow-lg text-black">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h2 className="text-2xl font-bold text-center">Register</h2>

            <Input
              type="text"
              placeholder="Nama depan*"
              {...register('firstName')}
              error={errors.firstName?.message}
            />

            <Input
              type="text"
              placeholder="Nama tengah"
              {...register('middleName')}
              error={errors.middleName?.message}
            />

            <Input
              type="text"
              placeholder="Nama belakang*"
              {...register('lastName')}
              error={errors.lastName?.message}
            />

            <Input
              type="text"
              placeholder="Username*"
              {...register('username')}
              error={errors.username?.message}
            />

            <Input
              type="password"
              placeholder="Password*"
              {...register('password')}
              error={errors.password?.message}
            />

            <Input
              type="password"
              placeholder="Konfirmasi Password*"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Input
              type="email"
              placeholder="Email*"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              type="text"
              placeholder="Afiliasi*"
              {...register('affiliation')}
              error={errors.affiliation?.message}
            />

            <Button
              type="submit"
              variant="secondary"
              loading={isSubmitting}
              className="w-full mt-2"
            >
              REGISTER
            </Button>
          </form>
        </div>
      </div>

      {/* Langkah di bawah */}
      <div className="py-8 text-center text-white text-xl font-bold">
        Login → Create Wallet → Choose Journals → Submit → Pay → Review → Published
        to NFT
      </div>
    </div>
  )
}
