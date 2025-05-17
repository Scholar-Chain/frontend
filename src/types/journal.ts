import { Publisher } from './publisher'



export interface Journal {
    id: string
    name: string
    price: number
    scope: string[]           // <-- array sekarang
    path: string
    thumbnail_url: string
    publisher_name: string
    publish_months?: string[]
}




export interface JournalDetail {
  id: number
  name: string
  price: number
  scope: string[]
  publish_months: string[]
  path: string
  publisher_id: number
  created_at: string
  updated_at: string
  publisher: Publisher
  thumbnail_url: string
}