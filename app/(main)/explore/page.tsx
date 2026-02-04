// Example: app/(main)/explore/page.tsx
// app/(main)/explore/page.tsx
// This can fetch data directly!
async function getPosts() {
  // You could query your database directly here
  // For now, mock data
  return [
    { id: 1, title: 'Bali Adventure', slug: 'bali-adventure' },
    { id: 2, title: 'Tokyo Nights', slug: 'tokyo-nights' }
  ]
}

export default async function ExplorePage() {
  const posts = await getPosts()
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="border p-4 rounded">
            <h2>{post.title}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}