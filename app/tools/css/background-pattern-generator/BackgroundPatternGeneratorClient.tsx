'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Download, Info, Lightbulb, BookOpen, Maximize2, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools'
import shapesData from './shapes.json'
import * as ShapeIcons from '@/components/ShapeIcons'

type PatternType = keyof typeof shapesData

export default function EnhancedBackgroundPatternGenerator() {
  const [patternType, setPatternType] = useState<PatternType>('checks')
  const [color1, setColor1] = useState('#47d3ff')
  const [color2, setColor2] = useState('#474bff')
  const [size, setSize] = useState(24)
  const [opacity, setOpacity] = useState(1)
  const [css, setCSS] = useState('')
  const [animate, setAnimate] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(5)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    generateCSS()
  }, [patternType, color1, color2, size, opacity, animate, animationSpeed])

  const generateCSS = () => {
    let generatedCSS = shapesData[patternType].css
      .replace(/#47d3ff/g, color1)
      .replace(/#474bff/g, color2)
      .replace(/32px/g, `${size}px`)
      .replace(/64px/g, `${size * 2}px`)
      .replace(/3em/g, `${size}px`)
    
    generatedCSS += `opacity: ${opacity};`

    if (animate) {
      generatedCSS += `
    animation: moveBackground ${animationSpeed}s linear infinite;
  `
    }
    setCSS(generatedCSS)
  }

  const handleCopy = () => {
    const fullCSS = `.background-pattern {
  ${css}
}

@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}`
    navigator.clipboard.writeText(fullCSS)
    toast.success('CSS copied to clipboard!');
  }

  const handleDownload = () => {
    const fullCSS = `.background-pattern {
  ${css}
}

@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}`
    const blob = new Blob([fullCSS], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'background-pattern.css'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('CSS Downloaded successfully!');
  }

  const handleReset = () => {
    setPatternType('checks')
    setColor1('#47d3ff')
    setColor2('#474bff')
    setSize(32)
    setOpacity(1)
    setAnimate(false)
    setAnimationSpeed(5)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const renderCodePreview = () => (
    <div
      className="w-full  h-full rounded-lg"
      style={{ ...cssToObject(css) }}
    ></div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        <aside className="bg-gray-800">
          <Sidebar />
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                CSS Background Pattern Generator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Create customizable CSS background patterns quickly and efficiently.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <Tabs defaultValue="pattern" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pattern">Pattern</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="pattern">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Pattern Preview</h2>
                    <div 
                      className="w-full h-64 rounded-lg relative"
                      style={{ ...{ transition: 'all 0.3s ease' } }}
                    >
                      {renderCodePreview()}
                      <Button
                        onClick={toggleFullscreen}
                        className="absolute bottom-2 right-2 bg-gray-700 hover:bg-gray-600"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
                    <div className="space-y-4">
                    <div>
                      <Label htmlFor="patternType" className="text-white mb-2 block">Pattern Type</Label>
                      <Select value={patternType} onValueChange={(value: PatternType) => setPatternType(value)}>
                        <SelectTrigger id="patternType" className="bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select pattern type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 text-white border-gray-600 h-48 overflow-y-auto">
                          {Object.entries(shapesData).map(([value, data]) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center">
                                {React.createElement(ShapeIcons[data.icon as keyof typeof ShapeIcons])}
                                <span className="ml-2">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                      <div>
                        <Label htmlFor="color1" className="text-white mb-2 block">Color 1</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="color1"
                            type="color"
                            value={color1}
                            onChange={(e) => setColor1(e.target.value)}
                            className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                          />
                          <Input
                            type="text"
                            value={color1}
                            onChange={(e) => setColor1(e.target.value)}
                            className="flex-grow bg-gray-700 text-white border-gray-600"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="color2" className="text-white mb-2 block">Color 2</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="color2"
                            type="color"
                            value={color2}
                            onChange={(e) => setColor2(e.target.value)}
                            className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                          />
                          <Input
                            type="text"
                            value={color2}
                            onChange={(e) => setColor2(e.target.value)}
                            className="flex-grow bg-gray-700 text-white border-gray-600"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="size" className="text-white mb-2 block">Pattern Size: {size}px</Label>
                        <Slider
                          id="size"
                          min={10}
                          max={100}
                          step={1}
                          value={size}
                          onChange={(value) => setSize(value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="opacity" className="text-white mb-2 block">Opacity: {opacity.toFixed(2)}</Label>
                        <Slider
                          id="opacity"
                          min={0}
                          max={1}
                          step={0.01}
                          value={opacity}
                          onChange={(value) => setOpacity(value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="animate" className="text-white">Animate Pattern</Label>
                    <Switch
                      id="animate"
                      checked={animate}
                      onCheckedChange={setAnimate}
                    />
                  </div>

                  {animate && (
                    <div>
                      <Label htmlFor="animationSpeed" className="text-white mb-2 block">Animation Speed: {animationSpeed}s</Label>
                      <Slider
                        id="animationSpeed"
                        min={1}
                        max={10}
                        step={0.1}
                        value={animationSpeed}
                        onChange={(value) => setAnimationSpeed(value)}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <pre className="text-white whitespace-pre-wrap break-all text-sm">
                  {`.background-pattern {
  ${css}
}

@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}`}
                </pre>
              </div>
              <div className="mt-4 flex flex-wrap justify-end space-x-2 space-y-2 sm:space-y-0">
                <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy CSS
                </Button>
                <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download CSS
                </Button>
              </div>
            </div>
          </div>

          {/* About section */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is CSS Background Pattern Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The CSS Background Pattern Generator is a powerful tool that allows developers and designers to create customizable background patterns quickly and efficiently. With an expanded variety of pattern options and real-time previews, you can design unique, dynamic backgrounds with ease.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use CSS Background Pattern Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Select a pattern type from the dropdown menu.</li>
              <li>Choose colors for your pattern using the color pickers.</li>
              <li>Adjust the pattern size using the slider.</li>
              <li>Set the opacity of the pattern using the opacity slider.</li>
              <li>Toggle the animation switch to add movement to your pattern.</li>
              <li>If animation is enabled, adjust the animation speed.</li>
              <li>Preview the pattern in real-time as you make adjustments.</li>
              <li>Copy the generated CSS or download it as a file.</li>
              <li>Use the <strong>Reset</strong> button to start over with default settings.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Multiple pattern types including new complex shapes.</li>
              <li>Customizable colors with color picker and hex input for precision.</li>
              <li>Adjustable pattern size to fit your design needs.</li>
              <li>Opacity control for fine-tuning pattern visibility.</li>
              <li>Optional pattern animation with customizable speed settings.</li>
              <li>Real-time preview of the background pattern as you make changes.</li>
              <li>Generated CSS code with syntax highlighting for easy integration.</li>
              <li>One-click copy to clipboard functionality for the CSS code.</li>
              <li>Option to download the generated CSS as a file for later use.</li>
              <li>Reset option to quickly return to default settings.</li>
              <li>Responsive design for use across various devices, including mobile and desktop.</li>
              <li>Fullscreen preview mode for a better view of your pattern.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips & Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Experiment with different color combinations to make your pattern stand out.</li>
              <li>Use the opacity control to create subtle background textures.</li>
              <li>Try combining different patterns by layering them in your CSS for more complex designs.</li>
              <li>Use the animation feature to add dynamic effects to background patterns.</li>
              <li>Adjust the pattern size carefully to avoid overcrowding or too much empty space.</li>
              <li>Test the background pattern on various screen sizes to ensure responsiveness.</li>
              <li>Use the fullscreen preview to get a better sense of how your pattern will look on larger screens.</li>
              <li>Consider accessibility when choosing colors and opacity levels.</li>
            </ul>
          </div>
        </main>
      </div>
      <Footer />

      {/* Fullscreen Preview Popup */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-3/4 h-3/4 max-h-screen p-4">
            <Button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
            {renderCodePreview()}
          </div>
        </div>
      )}
    </div>
  )
}

function cssToObject(cssString: string): Record<string, string> {
  const styleObject: Record<string, string> = {}
  const styles = cssString.split(';')
  styles.forEach(style => {
    const [property, value] = style.split(':')
    if (property && value) {
      styleObject[property.trim()] = value.trim()
    }
  })
  return styleObject
}