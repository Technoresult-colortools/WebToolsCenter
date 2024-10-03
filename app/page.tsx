'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronRight, Search, ArrowRight, Zap, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
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
  { name: 'Code to Image Converter', category: 'Coding', href: '/tools/coding/code-to-image-converter', icon: faCode, description: 'Convert your code to image.' },
  { name: 'JSON Validator', category: 'Coding', href: '/tools/coding/json-validator', icon: faCode, description: 'Validate and format JSON data.' },
  { name: 'JavaScript Minifier', category: 'Coding', href: '/tools/coding/javascript-minifier', icon: faCode, description: 'Minify Your JS Files.' },

  // Color Tools
  { name: 'Color Picker', category: 'Color', href: 'tools/color/image-color-picker', icon: faDroplet, description: 'Pick colors from images or create custom palettes.' },
  { name: 'Color Converter', category: 'Color', href: '/tools/color/color-converter', icon: faDroplet, description: 'Convert between color formats.' },
  { name: 'Color Palette Generator', category: 'Color', href: 'tools/color/color-palette-generator', icon: faDroplet, description: 'Generate color palettes for your designs.' },

  // Social Media Tools
  { name: 'Instagram Filters', category: 'Social Media', href: '/tools/social-media/instagram-filters', icon: faInstagram, description: 'Apply filters to your Instagram photos.' },
  { name: 'Tweet Generator', category: 'Social Media', href: '/tools/social-media/tweet-generator', icon: faTwitter, description: 'Generate tweets for Twitter.' },
  { name: 'YouTube Thumbnail Downloader', category: 'Social Media', href: '/tools/social-media/youtube-thumbnail-downloader', icon: faYoutube, description: 'Download YouTube video thumbnails.' },

  // Miscellaneous Tools
  { name: 'Password Generator', category: 'Misc', href: 'tools/misc/advance-password-generator', icon: faWrench, description: 'Generate secure passwords.' },
  { name: 'QR Code Generator', category: 'Misc', href: '/tools/misc/qr-code-generator', icon: faWrench, description: 'Create QR codes for various purposes.' },
  { name: 'URL Shortener', category: 'Misc', href: '/tools/misc/url-shortener', icon: faWrench, description: 'Shorten long URLs for easy sharing.' },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTools, setFilteredTools] = useState(allTools)
  const [activeCategory, setActiveCategory] = useState('All')

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

  const renderToolCard = (tool: Tool) => (
    <div key={tool.name} className="bg-gray-800 rounded-xl shadow-lg p-4 transform hover:scale-105 transition duration-300 flex flex-col justify-between h-full">
      <div>
        <FontAwesomeIcon icon={tool.icon} className="text-3xl text-blue-400 mb-2" />
        <h3 className="text-lg font-bold text-white mb-1">{tool.name}</h3>
        <p className="text-sm text-gray-400 mb-2">{tool.description}</p>
      </div>
      <div className="flex justify-between items-center">
        <Link href={tool.href} className="text-blue-400 font-medium hover:text-blue-600">
          Try now
        </Link>
      </div>


    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <section className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 animate-fade-in-up">
            Web<span className="text-blue-400">Tools</span>Center
          </h1>
          <p className="text-lg text-gray-400 mb-4 animate-fade-in-up animation-delay-200">Empowering Developers with Essential Web Tools</p>
          <div className="relative w-full max-w-md mx-auto animate-fade-in-up animation-delay-400">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tools..."
              className="w-full px-4 py-2 bg-gray-800 text-white border-gray-700 rounded-full pr-10 text-sm focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </section>

        <section className="mb-8 animate-fade-in-up animation-delay-600">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Zap className="mr-2 text-yellow-400" />
            Categories
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={() => setActiveCategory('All')}
              className={`${activeCategory === 'All' ? 'bg-blue-500' : 'bg-gray-700'} text-white font-semibold py-1 px-2 rounded-full transition duration-300 hover:bg-blue-600 text-sm`}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`${activeCategory === category.name ? 'bg-blue-500' : 'bg-gray-700'} text-white font-semibold py-1 px-2 rounded-full transition duration-300 hover:bg-blue-600 text-sm`}
              >
                <FontAwesomeIcon icon={category.icon} className="mr-1" />
                {category.name}
              </Button>
            ))}
          </div>
        </section>

        {(activeCategory === 'All' ? categories : categories.filter(cat => cat.name === activeCategory)).map((category, index) => {
          const categoryTools = filteredTools.filter(tool => tool.category === category.name)
          if (categoryTools.length === 0) return null

          return (
            <section key={category.name} className={`mb-8 animate-fade-in-up animation-delay-${(index + 4) * 200}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FontAwesomeIcon icon={category.icon} className="mr-2 text-blue-400" />
                  {category.name} Tools
                </h2>
                <Link href={`/tools/${category.name.toLowerCase()}`}>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded-full transition duration-300 text-sm">
                    View All <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryTools.slice(0, 3).map(renderToolCard)}
              </div>
            </section>
          )
        })}

        <section className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center">
            <TrendingUp className="mr-2 text-green-400" />
            Why Choose WebToolsCenter?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold text-white mb-2">All-in-One Solution</h3>
              <p className="text-sm text-gray-400">Access a wide range of web development tools in one place.</p>
            </div>
            <div className="bg-gray-700 rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold text-white mb-2">User-Friendly</h3>
              <p className="text-sm text-gray-400">Intuitive interfaces make our tools easy to use for everyone.</p>
            </div>
            <div className="bg-gray-700 rounded-xl shadow-md p-4">
              <h3 className="text-lg font-bold text-white mb-2">Always Free</h3>
              <p className="text-sm text-gray-400">Enjoy our tools without any cost or hidden fees.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}