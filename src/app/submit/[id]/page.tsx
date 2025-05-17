// app/submit/[id]/page.tsx
import ClientSubmitPage from './SubmitPage'
import { JournalDetail } from '@/types/journal'
interface PageProps {
  params: Promise<{ id: string }>
}
export default async function Page({ params }: PageProps) {
  const { id } = await params
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/journals/${id}`,
    { cache: 'no-store' }
  )
  if (!res.ok) throw new Error('Gagal memuat data jurnal')
  const journal: JournalDetail = await res.json()

  return <ClientSubmitPage journal={journal} />
}
