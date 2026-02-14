'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from './ui/button'

interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
}

interface BookmarksTableProps {
  bookmarks: Bookmark[]
  onDelete: (id: string) => void
  loading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function BookmarksTable({
  bookmarks,
  onDelete,
  loading,
  page,
  totalPages,
  onPageChange,
}: BookmarksTableProps) {
  const [sortAsc, setSortAsc] = useState(false)

  const sortedBookmarks = [...bookmarks].sort((a, b) =>
    sortAsc
      ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const handleSortToggle = () => setSortAsc(!sortAsc)
  const handlePrevPage = () => onPageChange(Math.max(1, page - 1))
  const handleNextPage = () => onPageChange(Math.min(totalPages, page + 1))

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-sm border border-gray-200">
        <Table className="min-w-full table-auto">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="w-1/4">Title</TableHead>
              <TableHead className="w-2/4">URL</TableHead>
              <TableHead
                className="w-1/4 cursor-pointer select-none"
                onClick={handleSortToggle}
              >
                Created At <span>{sortAsc ? '↑' : '↓'}</span>
              </TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, idx) => (
                <TableRow key={idx} className="hover:bg-gray-50">
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                </TableRow>
              ))
            ) : bookmarks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                  No bookmarks yet. Click "Add Bookmark" to get started.
                </TableCell>
              </TableRow>
            ) : (
              sortedBookmarks.map((b) => (
                <TableRow key={b.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{b.title}</TableCell>
                  <TableCell className="text-blue-600 underline break-all">
                    <a href={b.url} target="_blank" rel="noopener noreferrer">
                      {b.url}
                    </a>
                  </TableCell>
                  <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <button
                      className='border-none outline-none text-red-500 cursor-pointer px-2 font-medium'
                      onClick={() => onDelete(b.id)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!loading && bookmarks.length > 0 && (
        <div className="flex justify-end items-center gap-5 mt-2 text-sm text-gray-600">
          <Button size="sm" onClick={handlePrevPage} disabled={page === 1} className='cursor-pointer'>
            Previous
          </Button>
          <span>
            Page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
          </span>
          <Button size="sm" onClick={handleNextPage} disabled={page === totalPages} className='cursor-pointer'>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
