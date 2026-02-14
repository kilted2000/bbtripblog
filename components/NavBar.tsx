import { auth } from '@/auth'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              TravelBlog
            </Link>
            <Link href="/explore" className="text-gray-600 hover:text-gray-900">
              Explore
            </Link>
            {session && (
              <Link href="/create" className="text-gray-600 hover:text-gray-900">
                Create Post
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href={`/${session.user?.name}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  @{session.user?.name}
                </Link>
                <form action={logout}>
                  <button
                    type="submit"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}