'use client'

import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000',
      },
    })

    if (error) {
      alert(error.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Smart Bookmark
        </h1>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="h-5 w-5"
          />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}
