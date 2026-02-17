import { auth } from '@/auth'
import { query } from '@/lib/db'
import { User } from '@/types/database'
import { redirect } from 'next/navigation'
import EditProfileForm from '@/components/EditProfileForm'

async function getUserById(id: number): Promise<User | null> {
  const result = await query<User>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  )
  return result.rows[0] || null
}

export default async function SettingsPage() {
  const session = await auth()
  
  // Redirect if not logged in
  if (!session?.user?.id) {
    redirect('/login')
  }
  
  const user = await getUserById(parseInt(session.user.id))
  
  if (!user) {
    redirect('/login')
  }
  
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Edit Profile</h1>
      <EditProfileForm user={user} />
    </div>
  )
}