import pool from '@/lib/db'

async function getPosts() {
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
          <div key={post.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-600">{post.content}</p>
            <p className="text-sm text-gray-400 mt-2">
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}