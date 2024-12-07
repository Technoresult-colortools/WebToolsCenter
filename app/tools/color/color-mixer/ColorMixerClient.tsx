'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { Copy, Shuffle, Info, BookOpen, Lightbulb, AlertCircle, Star, RotateCcw, Palette, Maximize2, X, Sliders } from 'lucide-react'
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import Slider from "@/components/ui/Slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast, Toaster } from 'react-hot-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import ToolLayout from '@/components/ToolLayout'

function mixColors(color1: string, color2: string, weight: number = 0.5) {
  const w1 = weight
  const w2 = 1 - w1
  const rgb1 = parseInt(color1.slice(1), 16)
  const rgb2 = parseInt(color2.slice(1), 16)
  const r1 = (rgb1 >> 16) & 255
  const g1 = (rgb1 >> 8) & 255
  const b1 = rgb1 & 255
  const r2 = (rgb2 >> 16) & 255
  const g2 = (rgb2 >> 8) & 255
  const b2 = rgb2 & 255
  const r = Math.round(r1 * w1 + r2 * w2)
  const g = Math.round(g1 * w1 + g2 * w2)
  const b = Math.round(b1 * w1 + b2 * w2)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

function generateShades(startColor: string, endColor: string, steps: number) {
  const shades = []
  for (let i = 0; i < steps; i++) {
    const weight = i / (steps - 1)
    shades.push(mixColors(startColor, endColor, weight))
  }
  return shades
}

function hexToRgb(hex: string) {
  const bigint = parseInt(hex.slice(1), 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgb(${r}, ${g}, ${b})`
}

function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
}

function hexToCmyk(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const k = 1 - Math.max(r, g, b)
  const c = (1 - r - k) / (1 - k)
  const m = (1 - g - k) / (1 - k)
  const y = (1 - b - k) / (1 - k)

  return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`
}

export default function ColorMixer() {
  const [color1, setColor1] = useState("#4285F4")
  const [color2, setColor2] = useState("#34A853")
  const [steps, setSteps] = useState(5)
  const [mixedColors, setMixedColors] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  const [blendMode, setBlendMode] = useState<'linear' | 'radial'>('linear')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [colorFormat, setColorFormat] = useState<'hex' | 'rgb' | 'hsl' | 'cmyk'>('hex')
  const colorPicker1Ref = useRef<HTMLInputElement>(null)
  const colorPicker2Ref = useRef<HTMLInputElement>(null)

  const handleMixColors = useCallback(() => {
    setError('')
    if (!/^#[0-9A-Fa-f]{6}$/.test(color1) || !/^#[0-9A-Fa-f]{6}$/.test(color2)) {
      setError('Please enter valid hex color codes.')
      toast.error('Invalid hex color codes')
      return
    }
    setMixedColors(generateShades(color1, color2, steps))
    toast.success('Colors mixed successfully!')
  }, [color1, color2, steps])

  const handleReset = () => {
    setColor1("#4285F4")
    setColor2("#34A853")
    setSteps(5)
    setMixedColors([])
    setError('')
    toast.success('Reset to default values')
  }

  const handleCopyColor = (color: string) => {
    let colorToCopy = color
    switch (colorFormat) {
      case 'rgb':
        colorToCopy = hexToRgb(color)
        break
      case 'hsl':
        colorToCopy = hexToHsl(color)
        break
      case 'cmyk':
        colorToCopy = hexToCmyk(color)
        break
    }
    navigator.clipboard.writeText(colorToCopy)
    toast.success(`Copied ${colorToCopy} to clipboard`)
  }

  const handleRandomColors = () => {
    setColor1(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`)
    setColor2(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`)
    toast.success('Random colors generated')
  }

  const handlePopularMix = () => {
    const popularMixes = [
      { color1: "#4285F4", color2: "#34A853" }, // Google Blue to Green
      { color1: "#FF6B6B", color2: "#4ECDC4" }, // Coral to Teal
      { color1: "#FFC300", color2: "#DAF7A6" }, // Yellow to Light Green
      { color1: "#FF5733", color2: "#C70039" }, // Orange to Red
      { color1: "#3498DB", color2: "#8E44AD" }  // Blue to Purple
    ]
    const randomMix = popularMixes[Math.floor(Math.random() * popularMixes.length)]
    setColor1(randomMix.color1)
    setColor2(randomMix.color2)
    toast.success('Popular color mix applied')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  useEffect(() => {
    handleMixColors()
  }, [handleMixColors])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPicker1Ref.current && !colorPicker1Ref.current.contains(event.target as Node)) {
        colorPicker1Ref.current.blur()
      }
      if (colorPicker2Ref.current && !colorPicker2Ref.current.contains(event.target as Node)) {
        colorPicker2Ref.current.blur()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <ToolLayout
      title="Color Mixer"
      description="Mix colors, generate shades, and explore different color formats with advanced features"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">Color Mixer</CardTitle>
          <CardDescription className="text-gray-400">Mix colors and generate custom palettes with advanced controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <div 
              className={`w-full h-48 rounded-lg ${blendMode === 'linear' ? 'bg-gradient-to-r' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]'}`}
              style={{
                backgroundImage: `${blendMode === 'linear' ? 'linear-gradient' : 'radial-gradient'}(${mixedColors.join(',')})`
              }}
            ></div>
            <Button
              size="sm"
              variant="secondary"
              onClick={toggleFullscreen}
              className="absolute bottom-2 right-2 bg-white/10 hover:bg-white/20"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="mixer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="mixer" className="data-[state=active]:bg-blue-600">
                <Palette className="h-4 w-4 mr-2" />
                Mixer
              </TabsTrigger>
              <TabsTrigger value="palette" className="data-[state=active]:bg-purple-600">
                <Sliders className="h-4 w-4 mr-2" />
                Palette
              </TabsTrigger>
            </TabsList>
            <TabsContent value="mixer">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="color-picker-1" className="block text-sm font-medium text-gray-300 mb-2">
                      Start Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="color-input-1"
                        type="text"
                        value={color1}
                        onChange={(e) => setColor1(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                      <div className="relative">
                        <input
                          ref={colorPicker1Ref}
                          id="color-picker-1"
                          type="color"
                          value={color1}
                          onChange={(e) => setColor1(e.target.value)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="color-picker-1"
                          className="w-12 h-12 rounded cursor-pointer border-2 border-white/20 flex items-center justify-center"
                          style={{ backgroundColor: color1 }}
                        >
                          <div className="w-8 h-8 rounded-sm border border-white/40"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="color-picker-2" className="block text-sm font-medium text-gray-300 mb-2">
                      End Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="color-input-2"
                        type="text"
                        value={color2}
                        onChange={(e) => setColor2(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                      <div className="relative">
                        <input
                          ref={colorPicker2Ref}
                          id="color-picker-2"
                          type="color"
                          value={color2}
                          onChange={(e) => setColor2(e.target.value)}
                          className="sr-only"
                        />
                        <label
                          htmlFor="color-picker-2"
                          className="w-12 h-12 rounded cursor-pointer border-2 border-white/20 flex items-center justify-center"
                          style={{ backgroundColor: color2 }}
                        >
                          <div className="w-8 h-8 rounded-sm border border-white/40"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="steps" className="block text-sm font-medium text-gray-300 mb-2">
                    Steps: {steps}
                  </label>
                  <Slider
                    id="steps"
                    min={2}
                    max={20}
                    step={1}
                    value={steps}
                    onChange={(value) => setSteps(value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Blend Mode
                  </label>
                  <div className="flex space-x-4">
                    <Button
                      onClick={() => setBlendMode('linear')}
                      variant={blendMode === 'linear' ? 'default' : 'secondary'}
                      className="w-full"
                    >
                      Linear
                    </Button>
                    <Button
                      onClick={() => setBlendMode('radial')}
                      variant={blendMode === 'radial' ? 'default' : 'secondary'}
                      className="w-full"
                    >
                      Radial
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                  <Button onClick={handleReset} variant="destructive" className="flex-1">
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={handleRandomColors} variant="secondary" className="flex-1">
                    <Shuffle className="h-5 w-5 mr-2" />
                    Random
                  </Button>
                  <Button onClick={handlePopularMix} variant="secondary" className="flex-1">
                    <Star className="h-5 w-5 mr-2" />
                    Popular
                  </Button>
                  <Button onClick={handleMixColors} className="flex-1">
                    Mix Colors
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>
            <TabsContent value="palette">
              <div className="space-y-4">
                <div>
                  <label htmlFor="color-format" className="block text-sm font-medium text-gray-300 mb-2">
                    Color Format
                  </label>
                  <Select onValueChange={(value: 'hex' | 'rgb' | 'hsl' | 'cmyk') => setColorFormat(value)} value={colorFormat}>
                    <SelectTrigger id="color-format" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select color format" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="hex">HEX</SelectItem>
                      <SelectItem value="rgb">RGB</SelectItem>
                      <SelectItem value="hsl">HSL</SelectItem>
                      <SelectItem value="cmyk">CMYK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mixedColors.map((color, index) => (
                    <div key={index} className="bg-gray-700 shadow-md rounded-lg p-4">
                      <div
                        className="w-full h-20 rounded-lg mb-2 relative group"
                        style={{ backgroundColor: color }}
                      >
                        <Button
                          onClick={() => handleCopyColor(color)}
                          className="absolute top-1 right-1 bg-white/10 hover:bg-white/20 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-center">
                        <p className="text-white font-medium">
                          {colorFormat === 'hex' && color}
                          {colorFormat === 'rgb' && hexToRgb(color)}
                          {colorFormat === 'hsl' && hexToHsl(color)}
                          {colorFormat === 'cmyk' && hexToCmyk(color)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-3/4 h-3/4 max-h-screen p-4">
            <Button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
            <div 
              className={`w-full h-full rounded-lg ${blendMode === 'linear' ? 'bg-gradient-to-r' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]'}`}
              style={{
                backgroundImage: `${blendMode === 'linear' ? 'linear-gradient' : 'radial-gradient'}(${mixedColors.join(',')})`
              }}
            />
          </div>
        </div>
      )}

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Color Mixer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The Color Mixer is a powerful tool designed for designers, developers, and color enthusiasts. It allows you to create custom color blends, generate palettes, and explore different color formats with ease. Whether you're working on web design, graphic design, or any project involving color, this tool provides an intuitive interface to experiment with and perfect your color choices.
          </p>
          <p className="text-gray-300 mb-4">
            With features like linear and radial blending, multiple color format support, and a fullscreen preview mode, the Enhanced Color Mixer offers both versatility and precision in color manipulation. It's perfect for creating cohesive color schemes, exploring color relationships, or simply finding inspiration for your next project.
          </p>

          <div className="my-8">
            <Image
              src="/Images/ColorMixerPreview.png?height=400&width=600"
              alt="Screenshot of the Enhanced Color Mixer interface showing color inputs, gradient preview, and generated palette"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use Color Mixer?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Select start and end colors using the color pickers or hex inputs.</li>
            <li>Adjust the number of steps to control the blend granularity.</li>
            <li>Choose between linear and radial blending modes.</li>
            <li>Click "Mix Colors" to generate your custom palette.</li>
            <li>Switch to the "Palette" tab to view and copy generated colors.</li>
            <li>Use the color format dropdown to view colors in different formats.</li>
            <li>Click on any color swatch to copy its value.</li>
            <li>Use the fullscreen button for a detailed gradient view.</li>
            <li>Experiment with "Random Colors" or "Popular Mix" for inspiration.</li>
            <li>Use the Reset button to return to default settings.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Dynamic color mixing with real-time updates</li>
            <li>Linear and radial blending modes</li>
            <li>Support for multiple color formats (HEX, RGB, HSL, CMYK)</li>
            <li>Adjustable number of steps for precise control</li>
            <li>Random color generation and popular color mix options</li>
            <li>Fullscreen gradient preview</li>
            <li>Easy color copying with format selection</li>
            <li>Responsive design for various devices</li>
            <li>Intuitive tabbed interface</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips and Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Experiment with different step counts to achieve various gradient effects.</li>
            <li>Use the radial blend mode for creating circular or elliptical gradients.</li>
            <li>Copy colors in different formats for use in various design tools and programming languages.</li>
            <li>Utilize the fullscreen preview to visualize how your gradient might look as a background.</li>
            <li>Combine the Enhanced Color Mixer with other design tools for comprehensive color management.</li>
            <li>Save your favorite color combinations for future reference.</li>
            <li>Use the generated palettes as a starting point for creating color schemes in your projects.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The Color Mixer is more than just a tool—it's a playground for color exploration and a valuable asset in any creative workflow. Whether you're a professional designer working on complex projects or an enthusiast exploring the world of color, our tool provides the insights and functionality you need to bring your color ideas to life. Start mixing, blending, and discovering new color possibilities today!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}