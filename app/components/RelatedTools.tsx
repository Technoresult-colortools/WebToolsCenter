'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Cog } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { allTools } from '@/components/allTools' // Make sure this path is correct

const gradients = [
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-teal-500',
  'from-yellow-500 to-orange-500',
  'from-red-500 to-pink-500',
  'from-blue-500 to-purple-500',
  'from-indigo-500 to-blue-500',
]

export default function RelatedTools() {
  const [relatedTools, setRelatedTools] = useState<typeof allTools>([])
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsVisible(true)
    const getRelatedTools = () => {
      const pathParts = pathname.split('/').filter(Boolean)
      const category = pathParts[1]

      if (!category) {
        return allTools.sort(() => 0.5 - Math.random()).slice(0, 3)
      }

      const currentTool = allTools.find(t => t.href === pathname)

      if (!currentTool) {
        return allTools
          .filter(t => t.category.toLowerCase() === category.toLowerCase())
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
      }

      const related = allTools
        .filter(t => t.category === currentTool.category && t.href !== pathname)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)

      return related
    }

    setRelatedTools(getRelatedTools())
  }, [pathname])

  if (relatedTools.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 flex items-center">
          Related Tools
          <Cog className="ml-2 w-6 h-6 text-yellow-400 animate-spin-slow" />
        </h2>
        <p className="text-gray-300">No related tools found. Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-6 flex items-center">
        Related Tools
        <Cog className="ml-2 w-6 h-6 text-yellow-400 animate-spin-slow" />
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedTools.map((tool, index) => (
          <Link
            href={tool.href}
            key={index}
            className={`group bg-gray-700/70 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${gradients[index % gradients.length]} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <FontAwesomeIcon icon={tool.icon} className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300">
                  {tool.name}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {tool.description}
                </p>
              </div>
              <div className="mt-auto">
                <span className="inline-flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                  Try it now
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}