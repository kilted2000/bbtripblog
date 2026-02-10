import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authConfig } from './lib/auth.config'
import { query } from './lib/db'
import { User } from './types/database'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string
        
        if (!email || !password) {
          return null
        }
        
        // Get user from database
        const result = await query<User>(
          'SELECT * FROM users WHERE email = $1',
          [email]
        )
        
        const user = result.rows[0]
        
        if (!user) {
          return null
        }
        
        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password_hash)
        
        if (!passwordMatch) {
          return null
        }
        
        // Return user object (will be stored in JWT)
        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
        }
      },
    }),
  ],
})