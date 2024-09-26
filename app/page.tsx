'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, ArrowRight, Star } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faInstagram,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import { faFont, faImage, faPalette, faCode, faDroplet, faShare, faWrench } from '@fortawesome/free-solid-svg-icons'

type Tool = {
  name: string;
  category: string;
  href: string;
  icon: IconDefinition;
  description: string;
}

const categories = [
  { name: 'Text', icon: faFont },
  { name: 'Image', icon: faImage },
  { name: 'CSS', icon: faPalette },
  { name: 'Coding', icon: faCode },
  { name: 'Color', icon: faDroplet },
  { name: 'Social Media', icon: faShare },
  { name: 'Misc', icon: faWrench },
]

const allTools: Tool[] = [
  // Text Tools
  { name: 'Case Converter', category: 'Text', href: '/tools/text/case-converter', icon: faFont, description: 'Convert text to different cases.' },
  { name: 'Lorem Ipsum Generator', category: 'Text', href: '/tools/text/lorem-ipsum-generator', icon: faFont, description: 'Generate placeholder text.' },
  { name: 'Text Reverser', category: 'Text', href: '/tools/text/text-reverser', icon: faFont, description: 'Reverse any string of text.' },

  // Image Tools
  { name: 'Image Cropper', category: 'Image', href: '/tools/image/image-cropper', icon: faImage, description: 'Crop and resize images online.' },
  { name: 'Image Filters', category: 'Image', href: '/tools/image/image-filters', icon: faImage, description: 'Apply filters to your images.' },
  { name: 'Image Resizer', category: 'Image', href: '/tools/image/image-resizer', icon: faImage, description: 'Resize images to specific dimensions.' },

  // CSS Tools
  { name: 'CSS Gradient Generator', category: 'CSS', href: '/tools/css/gradient-generator', icon: faPalette, description: 'Create beautiful CSS gradients.' },
  { name: 'CSS Box Shadow Generator', category: 'CSS', href: '/tools/css/box-shadow-generator', icon: faPalette, description: 'Generate CSS box shadows.' },
  { name: 'CSS Flexbox Generator', category: 'CSS', href: '/tools/css/flexbox-generator', icon: faPalette, description: 'Create CSS flexbox layouts.' },

  // Coding Tools
  { name: 'Code Formatter', category: 'Coding', href: '/tools/coding/code-formatter', icon: faCode, description: 'Format and beautify your code.' },
  { name: 'JSON Validator', category: 'Coding', href: '/tools/coding/json-validator', icon: faCode, description: 'Validate and format JSON data.' },
  { name: 'Regex Tester', category: 'Coding', href: '/tools/coding/regex-tester', icon: faCode, description: 'Test and debug regular expressions.' },

  // Color Tools
  { name: 'Color Picker', category: 'Color', href: '/tools/color/color-picker', icon: faDroplet, description: 'Pick colors from images or create custom palettes.' },
  { name: 'Color Converter', category: 'Color', href: '/tools/color/color-converter', icon: faDroplet, description: 'Convert between color formats.' },
  { name: 'Color Palette Generator', category: 'Color', href: '/tools/color/palette-generator', icon: faDroplet, description: 'Generate color palettes for your designs.' },

  // Social Media Tools
  { name: 'Instagram Filters', category: 'Social Media', href: '/tools/social-media/instagram-filters', icon: faInstagram, description: 'Apply filters to your Instagram photos.' },
  { name: 'Tweet Generator', category: 'Social Media', href: '/tools/social-media/tweet-generator', icon: faTwitter, description: 'Generate tweets for Twitter.' },
  { name: 'YouTube Thumbnail Downloader', category: 'Social Media', href: '/tools/social-media/youtube-thumbnail-downloader', icon: faYoutube, description: 'Download YouTube video thumbnails.' },

  // Miscellaneous Tools
  { name: 'Password Generator', category: 'Misc', href: '/tools/misc/password-generator', icon: faWrench, description: 'Generate secure passwords.' },
  { name: 'QR Code Generator', category: 'Misc', href: '/tools/misc/qr-code-generator', icon: faWrench, description: 'Create QR codes for various purposes.' },
  { name: 'URL Shortener', category: 'Misc', href: '/tools/misc/url-shortener', icon: faWrench, description: 'Shorten long URLs for easy sharing.' },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTools, setFilteredTools] = useState(allTools)
  const [activeCategory, setActiveCategory] = useState('All')
  const [favorites, setFavorites] = useState<string[]>([])

  const handleSearch = useCallback((term: string) => {
    const filtered = allTools.filter(tool =>
      tool.name.toLowerCase().includes(term.toLowerCase()) ||
      tool.category.toLowerCase().includes(term.toLowerCase()) ||
      tool.description.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredTools(filtered)
  }, [])

  useEffect(() => {
    handleSearch(searchTerm)
  }, [searchTerm, handleSearch])

  const toggleFavorite = (toolName: string) => {
    setFavorites(prev => 
      prev.includes(toolName) 
        ? prev.filter(name => name !== toolName)
        : [...prev, toolName]
    )
  }

  const renderToolCard = (tool: Tool) => (
    <div key={tool.name} className="bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300 flex flex-col justify-between h-full relative">
      <div>
        <FontAwesomeIcon icon={tool.icon} className="text-3xl text-blue-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
        <p className="text-gray-400 mb-4">{tool.description}</p>
      </div>
      <div className="flex justify-between items-center">
        <Link href={tool.href}>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full">
            Try it now <ChevronRight size={20} className="ml-1" />
          </Button>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(tool.name)}
                className="text-yellow-400 hover:text-yellow-300"
              >
                <Star className={favorites.includes(tool.name) ? "fill-current" : ""} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{favorites.includes(tool.name) ? 'Remove from favorites' : 'Add to favorites'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Web<span className="text-blue-400">Tools</span>Center</h1>
          <p className="text-xl text-gray-400 mb-8">Your One-Stop Solution for Web Development Tools</p>
          <div className="relative w-full max-w-2xl mx-auto">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tools..."
              className="w-full px-6 py-3 bg-gray-800 text-white border-gray-700 rounded-full pr-12 text-lg"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Categories</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => setActiveCategory('All')}
              className={`${activeCategory === 'All' ? 'bg-blue-500' : 'bg-gray-700'} text-white font-semibold py-2 px-4 rounded-full`}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`${activeCategory === category.name ? 'bg-blue-500' : 'bg-gray-700'} text-white font-semibold py-2 px-4 rounded-full`}
              >
                <FontAwesomeIcon icon={category.icon} className="mr-2" />
                {category.name}
              </Button>
            ))}
          </div>
        </section>

        {(activeCategory === 'All' ? categories : categories.filter(cat => cat.name === activeCategory)).map((category) => {
          const categoryTools = filteredTools.filter(tool => tool.category === category.name)
          if (categoryTools.length === 0) return null

          return (
            <section key={category.name} className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <FontAwesomeIcon icon={category.icon} className="mr-3 text-blue-400" />
                  {category.name} Tools
                </h2>
                <Link href={`/tools/${category.name.toLowerCase()}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.slice(0, 3).map(renderToolCard)}
              </div>
            </section>
          )
        })}

        {favorites.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Star className="mr-3 text-yellow-400" />
              Your Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTools.filter(tool => favorites.includes(tool.name)).map(renderToolCard)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}