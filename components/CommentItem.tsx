'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { NestedComment } from '@/types/database'
import { deleteComment, type CommentResult } from '@/app/actions/comments'
import CommentForm from './CommentForm'

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  )
}

interface CommentItemProps {
  comment: NestedComment
  postId: number
  slug: string
  currentUserId?: string
  isReply?: boolean
}

export default function CommentItem({ 
  comment, 
  postId, 
  slug, 
  currentUserId,
  isReply = false
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const initialState: CommentResult = { success: true }
  const [, deleteAction] = useActionState(deleteComment, initialState)

  const isOwner = currentUserId === comment.author_id.toString()

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-gray-100 pl-4' : ''}`}>
      <div className="bg-white rounded-lg p-4 mb-2">
        {/* Comment Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">
              {comment.avatar_url ? (
                <img 
                  src={comment.avatar_url} 
                  alt={comment.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                comment.username[0].toUpperCase()
              )}
            </div>
            <span className="font-medium text-sm">@{comment.username}</span>
            <span className="text-gray-400 text-xs">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Delete button for own comments */}
          {isOwner && (
            <form action={deleteAction}>
              <input type="hidden" name="comment_id" value={comment.id} />
              <input type="hidden" name="slug" value={slug} />
              <DeleteButton />
            </form>
          )}
        </div>

        {/* Comment Content */}
        <p className="text-gray-800 text-sm mb-2">{comment.content}</p>

        {/* Reply Button - only on top-level comments */}
        {!isReply && currentUserId && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-500 hover:text-blue-700 text-xs"
          >
            {showReplyForm ? 'Cancel' : 'Reply'}
          </button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-8 mb-2">
          <CommentForm
            postId={postId}
            slug={slug}
            parentId={comment.id}
            onCancel={() => setShowReplyForm(false)}
            placeholder={`Reply to @${comment.username}...`}
          />
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={{ ...reply, replies: [] }}
              postId={postId}
              slug={slug}
              currentUserId={currentUserId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}