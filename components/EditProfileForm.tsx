'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProfile, type ProfileResult } from '@/app/actions/user'
import { User } from '@/types/database'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  )
}

export default function EditProfileForm({ user }: { user: User }) {
  const initialState: ProfileResult = { success: true }
  const [state, formAction] = useActionState(updateProfile, initialState)
  
  return (
    <div>
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          {state.error}
        </div>
      )}
      {state?.success && state?.message && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
          {state.message}
        </div>
      )}
      
      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={user.username}
            required
            minLength={3}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={user.bio || ''}
            rows={4}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us about yourself..."
          />
        </div>
        
        <SubmitButton />
      </form>
    </div>
  )
}