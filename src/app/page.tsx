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
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data.session?.user ?? null
      setUser(sessionUser)

      if (sessionUser) {
        fetchBookmarks(1, sessionUser)
      }
    })

    // 2️⃣ Listen to auth changes (login/logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null
        setUser(sessionUser)

        if (sessionUser) {
          fetchBookmarks(1, sessionUser)
        } else {
          setBookmarks([])
          setPage(1)
          setTotalPages(1)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        payload => {
          setBookmarks(prev => {
            if (payload.eventType === 'INSERT') {
              if (prev.some(b => b.id === payload.new.id)) return prev

              if (page === 1) {
                return [payload.new, ...prev].slice(0, PAGE_SIZE)
              }

              return prev
            }

            if (payload.eventType === 'DELETE') {
              return prev.filter(b => b.id !== payload.old.id)
            }

            return prev
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, page])



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

  const handleAddBookmark = async ({
    title,
    url,
  }: {
    title: string
    url: string
  }): Promise<boolean> => {
    if (!user) return false

    const cleanTitle = title.trim()
    let cleanUrl = url.trim()

    if (!cleanTitle) {
      toast.error('Title is required.')
      return false
    }

    if (cleanTitle.length < 2) {
      toast.error('Title must be at least 2 characters.')
      return false
    }

    if (!cleanUrl) {
      toast.error('URL is required.')
      return false
    }

    cleanUrl = normalizeUrl(cleanUrl)

    if (!isValidUrl(cleanUrl)) {
      toast.error('Please enter a valid URL.')
      return false
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .insert({
        title: cleanTitle,
        url: cleanUrl.toLowerCase(),
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        toast.error('Bookmark with same title or URL already exists.')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
      return false
    }

    if (page === 1 && data) {
      setBookmarks(prev => [data, ...prev].slice(0, PAGE_SIZE))
    }

    toast.success('Bookmark added successfully!')
    return true
  }


  const handleDelete = async (id: string) => {
    const previous = bookmarks

    setBookmarks(prev => prev.filter(b => b.id !== id))

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', id)

    if (error) {
      setBookmarks(previous)
      toast.error('Failed to delete bookmark.')
    }
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
        <main className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-medium">Welcome to Smart Bookmark</h1>
            <p className="text-lg text-muted-foreground">
              Save your favorite links, organize them, and access them anywhere.
            </p>
          </div>
          
          {!user && (
            <div className='text-muted-foreground space-y-2'>
              <p>Sign in to start saving and organizing your bookmarks</p>
              <Button size="lg" className='w-fit cursor-pointer' onClick={handleLogin}>
                Sign in with Google
              </Button>
            </div>
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
