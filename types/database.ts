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

export type UserSignupInput = {
  username: string
  email: string
  password: string
}

export type UserPublic = Omit<User, 'password_hash' | 'email'>
export type UserSession = {
  id: number
  username: string
  email: string
}

// New comment types
export interface Comment {
  id: number
  content: string
  post_id: number
  author_id: number
  parent_id: number | null  // null = top level comment
  created_at: Date
  updated_at: Date
}

// For displaying comments with author info
export interface CommentWithAuthor extends Comment {
  username: string
  avatar_url: string | null
}

export interface NestedComment extends CommentWithAuthor {
  replies: CommentWithAuthor[]
}

export type CommentCreateInput = Pick<Comment, 'content' | 'post_id'> & {
  parent_id?: number | null
}

export interface Follow {
  follower_id: number
  following_id: number
  created_at: Date
}

// For displaying follower/following counts
export interface UserWithStats extends UserPublic {
  followers_count: number
  following_count: number
  is_following?: boolean  // Is the current user following this user?
}