// app/(posts)/create/page.tsx
'use client'

import { useState } from 'react'

export default function CreatePostPage() {
  const [title, setTitle] = useState('')
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="border p-2 rounded w-full"
      />
      <p className="mt-2 text-gray-600">Title: {title}</p>
    </div>
  )
}