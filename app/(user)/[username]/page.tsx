import { query } from '@/lib/db'
import { User, Post } from '@/types/database'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import FollowButton from '@/components/FollowButton'

async function getUserByUsername(username: string): Promise<User | null> {
  const result = await query<User>(
    'SELECT id, username, bio, avatar_url, created_at FROM users WHERE username = $1',
    [username]
  )
  return result.rows[0] || null
}

async function getUserPosts(userId: number): Promise<Post[]> {
  const result = await query<Post>(
    'SELECT * FROM posts WHERE author_id = $1 AND status = $2 ORDER BY created_at DESC',
    [userId, 'published']
  )
  return result.rows
}

async function getFollowStats(userId: number, currentUserId?: number) {
  const result = await query<{
    followers_count: string
    following_count: string
    is_following: boolean
  }>(
    `SELECT
      (SELECT COUNT(*) FROM follows WHERE following_id = $1) as followers_count,
      (SELECT COUNT(*) FROM follows WHERE follower_id = $1) as following_count,
      ${currentUserId
        ? `EXISTS(SELECT 1 FROM follows WHERE follower_id = $2 AND following_id = $1)`
        : 'false'
      } as is_following`,
    currentUserId ? [userId, currentUserId] : [userId]
  )
  return result.rows[0]
}

export default async function UserProfilePage({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  const [user, session] = await Promise.all([
    getUserByUsername(username),
    auth()
  ])

  if (!user) {
    notFound()
  }

  const currentUserId = session?.user?.id
    ? parseInt(session.user.id)
    : undefined

  const [posts, stats] = await Promise.all([
    getUserPosts(user.id),
    getFollowStats(user.id, currentUserId)
  ])

  const isOwnProfile = session?.user?.name === username

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              user.username[0].toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">@{user.username}</h1>
              {isOwnProfile ? (
                <Link
                  href="/settings"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition text-sm"
                >
                  Edit Profile
                </Link>
              ) : session ? (
                <FollowButton
                  followingId={user.id}
                  username={username}
                  initialIsFollowing={stats.is_following}
                />
              ) : (
                <Link
                  href="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                >
                  Follow
                </Link>
              )}
            </div>
            {user.bio && (
              <p className="text-gray-600 mb-4">{user.bio}</p>
            )}
            <div className="flex space-x-6 text-sm text-gray-500">
              <span><strong>{posts.length}</strong> posts</span>
              <span><strong>{stats.followers_count}</strong> followers</span>
              <span><strong>{stats.following_count}</strong> following</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No posts yet</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="block bg-white rounded-lg shadow p-6 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                <p className="text-sm text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}