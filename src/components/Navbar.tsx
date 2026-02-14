'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface NavbarProps {
  user?: { email: string } | null
  onLogin?: () => void
  onLogout?: () => void
  onAddBookmark?: () => void
}

export default function Navbar({ user, onLogin, onLogout, onAddBookmark }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-white z-50 border-b shadow-sm px-4 sm:px-8 py-4 absolute ">
      <div className="flex items-center justify-between mx-auto">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold tracking-tight">Smart Bookmark</span>
        </div>

        {/* Right: Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          {user && (
            <Button size="sm" variant="default" onClick={onAddBookmark} className='cursor-pointer'>
              Add Bookmark
            </Button>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium truncate max-w-xs">
                {user.email}
              </span>
              <Button size="sm" variant="outline" onClick={onLogout} className='cursor-pointer'> 
                Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="default" onClick={onLogin} className='cursor-pointer'>
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 space-y-5 px-2 z-50 bg-white">
          {user && (
            <Button
              size="sm"
              variant="default"
              className="w-full cursor-pointer"
              onClick={onAddBookmark}
            >
              Add Bookmark
            </Button>
          )}

          {user ? (
            <div className="flex flex-col gap-5 z-50 bg-white">
              <span className="text-gray-700 font-medium truncate">{user.email}</span>
              <Button size="sm" variant="outline" className="w-full cursor-pointer" onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="default" className="w-full cursor-pointer" onClick={onLogin}>
              Sign In
            </Button>
          )}
        </div>
      )}
    </nav>
  )
}
