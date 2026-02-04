export default async function UserProfilePage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  const { username } = await params
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">@{username}</h1>
    </div>
  )
}