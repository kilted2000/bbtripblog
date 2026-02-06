export interface Post {
  id: number
  slug: string
  title: string
  content: string | null
  author_id: number | null
  created_at: Date
  updated_at: Date
}