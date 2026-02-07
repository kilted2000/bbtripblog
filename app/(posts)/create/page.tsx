'use client'

import { createPost, type ActionResult } from '@/app/actions/posts'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'

const initialState: ActionResult = { success: true }

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
    >
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  )
}

export default function CreatePostPage() {
  const [state, formAction] = useActionState(createPost, initialState)
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
      
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}
      
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            minLength={3}
            className="w-full border p-2 rounded"
            placeholder="My Amazing Trip..."
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            minLength={10}
            rows={10}
            className="w-full border p-2 rounded"
            placeholder="Tell us about your adventure..."
          />
        </div>
        
        <SubmitButton />
      </form>
    </div>
  )
}