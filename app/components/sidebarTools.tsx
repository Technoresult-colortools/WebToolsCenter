'use client'

import React, { useState, useEffect } from 'react';
import { FileText, Image, Palette, SprayCan, Code, SquareKanban, FacebookIcon, ChevronDown, Cog, Type, Hash, AlignLeft, AlignJustify, Eraser, FilesIcon as Fonts, FlipVertical2Icon as Flip2, BarChart2, Binary, Heading, Trash2, FileCode, Shuffle, PenTool, Crop, Sliders, Droplet, EyeIcon as Eyedropper, Paintbrush, Hexagon, Grid, Scissors, FileImage, Database, ClipboardIcon as ClipPath, Loader, PenIcon as Pattern, SplineIcon as BezierCurve, GlassWater, Zap, ContrastIcon as Gradient, Triangle, Square, Radius, Layout, PaletteIcon as ColorPicker, Pipette, HexagonIcon as HexIcon, Droplets, Rainbow, PaletteIcon, SwatchBookIcon as Swatch, Brush, Aperture, ComputerIcon as ImageIcon, Instagram, Twitter, Youtube, Globe, Lock, List, QrCode, Barcode, Ruler, Maximize } from 'lucide-react'
  
  

const categories = [
  {
    name: 'Text Tools',
    icon: FileText,
    gradient: 'from-blue-500 to-indigo-500',
    subCategories: [
      { name: 'Case Converter', href: '/tools/text/case-converter' },
      { name: 'Letter Counter', href: '/tools/text/letter-counter' },
      { name: 'Lorem Ipsum Generator', href: '/tools/text/lorem-ipsum-generator' },
      { name: 'Words Counter', href: '/tools/text/words-counter' },
      { name: 'Whitespace Remover', href: '/tools/text/whitespace-remover' },
      { name: 'Google Fonts Pair Finder', href: '/tools/text/google-fonts-pair-finder' },
      { name: 'Text Reverser', href: '/tools/text/text-reverser' },
      { name: 'Character Frequency Counter', href: '/tools/text/character-frequency-counter' },
      { name: 'Text to ASCII/Hex/Binary Converter', href: '/tools/text/text-to-ascii-hex-binary' },
      { name: 'Title Case Converter', href: '/tools/text/title-case-converter' },
      { name: 'Duplicate Line Remover', href: '/tools/text/duplicate-line-remover' },
      { name: 'HTML Encoder/Decoder', href: '/tools/text/html-encoder-decoder' },
      { name: 'Markdown to HTML Converter', href: '/tools/text/markdown-to-html' },
      { name: 'Word Scrambler', href: '/tools/text/word-scrambler' },
      { name: 'Text to Handwriting Converter', href: '/tools/text/text-to-handwriting' }
    ]
  },
  { 
    name: 'Image Tools', 
    icon: Image, 
    gradient: 'from-purple-500 to-pink-500',
    subCategories: [
      { name: 'Image Cropper', href: '/tools/image/image-cropper' },
      { name: 'Image Filters', href: '/tools/image/image-filters' },
      { name: 'Image Resizer', href: '/tools/image/image-resizer' },
      { name: 'Image Average Color Finder', href: '/tools/image/image-average-color-finder' },
      { name: 'Image Color Extractor', href: '/tools/image/image-color-extractor' },
      { name: 'Image Color Picker', href: '/tools/image/image-color-picker' },
      { name: 'SVG Blob Generator', href: '/tools/image/svg-blob-generator' },
      { name: 'SVG Pattern Generator', href: '/tools/image/svg-pattern-generator' },
      { name: 'Photo Censor', href: '/tools/image/photo-censor' },
      { name: 'SVG to PNG Converter', href: '/tools/image/svg-to-png-converter' },
      { name: 'PNG to SVG Converter', href: '/tools/image/png-to-svg-converter' },
      { name: 'Image to Base64 Converter', href: '/tools/image/image-to-base64-converter' }
    ]
  },
  { 
    name: 'CSS Tools', 
    icon: Palette, 
    gradient: 'from-green-500 to-teal-500',
    subCategories: [
      { name: 'CSS Clip Path Generator', href: '/tools/css/clip-path-generator' },
      { name: 'CSS Loader Generator', href: '/tools/css/loader-generator' },
      { name: 'CSS Background Pattern Generator', href: '/tools/css/background-pattern-generator' },
      { name: 'CSS Cubic Bezier Generator', href: '/tools/css/cubic-bezier-generator' },
      { name: 'CSS Glassmorphism Generator', href: '/tools/css/glassmorphism-generator' },
      { name: 'CSS Text Glitch Effect Generator', href: '/tools/css/text-glitch-effect-generator' },
      { name: 'CSS Gradient Generator', href: '/tools/css/gradient-generator' },
      { name: 'CSS Triangle Generator', href: '/tools/css/triangle-generator' },
      { name: 'CSS Box Shadow Generator', href: '/tools/css/box-shadow-generator' },
      { name: 'CSS Border Radius Generator', href: '/tools/css/border-radius-generator' },
      { name: 'CSS FlexBox Generator', href: '/tools/css/flexbox-generator' }
    ]
  },
  { 
    name: 'Color Tools', 
    icon: SprayCan, 
    gradient: 'from-yellow-500 to-orange-500',
    subCategories: [
      { name: 'Image Color Picker', href: '/tools/color/image-color-picker' },
      { name: 'Image Color Extractor', href: '/tools/color/image-color-extractor' },
      { name: 'Hex to RGBA Converter', href: '/tools/color/hex-to-rgba' },
      { name: 'RGBA to Hex Converter', href: '/tools/color/rgba-to-hex' },
      { name: 'HSV to RGB Converter', href: '/tools/color/hsv-to-rgb' },
      { name: 'RGB to HSV Converter', href: '/tools/color/rgb-to-hsv' },
      { name: 'CMYK to RGB Converter', href: '/tools/color/cmyk-to-rgb' },
      { name: 'Color Mixer', href: '/tools/color/color-mixer' },
      { name: 'Color Shades Generator', href: '/tools/color/color-shades-generator' },
      { name: 'RGB to CMYK Converter', href: '/tools/color/rgb-to-cmyk' },
      { name: 'HSL to RGB Converter', href: '/tools/color/hsl-to-rgb' },
      { name: 'HSL to HEX Converter', href: '/tools/color/hsl-to-hex' },
      { name: 'HSV to Hex Converter', href: '/tools/color/hsv-to-hex' },
      { name: 'RGB to HSL Converter', href: '/tools/color/rgb-to-hsl' },
      { name: 'Color Name Generator', href: '/tools/color/color-name-generator' },
      { name: 'Color Palette Generator', href: '/tools/color/color-palette-generator' },
      { name: 'Color Wheel', href: '/tools/color/color-wheel' },
      { name: 'Gradient Generator', href: '/tools/color/color-gradient-generator' },
      { name: 'Tailwind CSS Color Palette', href: '/tools/color/tailwind-color-generator' },
      { name: 'Color Converter', href: '/tools/color/color-converter' }
    ]
  },
  { 
    name: 'Coding Tools', 
    icon: Code, 
    gradient: 'from-red-500 to-pink-500',
    subCategories: [
      { name: 'Code to Image Converter', href: '/tools/coding/code-to-image-converter' },
      { name: 'URL Slug Generator', href: '/tools/coding/url-slug-generator' },
      { name: 'React Native Shadow Generator', href: '/tools/coding/react-native-shadow-generator' },
      { name: 'Base64 Encoder/Decoder', href: '/tools/coding/base64-encoder-decoder' },
      { name: 'HTML Encoder/Decoder', href: '/tools/coding/html-encoder-decoder' },
      { name: 'URL Encoder/Decoder', href: '/tools/coding/url-encoder-decoder' },
      { name: 'HTML Minifier', href: '/tools/coding/html-minifier' },
      { name: 'CSS Minifier', href: '/tools/coding/css-minifier' },
      { name: 'JavaScript Minifier', href: '/tools/coding/javascript-minifier' },
      { name: 'HTML Formatter', href: '/tools/coding/html-formatter' },
      { name: 'CSS Formatter', href: '/tools/coding/css-formatter' },
      { name: 'JavaScript Formatter', href: '/tools/coding/javascript-formatter' },
      { name: 'MD5 Generator and Verifier', href: '/tools/coding/md5-encrypt-verify' },
      { name: 'SHA1 Encrypt and Verifier', href: '/tools/coding/sha1-encrypt-verify' },
      { name: 'SHA224 Encrypt and Verifier', href: '/tools/coding/sha224-encrypt-verify' },
      { name: 'SHA256 Encrypt and Verifier', href: '/tools/coding/sha256-encrypt-verify' },
      { name: 'SHA384 Encrypt and Verifier', href: '/tools/coding/sha384-encrypt-verify' },
      { name: 'SHA512 Encrypt and Verifier', href: '/tools/coding/sha512-encrypt-verify' },
      { name: 'JWT Encoder/Decoder', href: '/tools/coding/jwt-encoder-decoder' },
      { name: 'Advance JSON Tree Viewer', href: '/tools/coding/json-tree-viewer' },
      { name: 'JSON Validator and Formatter', href: '/tools/coding/json-validator' }
    ]
  },
  { 
    name: 'Miscellaneous Tools', 
    icon: SquareKanban, 
    gradient: 'from-indigo-500 to-blue-500',
    subCategories: [
      { name: 'Advance Password Generator', href: '/tools/misc/advance-password-generator' },
      { name: 'List Randomizer', href: '/tools/misc/list-randomizer' },
      { name: 'QR Code Generator', href: '/tools/misc/qr-code-generator' },
      { name: 'BarCode Generator', href: '/tools/misc/barcode-generator' },
      { name: 'Unit Converter', href: '/tools/misc/unit-converter' },
      { name: 'Screen Resolution Checker', href: '/tools/misc/screen-resolution-checker' }
    ]
  },
  { 
    name: 'Social Media Tools', 
    icon: FacebookIcon, 
    gradient: 'from-blue-500 to-purple-500',
    subCategories: [
      { name: 'Instagram Filters', href: '/tools/social-media/instagram-filters' },
      { name: 'Instagram Post Generator', href: '/tools/social-media/instagram-post-generator' },
      { name: 'Instagram Photo Downloader', href: '/tools/social-media/instagram-photo-downloader' },
      { name: 'Tweet Generator', href: '/tools/social-media/tweet-generator' },
      { name: 'Tweet to Image Converter', href: '/tools/social-media/tweet-to-image-converter' },
      { name: 'YouTube Thumbnail Downloader', href: '/tools/social-media/youtube-thumbnail-downloader' },
      { name: 'YouTube KeyWord Tag Extractor',  href: '/tools/social-media/youtube-tag-extractor' },
      { name: 'YouTube Metadata Extractor', href: '/tools/social-media/youtube-metadata-extractor' },
      { name: 'YouTube Region Restriction Finder', href: '/tools/social-media/youtube-region-restriction-finder' },
      { name: 'Open Graph Meta Generator', href: '/tools/social-media/open-graph-meta-generator' }
    ]
  },
];

const toolIcons: { [key: string]: React.ElementType } = {
  // Text Tools
  'Case Converter': Type,
  'Letter Counter': Hash,
  'Lorem Ipsum Generator': AlignLeft,
  'Words Counter': AlignJustify,
  'Whitespace Remover': Eraser,
  'Google Fonts Pair Finder': Fonts,
  'Text Reverser': Flip2,
  'Character Frequency Counter': BarChart2,
  'Text to ASCII/Hex/Binary Converter': Binary,
  'Title Case Converter': Heading,
  'Duplicate Line Remover': Trash2,
  'HTML Encoder/Decoder': FileCode,
  'Markdown to HTML Converter': FileCode,
  'Word Scrambler': Shuffle,
  'Text to Handwriting Converter': PenTool,

  // Image Tools
  'Image Cropper': Crop,
  'Image Filters': Sliders,
  'Image Resizer': Maximize,
  'Image Average Color Finder': Droplet,
  'Image Color Extractor': Eyedropper,
  'Image Color Picker': Paintbrush,
  'SVG Blob Generator': Hexagon,
  'SVG Pattern Generator': Grid,
  'Photo Censor': Scissors,
  'SVG to PNG Converter': FileImage,
  'PNG to SVG Converter': ImageIcon,
  'Image to Base64 Converter': Database,

  // CSS Tools
  'CSS Clip Path Generator': ClipPath,
  'CSS Loader Generator': Loader,
  'CSS Background Pattern Generator': Pattern,
  'CSS Cubic Bezier Generator': BezierCurve,
  'CSS Glassmorphism Generator': GlassWater,
  'CSS Text Glitch Effect Generator': Zap,
  'CSS Gradient Generator': Gradient,
  'CSS Triangle Generator': Triangle,
  'CSS Box Shadow Generator': Square,
  'CSS Border Radius Generator': Radius,
  'CSS FlexBox Generator': Layout,

  // Color Tools
  'Image Color Picker1': ColorPicker,
  'Image Color Extractor1': Pipette,
  'Hex to RGBA Converter': HexIcon,
  'RGBA to Hex Converter': HexIcon,
  'HSV to RGB Converter': Droplets,
  'RGB to HSV Converter': Droplets,
  'CMYK to RGB Converter': Rainbow,
  'Color Mixer': PaletteIcon,
  'Color Shades Generator': Swatch,
  'RGB to CMYK Converter': Rainbow,
  'HSL to RGB Converter': Brush,
  'HSL to HEX Converter': HexIcon,
  'HSV to Hex Converter': HexIcon,
  'RGB to HSL Converter': Brush,
  'Color Name Generator': Type,
  'Color Palette Generator': PaletteIcon,
  'Color Wheel': Aperture,
  'Gradient Generator': Gradient,
  'Tailwind CSS Color Palette': Swatch,

  // Coding Tools
  'Code to Image Converter': ImageIcon,
  'URL Slug Generator': Type,
  'React Native Shadow Generator': Square,
  'Base64 Encoder/Decoder': Binary,
  'HTML Encoder/Decoder1': FileCode,
  'URL Encoder/Decoder': Globe,
  'HTML Minifier': FileCode,
  'CSS Minifier': FileCode,
  'JavaScript Minifier': FileCode,
  'HTML Formatter': FileCode,
  'CSS Formatter': FileCode,
  'JavaScript Formatter': FileCode,
  'MD5 Generator and Verifier': Lock,
  'SHA1 Encrypt and Verifier': Lock,
  'SHA224 Encrypt and Verifier': Lock,
  'SHA256 Encrypt and Verifier': Lock,
  'SHA384 Encrypt and Verifier': Lock,
  'SHA512 Encrypt and Verifier': Lock,
  'JWT Encoder/Decoder': Lock,
  'Advance JSON Tree Viewer': SquareKanban,
  'JSON Validator and Formatter': FileCode,

  // Miscellaneous Tools
  'Advance Password Generator': Lock,
  'List Randomizer': List,
  'QR Code Generator': QrCode,
  'BarCode Generator': Barcode,
  'Unit Converter': Ruler,
  'Screen Resolution Checker': Maximize,

  // Social Media Tools
  'Instagram Filters': Instagram,
  'Instagram Post Generator': Instagram,
  'Instagram Photo Downloader': Instagram,
  'Tweet Generator': Twitter,
  'Tweet to Image Converter': Twitter,
  'YouTube Thumbnail Downloader': Youtube,
  'YouTube KeyWord Tag Extractor': Youtube,
  'YouTube Metadata Extractor': Youtube,
  'YouTube Region Restriction Finder': Youtube,
  'Open Graph Meta Generator': Globe,
}

const Sidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1290)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleCategory = (categoryName: string) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName)
  }

  if (isMobile) {
    return null
  }

  return (
    <aside className="sticky left-0 top-16 h-screen w-16 lg:w-72 xl:w-80 bg-gray-900 text-white transition-all duration-300 ease-in-out flex flex-col">
      <div className="p-6 hidden lg:block flex-shrink-0">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          Explore Tools
          <Cog className="w-5 h-5 ml-2 text-yellow-400 animate-spin-slow" />
        </h2>
      </div>
      <nav 
        className="flex-grow overflow-y-auto overflow-x-hidden
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar]:h-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-[#1a1f2b]
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border
          [&::-webkit-scrollbar-thumb]:border-[#2a2f3b]
          hover:[&::-webkit-scrollbar-thumb]:bg-[#2a2f3b]
          [&::-webkit-scrollbar-corner]:bg-transparent
          scrollbar-thin
          scrollbar-track-transparent
          scrollbar-thumb-[#1a1f2b]"
      >
        <div className="px-4 pb-6 space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="mb-2">
              <button
                className={`flex items-center justify-between w-full p-3 rounded-lg text-left text-gray-200 hover:bg-gray-800 transition-all duration-300 ${
                  activeCategory === category.name ? 'bg-gray-800' : ''
                }`}
                onClick={() => toggleCategory(category.name)}
              >
                <span className="flex items-center">
                  <div className={`w-8 h-8 rounded-md mr-3 flex items-center justify-center bg-gradient-to-br ${category.gradient}`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="hidden lg:inline">{category.name}</span>
                </span>
                <ChevronDown 
                  className={`w-5 h-5 hidden lg:block transition-transform duration-300 ${
                    activeCategory === category.name ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {activeCategory === category.name && (
                <ul className="mt-2 ml-11 space-y-1 hidden lg:block">
                  {category.subCategories.map((subCategory) => {
                    const ToolIcon = toolIcons[subCategory.name] || FileText
                    return (
                      <li key={subCategory.name}>
                        <a
                          href={subCategory.href}
                          className="flex items-center py-2 px-3 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition-colors duration-300"
                        >
                          <ToolIcon className="w-4 h-4 mr-2" />
                          {subCategory.name}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar