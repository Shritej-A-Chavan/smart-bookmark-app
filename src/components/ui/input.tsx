'use client'

import React, { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils' // optional utility for className merging

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500',
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
