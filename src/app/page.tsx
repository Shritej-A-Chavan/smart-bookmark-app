'use client'

import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const connection = async () => {
      const { data, error } = await supabase.from('bookmarks').select('*')

      if (error) {
        console.error('Supabase error:', error)
      } else {
        console.log('Supabase connected:', data)
      }
    }

    connection()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1>Home</h1>
    </div>
  );
}
