'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { createComment, type CommentResult } from '@/app/actions/comments'

function SubmitButton({ label = 'Post Comment' }: { label?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 text-sm"
    >
      {pending ? 'Posting...' : label}
    </button>
  )
}

interface CommentFormProps {
  postId: number
  slug: string
  parentId?: number | null
  onCancel?: () => void
  placeholder?: string
}

export default function CommentForm({ 
  postId, 
  slug, 
  parentId = null,
  onCancel,
  placeholder = 'Write a comment...'
}: CommentFormProps) {
  const initialState: CommentResult = { success: true }
  const [state, formAction] = useActionState(createComment, initialState)

  return (
    <form action={formAction} className="space-y-2">
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
          {state.error}
        </div>
      )}

      {/* Hidden fields */}
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="slug" value={slug} />
      {parentId && <input type="hidden" name="parent_id" value={parentId} />}

      <textarea
        name="content"
        rows={3}
        required
        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        placeholder={placeholder}
      />

      <div className="flex space-x-2">
        <SubmitButton label={parentId ? 'Post Reply' : 'Post Comment'} />
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-600 px-4 py-2 rounded hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}