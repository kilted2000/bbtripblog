import pool from '@/lib/db'
import { Post } from '@/types/database'
import Link from 'next/link'

async function getPosts(): Promise<Post[]> {
  const result = await pool.query('SELECT * FROM posts ORDER BY created_at DESC')
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
            <p className="text-gray-600">{post.content}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}