'use client'

import { Suspense, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import AddBookmarkModal from '@/components/AddBookmarkModal'
import BookmarksTable from '@/components/BookmarksTable'
import SkeletonTable from '@/components/SkeletonTable'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
const PAGE_SIZE = 10

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      if (data.user) await fetchBookmarks(1, data.user)
      else setLoading(false)
    }
    fetchUser()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (!session?.user) {
        setBookmarks([])
        setPage(1)
        setTotalPages(1)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const fetchBookmarks = async (pageNo: number, currentUser?: any) => {
    const activeUser = currentUser || user
    if (!activeUser) {
      setLoading(false)
      return
    }

    setLoading(true)
    const from = (pageNo - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const { data, count, error } = await supabase
      .from('bookmarks')
      .select('*', { count: 'exact' })
      .eq('user_id', activeUser.id)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error(error)
      setBookmarks([])
      setTotalPages(1)
    } else if (data) {
      setBookmarks(data)
      setTotalPages(count ? Math.ceil(count / PAGE_SIZE) : 1)
      setPage(pageNo)
    }

    setLoading(false)
  }

 

  const isValidUrl = (value: string) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const normalizeUrl = (value: string) => {
    if (!/^https?:\/\//i.test(value)) {
      return `https://${value}`
    }
    return value
  }

  const handleAddBookmark = async ({ title, url }: { title: string; url: string }) => {
    if (!user) return

    const cleanTitle = title.trim()
    let cleanUrl = url.trim()

    if (!cleanTitle) {
      toast.error('Title is required.')
      return
    }

    if (cleanTitle.length < 2) {
      toast.error('Title must be at least 2 characters.')
      return
    }

    if (!cleanUrl) {
      toast.error('URL is required.')
      return
    }

    cleanUrl = normalizeUrl(cleanUrl)

    if (!isValidUrl(cleanUrl)) {
      toast.error('Please enter a valid URL.')
      return
    }

    // 🔵 Insert into DB (DB enforces uniqueness)
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        title: cleanTitle,
        url: cleanUrl.toLowerCase(),
        user_id: user.id
      })

    if (error) {
      if (error.code === '23505') {
        toast.error('Bookmark with same title or URL already exists.')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
      return
    }

    toast.success('Bookmark added successfully!')

    fetchBookmarks(1)
  }


  const handleDelete = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
    fetchBookmarks(page)
  }

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setBookmarks([])
    setPage(1)
    setTotalPages(1)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onAddBookmark={() => setAddOpen(true)}
      />

      <div className="p-10 flex flex-col gap-10 relative top-15">
        {/* HERO */}
        <main className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-medium">Welcome to Smart Bookmark</h1>
            <p className="text-lg text-muted-foreground">
              Save your favorite links, organize them, and access them anywhere.
            </p>
          </div>
          
          {!user && (
            <Button size="lg" onClick={handleLogin}>
              Sign in with Google
            </Button>
          )}
          
        </main>
        
        {/* Bookmarks Table */}
        {user && (
          <section className="">
            <Suspense fallback={<SkeletonTable />}>
              <BookmarksTable
                bookmarks={bookmarks}
                onDelete={handleDelete}
                loading={loading}
                page={page}
                totalPages={totalPages}
                onPageChange={fetchBookmarks} // no user prop needed
              />
            </Suspense>

            {/* Add Bookmark Modal */}
            <AddBookmarkModal
              open={addOpen}
              onClose={() => setAddOpen(false)}
              onSave={handleAddBookmark}
            />
          </section>
        )}
      </div>

    </div>
  )
}
