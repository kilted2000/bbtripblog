import LikeButton from '@/components/LikeButton'

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // Fetch post data from DB here
  
  return (
    <div className="p-8">
      <h1>{slug}</h1>
      <LikeButton postSlug={slug} /> {/* Client Component inside Server Component! */}
    </div>
  )
}