'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { followUser, unfollowUser, type FollowResult } from '@/app/actions/follows'

function FollowSubmitButton({ isFollowing }: { isFollowing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-4 py-2 rounded text-sm font-medium transition disabled:opacity-50 ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-red-100 hover:text-red-600'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {pending ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  )
}

interface FollowButtonProps {
  followingId: number
  username: string
  initialIsFollowing: boolean
}

export default function FollowButton({
  followingId,
  username,
  initialIsFollowing
}: FollowButtonProps) {
  const initialState: FollowResult = { success: true }
  const action = initialIsFollowing ? unfollowUser : followUser
  const [, formAction] = useActionState(action, initialState)

  return (
    <form action={formAction}>
      <input type="hidden" name="following_id" value={followingId} />
      <input type="hidden" name="username" value={username} />
      <FollowSubmitButton isFollowing={initialIsFollowing} />
    </form>
  )
}