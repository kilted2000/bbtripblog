import { query } from '@/lib/db'
import { Post } from '@/types/database'
import LikeButton from '@/components/LikeButton'

async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await query<Post>(
    'SELECT * FROM posts WHERE slug = $1', 
    [slug]
  )
  return result.rows[0] || null
}

export default async function PostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  
  if (!post) {
    return <div className="p-8">Post not found</div>
  }
  
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-500 mb-6">
        {new Date(post.created_at).toLocaleDateString()}
      </p>
      <div className="prose mb-6">
        <p>{post.content}</p>
      </div>
      <LikeButton postSlug={slug} />
    </div>
  )
}