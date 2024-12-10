'use client'

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Copy, Download,  Info,  Palette,  BookOpen, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Slider from "@/components/ui/Slider"
import { toast, Toaster } from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/Card"
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'

// Color Harmonies Configuration
const colorHarmonies = [
  { name: 'Complementary', angles: [180] },
  { name: 'Analogous', angles: [30, -30] },
  { name: 'Triadic', angles: [120, 240] },
  { name: 'Split-Complementary', angles: [150, 210] },
  { name: 'Square', angles: [90, 180, 270] },
  { name: 'Tetradic', angles: [60, 180, 240] },
  { name: 'Monochromatic', angles: [0], saturationSteps: [25, 50, 75] }
]

// Utility Functions
function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hexToRGB(hex: string): { r: number, g: number, b: number } {
  hex = hex.replace(/^#/, '')
  
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16)
  }
}

function hexToHSL(hex: string): { h: number, s: number, l: number } {
  hex = hex.replace(/^#/, '')
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h *= 60
  }

  return {
    h: h < 0 ? h + 360 : h,
    s: s * 100,
    l: l * 100
  }
}

function getColorFromPosition(x: number, y: number, width: number, height: number): { hue: number, saturation: number } {
  const centerX = width / 2
  const centerY = height / 2
  const dx = x - centerX
  const dy = y - centerY
  
  let angle = Math.atan2(dy, dx) * (180 / Math.PI)
  if (angle < 0) angle += 360
  
  const maxRadius = Math.min(width, height) / 2
  const distance = Math.sqrt(dx * dx + dy * dy)
  const saturation = Math.min(distance / maxRadius * 100, 100)
  
  return {
    hue: angle,
    saturation: saturation
  }
}

function getContrastColor(hexColor: string): string {
  const { r, g, b } = hexToRGB(hexColor)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

export default function ColorWheel() {
  // State Management
  const [selectedHarmony, setSelectedHarmony] = useState(colorHarmonies[0])
  const [baseColor, setBaseColor] = useState('#ff0000')
  const [customColor, setCustomColor] = useState('#ff0071')
  const [isDragging, setIsDragging] = useState(false)
  const [selectedDot, setSelectedDot] = useState(0)
  const [lightness, setLightness] = useState(50)
  const wheelRef = useRef<HTMLDivElement>(null)

  // Memoized color calculations
  const { h: hue, s: saturation } = useMemo(() => hexToHSL(baseColor), [baseColor])

  const harmonyColors = useMemo(() => {
    if (selectedHarmony.name === 'Monochromatic') {
      return [
        hslToHex(hue, saturation, lightness),
        ...selectedHarmony.saturationSteps!.map(step => hslToHex(hue, step, lightness))
      ]
    } else {
      return [
        hslToHex(hue, saturation, lightness),
        ...selectedHarmony.angles.map(angle => 
          hslToHex((hue + angle + 360) % 360, saturation, lightness)
        )
      ]
    }
  }, [selectedHarmony, hue, saturation, lightness])

  // Event Handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return

    const rect = wheelRef.current.getBoundingClientRect()
    const { hue: newHue, saturation: newSaturation } = getColorFromPosition(
      e.clientX - rect.left,
      e.clientY - rect.top,
      rect.width,
      rect.height
    )
    
    const newColor = hslToHex(newHue, newSaturation, lightness)
    setBaseColor(newColor)
    setCustomColor(newColor)
    setIsDragging(true)
    setSelectedDot(0)
  }, [lightness])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect()
      const { hue: newHue, saturation: newSaturation } = getColorFromPosition(
        e.clientX - rect.left,
        e.clientY - rect.top,
        rect.width,
        rect.height
      )
      
      const newColor = hslToHex(newHue, newSaturation, lightness)
      setBaseColor(newColor)
      setCustomColor(newColor)
    }
  }, [isDragging, lightness])

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!wheelRef.current) return
    const touch = e.touches[0]
    const rect = wheelRef.current.getBoundingClientRect()
    const { hue: newHue, saturation: newSaturation } = getColorFromPosition(
      touch.clientX - rect.left,
      touch.clientY - rect.top,
      rect.width,
      rect.height
    )
    
    const newColor = hslToHex(newHue, newSaturation, lightness)
    setBaseColor(newColor)
    setCustomColor(newColor)
    setIsDragging(true)
    setSelectedDot(0)
  }, [lightness])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging && wheelRef.current) {
      const touch = e.touches[0]
      const rect = wheelRef.current.getBoundingClientRect()
      const { hue: newHue, saturation: newSaturation } = getColorFromPosition(
        touch.clientX - rect.left,
        touch.clientY - rect.top,
        rect.width,
        rect.height
      )
      
      const newColor = hslToHex(newHue, newSaturation, lightness)
      setBaseColor(newColor)
      setCustomColor(newColor)
    }
  }, [isDragging, lightness])

  // Mouse and Touch Event Listeners
  useEffect(() => {
    const handleMouseMoveWrapper = (e: MouseEvent) => handleMouseMove(e)
    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveWrapper)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMoveWrapper)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove])

  // Event Handlers
  const handleDotClick = (index: number) => {
    setBaseColor(harmonyColors[index])
    setCustomColor(harmonyColors[index])
    setSelectedDot(index)
  }

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    toast.success(`Copied ${color} to clipboard`)
  }

  const handleDownloadPalette = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colorWidth = 200
    const colorHeight = 150
    const textHeight = 30
    canvas.width = harmonyColors.length * colorWidth
    canvas.height = colorHeight + textHeight

    harmonyColors.forEach((color, index) => {
      // Draw color swatch
      ctx.fillStyle = color
      ctx.fillRect(index * colorWidth, 0, colorWidth, colorHeight)

      // Draw text background
      ctx.fillStyle = '#f0f0f0'
      ctx.fillRect(index * colorWidth, colorHeight, colorWidth, textHeight)

      // Draw hex code text
      ctx.fillStyle = '#000000'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(color.toUpperCase(), index * colorWidth + colorWidth / 2, colorHeight + textHeight / 2)
    })

    const link = document.createElement('a')
    link.download = 'color-palette.png'
    link.href = canvas.toDataURL()
    link.click()
  }

  return (
    <ToolLayout
      title="Color Wheel"
      description="Explore color theory and generate harmonious palettes with our advanced color wheel tool"
    >
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Wheel Section */}
          <Card className="bg-gray-800 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Interactive Color Wheel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Custom Color Input */}
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium text-gray-300">
                  Custom Color:
                </label>
                <input 
                  type="color" 
                  value={customColor}
                  onChange={(e) => {
                    const newColor = e.target.value
                    setCustomColor(newColor)
                    setBaseColor(newColor)
                  }}
                  className="w-16 h-10 bg-transparent cursor-pointer"
                />
              </div>

              {/* Color Wheel */}
              <div 
                ref={wheelRef}
                className="relative w-full aspect-square max-w-[500px] mx-auto touch-none select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setIsDragging(false)}
              >
                {/* Color Wheel Visualization */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="w-full h-full"
                    style={{
                      background: `
                        radial-gradient(
                          circle at center, 
                          transparent 0%, 
                          rgba(0,0,0,0.2) 80%, 
                          rgba(0,0,0,0.4) 100%
                        ),
                        conic-gradient(
                          from 90deg,
                          hsl(0, 100%, ${lightness}%),
                          hsl(60, 100%, ${lightness}%),
                          hsl(120, 100%, ${lightness}%),
                          hsl(180, 100%, ${lightness}%),
                          hsl(240, 100%, ${lightness}%),
                          hsl(300, 100%, ${lightness}%),
                          hsl(360, 100%, ${lightness}%)
                        )`
                    }}
                  />
                </div>
                
                {/* Color Dots */}
                {harmonyColors.map((color, index) => {
                  const { h, s } = hexToHSL(color)
                  const dotAngle = (h) * (Math.PI / 180)
                  const dotRadius = (s / 100) * (Math.min(wheelRef.current?.offsetWidth || 0, wheelRef.current?.offsetHeight || 0) / 2 - 20)
                  const x = Math.cos(dotAngle) * dotRadius + (wheelRef.current?.offsetWidth || 0) / 2
                  const y = Math.sin(dotAngle) * dotRadius + (wheelRef.current?.offsetHeight || 0) / 2

                  return (
                    <div
                      key={index}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/50 shadow-lg transition-all duration-200 cursor-pointer 
                        ${index === selectedDot ? 'w-10 h-10 z-20 scale-110' : 'w-7 h-7 z-10'}`}
                      style={{
                        backgroundColor: color,
                        left: `${x}px`,
                        top: `${y}px`,
                      }}
                      onClick={() => handleDotClick(index)}
                    />
                  )
                })}
              </div>

              {/* Lightness Slider */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Lightness:</label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={lightness}
                  onChange={(value) => setLightness(value)}
                  className="w-full"
                />
              </div>

              {/* Color Harmony Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Color Harmony:</label>
                <select
                  value={selectedHarmony.name}
                  onChange={(e) => setSelectedHarmony(colorHarmonies.find(h => h.name === e.target.value) || colorHarmonies[0])}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                >
                  {colorHarmonies.map((harmony) => (
                    <option key={harmony.name} value={harmony.name}>
                      {harmony.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Section */}
          <Card className="bg-gray-800 rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Color Palette
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {harmonyColors.map((color, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: color }}>
                  <span className="font-medium" style={{ color: getContrastColor(color) }}>
                    {color.toUpperCase()}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCopyColor(color)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              ))}
              <Button onClick={handleDownloadPalette} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Palette
              </Button>
            </CardContent>
          </Card>
        </div>
        <AboutColorWheel />
      </div>
    </ToolLayout>
  )
}

function AboutColorWheel() {
  return (
    <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About Color Wheel Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          The Color Wheel Generator is an advanced tool designed for designers, developers, and color enthusiasts. It allows you to explore color harmonies, generate color palettes, and visualize color relationships with ease and precision. Whether you're working on web design, graphic design, or any project involving color theory, this tool provides an intuitive interface to experiment with and perfect your color choices.
        </p>
        <p className="text-gray-300 mb-4">
          With features like an interactive color wheel, real-time harmony updates, and support for various color harmonies, the Enhanced Color Wheel Generator offers both versatility and accuracy in color exploration and selection. It's perfect for creating harmonious color schemes, exploring color relationships, or simply finding inspiration for your next project.
        </p>

        <div className="my-8">
          <Image
            src="/Images/ColorWheelPreview.png?height=400&width=600"
            alt="Screenshot of the Enhanced Color Wheel Generator interface showing the interactive wheel and harmony colors"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use Color Wheel Generator?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Interact with the color wheel by clicking or dragging to select your base color.</li>
          <li>Use the custom color input to manually enter a specific color.</li>
          <li>Adjust the lightness slider to modify the brightness of the colors.</li>
          <li>Select a color harmony from the available options to generate complementary colors.</li>
          <li>Click on the generated harmony colors to set them as the new base color.</li>
          <li>Use the copy button to easily copy color values to your clipboard.</li>
          <li>Download the generated color palette as an image for later use.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Interactive color wheel for intuitive color selection</li>
          <li>Support for various color harmonies (Complementary, Analogous, Triadic, etc.)</li>
          <li>Real-time updates of harmony colors as you interact with the wheel</li>
          <li>Custom color input for precise color selection</li>
          <li>Lightness adjustment slider for fine-tuning colors</li>
          <li>Easy-to-use copy functionality for color values</li>
          <li>Option to download the generated color palette as an image</li>
          <li>Responsive design for seamless use on various devices</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Palette className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Experiment with different color harmonies to find the perfect combination for your project.</li>
          <li>Use the lightness slider to create variations of your chosen color scheme.</li>
          <li>Click on harmony colors to explore new color combinations based on that selection.</li>
          <li>Utilize the custom color input to match specific brand colors or existing design elements.</li>
          <li>Download your color palettes to build a library of harmonious color schemes for future projects.</li>
          <li>Pay attention to the contrast between colors when selecting combinations for text and backgrounds.</li>
          <li>Use the monochromatic harmony to create subtle, sophisticated color schemes.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          The Color Wheel Generator is more than just a tool—it's a gateway to understanding and mastering color theory. Whether you're a professional designer working on complex projects or an enthusiast exploring the world of color, our tool provides the insights and functionality you need to create stunning, harmonious color palettes. Start exploring and creating beautiful color combinations today!
        </p>
      </CardContent>
    </Card>
  )
}

