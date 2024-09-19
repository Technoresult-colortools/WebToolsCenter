'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    setIsSearchOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
        setIsSearchOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Web<span className="text-blue-400">Tools</span>Center
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/categories" className="text-gray-300 hover:text-blue-400 transition duration-200">Categories</Link>
            <Link href="/about" className="text-gray-300 hover:text-blue-400 transition duration-200">About</Link>
            <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition duration-200">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </button>
            </form>
            <button 
              className="md:hidden text-gray-300 hover:text-white transition duration-200"
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <Search size={24} />
            </button>
            <button 
              className="md:hidden text-gray-300 hover:text-white transition duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isSearchOpen && (
          <form onSubmit={handleSearch} className="mt-4 md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search size={20} />
              </button>
            </div>
          </form>
        )}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <Link href="/categories" className="block py-2 text-gray-300 hover:text-blue-400 transition duration-200">Categories</Link>
            <Link href="/about" className="block py-2 text-gray-300 hover:text-blue-400 transition duration-200">About</Link>
            <Link href="/contact" className="block py-2 text-gray-300 hover:text-blue-400 transition duration-200">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  )
}