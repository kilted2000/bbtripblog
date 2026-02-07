import { query } from '@/lib/db'
import { PostPreview } from '@/types/database'
import Link from 'next/link'

async function getPosts(): Promise<PostPreview[]> {
  const result = await query<PostPreview>(
    'SELECT id, slug, title, created_at, status FROM posts WHERE status = $1 ORDER BY created_at DESC',
    ['published']
  )
  return result.rows
}

export default async function ExplorePage() {
  const posts = await getPosts()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link 
            key={post.id} 
            href={`/post/${post.slug}`}
            className="block border p-4 rounded hover:border-blue-500 transition"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              {post.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}