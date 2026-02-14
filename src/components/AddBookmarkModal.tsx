'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddBookmarkModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: { title: string; url: string }) => Promise<void>
}

export default function AddBookmarkModal({ open, onClose, onSave }: AddBookmarkModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!title || !url) return
    setLoading(true)
    await onSave({ title, url })
    setLoading(false)
    setTitle('')
    setUrl('')
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        {/* Black overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Centered card */}
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform -translate-x-1/2 -translate-y-1/2 focus:outline-none">
          <Dialog.Title className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Add Bookmark
          </Dialog.Title>

          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button className='cursor-pointer' variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className='cursor-pointer' onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
