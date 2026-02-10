import NextAuth from 'next-auth'
import { authConfig } from './lib/auth.config'

export default NextAuth(authConfig).auth

export const config = {
  // Match all routes except static files and api routes
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}