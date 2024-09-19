'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, Palette, FileText, Image, PenTool, Code, Share2, Wrench, Zap } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const featuredTools = [
  { name: 'Instagram Photo Downloader', description: 'Download Instagram Photos with single click', icon: FileText, category: 'Text' },
  { name: 'Image Resizer', description: 'Resize images with ease.', icon: Image, category: 'Image' },
  { name: 'CSS Flexbox Generator', description: 'Create flexible layouts quickly.', icon: PenTool, category: 'CSS' },
  { name: 'JSON Formatter', description: 'Format and validate JSON data.', icon: Code, category: 'Coding' },
  { name: 'Color Palette Generator', description: 'Generate harmonious color schemes.', icon: Palette, category: 'Color' },
  { name: 'Social Media Image Creator', description: 'Design eye-catching social media graphics.', icon: Share2, category: 'Social Media' },
  { name: 'Unit Converter', description: 'Convert between various units.', href: '/tools/misc/unit-converter', icon: Wrench, category: 'Misc' },
]

const toolCategories = [
  { name: 'Text Tools', href: '/tools/text', icon: FileText },
  { name: 'Image Tools', href: '/tools/image', icon: Image },
  { name: 'CSS Tools', href: '/tools/css', icon: PenTool },
  { name: 'Coding Tools', href: '/tools/coding', icon: Code },
  { name: 'Color Tools', href: '/tools/color', icon: Palette },
  { name: 'Social Media Tools', href: '/tools/social-media', icon: Share2 },
  { name: 'Miscellaneous Tools', href: '/tools/misc', icon: Wrench },
]

function Home() {
  const [currentToolIndex, setCurrentToolIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentToolIndex((prevIndex) => (prevIndex + 1) % featuredTools.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    },
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold text-white mb-4">
            Empower Your Creativity with
            <span className="text-blue-400"> Online Tools</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover a comprehensive suite of tools designed to enhance your workflow, boost productivity, and unleash your creative potential.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/categories"
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center"
            >
              Explore All Tools
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Featured Tools Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className={`bg-gray-800 rounded-xl shadow-lg p-6 ${index === currentToolIndex ? 'ring-2 ring-blue-400' : ''}`}
              >
                <tool.icon className={`w-12 h-12 mb-4 ${index % 2 === 0 ? 'text-green-400' : 'text-yellow-400'}`} />
                <h3 className="text-xl font-bold text-blue-400 mb-2">{tool.name}</h3>
                <p className="text-gray-300 mb-4">{tool.description}</p>
                <span className="text-sm text-gray-400 mb-4 block">Category: {tool.category}</span>
                <Link
                  href={`/tools/${tool.category.toLowerCase()}/${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-blue-400 font-semibold hover:text-blue-300 inline-flex items-center"
                >
                  Try it now
                  <ChevronRight size={20} className="ml-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tool Categories Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Tool Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {toolCategories.map((category) => (
              <motion.div key={category.name} variants={itemVariants}>
                <Link
                  href={category.href}
                  className="bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:bg-gray-700 transition duration-300 block"
                >
                  <category.icon className="text-blue-400 w-12 h-12 mb-4 mx-auto" />
                  <h3 className="text-xl font-bold text-blue-400 mb-2">{category.name}</h3>
                  {/* Space for subcategories */}
                  <div className="mt-4 text-gray-400">
                    <p>Explore various {category.name.toLowerCase()}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why Choose Us Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose Our Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <Zap className="text-yellow-400 w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Powerful & Fast</h3>
              <p className="text-gray-300">Our tools are optimized for speed and efficiency, saving you valuable time.</p>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <PenTool className="text-green-400 w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">User-Friendly Design</h3>
              <p className="text-gray-300">Intuitive interfaces make our tools accessible to both beginners and professionals.</p>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <Share2 className="text-purple-400 w-12 h-12 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Seamless Integration</h3>
              <p className="text-gray-300">Easily integrate our tools into your existing workflow and projects.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mt-16"
        >
          <h2 className="text-4xl font-bold text-white mb-8">Ready to Get Started?</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/categories"
              className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center"
            >
              Browse All Tools
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
