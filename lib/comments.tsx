import { query } from '@/lib/db'
import { CommentWithAuthor, NestedComment } from '@/types/database'

export async function getPostComments(postId: number): Promise<NestedComment[]> {
  // Fetch all comments with author info in one query
  const result = await query<CommentWithAuthor>(
    `SELECT 
      c.id,
      c.content,
      c.post_id,
      c.author_id,
      c.parent_id,
      c.created_at,
      c.updated_at,
      u.username,
      u.avatar_url
    FROM comments c
    JOIN users u ON c.author_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC`,
    [postId]
  )

  const comments = result.rows

  // Separate top-level comments and replies
  const topLevel = comments.filter(c => c.parent_id === null)
  const replies = comments.filter(c => c.parent_id !== null)

  // Nest replies under their parent comments
  const nested: NestedComment[] = topLevel.map(comment => ({
    ...comment,
    replies: replies.filter(reply => reply.parent_id === comment.id)
  }))

  return nested
}