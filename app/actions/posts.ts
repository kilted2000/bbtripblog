'use server'

import { query } from '@/lib/db'
import { Post } from '@/types/database'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export type ActionResult = {
  success: boolean
  error?: string
  slug?: string
}

export async function createPost(
  prevState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  // Get the logged-in user
  const session = await auth()
  
  console.log('Session in createPost:', session)
  console.log('User ID:', session?.user?.id)
  
  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in to create a post' }
  }
  
  const userId = parseInt(session.user.id)
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  if (!title || title.trim().length < 3) {
    return { success: false, error: 'Title must be at least 3 characters' }
  }
  
  if (!content || content.trim().length < 10) {
    return { success: false, error: 'Content must be at least 10 characters' }
  }
  
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  
  try {
    const existingPost = await query<Post>(
      'SELECT id FROM posts WHERE slug = $1',
      [slug]
    )
    
    if (existingPost.rows.length > 0) {
      const randomSuffix = Math.random().toString(36).substring(2, 8)
      slug = `${slug}-${randomSuffix}`
    }
    
    await query<Post>(
      'INSERT INTO posts (slug, title, content, status, author_id) VALUES ($1, $2, $3, $4, $5)',
      [slug, title, content, 'published', userId]
    )
    
    revalidatePath('/explore')
  } catch (error) {
    console.error('Database error:', error)
    return { success: false, error: 'Failed to create post. Please try again.' }
  }
  
  redirect('/post/' + slug)
}