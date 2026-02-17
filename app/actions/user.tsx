'use server'

import { query } from '@/lib/db'
import { User } from '@/types/database'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export type ProfileResult = {
  success: boolean
  error?: string
  message?: string
}

export async function updateProfile(
  prevState: ProfileResult,
  formData: FormData
): Promise<ProfileResult> {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: 'You must be logged in' }
  }
  
  const userId = parseInt(session.user.id)
  const username = formData.get('username') as string
  const bio = formData.get('bio') as string
  
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' }
  }
  
  try {
    // Check if username is taken by someone else
    const existingUser = await query<User>(
      'SELECT id FROM users WHERE username = $1 AND id != $2',
      [username, userId]
    )
    
    if (existingUser.rows.length > 0) {
      return { success: false, error: 'Username already taken' }
    }
    
    // Update user
    await query(
      'UPDATE users SET username = $1, bio = $2, updated_at = NOW() WHERE id = $3',
      [username, bio || null, userId]
    )
    
    revalidatePath(`/${username}`)
    revalidatePath('/settings')
  } catch (error) {
    console.error('Update profile error:', error)
    return { success: false, error: 'Failed to update profile. Please try again.' }
  }
  
  return { success: true, message: 'Profile updated successfully!' }
}