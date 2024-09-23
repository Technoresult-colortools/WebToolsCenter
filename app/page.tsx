'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search,BarChart,Download, Video,Scale, ChevronDown, ArrowRight, ChevronRight, Type, Image, Palette, Code, Droplet, Share2, Wrench, TextCursor,SwatchBook, ALargeSmall, FileText, Crop, Filter, Maximize2, ClipboardCheck, Copy, Shuffle, Scissors, RefreshCw, FileCode, BookMarked, Zap, Grid, EyeOff, Blend, Box, Loader, AlertTriangle, Link2, Lock, QrCode, KeyRound, Instagram, Twitter, Pipette, BookType } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const categories = [
  { name: 'Text Tools', tools: '/tools/text', color: 'from-blue-500 to-blue-600', icon: Type },
  { name: 'Image Tools', tools: '/tools/image', color: 'from-green-500 to-green-600', icon: Image },
  { name: 'CSS Tools', tools: '/tools/css', color: 'from-purple-500 to-purple-600', icon: Palette },
  { name: 'Coding Tools', tools: '/tools/coding', color: 'from-yellow-500 to-yellow-600', icon: Code },
  { name: 'Color Tools', tools: '/tools/color', color: 'from-red-500 to-red-600', icon: Droplet },
  { name: 'Social Media Tools', tools: '/tools/social-media', color: 'from-pink-500 to-pink-600', icon: Share2 },
  { name: 'Miscellaneous Tools', tools: '/tools/misc', color: 'from-indigo-500 to-indigo-600', icon: Wrench }
]

const featuredTools = [
  { name: 'Case Converter', category: 'Text Tools', href: '/tools/text/case-converter', description: 'Easily convert text to uppercase, lowercase, title case, and more for improved readability and style.', icon: TextCursor },
  { name: 'Image Cropper', category: 'Image Tools', href: '/tools/image/image-cropper', description: 'Crop and resize images online with our simple-to-use image cropper tool.', icon: Crop },
  { name: 'CSS Gradient Generator', category: 'CSS Tools', href: '/tools/css/gradient-generator', description: 'Design beautiful, custom CSS gradients for your website or app.', icon: Blend },
  { name: 'Code to Image Converter', category: 'Coding Tools', href: '/tools/coding/code-to-image', description: 'Convert code snippets into beautifully formatted images for sharing.', icon: Code },
  { name: 'Color Palette Generator', category: 'Color Tools', href: '/tools/color/color-palette-generator', description: 'Create stunning color palettes for your designs or brand.', icon: Palette },
  { name: 'Instagram Post Generator', category: 'Social Media Tools', href: '/tools/social-media/instagram-post-generator', description: 'Design and generate Instagram posts that captivate your audience.', icon: Instagram },
]

const allTools = [
  { name: 'Case Converter', category: 'Text Tools', href: '/tools/text/case-converter', description: 'Easily convert text to uppercase, lowercase, title case, and more for improved readability and style.', icon: TextCursor },
  { name: 'Letter Counter', category: 'Text Tools', href: '/tools/text/letter-counter', description: 'Count characters, words, and sentences in any text to improve content management and SEO optimization.', icon: ALargeSmall },
  { name: 'Lorem Ipsum Generator', category: 'Text Tools', href: '/tools/text/lorem-ipsum-generator', description: 'Generate placeholder text for web designs, apps, and print layouts quickly and efficiently.', icon: FileText },
  { name: 'Words Counter', category: 'Text Tools', href: '/tools/text/words-counter', description: 'Accurately count the number of words in a document or text snippet for precise content creation.', icon: FileText },
  { name: 'Whitespace Remover', category: 'Text Tools', href: '/tools/text/whitespace-remover', description: 'Effortlessly remove unnecessary spaces from text for cleaner formatting.', icon: Scissors },
  { name: 'Google Fonts Pair Finder', category: 'Text Tools', href: '/tools/text/google-fonts-pair-finder', description: 'Find perfect font pairings for your web designs using Google Fonts.', icon: BookType },
  { name: 'Text Reverser', category: 'Text Tools', href: '/tools/text/text-reverser', description: 'Reverse any string of text for creative purposes or puzzle creation.', icon: RefreshCw },
  { name: 'Character Frequency Counter', category: 'Text Tools', href: '/tools/text/character-frequency-counter', description: 'Analyze text by counting character occurrences for linguistic studies or text optimization.', icon: ClipboardCheck },
  { name: 'Text to ASCII/Hex/Binary Converter', category: 'Text Tools', href: '/tools/text/text-to-ascii-hex-binary', description: 'Convert text to ASCII, Hex, or Binary formats for coding and encryption purposes.', icon: Code },
  { name: 'Title Case Converter', category: 'Text Tools', href: '/tools/text/title-case-converter', description: 'Convert text to title case for blog posts, articles, or book titles.', icon: Type },
  { name: 'Duplicate Line Remover', category: 'Text Tools', href: '/tools/text/duplicate-line-remover', description: 'Remove duplicate lines in large texts for cleaner documents and code.', icon: Copy },
  { name: 'HTML Encoder/Decoder', category: 'Text Tools', href: '/tools/text/html-encoder-decoder', description: 'Easily encode or decode HTML entities to ensure proper web rendering.', icon: Code },
  { name: 'Markdown to HTML Converter', category: 'Text Tools', href: '/tools/text/markdown-to-html', description: 'Convert Markdown syntax to HTML format for easier web content publishing.', icon: BookMarked },
  { name: 'Word Scrambler', category: 'Text Tools', href: '/tools/text/word-scrambler', description: 'Scramble words for games, creative writing, or educational exercises.', icon: Shuffle },

  { name: 'Image Cropper', category: 'Image Tools', href: '/tools/image/image-cropper', description: 'Crop and resize images online with our simple-to-use image cropper tool.', icon: Crop },
  { name: 'Image Filters', category: 'Image Tools', href: '/tools/image/image-filters', description: 'Apply creative filters and effects to your photos instantly.', icon: Filter },
  { name: 'Image Resizer', category: 'Image Tools', href: '/tools/image/image-resizer', description: 'Quickly resize images to fit specific dimensions for websites or apps.', icon: Maximize2 },
  { name: 'Image Average Color Finder', category: 'Image Tools', href: '/tools/image/image-average-color-finder', description: 'Find the average color of any image for design and color matching.', icon: Pipette },
  { name: 'Image Color Extractor', category: 'Image Tools', href: '/tools/image/image-color-extractor', description: 'Extract specific colors from images for branding or design purposes.', icon: Droplet },
  { name: 'SVG Blob Generator', category: 'Image Tools', href: '/tools/image/svg-blob-generator', description: 'Generate random, abstract blob shapes in SVG format for web design.', icon: Zap },
  { name: 'SVG Pattern Generator', category: 'Image Tools', href: '/tools/image/svg-pattern-generator', description: 'Create scalable and customizable SVG patterns for backgrounds.', icon: Grid },
  { name: 'Photo Censor', category: 'Image Tools', href: '/tools/image/photo-censor', description: 'Blur, pixelate, or black-out parts of an image for censorship.', icon: EyeOff },
  { name: 'SVG to PNG Converter', category: 'Image Tools', href: '/tools/image/svg-to-png-converter', description: 'Convert SVG images to PNG format with ease.', icon: Image },
  { name: 'Image to Base64 Converter', category: 'Image Tools', href: '/tools/image/image-to-base64-converter', description: 'Convert images to Base64 encoding for embedding into HTML and CSS.', icon: FileCode },
  { name: 'Image Caption Generator', category: 'Image Tools', href: '/tools/image/image-caption-generator', description: 'Automatically generate creative captions for your photos.', icon: FileText },

  { name: 'CSS Gradient Generator', category: 'CSS Tools', href: '/tools/css/gradient-generator', description: 'Design beautiful, custom CSS gradients for your website or app.', icon: Blend },
  { name: 'CSS Box Shadow Generator', category: 'CSS Tools', href: '/tools/css/box-shadow-generator', description: 'Create and customize stunning CSS box shadows with ease.', icon: Box },
  { name: 'CSS Clip Path Generator', category: 'CSS Tools', href: '/tools/css/clip-path-generator', description: 'Generate CSS clip-paths to create creative shapes for design elements.', icon: Scissors },
  { name: 'CSS Loader Generator', category: 'CSS Tools', href: '/tools/css/loader-generator', description: 'Generate smooth and customizable CSS loaders and spinners.', icon: Loader },
  { name: 'CSS Background Pattern Generator', category: 'CSS Tools', href: '/tools/css/background-pattern-generator', description: 'Design dynamic background patterns with CSS for your website.', icon: Grid },
  { name: 'CSS Glassmorphism Generator', category: 'CSS Tools', href: '/tools/css/glassmorphism-generator', description: 'Generate stunning glass-like UI elements with CSS Glassmorphism.', icon: Copy },
  { name: 'CSS Text Glitch Effect Generator', category: 'CSS Tools', href: '/tools/css/text-glitch-effect-generator', description: 'Create glitchy text effects with CSS for edgy design.', icon: AlertTriangle },

  { name: 'Code to Image Converter', category: 'Coding Tools', href: '/tools/coding/code-to-image', description: 'Convert code snippets into beautifully formatted images for sharing.', icon: Code },
  { name: 'URL Slug Generator', category: 'Coding Tools', href: '/tools/coding/url-slug-generator', description: 'Generate clean and SEO-friendly URLs by converting text into slugs.', icon: Link2 },
  { name: 'Base64 Encoder/Decoder', category: 'Coding Tools', href: '/tools/coding/base64-encoder-decoder', description: 'Encode and decode Base64 data for various applications.', icon: FileCode },
  { name: 'MD5 Encrypt/Decrypt', category: 'Coding Tools', href: '/tools/coding/md5-encrypt-decrypt', description: 'Encrypt and decrypt data using the MD5 hashing algorithm.', icon: Lock },
  
  { name: 'Image Color Picker', category: 'Color Tools', href: '/tools/color/image-color-picker', description: 'Select and extract colors from images effortlessly using our intuitive color picker tool.', icon: Droplet },
  { name: 'Image Color Extractor', category: 'Color Tools', href: '/tools/color/image-color-extractor', description: 'Extract dominant colors from images for design inspiration or branding purposes.', icon: Palette },
  { name: 'Hex to RGBA Converter', category: 'Color Tools', href: '/tools/color/hex-to-rgba', description: 'Convert hex color codes to RGBA format for use in web design and graphics.', icon: Pipette },
  { name: 'RGBA to Hex Converter', category: 'Color Tools', href: '/tools/color/rgba-to-hex', description: 'Easily convert RGBA color values back to hex format for streamlined styling.', icon: Pipette },
  { name: 'HSV to RGB Converter', category: 'Color Tools', href: '/tools/color/hsv-to-rgb', description: 'Transform HSV color values into RGB for digital applications and design.', icon: Pipette },
  { name: 'RGB to HSV Converter', category: 'Color Tools', href: '/tools/color/rgb-to-hsv', description: 'Convert RGB color values to HSV for color manipulation and selection.', icon: Pipette },
  { name: 'CMYK to RGB Converter', category: 'Color Tools', href: '/tools/color/cmyk-to-rgb', description: 'Change CMYK color values to RGB for use in digital graphics and design.', icon: Pipette },
  { name: 'Color Mixer', category: 'Color Tools', href: '/tools/color/color-mixer', description: 'Experiment with color combinations and create custom shades using our color mixer tool.', icon: Droplet },
  { name: 'Color Shades Generator', category: 'Color Tools', href: '/tools/color/color-shades-generator', description: 'Generate a range of shades from a base color for design consistency.', icon: SwatchBook },
  { name: 'RGB to CMYK Converter', category: 'Color Tools', href: '/tools/color/rgb-to-cmyk', description: 'Convert RGB color values to CMYK for accurate printing and graphic design.', icon: Pipette },
  { name: 'HSL to RGB Converter', category: 'Color Tools', href: '/tools/color/hsl-to-rgb', description: 'Convert HSL color values to RGB for seamless color application in digital media.', icon: Pipette },
  { name: 'HSL to HEX Converter', category: 'Color Tools', href: '/tools/color/hsl-to-hex', description: 'Transform HSL color codes into hex format for web design and styling.', icon: Pipette },
  { name: 'HSV to Hex Converter', category: 'Color Tools', href: '/tools/color/hsv-to-hex', description: 'Easily convert HSV values to hex for digital artwork and design projects.', icon: Pipette },
  { name: 'RGB to HSL Converter', category: 'Color Tools', href: '/tools/color/rgb-to-hsl', description: 'Convert RGB color values to HSL for enhanced color adjustments and analysis.', icon: Pipette },
  { name: 'Color Name Generator', category: 'Color Tools', href: '/tools/color/color-name-generator', description: 'Generate unique color names for your designs, helping you easily identify and categorize shades.', icon: Pipette },
  { name: 'Color Palette Generator', category: 'Color Tools', href: '/tools/color/color-palette-generator', description: 'Create and customize color palettes to enhance your design projects and branding.', icon: Palette },
  { name: 'Color Wheel', category: 'Color Tools', href: '/tools/color/color-wheel', description: 'Visualize and select colors using an interactive color wheel for better design choices.', icon: Pipette },
  { name: 'Gradient Generator', category: 'Color Tools', href: '/tools/color/color-gradient-generator', description: 'Design and generate beautiful gradients for backgrounds and UI elements effortlessly.', icon: Pipette },
  
  { name: 'Instagram Filters', category: 'Social Media Tools', href: '/tools/social-media/instagram-filters', description: 'Apply popular Instagram filters to your photos for a professional, polished look.', icon: Filter },
  { name: 'Instagram Post Generator', category: 'Social Media Tools', href: '/tools/social-media/instagram-post-generator', description: 'Create eye-catching Instagram posts with customized text and visuals for your audience.', icon: Image },
  { name: 'Instagram Photo Downloader', category: 'Social Media Tools', href: '/tools/social-media/instagram-photo-downloader', description: 'Easily download high-quality Instagram photos to your device for offline use.', icon: Download },
  { name: 'Tweet Generator', category: 'Social Media Tools', href: '/tools/social-media/tweet-generator', description: 'Generate Twitter posts with formatted text for engagement or content planning.', icon: Twitter },
  { name: 'Tweet to Image Converter', category: 'Social Media Tools', href: '/tools/social-media/tweet-to-image-converter', description: 'Convert tweets into shareable images for use on other social media platforms.', icon: Image },
  { name: 'YouTube Thumbnail Downloader', category: 'Social Media Tools', href: '/tools/social-media/youtube-thumbnail-downloader', description: 'Download YouTube video thumbnails in high resolution for easy reuse or analysis.', icon: Video },

  { name: 'Advance Password Generator', category: 'Miscellaneous Tools', href: '/tools/misc/advance-password-generator', description: 'Generate strong, secure passwords with customizable options to enhance your online security.', icon: Lock },
  { name: 'List Randomizer', category: 'Miscellaneous Tools', href: '/tools/misc/list-randomizer', description: 'Randomize any list for fair selections, raffle draws, or randomized order.', icon: Shuffle },
  { name: 'QR Code Generator', category: 'Miscellaneous Tools', href: '/tools/misc/qr-code-generator', description: 'Quickly generate QR codes for links, contact info, or any text for easy sharing.', icon: QrCode },
  { name: 'BarCode Generator', category: 'Miscellaneous Tools', href: '/tools/misc/barcode-generator', description: 'Create standard barcodes for products, inventory management, or business needs.', icon: BarChart },
  { name: 'Unit Converter', category: 'Miscellaneous Tools', href: '/tools/misc/unit-converter', description: 'Convert between various units like length, weight, temperature, and more for accurate measurements.', icon: Scale },
]


export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTools, setFilteredTools] = useState(allTools)

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

  const renderToolCard = (tool: any) => (
    <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg h-[300px] flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center">
          <tool.icon className="w-6 h-6 mr-2" />
          {tool.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 line-clamp-3">{tool.description}</p>
      </CardContent>
      <CardFooter>
        <Link href={tool.href} className="w-full">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-full py-2 font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105">
            Try Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            WebToolsCenter
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover powerful tools for your web projects
          </p>

          {/* Search bar */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-md">
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools..."
                className="w-full px-4 py-2 bg-gray-800 text-white border-gray-700 rounded-full pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Display Tools */}
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            {searchTerm ? 'Search Results' : 'Featured Tools'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <AnimatePresence>
              {(searchTerm ? filteredTools : featuredTools).map(tool => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderToolCard(tool)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Category sections */}
          {!searchTerm && categories.map((category) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center">
                <category.icon className="w-8 h-8 mr-2" />
                {category.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allTools
                  .filter(tool => tool.category === category.name)
                  .slice(0, 3)
                  .map(tool => (
                    <motion.div key={tool.name}>
                      {renderToolCard(tool)}
                    </motion.div>
                  ))}
              </div>
              <div className="mt-6 text-center">
                <Link href={category.tools}>
                  <Button className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-full py-2 px-6 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105">
                    See all {category.name} <ChevronRight className="ml-2 h-4 w-4 inline" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}