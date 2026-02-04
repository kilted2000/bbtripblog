'use client'
import { useState } from 'react'

export default function LikeButton({ postSlug }: { postSlug: string }) {
  const [liked, setLiked] = useState(false)
  
  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'} Like
    </button>
  )
}