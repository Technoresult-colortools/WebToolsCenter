'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, X, Info, BookOpen, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import { defaultColors, ColorShade, ColorPalette } from './color-data'
import { generateComplementaryColors, generateAnalogousColors, generateTriadicColors } from './color-utils'
import Image from 'next/image'

export default function TailwindColorGenerator() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredColors, setFilteredColors] = useState<ColorPalette>(defaultColors)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [customColor, setCustomColor] = useState('#000000')
  const [generatedPalette, setGeneratedPalette] = useState<ColorShade[]>([])

  const colorSchemes = useMemo(() => {
    if (!selectedColor) return null
    const [colorName, shade] = selectedColor.split('-')
    const hexColor = defaultColors[colorName].find(s => s.shade === shade)?.hex || '#000000'
    return {
      complementary: generateComplementaryColors(hexColor),
      analogous: generateAnalogousColors(hexColor),
      triadic: generateTriadicColors(hexColor)
    }
  }, [selectedColor])

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

  const copyToClipboard = (text: string, isClass: boolean = false) => {
    const copyText = isClass ? `bg-${text}` : text
    navigator.clipboard.writeText(copyText)
    toast.success('Copied to clipboard!', {
      icon: '📋',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    })
  }

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value)
    setGeneratedPalette(generateCustomPalette(e.target.value))
  }

  const generateCustomPalette = (baseColor: string): ColorShade[] => {
    // This is a simplified version. You might want to use a more sophisticated algorithm
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]
    return shades.map(shade => ({
      shade: shade.toString(),
      hex: adjustBrightness(baseColor, (shade - 500) / 400)
    }))
  }

  const adjustBrightness = (hex: string, factor: number): string => {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)

    // Adjust brightness
    r = Math.round(r * (1 + factor))
    g = Math.round(g * (1 + factor))
    b = Math.round(b * (1 + factor))

    // Ensure values are within 0-255 range
    r = Math.min(255, Math.max(0, r))
    g = Math.min(255, Math.max(0, g))
    b = Math.min(255, Math.max(0, b))

    // Convert back to hex
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  return (
    <ToolLayout
      title="Tailwind CSS Color Generator"
      description="Discover, generate, and experiment with Tailwind CSS colors in a sleek, futuristic interface"
    >
      <div className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 max-w-7xl mx-auto mb-8 overflow-hidden">
        <div className="relative w-full max-w-md mx-auto mb-8">
          <Input
            type="text"
            placeholder="Search colors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white border-gray-700 rounded-full pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        
        <Tabs defaultValue="tailwind" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="tailwind">Tailwind Colors</TabsTrigger>
            <TabsTrigger value="custom">Custom Generator</TabsTrigger>
          </TabsList>
          <TabsContent value="tailwind">
            <div className="space-y-8">
              {Object.entries(filteredColors).map(([colorName, shades]) => (
                <div key={colorName} className="bg-gray-800 rounded-lg overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-30">
                  <div className="p-4 bg-gray-700 bg-opacity-50">
                    <h3 className="text-xl font-semibold text-white capitalize">{colorName}</h3>
                  </div>
                  <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {shades.map((shade) => (
                      <div 
                        key={shade.shade} 
                        className="flex flex-col items-center bg-gray-800 rounded-lg p-4 transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer min-w-[120px] backdrop-filter backdrop-blur-sm bg-opacity-50"
                        onClick={() => setSelectedColor(`${colorName}-${shade.shade}`)}
                      >
                        <div
                          className="w-16 h-16 rounded-lg mb-2 border border-gray-600 shadow-inner"
                          style={{ backgroundColor: shade.hex }}
                        ></div>
                        <span className="text-white font-medium mb-1">{shade.shade}</span>
                        <span className="text-gray-400 text-sm mb-2">{shade.hex}</span>
                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(`${colorName}-${shade.shade}`, true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs transition-colors duration-200"
                            title="Copy class name"
                          >
                            Class
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(shade.hex);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors duration-200"
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
          </TabsContent>
          <TabsContent value="custom">
            <div className="bg-gray-800 rounded-lg p-6 backdrop-filter backdrop-blur-lg bg-opacity-30">
              <h3 className="text-xl font-semibold text-white mb-4">Custom Color Generator</h3>
              <div className="flex items-center space-x-4 mb-6">
                <Input
                  type="color"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="w-12 h-12 p-1 rounded-lg border-2 border-gray-600 focus:border-blue-500 transition-colors duration-200"
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={handleCustomColorChange}
                  className="bg-gray-700 text-white border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {generatedPalette.map((shade) => (
                  <div 
                    key={shade.shade} 
                    className="flex flex-col items-center bg-gray-800 rounded-lg p-4 transition-all transform hover:scale-105 hover:shadow-lg cursor-pointer backdrop-filter backdrop-blur-sm bg-opacity-50"
                  >
                    <div
                      className="w-16 h-16 rounded-lg mb-2 border border-gray-600 shadow-inner"
                      style={{ backgroundColor: shade.hex }}
                    ></div>
                    <span className="text-white font-medium mb-1">{shade.shade}</span>
                    <span className="text-gray-400 text-sm mb-2">{shade.hex}</span>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      <Button
                        onClick={() => copyToClipboard(`custom-${shade.shade}`, true)}
                        className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs transition-colors duration-200"
                        title="Copy class name"
                      >
                        Class
                      </Button>
                      <Button
                        onClick={() => copyToClipboard(shade.hex)}
                        className="bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-xs transition-colors duration-200"
                        title="Copy hex code"
                      >
                        Hex
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
  
        {selectedColor && colorSchemes && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6 backdrop-filter backdrop-blur-lg bg-opacity-30">
            <h3 className="text-xl font-semibold text-white mb-4">Color Schemes for {selectedColor}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Complementary</h4>
                <div className="flex space-x-2">
                  {colorSchemes.complementary.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-lg border border-gray-600 shadow-inner cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`Copy ${color}`}
                    ></div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Analogous</h4>
                <div className="flex space-x-2">
                  {colorSchemes.analogous.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-lg border border-gray-600 shadow-inner cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`Copy ${color}`}
                    ></div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Triadic</h4>
                <div className="flex space-x-2">
                  {colorSchemes.triadic.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-lg border border-gray-600 shadow-inner cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => copyToClipboard(color)}
                      title={`Copy ${color}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About Tailwind Color Generator
        </h2>
        <p className="text-gray-300 mb-4">
          The Tailwind Color Generator is an advanced tool designed for web developers, designers, and digital artists. It provides a comprehensive exploration and manipulation platform for Tailwind CSS colors, allowing users to easily browse, search, and generate custom color palettes. This tool is particularly useful when working with web design, CSS styling, or any project that requires precise color management and consistency across different color representations.
        </p>
        <p className="text-gray-300 mb-4">
          With features like real-time color preview, interactive color selection, custom palette generation, and support for various color formats, the Tailwind Color Generator streamlines your workflow and ensures accurate color representation across your projects. It's perfect for creating consistent color schemes, exploring color relationships, or simply diving deep into the expansive world of Tailwind CSS colors.
        </p>

        <div className="my-8">
          <Image
            src="/Images/TailwindPreview.png?height=400&width=600"
            alt="Screenshot of the Tailwind Color Generator interface showing color palettes and custom color generator"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Tailwind Color Generator?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use the search bar to quickly find specific colors or shades within the Tailwind palette.</li>
          <li>Click on any color swatch to view more details and copy its class name or hex code.</li>
          <li>Explore different shades of each color family to find the perfect hue for your project.</li>
          <li>Switch to the Custom Generator tab to create your own color palette based on a chosen base color.</li>
          <li>Adjust the base color using the color picker or by entering a hex code.</li>
          <li>View and copy generated custom shades that complement your base color.</li>
          <li>Explore complementary, analogous, and triadic color schemes for selected colors.</li>
          <li>Use the copy buttons to quickly add color values to your clipboard for use in your projects.</li>
          <li>Experiment with different color combinations to create unique and harmonious designs.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Comprehensive Tailwind CSS color palette browser</li>
          <li>Powerful search functionality for quick color location</li>
          <li>Custom color palette generator</li>
          <li>Real-time color preview and interaction</li>
          <li>Support for both class names and hex code formats</li>
          <li>One-click copying of color values to clipboard</li>
          <li>Color scheme suggestions (complementary, analogous, triadic)</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Intuitive and user-friendly interface</li>
          <li>Detailed information and usage tips for each color</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Quickly find and implement Tailwind CSS color classes in your projects, ensuring consistency and efficiency in your styling process.</li>
          <li><strong>UI/UX Design:</strong> Explore and experiment with color combinations to create visually appealing and harmonious user interfaces.</li>
          <li><strong>Brand Identity:</strong> Develop and maintain consistent color schemes across various digital platforms by leveraging Tailwind's predefined color palette.</li>
          <li><strong>Accessibility Testing:</strong> Use the tool to ensure proper color contrast and readability in your web designs, especially for users with visual impairments.</li>
          <li><strong>Custom Theme Creation:</strong> Generate custom color palettes that seamlessly integrate with Tailwind CSS, allowing for unique project themes.</li>
          <li><strong>Design Systems:</strong> Establish a cohesive color system for large-scale projects or design systems based on Tailwind's color structure.</li>
          <li><strong>Prototyping:</strong> Quickly iterate through different color options during the prototyping phase of your design process.</li>
          <li><strong>Color Theory Education:</strong> Use the tool as a teaching aid to demonstrate color relationships and how they translate into practical web design scenarios.</li>
          <li><strong>Cross-Platform Design:</strong> Ensure color consistency across different devices and platforms by using Tailwind's carefully crafted color scales.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to elevate your color workflow? Start using our Tailwind Color Generator now and experience the power of efficient color management and exploration. Whether you're a seasoned web developer working on complex projects, a designer crafting the perfect user interface, or a newcomer to the world of web design, our tool provides the functionality and inspiration you need. Try it out today and see how it can streamline your design process, spark your creativity, and help you make the most of Tailwind CSS's robust color system!
        </p>
      </div>
 
      <Toaster />
    </ToolLayout>
  )
}