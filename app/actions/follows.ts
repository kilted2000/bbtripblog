'use server'

import { query } from '@/lib/db'
import { Follow } from '@/types/database'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export type FollowResult = {
  success: boolean
  error?: string
}

export async function followUser(
  prevState: FollowResult,
  formData: FormData
): Promise<FollowResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in to follow users' }
  }

  const followerId = parseInt(session.user.id)
  const followingId = parseInt(formData.get('following_id') as string)
  const username = formData.get('username') as string

  // Can't follow yourself
  if (followerId === followingId) {
    return { success: false, error: 'You cannot follow yourself' }
  }

  try {
    await query<Follow>(
      `INSERT INTO follows (follower_id, following_id) 
       VALUES ($1, $2) 
       ON CONFLICT DO NOTHING`,
      [followerId, followingId]
    )

    revalidatePath(`/${username}`)
  } catch (error) {
    console.error('Follow error:', error)
    return { success: false, error: 'Failed to follow user' }
  }

  return { success: true }
}

export async function unfollowUser(
  prevState: FollowResult,
  formData: FormData
): Promise<FollowResult> {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in' }
  }

  const followerId = parseInt(session.user.id)
  const followingId = parseInt(formData.get('following_id') as string)
  const username = formData.get('username') as string

  try {
    await query<Follow>(
      'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, followingId]
    )

    revalidatePath(`/${username}`)
  } catch (error) {
    console.error('Unfollow error:', error)
    return { success: false, error: 'Failed to unfollow user' }
  }

  return { success: true }
}