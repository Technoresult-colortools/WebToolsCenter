'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, FileText, Image, PenTool, Code, Palette, Share2, Wrench, Sparkles, Star } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const toolCategories = [
  { 
    name: 'Text Tools', 
    href: '/tools/text', 
    icon: FileText, 
    description: 'Transform and analyze text with ease.',
    gradient: 'from-blue-500 to-indigo-500'
  },
  { 
    name: 'Image Tools', 
    href: '/tools/image', 
    icon: Image, 
    description: 'Edit, resize, and optimize images effortlessly.',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'CSS Tools', 
    href: '/tools/css', 
    icon: PenTool, 
    description: 'Create and debug CSS with powerful utilities.',
    gradient: 'from-green-500 to-teal-500'
  },
  { 
    name: 'Coding Tools', 
    href: '/tools/coding', 
    icon: Code, 
    description: 'Enhance your coding workflow with handy tools.',
    gradient: 'from-yellow-500 to-orange-500'
  },
  { 
    name: 'Color Tools', 
    href: '/tools/color', 
    icon: Palette, 
    description: 'Explore and manipulate colors like a pro.',
    gradient: 'from-red-500 to-pink-500'
  },
  { 
    name: 'Social Media Tools', 
    href: '/tools/social-media', 
    icon: Share2, 
    description: 'Optimize your social media content creation.',
    gradient: 'from-blue-500 to-purple-500'
  },
  { 
    name: 'Miscellaneous Tools', 
    href: '/tools/misc', 
    icon: Wrench, 
    description: 'A collection of useful tools for various tasks.',
    gradient: 'from-indigo-500 to-blue-500'
  },
]

export default function ToolCategories() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

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
            Our<span className="text-blue-400">Tool</span>Categories
            <span className="inline-block ml-3">
              <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover our comprehensive collection of web development tools, designed to streamline your workflow.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCategories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="text-2xl text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {category.description}
                  </p>
                </div>
                <div className="mt-auto">
                  <span className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-300">
                    Explore tools
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center">
              <Star className="mr-3 text-yellow-400" />
              Missing Something?
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              We're constantly expanding our toolkit. Let us know what you need!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-opacity duration-300"
            >
              Request a Tool
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}