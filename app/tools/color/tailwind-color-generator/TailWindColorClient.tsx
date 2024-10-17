'use client'

import React, { useState, useEffect } from 'react'
import { Search, X, Download, Info, BookOpen, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type ColorShade = {
  shade: string
  hex: string
}

type ColorPalette = {
  [key: string]: ColorShade[]
}

const defaultColors: ColorPalette = {
  slate: [
    { shade: '50', hex: '#f8fafc' },
    { shade: '100', hex: '#f1f5f9' },
    { shade: '200', hex: '#e2e8f0' },
    { shade: '300', hex: '#cbd5e1' },
    { shade: '400', hex: '#94a3b8' },
    { shade: '500', hex: '#64748b' },
    { shade: '600', hex: '#475569' },
    { shade: '700', hex: '#334155' },
    { shade: '800', hex: '#1e293b' },
    { shade: '900', hex: '#0f172a' },
    { shade: '950', hex: '#020617' },
  ],
  gray: [
    { shade: '50', hex: '#f9fafb' },
    { shade: '100', hex: '#f3f4f6' },
    { shade: '200', hex: '#e5e7eb' },
    { shade: '300', hex: '#d1d5db' },
    { shade: '400', hex: '#9ca3af' },
    { shade: '500', hex: '#6b7280' },
    { shade: '600', hex: '#4b5563' },
    { shade: '700', hex: '#374151' },
    { shade: '800', hex: '#1f2937' },
    { shade: '900', hex: '#111827' },
    { shade: '950', hex: '#030712' },
  ],
  zinc: [
    { shade: '50', hex: '#fafafa' },
    { shade: '100', hex: '#f4f4f5' },
    { shade: '200', hex: '#e4e4e7' },
    { shade: '300', hex: '#d4d4d8' },
    { shade: '400', hex: '#a1a1aa' },
    { shade: '500', hex: '#71717a' },
    { shade: '600', hex: '#52525b' },
    { shade: '700', hex: '#3f3f46' },
    { shade: '800', hex: '#27272a' },
    { shade: '900', hex: '#18181b' },
    { shade: '950', hex: '#09090b' },
  ],
    neutral: [
      { shade: '50', hex: '#fafafa' },
      { shade: '100', hex: '#f5f5f5' },
      { shade: '200', hex: '#e5e5e5' },
      { shade: '300', hex: '#d4d4d4' },
      { shade: '400', hex: '#a3a3a3' },
      { shade: '500', hex: '#737373' },
      { shade: '600', hex: '#525252' },
      { shade: '700', hex: '#404040' },
      { shade: '800', hex: '#262626' },
      { shade: '900', hex: '#171717' },
      { shade: '950', hex: '#0a0a0a' },
    ],
    stone: [
      { shade: '50', hex: '#fafaf9' },
      { shade: '100', hex: '#f5f5f4' },
      { shade: '200', hex: '#e7e5e4' },
      { shade: '300', hex: '#d6d3d1' },
      { shade: '400', hex: '#a8a29e' },
      { shade: '500', hex: '#78716c' },
      { shade: '600', hex: '#57534e' },
      { shade: '700', hex: '#44403c' },
      { shade: '800', hex: '#292524' },
      { shade: '900', hex: '#1c1917' },
      { shade: '950', hex: '#0c0a09' },
    ],
    red: [
      { shade: '50', hex: '#fef2f2' },
      { shade: '100', hex: '#fee2e2' },
      { shade: '200', hex: '#fecaca' },
      { shade: '300', hex: '#fca5a5' },
      { shade: '400', hex: '#f87171' },
      { shade: '500', hex: '#ef4444' },
      { shade: '600', hex: '#dc2626' },
      { shade: '700', hex: '#b91c1c' },
      { shade: '800', hex: '#991b1b' },
      { shade: '900', hex: '#7f1d1d' },
      { shade: '950', hex: '#450a0a' },
    ],
    orange: [
      { shade: '50', hex: '#fff7ed' },
      { shade: '100', hex: '#ffedd5' },
      { shade: '200', hex: '#fed7aa' },
      { shade: '300', hex: '#fdba74' },
      { shade: '400', hex: '#fb923c' },
      { shade: '500', hex: '#f97316' },
      { shade: '600', hex: '#ea580c' },
      { shade: '700', hex: '#c2410c' },
      { shade: '800', hex: '#9a3412' },
      { shade: '900', hex: '#7c2d12' },
      { shade: '950', hex: '#431407' },
    ],
    amber: [
      { shade: '50', hex: '#fffbeb' },
      { shade: '100', hex: '#fef3c7' },
      { shade: '200', hex: '#fde68a' },
      { shade: '300', hex: '#fcd34d' },
      { shade: '400', hex: '#fbbf24' },
      { shade: '500', hex: '#f59e0b' },
      { shade: '600', hex: '#d97706' },
      { shade: '700', hex: '#b45309' },
      { shade: '800', hex: '#92400e' },
      { shade: '900', hex: '#78350f' },
      { shade: '950', hex: '#451a03' },
    ],
    yellow: [
      { shade: '50', hex: '#fefce8' },
      { shade: '100', hex: '#fef9c3' },
      { shade: '200', hex: '#fef08a' },
      { shade: '300', hex: '#fde047' },
      { shade: '400', hex: '#facc15' },
      { shade: '500', hex: '#eab308' },
      { shade: '600', hex: '#ca8a04' },
      { shade: '700', hex: '#a16207' },
      { shade: '800', hex: '#854d0e' },
      { shade: '900', hex: '#713f12' },
      { shade: '950', hex: '#422006' },
    ],
    lime: [
        { shade: '50', hex: '#f7fee7' },
        { shade: '100', hex: '#ecfccb' },
        { shade: '200', hex: '#d9f99d' },
        { shade: '300', hex: '#bef264' },
        { shade: '400', hex: '#a3e635' },
        { shade: '500', hex: '#84cc16' },
        { shade: '600', hex: '#65a30d' },
        { shade: '700', hex: '#4d7c0f' },
        { shade: '800', hex: '#3f6212' },
        { shade: '900', hex: '#365314' },
      ],
      green: [
        { shade: '50', hex: '#f0fdf4' },
        { shade: '100', hex: '#dcfce7' },
        { shade: '200', hex: '#bbf7d0' },
        { shade: '300', hex: '#86efac' },
        { shade: '400', hex: '#4ade80' },
        { shade: '500', hex: '#22c55e' },
        { shade: '600', hex: '#16a34a' },
        { shade: '700', hex: '#15803d' },
        { shade: '800', hex: '#166534' },
        { shade: '900', hex: '#14532d' },
      ],
      emerald: [
        { shade: '50', hex: '#ecfdf5' },
        { shade: '100', hex: '#d1fae5' },
        { shade: '200', hex: '#a7f3d0' },
        { shade: '300', hex: '#6ee7b7' },
        { shade: '400', hex: '#34d399' },
        { shade: '500', hex: '#10b981' },
        { shade: '600', hex: '#059669' },
        { shade: '700', hex: '#047857' },
        { shade: '800', hex: '#065f46' },
        { shade: '900', hex: '#064e3b' },
      ],
      teal: [
        { shade: '50', hex: '#f0fdfa' },
        { shade: '100', hex: '#ccfbf1' },
        { shade: '200', hex: '#99f6e4' },
        { shade: '300', hex: '#5eead4' },
        { shade: '400', hex: '#2dd4bf' },
        { shade: '500', hex: '#14b8a6' },
        { shade: '600', hex: '#0d9488' },
        { shade: '700', hex: '#0f766e' },
        { shade: '800', hex: '#115e59' },
        { shade: '900', hex: '#134e4a' },
      ],
      cyan: [
        { shade: '50', hex: '#ecfeff' },
        { shade: '100', hex: '#cffafe' },
        { shade: '200', hex: '#a5f3fc' },
        { shade: '300', hex: '#67e8f9' },
        { shade: '400', hex: '#22d3ee' },
        { shade: '500', hex: '#06b6d4' },
        { shade: '600', hex: '#0891b2' },
        { shade: '700', hex: '#0e7490' },
        { shade: '800', hex: '#155e75' },
        { shade: '900', hex: '#164e63' },
      ],
      sky: [
        { shade: '50', hex: '#f0f9ff' },
        { shade: '100', hex: '#e0f2fe' },
        { shade: '200', hex: '#bae6fd' },
        { shade: '300', hex: '#7dd3fc' },
        { shade: '400', hex: '#38bdf8' },
        { shade: '500', hex: '#0ea5e9' },
        { shade: '600', hex: '#0284c7' },
        { shade: '700', hex: '#0369a1' },
        { shade: '800', hex: '#075985' },
        { shade: '900', hex: '#0c4a6e' },
      ],
      blue: [
        { shade: '50', hex: '#eff6ff' },
        { shade: '100', hex: '#dbeafe' },
        { shade: '200', hex: '#bfdbfe' },
        { shade: '300', hex: '#93c5fd' },
        { shade: '400', hex: '#60a5fa' },
        { shade: '500', hex: '#3b82f6' },
        { shade: '600', hex: '#2563eb' },
        { shade: '700', hex: '#1d4ed8' },
        { shade: '800', hex: '#1e40af' },
        { shade: '900', hex: '#1e3a8a' },
      ],
      indigo: [
        { shade: '50', hex: '#eef2ff' },
        { shade: '100', hex: '#e0e7ff' },
        { shade: '200', hex: '#c7d2fe' },
        { shade: '300', hex: '#a5b4fc' },
        { shade: '400', hex: '#818cf8' },
        { shade: '500', hex: '#6366f1' },
        { shade: '600', hex: '#4f46e5' },
        { shade: '700', hex: '#4338ca' },
        { shade: '800', hex: '#3730a3' },
        { shade: '900', hex: '#312e81' },
      ],
      violet: [
        { shade: '50', hex: '#f5f3ff' },
        { shade: '100', hex: '#ede9fe' },
        { shade: '200', hex: '#ddd6fe' },
        { shade: '300', hex: '#c4b5fd' },
        { shade: '400', hex: '#a78bfa' },
        { shade: '500', hex: '#8b5cf6' },
        { shade: '600', hex: '#7c3aed' },
        { shade: '700', hex: '#6d28d9' },
        { shade: '800', hex: '#5b21b6' },
        { shade: '900', hex: '#4c1d95' },
      ],
      purple: [
        { shade: '50', hex: '#faf5ff' },
        { shade: '100', hex: '#f3e8ff' },
        { shade: '200', hex: '#e9d5ff' },
        { shade: '300', hex: '#d8b4fe' },
        { shade: '400', hex: '#c084fc' },
        { shade: '500', hex: '#a855f7' },
        { shade: '600', hex: '#9333ea' },
        { shade: '700', hex: '#7e22ce' },
        { shade: '800', hex: '#6b21a8' },
        { shade: '900', hex: '#581c87' },
      ],
      fuchsia: [
        { shade: '50', hex: '#fdf4ff' },
        { shade: '100', hex: '#fae8ff' },
        { shade: '200', hex: '#f5d0fe' },
        { shade: '300', hex: '#f0abfc' },
        { shade: '400', hex: '#e879f9' },
        { shade: '500', hex: '#d946ef' },
        { shade: '600', hex: '#c026d3' },
        { shade: '700', hex: '#a21caf' },
        { shade: '800', hex: '#86198f' },
        { shade: '900', hex: '#701a75' },
      ],
      pink: [
        { shade: '50', hex: '#fdf2f8' },
        { shade: '100', hex: '#fce7f3' },
        { shade: '200', hex: '#fbcfe8' },
        { shade: '300', hex: '#f9a8d4' },
        { shade: '400', hex: '#f472b6' },
        { shade: '500', hex: '#ec4899' },
        { shade: '600', hex: '#db2777' },
        { shade: '700', hex: '#be185d' },
        { shade: '800', hex: '#9d174d' },
        { shade: '900', hex: '#831843' },
      ],
      rose: [
        { shade: '50', hex: '#fff1f2' },
        { shade: '100', hex: '#ffe4e6' },
        { shade: '200', hex: '#fecdd3' },
        { shade: '300', hex: '#fda4af' },
        { shade: '400', hex: '#fb7185' },
        { shade: '500', hex: '#f43f5e' },
        { shade: '600', hex: '#e11d48' },
        { shade: '700', hex: '#be123c' },
        { shade: '800', hex: '#9f1239' },
        { shade: '900', hex: '#881337' },
      ],
}

export default function TailwindColorGenerator() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredColors, setFilteredColors] = useState<ColorPalette>(defaultColors)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  useEffect(() => {
    const filtered = Object.entries(defaultColors).reduce((acc, [colorName, shades]) => {
      const filteredShades = shades.filter(
        shade => 
          colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shade.shade.includes(searchTerm) ||
          shade.hex.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (filteredShades.length > 0) {
        acc[colorName] = filteredShades
      }
      return acc
    }, {} as ColorPalette)
    setFilteredColors(filtered)
  }, [searchTerm])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const downloadPalette = () => {
    const paletteText = Object.entries(filteredColors)
      .map(([colorName, shades]) => 
        `${colorName}:\n${shades.map(shade => `  ${shade.shade}: ${shade.hex}`).join('\n')}`
      )
      .join('\n\n')
    
    const blob = new Blob([paletteText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tailwind_palette.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Palette downloaded successfully!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <div className='flex-grow flex'>
        <aside className="bg-gray-800">
          <Sidebar />
        </aside>
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
              Tailwind CSS Color Palette Generator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Explore, search, and copy Tailwind CSS color classes and hex codes with ease.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-6xl mx-auto mb-8">
            <div className="relative w-full max-w-md mx-auto mb-8">
              <Input
                type="text"
                placeholder="Search colors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white border-gray-600 rounded-full pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <div className="space-y-8">
              {Object.entries(filteredColors).map(([colorName, shades]) => (
                <div key={colorName} className="bg-gray-700 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-600">
                    <h3 className="text-xl font-semibold text-white capitalize">{colorName}</h3>
                  </div>
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {shades.map((shade) => (
                      <div 
                        key={shade.shade} 
                        className="flex flex-col items-center bg-gray-800 rounded-lg p-4 transition-transform transform hover:scale-105 cursor-pointer"
                        onClick={() => setSelectedColor(`${colorName}-${shade.shade}`)}
                      >
                        <div
                          className="w-16 h-16 rounded-lg mb-2 border border-gray-600"
                          style={{ backgroundColor: shade.hex }}
                        ></div>
                        <span className="text-white font-medium mb-1">{shade.shade}</span>
                        <span className="text-gray-400 text-sm mb-2">{shade.hex}</span>
                        <div className="flex space-x-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(`${colorName}-${shade.shade}`)
                            }}
                            className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
                            title="Copy class name"
                          >
                            Class
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(shade.hex)
                            }}
                            className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs"
                            title="Copy hex code"
                          >
                            Hex
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {selectedColor && (
              <Alert className="mt-8">
                <Info className="h-4 w-4" />
                <AlertTitle>Selected Color</AlertTitle>
                <AlertDescription>
                  You've selected the color: <strong>{selectedColor}</strong>. 
                  Click 'Class' to copy the Tailwind class name or 'Hex' to copy the hex code.
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-8 flex justify-center">
              <Button onClick={downloadPalette} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="mr-2 h-4 w-4" />
                Download Palette
              </Button>
            </div>
          </div>
  
          <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-4xl mx-auto mt-8">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                  <Info className="w-6 h-6 mr-2" />
                  About Tailwind Color Generator
                </h2>
                <p className="text-white">
                  The Tailwind Color Generator is a powerful tool designed to help developers and designers explore and utilize the full range of Tailwind CSS colors. With features like real-time search, instant class name generation, and hex code copying, this tool simplifies color selection and integration for your web projects.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                  <BookOpen className="w-6 h-6 mr-2" />
                  How to Use Tailwind Color Generator
                </h2>
                <ol className="list-decimal list-inside text-white space-y-2">
                  <li>Use the search bar to filter colors by name, shade, or hex code.</li>
                  <li>Click on a color swatch to select it and view more details.</li>
                  <li>Use the 'Class' button to copy the Tailwind class name (e.g., 'bg-blue-500').</li>
                  <li>Use the 'Hex' button to copy the color's hex code.</li>
                  <li>Download the entire palette for offline reference.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2" />
                  Key Features
                </h2>
                <ul className="list-disc list-inside text-white space-y-2">
                  <li>Comprehensive Tailwind CSS color palette</li>
                  <li>Real-time search and filtering</li>
                  <li>One-click copying of class names and hex codes</li>
                  <li>Color selection with detailed view</li>
                  <li>Palette download functionality</li>
                  <li>Responsive design for use on any device</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-2" />
                  Tips and Tricks
                </h2>
                <ul className="list-disc list-inside text-white space-y-2">
                  <li>Use the search to quickly find specific colors or shades.</li>
                  <li>Experiment with different shades to find the perfect color for your design.</li>
                  <li>Combine Tailwind color classes for backgrounds, text, and borders to create unique designs.</li>
                  <li>Download the palette for offline reference or to share with your team.</li>
                  <li>Use the selected color alert to keep track of your current color choice.</li>
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  )
}