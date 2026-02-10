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

// User types
export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  bio: string | null
  avatar_url: string | null
  created_at: Date
  updated_at: Date
}

// For signup (plain password, will be hashed)
export type UserSignupInput = {
  username: string
  email: string
  password: string
}

// For public display (no sensitive data)
export type UserPublic = Omit<User, 'password_hash' | 'email'>

// For session (minimal data stored in JWT)
export type UserSession = {
  id: number
  username: string
  email: string
}