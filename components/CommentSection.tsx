import { getPostComments } from '@/lib/comments'
import { auth } from '@/auth'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

interface CommentSectionProps {
  postId: number
  slug: string
}

export default async function CommentSection({ postId, slug }: CommentSectionProps) {
  const [comments, session] = await Promise.all([
    getPostComments(postId),
    auth()
  ])

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment Form - only for logged in users */}
      {session?.user ? (
        <div className="mb-8">
          <CommentForm postId={postId} slug={slug} />
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-8 text-center">
          <p className="text-gray-600">
            <a href="/login" className="text-blue-500 hover:underline">Log in</a>
            {' '}to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              slug={slug}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}