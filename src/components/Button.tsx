// src/components/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'warning' | 'danger' | 'success'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold hover:opacity-90',
  secondary: 'bg-gradient-to-r from-green-500 to-green-700 text-white font-bold hover:opacity-90',
  warning: 'bg-gradient-to-r from-red-500 to-red-700 text-white font-bold hover:opacity-90',
  danger: 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-bold hover:opacity-90',
  success: 'bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold hover:opacity-90',
}

export default function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'w-full rounded-lg py-2 transition',
        variantClasses[variant],
        className
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
