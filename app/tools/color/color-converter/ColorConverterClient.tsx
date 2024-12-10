'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import Slider from "@/components/ui/Slider"
import { Copy, Palette, Info, BookOpen, Lightbulb, Maximize2, X } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'

const ColorConverter: React.FC = () => {
  const [hex, setHex] = useState('#3498db')
  const [rgb, setRgb] = useState({ r: 52, g: 152, b: 219 })
  const [hsl, setHsl] = useState({ h: 204, s: 70, l: 53 })
  const [hsv, setHsv] = useState({ h: 204, s: 76, v: 86 })
  const [rgba, setRgba] = useState({ r: 52, g: 152, b: 219, a: 1 })
  const [activeTab, setActiveTab] = useState('hex')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [contrastColor, setContrastColor] = useState('#ffffff')

  useEffect(() => {
    updateAllFormats(hex)
  }, [])

  const updateAllFormats = (hexValue: string) => {
    const rgbValue = hexToRgb(hexValue)
    const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b)
    const hsvValue = rgbToHsv(rgbValue.r, rgbValue.g, rgbValue.b)
    const rgbaValue = { ...rgbValue, a: rgba.a }

    setHex(hexValue)
    setRgb(rgbValue)
    setHsl(hslValue)
    setHsv(hsvValue)
    setRgba(rgbaValue)
    updateContrastColor(rgbValue)
  }

  const updateContrastColor = (rgbValue: { r: number; g: number; b: number }) => {
    const brightness = (rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000
    setContrastColor(brightness > 128 ? '#000000' : '#ffffff')
  }

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s
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
      h! /= 6
    }

    return { h: Math.round(h! * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return {
      r: Math.round(255 * f(0)),
      g: Math.round(255 * f(8)),
      b: Math.round(255 * f(4))
    }
  }

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h 
    const v = max
  
    const d = max - min
    const s = max === 0 ? 0 : d / max
  
    if (max === min) {
      h = 0
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h! /= 6
    }
  
    return { h: Math.round(h! * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
  }
  
  const hsvToRgb = (h: number, s: number, v: number): { r: number; g: number; b: number } => {
    s /= 100
    v /= 100
    const k = (n: number) => (n + h / 60) % 6
    const f = (n: number) => v * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
    return {
      r: Math.round(255 * f(5)),
      g: Math.round(255 * f(3)),
      b: Math.round(255 * f(1))
    }
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      updateAllFormats(newHex)
    }
    setHex(newHex)
  }

  const handleRgbChange = (color: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [color]: value }
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    updateAllFormats(newHex)
  }

  const handleHslChange = (color: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hsl, [color]: value }
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    const newHex = rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b)
    updateAllFormats(newHex)
  }

  const handleHsvChange = (color: 'h' | 's' | 'v', value: number) => {
    const newHsv = { ...hsv, [color]: value }
    const rgbValue = hsvToRgb(newHsv.h, newHsv.s, newHsv.v)
    const newHex = rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b)
    updateAllFormats(newHex)
  }

  const handleRgbaChange = (color: 'r' | 'g' | 'b' | 'a', value: number) => {
    const newRgba = { ...rgba, [color]: value }
    setRgba(newRgba)
    if (color !== 'a') {
      const newHex = rgbToHex(newRgba.r, newRgba.g, newRgba.b)
      updateAllFormats(newHex)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!', {
        position: "top-right",
        duration: 2000,
      })
    }, () => {
      toast.error('Failed to copy', {
        position: "top-right",
        duration: 2000,
      })
    })
  }

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    updateAllFormats(randomHex)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert colors between HEX, RGB, HSL, HSV, and RGBA formats with advanced features"
    >
      <Toaster />

      <Card className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Color Preview</CardTitle>
          <CardDescription className="text-gray-400">Current color: {hex}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div 
              className="w-full h-64 rounded-lg shadow-inner flex items-center justify-center transition-all duration-300 ease-in-out"
              style={{ 
                backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`,
                boxShadow: `0 0 20px rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 0.5)`,
              }}
            >
              <p className="text-4xl font-bold" style={{ color: contrastColor }}>
                {hex}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={toggleFullscreen}
              className="absolute bottom-2 right-2"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between space-x-2 mt-4">
            <Button onClick={() => copyToClipboard(hex)} className="w-48">
              <Copy className="mr-2 h-4 w-4" /> Copy HEX
            </Button>
            <Button onClick={generateRandomColor} className="w-48">
              <Palette className="mr-2 h-4 w-4" /> Random Color
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Color Formats</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="hex">HEX</TabsTrigger>
              <TabsTrigger value="rgb">RGB</TabsTrigger>
              <TabsTrigger value="hsl">HSL</TabsTrigger>
              <TabsTrigger value="hsv">HSV</TabsTrigger>
              <TabsTrigger value="rgba">RGBA</TabsTrigger>
            </TabsList>
            <TabsContent value="hex">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hex" className="text-white mb-2 block">HEX Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="hex"
                      value={hex}
                      onChange={handleHexChange}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                    <Button onClick={() => copyToClipboard(hex)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="rgb">
              <div className="space-y-4">
                {['r', 'g', 'b'].map((color) => (
                  <div key={color}>
                    <Label htmlFor={`rgb-${color}`} className="text-white mb-2 block">
                      {color.toUpperCase()}: {rgb[color as keyof typeof rgb]}
                    </Label>
                    <Slider
                      id={`rgb-${color}`}
                      min={0}
                      max={255}
                      step={1}
                      value={rgb[color as keyof typeof rgb]}
                      onChange={(value) => handleRgbChange(color as 'r' | 'g' | 'b', value)}
                    />
                  </div>
                ))}
                <Button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy RGB
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="hsl">
              <div className="space-y-4">
                {['h', 's', 'l'].map((color) => (
                  <div key={color}>
                    <Label htmlFor={`hsl-${color}`} className="text-white mb-2 block">
                      {color.toUpperCase()}: {hsl[color as keyof typeof hsl]}
                      {color === 'h' ? '°' : '%'}
                    </Label>
                    <Slider
                      id={`hsl-${color}`}
                      min={0}
                      max={color === 'h' ? 360 : 100}
                      step={1}
                      value={hsl[color as keyof typeof hsl]}
                      onChange={(value) => handleHslChange(color as 'h' | 's' | 'l', value)}
                    />
                  </div>
                ))}
                <Button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy HSL
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="hsv">
              <div className="space-y-4">
                {['h', 's', 'v'].map((color) => (
                  <div key={color}>
                    <Label htmlFor={`hsv-${color}`} className="text-white mb-2 block">
                      {color.toUpperCase()}: {hsv[color as keyof typeof hsv]}
                      {color === 'h' ? '°' : '%'}
                    </Label>
                    <Slider
                      id={`hsv-${color}`}
                      min={0}
                      max={color === 'h' ? 360 : 100}
                      step={1}
                      value={hsv[color as keyof typeof hsv]}
                      onChange={(value) => handleHsvChange(color as 'h' | 's' | 'v', value)}
                    />
                  </div>
                ))}
                <Button onClick={() => copyToClipboard(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy HSV
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="rgba">
              <div className="space-y-4">
                {['r', 'g', 'b', 'a'].map((color) => (
                  <div key={color}>
                    <Label htmlFor={`rgba-${color}`} className="text-white mb-2 block">
                      {color.toUpperCase()}: {color === 'a' ? rgba[color as keyof typeof rgba].toFixed(2) : rgba[color as keyof typeof rgba]}
                    </Label>
                    <Slider
                      id={`rgba-${color}`}
                      min={0}
                      max={color === 'a' ? 1 : 255}
                      step={color === 'a' ? 0.01 : 1}
                      value={rgba[color as keyof typeof rgba]}
                      onChange={(value) => handleRgbaChange(color as 'r' | 'g' | 'b' | 'a', value)}
                    />
                  </div>
                ))}
                <Button onClick={() => copyToClipboard(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`)}>
                  <Copy className="mr-2 h-4 w-4" /> Copy RGBA
                </Button>
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
              className="w-full h-full rounded-lg shadow-inner flex items-center justify-center transition-all duration-300 ease-in-out"
              style={{ 
                backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`,
                boxShadow: `0 0 40px rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 0.5)`,
              }}
            >
              <p className="text-6xl font-bold" style={{ color: contrastColor }}>
                {hex}
              </p>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Color Converter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The Color Converter is a powerful tool designed for developers, designers, and color enthusiasts. It allows you to easily convert colors between various formats, including HEX, RGB, HSL, HSV, and RGBA. This tool ensures accurate and fast conversions for all your color-related needs, whether you're working on web development, graphic design, or any other project involving colors.
          </p>
          <p className="text-gray-300 mb-4">
            With features like real-time color preview, interactive sliders, fullscreen mode, and support for multiple color formats, the Enhanced Color Converter is an invaluable resource for anyone working with digital colors. It's perfect for ensuring color consistency across different projects, exploring color relationships, or simply converting colors between different formats quickly and accurately.
          </p>
          <div className="my-8">
          <Image
            src="/Images/ColorConverterPreview.png?height=400&width=600"
            alt="Screenshot of the CMYK to RGB Converter interface showing CMYK input sliders, RGB output, and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use Color Converter?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Select the desired color format tab (HEX, RGB, HSL, HSV, or RGBA).</li>
            <li>Adjust the color values using either the input field or the interactive sliders.</li>
            <li>Observe the real-time color preview updating as you modify the values.</li>
            <li>Use the copy buttons to quickly copy color values in any format.</li>
            <li>Experiment with the "Random Color" button for inspiration or design exploration.</li>
            <li>Switch between tabs to view and compare color values in different formats.</li>
            <li>Use the fullscreen preview option for a detailed view of your selected color.</li>
            <li>Adjust the alpha channel in the RGBA tab to create transparent colors.</li>
          </ol>
     
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Support for multiple color formats: HEX, RGB, HSL, HSV, and RGBA</li>
            <li>Real-time color preview with dynamic text color for optimal readability</li>
            <li>Interactive sliders for precise color value adjustments</li>
            <li>Copy functionality for easy color value copying in any format</li>
            <li>Random color generation for inspiration</li>
            <li>Fullscreen preview mode for detailed color examination</li>
            <li>Seamless switching between different color formats</li>
            <li>Responsive design for optimal use on all devices</li>
            <li>Intuitive user interface with clear, easy-to-read color information</li>
            <li>Dynamic background color and shadow effects for enhanced visual feedback</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Web Development:</strong> Easily convert between color formats for CSS styling and JavaScript color manipulation.</li>
            <li><strong>Graphic Design:</strong> Ensure color consistency across different design tools and formats.</li>
            <li><strong>UI/UX Design:</strong> Experiment with color schemes and accessibility in various formats, including transparency with RGBA.</li>
            <li><strong>Digital Marketing:</strong> Create consistent brand colors across different platforms and media.</li>
            <li><strong>Print Design:</strong> Convert web colors to print-friendly formats and vice versa.</li>
            <li><strong>Color Theory Education:</strong> Explore relationships between different color models and learn about color spaces.</li>
            <li><strong>Accessibility Testing:</strong> Check color contrasts and readability in different formats to ensure WCAG compliance.</li>
            <li><strong>Brand Identity Development:</strong> Develop and maintain consistent color palettes across all brand materials, including digital and print.</li>
            <li><strong>Game Development:</strong> Create and adjust color palettes for game assets and UI elements.</li>
            <li><strong>Data Visualization:</strong> Generate color schemes for charts, graphs, and other data representation tools.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            Whether you're a professional designer working on complex projects or a hobbyist exploring the world of digital colors, our Enhanced Color Converter provides the accuracy, functionality, and user-friendly interface you need. Start using it today to streamline your workflow, enhance your understanding of color spaces, and bring your creative visions to life with precision and ease!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

export default ColorConverter