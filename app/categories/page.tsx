import React from 'react'
import Link from 'next/link'
import { ChevronRight, FileText, Image, PenTool, Code, Palette, Share2, Wrench } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const toolCategories = [
  { name: 'Text Tools', href: '/tools/text', icon: FileText, description: 'Transform and analyze text with ease.' },
  { name: 'Image Tools', href: '/tools/image', icon: Image, description: 'Edit, resize, and optimize images effortlessly.' },
  { name: 'CSS Tools', href: '/tools/css', icon: PenTool, description: 'Create and debug CSS with powerful utilities.' },
  { name: 'Coding Tools', href: '/tools/coding', icon: Code, description: 'Enhance your coding workflow with handy tools.' },
  { name: 'Color Tools', href: '/tools/color', icon: Palette, description: 'Explore and manipulate colors like a pro.' },
  { name: 'Social Media Tools', href: '/tools/social-media', icon: Share2, description: 'Optimize your social media content creation.' },
  { name: 'Miscellaneous Tools', href: '/tools/misc', icon: Wrench, description: 'A collection of useful tools for various tasks.' },
]

export default function ToolCategories() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Tool Categories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toolCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="bg-gray-800 rounded-xl shadow-lg p-6 hover:bg-gray-700 transition duration-300 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <category.icon className="text-blue-400 w-8 h-8 mr-4" />
                <h2 className="text-2xl font-bold text-blue-400">{category.name}</h2>
              </div>
              <p className="text-gray-300 mb-4 flex-grow">{category.description}</p>
              <span className="text-blue-400 font-semibold hover:text-blue-300 inline-flex items-center mt-auto">
                Explore tools
                <ChevronRight size={20} className="ml-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            We&apos;re always adding new tools. Let us know what you need!
          </p>
          <Link
            href="/contact"
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 inline-flex items-center"
          >
            Request a Tool
            <ChevronRight size={20} className="ml-2" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}