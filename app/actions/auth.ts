'use server'

import { query } from '@/lib/db'
import { User } from '@/types/database'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'

export type AuthResult = {
  success: boolean
  error?: string
}

export async function signup(
  prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' }
  }

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email address' }
  }

  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match' }
  }

  try {
    const usernameCheck = await query<User>(
      'SELECT id FROM users WHERE username = $1',
      [username]
    )

    if (usernameCheck.rows.length > 0) {
      return { success: false, error: 'Username already taken' }
    }

    const emailCheck = await query<User>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (emailCheck.rows.length > 0) {
      return { success: false, error: 'Email already registered' }
    }

    const password_hash = await bcrypt.hash(password, 10)

    await query<User>(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, password_hash]
    )

    // Auto-login after signup
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

  } catch (error) {
    console.error('Signup error:', error)
    return { success: false, error: 'Failed to create account. Please try again.' }
  }

  redirect('/')
}

export async function login(
  prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, error: 'Invalid email or password' }
    }
    throw error
  }

  redirect('/')
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}