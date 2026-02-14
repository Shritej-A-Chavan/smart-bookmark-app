'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AddBookmarkModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: { title: string; url: string }) => Promise<boolean | void>
}

export default function AddBookmarkModal({
  open,
  onClose,
  onSave,
}: AddBookmarkModalProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (loading) return

    setLoading(true)
    const success = await onSave({ title, url })
    setLoading(false)

    if (success !== false) {
      setTitle('')
      setUrl('')
      onClose()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={open => !loading && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content
          className="fixed top-1/2 left-1/2 max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          onEscapeKeyDown={e => loading && e.preventDefault()}
          onPointerDownOutside={e => loading && e.preventDefault()}
        >
          <Dialog.Title className="text-xl font-semibold mb-4">
            Add Bookmark
          </Dialog.Title>

          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              disabled={loading}
              onChange={e => setTitle(e.target.value)}
            />

            <Input
              placeholder="URL"
              value={url}
              disabled={loading}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
