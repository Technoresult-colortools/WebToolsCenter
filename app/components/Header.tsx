'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'


// Define the structure for our tools
interface Tool {
  name: string;
  category: string;
  path: string;
}

// Create a list of all tools
const allTools: Tool[] = [
  // Text Tools
  { name: 'Case Converter', category: 'Text Tools', path: '/tools/text/case-converter' },
  { name: 'Letter Counter', category: 'Text Tools', path: '/tools/text/letter-counter' },
  { name: 'Lorem Ipsum Generator', category: 'Text Tools', path: '/tools/text/lorem-ipsum-generator' },
  { name: 'Words Counter', category: 'Text Tools', path: '/tools/text/words-counter' },
  { name: 'Whitespace Remover', category: 'Text Tools', path: '/tools/text/whitespace-remover' },
  { name: 'Google Fonts Pair Finder', category: 'Text Tools', path: '/tools/text/google-fonts-pair-finder' },
  { name: 'Text Reverser', category: 'Text Tools', path: '/tools/text/text-reverser' },
  { name: 'Character Frequency Counter', category: 'Text Tools', path: '/tools/text/character-frequency-counter' },
  { name: 'Text to ASCII/Hex/Binary Converter', category: 'Text Tools', path: '/tools/text/text-to-ascii-hex-binary' },
  { name: 'Title Case Converter', category: 'Text Tools', path: '/tools/text/title-case-converter' },
  { name: 'Duplicate Line Remover', category: 'Text Tools', path: '/tools/text/duplicate-line-remover' },
  { name: 'HTML Encoder/Decoder', category: 'Text Tools', path: '/tools/text/html-encoder-decoder' },
  { name: 'Markdown to HTML Converter', category: 'Text Tools', path: '/tools/text/markdown-to-html' },
  { name: 'Word Scrambler', category: 'Text Tools', path: '/tools/text/word-scrambler' },

  // Image Tools
  { name: 'Image Cropper', category: 'Image Tools', path: '/tools/image/image-cropper' },
  { name: 'Image Filters', category: 'Image Tools', path: '/tools/image/image-filters' },
  { name: 'Image Resizer', category: 'Image Tools', path: '/tools/image/image-resizer' },
  { name: 'Image Average Color Finder', category: 'Image Tools', path: '/tools/image/image-average-color-finder' },
  { name: 'Image Color Extractor', category: 'Image Tools', path: '/tools/image/image-color-extractor' },
  { name: 'Image Color Picker', category: 'Image Tools', path: '/tools/image/image-color-picker' },
  { name: 'SVG Blob Generator', category: 'Image Tools', path: '/tools/image/svg-blob-generator' },
  { name: 'SVG Pattern Generator', category: 'Image Tools', path: '/tools/image/svg-pattern-generator' },
  { name: 'Photo Censor', category: 'Image Tools', path: '/tools/image/photo-censor' },
  { name: 'SVG to PNG Converter', category: 'Image Tools', path: '/tools/image/svg-to-png-converter' },
  { name: 'Image to Base64 Converter', category: 'Image Tools', path: '/tools/image/image-to-base64-converter' },

  // CSS Tools

    { name: 'CSS Clip Path Generator', category: 'CSS Tools', path: '/tools/css/clip-path-generator' },
    { name: 'CSS Loader Generator', category: 'CSS Tools', path: '/tools/css/loader-generator' },
    { name: 'CSS Background Pattern Generator', category: 'CSS Tools', path: '/tools/css/background-pattern-generator' },
    { name: 'CSS Cubic Bezier Generator', category: 'CSS Tools', path: '/tools/css/cubic-bezier-generator' },
    { name: 'CSS Glassmorphism Generator', category: 'CSS Tools', path: '/tools/css/glassmorphism-generator' },
    { name: 'CSS Text Glitch Effect Generator', category: 'CSS Tools', path: '/tools/css/text-glitch-effect-generator' },
    { name: 'CSS Gradient Generator', category: 'CSS Tools', path: '/tools/css/gradient-generator' },
    { name: 'CSS Triangle Generator', category: 'CSS Tools', path: '/tools/css/triangle-generator' },
    { name: 'CSS Box Shadow Generator', category: 'CSS Tools', path: '/tools/css/box-shadow-generator' },
    { name: 'CSS Border Radius Generator', category: 'CSS Tools', path: '/tools/css/border-radius-generator' },
    { name: 'CSS FlexBox Generator', category: 'CSS Tools', path: '/tools/css/flexbox-generator' },
// Color Tools

{ name: 'Image Color Picker', category: 'Color Tools', path: '/tools/color/image-color-picker' },
  { name: 'Image Color Extractor', category: 'Color Tools', path: '/tools/color/image-color-extractor' },
  { name: 'Hex to RGBA Converter', category: 'Color Tools', path: '/tools/color/hex-to-rgba' },
  { name: 'RGBA to Hex Converter', category: 'Color Tools', path: '/tools/color/rgba-to-hex' },
  { name: 'HSV to RGB Converter', category: 'Color Tools', path: '/tools/color/hsv-to-rgb' },
  { name: 'RGB to HSV Converter', category: 'Color Tools', path: '/tools/color/rgb-to-hsv' },
  { name: 'CMYK to RGB Converter', category: 'Color Tools', path: '/tools/color/cmyk-to-rgb' },
  { name: 'Color Mixer', category: 'Color Tools', path: '/tools/color/color-mixer' },
  { name: 'Color Shades Generator', category: 'Color Tools', path: '/tools/color/color-shades-generator' },
  { name: 'RGB to CMYK Converter', category: 'Color Tools', path: '/tools/color/rgb-to-cmyk' },
  { name: 'HSL to RGB Converter', category: 'Color Tools', path: '/tools/color/hsl-to-rgb' },
  { name: 'HSL to HEX Converter', category: 'Color Tools', path: '/tools/color/hsl-to-hex' },
  { name: 'HSV to Hex Converter', category: 'Color Tools', path: '/tools/color/hsv-to-hex' },
  { name: 'RGB to HSL Converter', category: 'Color Tools', path: '/tools/color/rgb-to-hsl' },
  { name: 'Color Name Generator', category: 'Color Tools', path: '/tools/color/color-name-generator' },
  { name: 'Color Palette Generator', category: 'Color Tools', path: '/tools/color/color-palette-generator' },
  { name: 'Color Wheel', category: 'Color Tools', path: '/tools/color/color-wheel' },
  { name: 'Gradient Generator', category: 'Color Tools', path: '/tools/color/color-gradient-generator' },
  { name: 'Tailwind CSS Color Palette', category: 'Color Tools', path: '/tools/color/tailwind-color-generator' },
  
  //Coding Tools
  { name: 'Code to Image Converter', category: 'Coding Tools', path: '/tools/coding/code-to-image-converter' },
  { name: 'URL Slug Generator', category: 'Coding Tools', path: '/tools/coding/url-slug-generator' },
  { name: 'React Native Shadow Generator', category: 'Coding Tools', path: '/tools/coding/react-native-shadow-generator' },
  { name: 'Base64 Encoder/Decoder', category: 'Coding Tools', path: '/tools/coding/base64-encoder-decoder' },
  { name: 'HTML Encoder/Decoder', category: 'Coding Tools', path: '/tools/coding/html-encoder-decoder' },
  { name: 'URL Encoder/Decoder', category: 'Coding Tools', path: '/tools/coding/url-encoder-decoder' },
  { name: 'HTML Minifier', category: 'Coding Tools', path: '/tools/coding/html-minifier' },
  { name: 'CSS Minifier', category: 'Coding Tools', path: '/tools/coding/css-minifier' },
  { name: 'JavaScript Minifier', category: 'Coding Tools', path: '/tools/coding/javascript-minifier' },
  { name: 'HTML Formatter', category: 'Coding Tools', path: '/tools/coding/html-formatter' },
  { name: 'CSS Formatter', category: 'Coding Tools', path: '/tools/coding/css-formatter' },
  { name: 'JavaScript Formatter', category: 'Coding Tools', path: '/tools/coding/javascript-formatter' },
  { name: 'MD5 Generator and Verifier', category: 'Coding Tools', path: '/tools/coding/md5-encrypt-verify' },
  { name: 'SHA1 Encrypt and Verifier', category: 'Coding Tools', path: '/tools/coding/sha1-encrypt-verify' },
  { name: 'SHA224 Encrypt and Verifier', category: 'Coding Tools', path: '/tools/coding/sha224-encrypt-verify' },
  { name: 'SHA256 Encrypt and Verifier', category: 'Coding Tools', path: '/tools/coding/sha256-encrypt-verify' },
  { name: 'SHA384 Encrypt and Verifier', category: 'Coding Tools', path: '/tools/coding/sha384-encrypt-verify' },
  { name: 'SHA512 Encrypt and Verifier', category: 'Coding Tools', path: '/tools/coding/sha512-encrypt-verify' },
  { name: 'JWT Encoder/Decoder', category: 'Coding Tools', path: '/tools/coding/jwt-encoder-decoder' },
  { name: 'Advance JSON Tree Viewer', category: 'Coding Tools', path: '/tools/coding/json-tree-viewer' },

  //Misc Tools
  { name: 'Advance Password Generator', category: 'Miscellaneous Tools', path: '/tools/misc/advance-password-generator' },
  { name: 'List Randomizer', category: 'Miscellaneous Tools', path: '/tools/misc/list-randomizer' },
  { name: 'QR Code Generator', category: 'Miscellaneous Tools', path: '/tools/misc/qr-code-generator' },
  { name: 'BarCode Generator', category: 'Miscellaneous Tools', path: '/tools/misc/barcode-generator' },
  { name: 'Unit Converter', category: 'Miscellaneous Tools', path: '/tools/misc/unit-converter' },
  //Social-Media Tools
    { name: 'Instagram Filters', category: 'Social Media Tools', path: '/tools/social-media/instagram-filters' },
    { name: 'Instagram Post Generator', category: 'Social Media Tools', path: '/tools/social-media/instagram-post-generator' },
    { name: 'Instagram Photo Downloader', category: 'Social Media Tools', path: '/tools/social-media/instagram-photo-downloader' },
    { name: 'Tweet Generator', category: 'Social Media Tools', path: '/tools/social-media/tweet-generator' },
    { name: 'Tweet to Image Converter', category: 'Social Media Tools', path: '/tools/social-media/tweet-to-image-converter' },
    { name: 'YouTube Thumbnail Downloader', category: 'Social Media Tools', path: '/tools/social-media/youtube-thumbnail-downloader' },
  
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Tool[]>([])
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === '') {
      setSearchResults([])
    } else {
      const filteredTools = allTools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filteredTools)
    }
  }

  const handleToolSelect = (tool: Tool) => {
    router.push(tool.path)
    setSearchQuery('')
    setSearchResults([])
    setIsSearchOpen(false)
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
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([])
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg">
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
            <div className="relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setIsSearchOpen(true)}
                className="pl-10 pr-4 py-2 rounded-full bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 w-full md:w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              {isSearchOpen && searchResults.length > 0 && (
                <div className="absolute mt-2 w-full bg-gray-700 rounded-md shadow-lg overflow-hidden z-50">
                  <div className="max-h-60 overflow-y-auto">
                    {searchResults.map((tool, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-600 cursor-pointer text-white"
                        onClick={() => handleToolSelect(tool)}
                      >
                        <div className="font-semibold">{tool.name}</div>
                        <div className="text-sm text-gray-400">{tool.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button 
              className="md:hidden text-gray-300 hover:text-white transition duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
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