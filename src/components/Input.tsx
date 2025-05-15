// src/components/Input.tsx
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Pesan error, kalau ada akan ditampilkan di bawah input */
  error?: string
}

export default function Input({ error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        {...props}
        className={[
          'w-full rounded border px-3 py-1 focus:outline-none focus:ring-2 transition',
          error
            ? 'border-red-500 ring-red-200'
            : 'border-gray-300 ring-blue-200',
          className,
        ].join(' ')}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
