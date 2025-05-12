// src/app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div
          className="
            w-16 h-16
            border-4
            border-t-blue-500
            border-r-red-500
            border-b-yellow-500
            border-l-green-500
            rounded-full
            animate-spin
          "
        />
      </div>
    )
  }
  