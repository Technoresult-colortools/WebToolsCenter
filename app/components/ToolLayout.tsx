//Tool layout

import React from 'react'
import { Button } from "@/components/ui/Button"
import { Toaster } from 'react-hot-toast'
import { Bug } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools'
import { SharePopup } from '@/components/CompactShare'
import RelatedTools from '@/components/RelatedTools'
import Link from 'next/link'

interface ToolLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export default function ToolLayout({ children, title, description }: ToolLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        <aside className="bg-gray-800">
          <Sidebar />
        </aside>
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 md:mb-12 text-center px-4">
              <div className="flex flex-col items-center justify-between gap-4 mb-4">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  {title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                  {description}
                </p>
              </div>
              <div className='flex flex-1 justify-end items-center space-x-2'>
                <SharePopup />
                <Link href="https://webtoolscenter.com/contact" passHref>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/50"
                  >
                    <Bug className="h-4 w-4 mr-2" />
                    Report Bug
                  </Button>
                </Link>
              </div>
            </div>

            {children}

            <div className='bg-gray-800 rounded-xl shadow-lg max-w-4xl mx-auto mb-8'>
              <RelatedTools />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}