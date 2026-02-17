'use server'

import { query } from '@/lib/db'
import { Comment, CommentWithAuthor } from '@/types/database'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export type CommentResult = {
  success: boolean
  error?: string
}

export async function createComment(
  prevState: CommentResult,
  formData: FormData
): Promise<CommentResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in to comment' }
  }

  const userId = parseInt(session.user.id)
  const content = formData.get('content') as string
  const postId = parseInt(formData.get('post_id') as string)
  const parentIdRaw = formData.get('parent_id') as string
  const parentId = parentIdRaw ? parseInt(parentIdRaw) : null

  if (!content || content.trim().length < 1) {
    return { success: false, error: 'Comment cannot be empty' }
  }

  if (content.length > 1000) {
    return { success: false, error: 'Comment cannot exceed 1000 characters' }
  }

  try {
    await query<Comment>(
      `INSERT INTO comments (content, post_id, author_id, parent_id)
       VALUES ($1, $2, $3, $4)`,
      [content, postId, userId, parentId]
    )

    revalidatePath(`/post/${formData.get('slug')}`)
  } catch (error) {
    console.error('Comment error:', error)
    return { success: false, error: 'Failed to post comment. Please try again.' }
  }

  return { success: true }
}

export async function deleteComment(
  prevState: CommentResult,
  formData: FormData
): Promise<CommentResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in' }
  }

  const userId = parseInt(session.user.id)
  const commentId = parseInt(formData.get('comment_id') as string)
  const slug = formData.get('slug') as string

  try {
    // Only allow deleting own comments
    const result = await query<Comment>(
      'DELETE FROM comments WHERE id = $1 AND author_id = $2 RETURNING id',
      [commentId, userId]
    )

    if (result.rows.length === 0) {
      return { success: false, error: 'Comment not found or unauthorized' }
    }

    revalidatePath(`/post/${slug}`)
  } catch (error) {
    console.error('Delete comment error:', error)
    return { success: false, error: 'Failed to delete comment' }
  }

  return { success: true }
}