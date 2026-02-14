'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils' // optional, for className merging

export const Modal = Dialog.Root
export const ModalTrigger = Dialog.Trigger
export const ModalContent = Dialog.Content
export const ModalHeader = Dialog.Title
export const ModalBody = Dialog.Description
export const ModalFooter = ({ className, children }: any) => (
  <div className={cn('flex justify-end gap-2', className)}>{children}</div>
)
