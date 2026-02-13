'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome {user.email}
        </h2>

        <button
          onClick={handleLogout}
          className="mt-6 rounded-xl bg-red-500 px-6 py-2 text-white transition hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
