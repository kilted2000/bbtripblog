export type PostStatus = 'draft' | 'published' | 'archived'

export interface Post {
  id: number
  slug: string
  title: string
  content: string | null
  author_id: number | null
  status: PostStatus
  created_at: Date
  updated_at: Date
}

export type PostCreateInput = Omit<Post, 'id' | 'created_at' | 'updated_at'>

export type PostUpdateInput = Partial<Omit<Post, 'id'>> & { id: number }

export type PostPreview = Pick<Post, 'id' | 'slug' | 'title' | 'created_at' | 'status'>