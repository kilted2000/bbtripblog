import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authConfig } from './lib/auth.config'
import { query } from './lib/db'
import { User } from './types/database'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string
        
        if (!email || !password) {
          return null
        }
        
        const result = await query<User>(
          'SELECT * FROM users WHERE email = $1',
          [email]
        )
        
        const user = result.rows[0]
        
        if (!user) {
          return null
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password_hash)
        
        if (!passwordMatch) {
          return null
        }
        
        return {
          id: user.id.toString(),
          name: user.username,
          email: user.email,
        }
      },
    }),
  ],
})