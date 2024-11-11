'use client'

import React, { useState, useEffect,} from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, Star, Wrench, Command, CogIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ScrollToTop from '@/components/ScrollToTop';  
import { faDatabase, faDesktop, faHashtag, faMicrochip, faPrint, faSignature, faSliders, faSun, faTag, faThLarge } from '@fortawesome/free-solid-svg-icons'; 
import {
  IconDefinition,
  faGlide,
  faInstagram,
  faMarkdown,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import { faFont, faImage, faPalette, faCode, faDroplet, faShare, faWrench, faEraser, faChartBar, faTextHeight, faScissors, faRandom, faCropAlt, faExpand, faEyeDropper, faShapes, faVectorSquare, faEyeSlash, faFileImage, faFileCode, faSpinner, faBrush, faBezierCurve, faGlassMartiniAlt, faDrawPolygon, faAlignJustify, faLink, faMobileAlt, faKey, faCompress, faFingerprint, faLock, faSitemap, faQrcode, faBarcode, faExchangeAlt } from '@fortawesome/free-solid-svg-icons'

// Types remain the same
type Tool = {
  name: string;
  category: string;
  href: string;
  icon: IconDefinition;
  description: string;
}

const categories = [
  { name: 'Text', icon: faFont, gradient: 'from-blue-500 to-cyan-500' },
  { name: 'Image', icon: faImage, gradient: 'from-purple-500 to-pink-500' },
  { name: 'CSS', icon: faPalette, gradient: 'from-green-500 to-emerald-500' },
  { name: 'Coding', icon: faCode, gradient: 'from-orange-500 to-red-500' },
  { name: 'Color', icon: faDroplet, gradient: 'from-violet-500 to-purple-500' },
  { name: 'Social Media', icon: faShare, gradient: 'from-pink-500 to-rose-500' },
  { name: 'Misc', icon: faWrench, gradient: 'from-cyan-500 to-blue-500' },
]

const allTools: Tool[] = [
  // Text Tools
  { name: 'Case Converter', category: 'Text', href: '/tools/text/case-converter', icon: faFont, description: 'Convert text to different cases.' },
  { name: 'Letter Counter', category: 'Text', href: '/tools/text/letter-counter', icon: faFont, description: 'Count the number of letters in text.' },
  { name: 'Lorem Ipsum Generator', category: 'Text', href: '/tools/text/lorem-ipsum-generator', icon: faFont, description: 'Generate placeholder text.' },
  { name: 'Words Counter', category: 'Text', href: '/tools/text/words-counter', icon: faFont, description: 'Count the number of words in text.' },
  { name: 'Whitespace Remover', category: 'Text', href: '/tools/text/whitespace-remover', icon: faEraser, description: 'Remove unnecessary whitespace from text.' },
  { name: 'Google Fonts Pair Finder', category: 'Text', href: '/tools/text/google-fonts-pair-finder', icon: faFont, description: 'Find and pair Google Fonts.' },
  { name: 'Text Reverser', category: 'Text', href: '/tools/text/text-reverser', icon: faFont, description: 'Reverse any string of text.' },
  { name: 'Character Frequency Counter', category: 'Text', href: '/tools/text/character-frequency-counter', icon: faChartBar, description: 'Analyze character frequency in text.' },
  { name: 'Text to ASCII/Hex/Binary Converter', category: 'Text', href: '/tools/text/text-to-ascii-hex-binary', icon: faCode, description: 'Convert text to ASCII, Hex, or Binary.' },
  { name: 'Title Case Converter', category: 'Text', href: '/tools/text/title-case-converter', icon: faTextHeight, description: 'Convert text to title case.' },
  { name: 'Duplicate Line Remover', category: 'Text', href: '/tools/text/duplicate-line-remover', icon: faScissors, description: 'Remove duplicate lines in text.' },
  { name: 'HTML Encoder/Decoder', category: 'Text', href: '/tools/text/html-encoder-decoder', icon: faCode, description: 'Encode or decode HTML entities.' },
  { name: 'Markdown to HTML Converter', category: 'Text', href: '/tools/text/markdown-to-html', icon: faMarkdown, description: 'Convert Markdown to HTML.' },
  { name: 'Word Scrambler', category: 'Text', href: '/tools/text/word-scrambler', icon: faRandom, description: 'Scramble words in text.' },
  { name: 'Text to Handwriting Converter', category: 'Text', href: '/tools/text/text-to-handwriting', icon: faSignature, description: 'Transform your text into handwritten notes with customizable styles.' },
  // Image Tools
  { name: 'Image Cropper', category: 'Image', href: '/tools/image/image-cropper', icon: faCropAlt, description: 'Crop and resize images online.' },
  { name: 'Image Filters', category: 'Image', href: '/tools/image/image-filters', icon: faImage, description: 'Apply filters to your images.' },
  { name: 'Image Resizer', category: 'Image', href: '/tools/image/image-resizer', icon: faExpand, description: 'Resize images to specific dimensions.' },
  { name: 'Image Average Color Finder', category: 'Image', href: '/tools/image/image-average-color-finder', icon: faPalette, description: 'Find the average color of an image.' },
  { name: 'Image Color Extractor', category: 'Image', href: '/tools/image/image-color-extractor', icon: faEyeDropper, description: 'Extract colors from an image.' },
  { name: 'Image Color Picker', category: 'Image', href: '/tools/image/image-color-picker', icon: faPalette, description: 'Pick colors from images.' },
  { name: 'SVG Blob Generator', category: 'Image', href: '/tools/image/svg-blob-generator', icon: faShapes, description: 'Generate random SVG blobs.' },
  { name: 'SVG Pattern Generator', category: 'Image', href: '/tools/image/svg-pattern-generator', icon: faVectorSquare, description: 'Generate SVG patterns.' },
  { name: 'Photo Censor', category: 'Image', href: '/tools/image/photo-censor', icon: faEyeSlash, description: 'Blur or censor parts of a photo.' },
  { name: 'SVG to PNG Converter', category: 'Image', href: '/tools/image/svg-to-png-converter', icon: faFileImage, description: 'Convert SVG images to PNG format.' },
  { name: 'PNG to SVG Converter', category: 'Image', href: '/tools/image/png-to-svg-converter', icon: faFileImage, description: 'Convert PNG images to SVG format.' },
  { name: 'Image to Base64 Converter', category: 'Image', href: '/tools/image/image-to-base64-converter', icon: faFileCode, description: 'Convert images to Base64 format.' },

  // CSS Tools
  { name: 'CSS Clip Path Generator', category: 'CSS', href: '/tools/css/clip-path-generator', icon: faScissors, description: 'Create CSS clip paths.' },
  { name: 'CSS Loader Generator', category: 'CSS', href: '/tools/css/loader-generator', icon: faSpinner, description: 'Generate custom CSS loaders.' },
  { name: 'CSS Background Pattern Generator', category: 'CSS', href: '/tools/css/background-pattern-generator', icon: faBrush, description: 'Generate CSS background patterns.' },
  { name: 'CSS Cubic Bezier Generator', category: 'CSS', href: '/tools/css/cubic-bezier-generator', icon: faBezierCurve, description: 'Create cubic-bezier timing functions.' },
  { name: 'CSS Glassmorphism Generator', category: 'CSS', href: '/tools/css/glassmorphism-generator', icon: faGlassMartiniAlt, description: 'Generate CSS glassmorphism effects.' },
  { name: 'CSS Text Glitch Effect Generator', category: 'CSS', href: '/tools/css/text-glitch-effect-generator', icon: faGlide, description: 'Generate glitch text effects with CSS.' },
  { name: 'CSS Triangle Generator', category: 'CSS', href: '/tools/css/triangle-generator', icon: faDrawPolygon, description: 'Generate CSS triangles.' },
  { name: 'CSS Box Shadow Generator', category: 'CSS', href: '/tools/css/box-shadow-generator', icon: faPalette, description: 'Generate CSS box shadows.' },
  { name: 'CSS Border Radius Generator', category: 'CSS', href: '/tools/css/border-radius-generator', icon: faShapes, description: 'Create CSS border-radius shapes.' },
  { name: 'CSS Flexbox Generator', category: 'CSS', href: '/tools/css/flexbox-generator', icon: faAlignJustify, description: 'Create CSS Flexbox layouts.' },
  { name: 'CSS Gradient Generator', category: 'CSS', href: '/tools/css/gradient-generator', icon: faPalette, description: 'Easily create and customize beautiful linear and radial gradients.'},

  // Color Tools
  { name: 'Image Color Picker', category: 'Color', href: '/tools/color/image-color-picker', icon: faEyeDropper, description: 'Pick any color from an image with ease.' },
  { name: 'Image Color Extractor', category: 'Color', href: '/tools/color/image-color-extractor', icon: faImage, description: 'Extract the most dominant colors from any image.' },
  { name: 'Hex to RGBA Converter', category: 'Color', href: '/tools/color/hex-to-rgba', icon: faHashtag, description: 'Convert Hex color codes to RGBA format quickly.' },
  { name: 'RGBA to Hex Converter', category: 'Color', href: '/tools/color/rgba-to-hex', icon: faHashtag, description: 'Convert RGBA values to Hex color codes effortlessly.' },
  { name: 'HSV to RGB Converter', category: 'Color', href: '/tools/color/hsv-to-rgb', icon: faHashtag, description: 'Easily convert HSV color format to RGB.' },
  { name: 'RGB to HSV Converter', category: 'Color', href: '/tools/color/rgb-to-hsv', icon: faSliders, description: 'Convert RGB colors to HSV format seamlessly.' },
  { name: 'CMYK to RGB Converter', category: 'Color', href: '/tools/color/cmyk-to-rgb', icon: faPrint, description: 'Convert CMYK values to RGB format with precision.' },
  { name: 'Color Mixer', category: 'Color', href: '/tools/color/color-mixer', icon: faDroplet, description: 'Mix multiple colors together and create new ones.' },
  { name: 'Color Shades Generator', category: 'Color', href: '/tools/color/color-shades-generator', icon: faSun, description: 'Generate multiple shades of any color.' },
  { name: 'RGB to CMYK Converter', category: 'Color', href: '/tools/color/rgb-to-cmyk', icon: faPrint, description: 'Easily convert RGB values to CMYK for printing needs.' },
  { name: 'HSL to RGB Converter', category: 'Color', href: '/tools/color/hsl-to-rgb', icon: faSliders, description: 'Convert HSL colors to RGB format with ease.' },
  { name: 'HSL to HEX Converter', category: 'Color', href: '/tools/color/hsl-to-hex', icon: faHashtag, description: 'Transform HSL colors into Hex color codes.' },
  { name: 'HSV to Hex Converter', category: 'Color', href: '/tools/color/hsv-to-hex', icon: faHashtag, description: 'Convert HSV color format into Hex codes quickly.' },
  { name: 'RGB to HSL Converter', category: 'Color', href: '/tools/color/rgb-to-hsl', icon: faHashtag, description: 'Convert RGB colors into HSL format effortlessly.' },
  { name: 'Color Name Generator', category: 'Color', href: '/tools/color/color-name-generator', icon: faTag, description: 'Generate names for custom colors based on RGB or Hex values.' },
  { name: 'Color Palette Generator', category: 'Color', href: '/tools/color/color-palette-generator', icon: faMicrochip, description: 'Create stunning color palettes for your designs.' },
  { name: 'Color Wheel', category: 'Color', href: '/tools/color/color-wheel', icon: faPalette, description: 'Visualize colors and find perfect combinations using the color wheel.' },
  { name: 'Gradient Generator', category: 'Color', href: '/tools/color/color-gradient-generator', icon: faPalette, description: 'Design beautiful gradients with custom colors and stops.' },
  { name: 'Tailwind CSS Color Palette', category: 'Color', href: '/tools/color/tailwind-color-generator', icon: faPalette, description: 'Convert TailWind CSS to Hex, Generate TailWind Colors.' },
  { name: 'Color Converter', category: 'Color', href: '/tools/color/color-converter', icon: faPalette, description: 'Convert color codes from Hex to RGBA, HSL, HSV, RGB and vice versa.' },

  // Coding Tools
  { name: 'Code to Image Converter', category: 'Coding', href: '/tools/coding/code-to-image-converter', icon: faFileImage, description: 'Convert code snippets into beautiful images.' },
  { name: 'URL Slug Generator', category: 'Coding', href: '/tools/coding/url-slug-generator', icon: faLink, description: 'Generate URL-friendly slugs.' },
  { name: 'React Native Shadow Generator', category: 'Coding', href: '/tools/coding/react-native-shadow-generator', icon: faMobileAlt, description: 'Generate shadow for React Native components.' },
  { name: 'Base64 Encoder/Decoder', category: 'Coding', href: '/tools/coding/base64-encoder-decoder', icon: faCode, description: 'Encode or decode Base64 strings.' },
  { name: 'HTML Encoder/Decoder', category: 'Coding', href: '/tools/coding/html-encoder-decoder', icon: faCode, description: 'Encode or decode HTML entities.' },
  { name: 'URL Encoder/Decoder', category: 'Coding', href: '/tools/coding/url-encoder-decoder', icon: faCode, description: 'Encode or decode URLs.' },
  { name: 'HTML Minifier', category: 'Coding', href: '/tools/coding/html-minifier', icon: faCompress, description: 'Minify HTML code for performance.' },
  { name: 'CSS Minifier', category: 'Coding', href: '/tools/coding/css-minifier', icon: faCompress, description: 'Minify CSS code for better efficiency.' },
  { name: 'JavaScript Minifier', category: 'Coding', href: '/tools/coding/javascript-minifier', icon: faCompress, description: 'Minify JavaScript code for optimization.' },
  { name: 'HTML Formatter', category: 'Coding', href: '/tools/coding/html-formatter', icon: faFileCode, description: 'Format and beautify HTML code.' },
  { name: 'CSS Formatter', category: 'Coding', href: '/tools/coding/css-formatter', icon: faFileCode, description: 'Format and beautify CSS code.' },
  { name: 'JavaScript Formatter', category: 'Coding', href: '/tools/coding/javascript-formatter', icon: faFileCode, description: 'Format and beautify JavaScript code.' },
  { name: 'MD5 Generator and Verifier', category: 'Coding', href: '/tools/coding/md5-encrypt-verify', icon: faFingerprint, description: 'Generate and verify MD5 hashes.' },
  { name: 'SHA1 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha1-encrypt-verify', icon: faLock, description: 'Encrypt and verify SHA-1 hashes.' },
  { name: 'SHA224 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha224-encrypt-verify', icon: faLock, description: 'Encrypt and verify SHA-224 hashes.' },
  { name: 'SHA256 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha256-encrypt-verify', icon: faLock, description: 'Encrypt and verify SHA-256 hashes.' },
  { name: 'SHA384 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha384-encrypt-verify', icon: faLock, description: 'Encrypt and verify SHA-384 hashes.' },
  { name: 'SHA512 Encrypt and Verifier', category: 'Coding', href: '/tools/coding/sha512-encrypt-verify', icon: faLock, description: 'Encrypt and verify SHA-512 hashes.' },
  { name: 'JWT Encoder/Decoder', category: 'Coding', href: '/tools/coding/jwt-encoder-decoder', icon: faKey, description: 'Encode or decode JWT tokens.' },
  { name: 'Advance JSON Tree Viewer', category: 'Coding', href: '/tools/coding/json-tree-viewer', icon: faSitemap, description: 'View JSON data as an interactive tree.' },
  { name: 'JSON Validator and Formatter', category: 'Coding', href: '/tools/coding/json-validator', icon: faDatabase, description: 'Validate, format, and manipulate JSON with ease.' },

// Miscellaneous Tools
  { name: 'Advance Password Generator', category: 'Misc', href: '/tools/misc/advance-password-generator', icon: faLock, description: 'Generate advanced and secure passwords.' },
  { name: 'List Randomizer', category: 'Misc', href: '/tools/misc/list-randomizer', icon: faRandom, description: 'Randomize list items with various methods.' },
  { name: 'QR Code Generator', category: 'Misc', href: '/tools/misc/qr-code-generator', icon: faQrcode, description: 'Generate custom QR codes.' },
  { name: 'BarCode Generator', category: 'Misc', href: '/tools/misc/barcode-generator', icon: faBarcode, description: 'Generate custom barcodes.' },
  { name: 'Unit Converter', category: 'Misc', href: '/tools/misc/unit-converter', icon: faExchangeAlt, description: 'Convert between different units of measurement.' },
  { name: 'Screen Resolution Checker', category: 'Misc', href: '/tools/misc/screen-resolution-checker', icon: faDesktop, description: 'Analyze your screen properties and display capabilities.' },

// Social Media Tools
  { name: 'Instagram Filters', category: 'Social Media', href: '/tools/social-media/instagram-filters', icon: faInstagram, description: 'Apply filters to Instagram images.' },
  { name: 'Instagram Post Generator', category: 'Social Media', href: '/tools/social-media/instagram-post-generator', icon: faInstagram, description: 'Generate Instagram posts with customizable templates.' },
  { name: 'Instagram Photo Downloader', category: 'Social Media', href: '/tools/social-media/instagram-photo-downloader', icon: faInstagram, description: 'Download photos from Instagram.' },
  { name: 'Tweet Generator', category: 'Social Media', href: '/tools/social-media/tweet-generator', icon: faTwitter, description: 'Generate tweet mockups for sharing.' },
  { name: 'Tweet to Image Converter', category: 'Social Media', href: '/tools/social-media/tweet-to-image-converter', icon: faTwitter, description: 'Convert tweets to images for social media.' },
  { name: 'YouTube Thumbnail Downloader', category: 'Social Media', href: '/tools/social-media/youtube-thumbnail-downloader', icon: faYoutube, description: 'Download thumbnails from YouTube videos.' },
  { name: 'YouTube KeyWord Tag Extractor', category: 'Social Media', href: '/tools/social-media/youtube-tag-extractor', icon: faHashtag, description: 'Extract keyword tags from any YouTube video.' },
  { name: 'YouTube Metadata Extractor', category: 'Social Media', href: '/tools/social-media/youtube-metadata-extractor', icon: faHashtag, description: 'Extract comprehensive metadata from any YouTube video.' },
  { name: 'YouTube Region Restriction Finder', category: 'Social Media', href: '/tools/social-media/youtube-region-restriction-finder', icon: faHashtag, description: 'Check the availability of a YouTube video across different regions.' }
];

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const renderToolCard = (tool: Tool) => (
    <div 
      key={tool.name} 
      className="group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-6 h-full flex flex-col">
        <div className="mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <FontAwesomeIcon icon={tool.icon} className="text-2xl text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
            {tool.name}
          </h3>
          <p className="text-gray-400 text-sm">
            {tool.description}
          </p>
        </div>
        <div className="mt-auto">
          <Link 
            href={tool.href}
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            Try now
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        <div 
          className={`max-w-6xl mx-auto text-center transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Web<span className="text-blue-400">Tools</span>Center
            <span className="inline-block ml-3">
               <CogIcon className="w-10 h-10 text-blue-400 animate-spin-slow" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Your all-in-one platform for web development tools. Create, convert, and transform with ease.
          </p>

          {/* Categories including All option */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <button
              onClick={() => setActiveCategory('All')}
              className={`relative p-4 rounded-xl transition-all duration-300 ${
                activeCategory === 'All'
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500'
                  : 'bg-gray-800/50 hover:bg-gray-700/50'
              }`}
            >
              <FontAwesomeIcon 
                icon={faThLarge}
                className="text-2xl text-white mb-2" 
              />
              <p className="text-sm font-medium text-white">
                All
              </p>
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`relative p-4 rounded-xl transition-all duration-300 ${
                  activeCategory === category.name 
                    ? 'bg-gradient-to-br ' + category.gradient
                    : 'bg-gray-800/50 hover:bg-gray-700/50'
                }`}
              >
                <FontAwesomeIcon 
                  icon={category.icon} 
                  className="text-2xl text-white mb-2" 
                />
                <p className="text-sm font-medium text-white">
                  {category.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {(activeCategory === 'All' ? categories : categories.filter(cat => cat.name === activeCategory))
          .map((category, index) => {
            const categoryTools = allTools.filter(tool => 
              activeCategory === 'All' 
                ? tool.category === category.name
                : tool.category === activeCategory
            )
            if (categoryTools.length === 0) return null

            return (
              <section 
                key={category.name} 
                className={`mb-16 transform transition-all duration-500 delay-${index * 100}`}
              >
                <div className="flex items-center mb-8">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <FontAwesomeIcon icon={category.icon} className="mr-3 text-blue-400" />
                    {category.name} Tools
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-4">
                  {categoryTools.map(renderToolCard)}
                </div>
              </section>
            )
        })}
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center">
            <Star className="mr-3 text-yellow-400" />
            Why Choose WebToolsCenter?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Command className="w-8 h-8 text-blue-400" />,
                title: "All-in-One Solution",
                description: "Access a comprehensive suite of web development tools in one place."
              },
              {
                icon: <Wrench className="w-8 h-8 text-green-400" />,
                title: "User-Friendly Interface",
                description: "Intuitive design makes our tools accessible to everyone."
              },
              {
                icon: <Zap className="w-8 h-8 text-yellow-400" />,
                title: "Lightning Fast",
                description: "Optimized performance for quick and efficient results."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 hover:transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </div>
  )
}