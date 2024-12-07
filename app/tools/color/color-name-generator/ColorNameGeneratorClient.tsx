'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, Copy, Info, BookOpen, Lightbulb, AlertCircle, Palette } from 'lucide-react'
import Input from "@/components/ui/Input"
import Image from 'next/image'
import { Button } from "@/components/ui/Button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'

const apiUrl = 'https://www.thecolorapi.com/id?'

type ColorFormat = 'hex' | 'rgb' | 'hsl'

interface ColorInfo {
  name: string
  hex: string
  rgb: string
  hsl: string
}

const ColorUtils = {
  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  },

  rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b]
      .map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  },

  hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return {
      r: Math.round(f(0) * 255),
      g: Math.round(f(8) * 255),
      b: Math.round(f(4) * 255)
    }
  },

  parseColorInput(input: string, format: ColorFormat): string | null {
    try {
      switch (format) {
        case 'hex':
          if (/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(input)) {
            return input.startsWith('#') ? input : `#${input}`
          }
          break
        case 'rgb': {
          const match = input.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
          if (match) {
            const [, r, g, b] = match.map(Number)
            if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
              return this.rgbToHex(r, g, b)
            }
          }
          break
        }
        case 'hsl': {
          const match = input.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/)
          if (match) {
            const [, h, s, l] = match.map(Number)
            if (h >= 0 && h <= 360 && s >= 0 && s <= 100 && l >= 0 && l <= 100) {
              const { r, g, b } = this.hslToRgb(h, s, l)
              return this.rgbToHex(r, g, b)
            }
          }
          break
        }
      }
      return null
    } catch {
      return null
    }
  },

  generateRandomColor(): string {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return this.rgbToHex(r, g, b)
  },

  getContrastColor(hexColor: string): string {
    const rgb = this.hexToRgb(hexColor)
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    return brightness > 128 ? '#000000' : '#FFFFFF'
  }
}

export default function ColorNameGenerator() {
  const [colorValue, setColorValue] = useState(ColorUtils.generateRandomColor())
  const [colorInfo, setColorInfo] = useState<ColorInfo | null>(null)
  const [error, setError] = useState('')
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex')

  const fetchColorInfo = async (hex: string): Promise<ColorInfo> => {
    try {
      const response = await fetch(`${apiUrl}hex=${hex.replace('#', '')}`)
      const data = await response.json()

      return {
        name: data.name.value,
        hex: data.hex.value,
        rgb: data.rgb.value,
        hsl: data.hsl.value
      }
    } catch (error) {
      console.error('Error fetching color info:', error)
      throw new Error('Error fetching color info')
    }
  }

  const handleGenerateColorName = async () => {
    setError('')
    try {
      let hex = colorValue
      if (colorFormat === 'rgb' || colorFormat === 'hsl') {
        const parsedColor = ColorUtils.parseColorInput(colorValue, colorFormat)
        if (parsedColor) {
          hex = parsedColor
        } else {
          throw new Error('Invalid color format')
        }
      }
      const info = await fetchColorInfo(hex)
      setColorInfo(info)
      setColorValue(info.hex)
      setColorFormat('hex')
    } catch (error) {
      setError('Invalid color format. Please check your input.')
    }
  }

  const handleCopyColor = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast.success(`Copied ${label} to clipboard`)
  }

  const handleColorFormatChange = (format: ColorFormat) => {
    setColorFormat(format)
    if (colorInfo) {
      setColorValue(colorInfo[format])
    }
  }

  const handleColorChange = (value: string) => {
    setColorValue(value)
  }

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value
    setColorValue(hex)
    setColorFormat('hex')
    handleGenerateColorName()
  }

  useEffect(() => {
    handleGenerateColorName()
  }, [])

  return (
    <ToolLayout
      title="Color Name Generator"
      description="Discover color names and explore color formats with advanced features"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Color Name Generator
          </CardTitle>
          <CardDescription className="text-gray-400">
            Explore colors, discover names, and dive deep into color details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {colorInfo && (
            <div className="bg-gray-900 rounded-lg p-4 shadow-inner mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-white">Color Name:</h4>
                <span className="text-lg font-bold text-blue-400">{colorInfo.name}</span>
              </div>
              <div
                className="w-full h-16 rounded-md shadow-md mb-3 flex items-center justify-center text-xl font-bold"
                style={{ 
                  backgroundColor: colorInfo.hex, 
                  color: ColorUtils.getContrastColor(colorInfo.hex)
                }}
              >
                {colorInfo.name}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Name', value: colorInfo.name },
                  { label: 'HEX', value: colorInfo.hex },
                  { label: 'RGB', value: colorInfo.rgb },
                  { label: 'HSL', value: colorInfo.hsl }
                ].map((item) => (
                  <Button 
                    key={item.label} 
                    onClick={() => handleCopyColor(item.value, item.label)} 
                    variant="secondary" 
                    className="w-full text-sm"
                  >
                    <Copy className="mr-1 h-3 w-3" /> {item.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Tabs value={colorFormat} onValueChange={(value) => handleColorFormatChange(value as ColorFormat)}>
              <TabsList className="grid w-full grid-cols-3 mb-2">
                <TabsTrigger value="hex">HEX</TabsTrigger>
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
              </TabsList>
              <TabsContent value="hex">
                <Input
                  type="text"
                  value={colorValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGenerateColorName()
                    }
                  }}
                  className="mb-2 w-full text-gray-800"
                  placeholder="#FFFFFF"
                />
              </TabsContent>
              <TabsContent value="rgb">
                <Input
                  type="text"
                  value={colorValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGenerateColorName()
                    }
                  }}
                  className="mb-2 w-full text-gray-800"
                  placeholder="rgb(255, 255, 255)"
                />
              </TabsContent>
              <TabsContent value="hsl">
                <Input
                  type="text"
                  value={colorValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGenerateColorName()
                    }
                  }}
                  className="mb-2 w-full text-gray-800"
                  placeholder="hsl(0, 100%, 50%)"
                />
              </TabsContent>
            </Tabs>

            <div className="flex space-x-2">
              <Button 
                onClick={handleGenerateColorName} 
                className="flex-grow"
              >
                <Lightbulb className="mr-2 h-4 w-4" /> Generate Color Name
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  const randomColor = ColorUtils.generateRandomColor()
                  setColorValue(randomColor)
                  setColorFormat('hex')
                  handleGenerateColorName()
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-gray-400" />
              <input
                type="color"
                value={colorValue}
                onChange={handleColorPickerChange}
                className="w-8 h-8 rounded cursor-pointer"
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Color Name Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The Color Name Generator is a sophisticated tool designed for designers, developers, and color enthusiasts. It allows you to discover color names and explore different color formats with ease and precision. Whether you're working on web design, graphic design, or any project involving color, this tool provides an intuitive interface to experiment with and perfect your color choices.
          </p>
          <p className="text-gray-300 mb-4">
            With features like real-time color preview, multiple format support (HEX, RGB, HSL), and instant color name generation, the Enhanced Color Name Generator offers both versatility and accuracy in color exploration and selection. It's perfect for identifying specific colors, exploring color relationships, or simply finding inspiration for your next project.
          </p>

          <div className="my-8">
            <Image
              src="/Images/ColorNamePreview.png?height=400&width=600"
              alt="Screenshot of the Enhanced Color Name Generator interface showing color inputs and preview"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use Color Name Generator
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>The tool starts with a random color. You can modify this or enter your own color.</li>
            <li>Select a color format (HEX, RGB, or HSL) using the tabs.</li>
            <li>Enter a valid color value in the selected format using the input field.</li>
            <li>For HEX, use the format: #RRGGBB (e.g., #FF5733)</li>
            <li>For RGB, use the format: rgb(R, G, B) (e.g., rgb(255, 87, 51))</li>
            <li>For HSL, use the format: hsl(H, S%, L%) (e.g., hsl(9, 100%, 60%))</li>
            <li>Click the "Generate Color Name" button to get the color information.</li>
            <li>View the color name and preview at the top of the interface.</li>
            <li>Use the copy buttons to easily copy the color name or different color format values.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Support for HEX, RGB, and HSL color formats with accurate parsing and conversions</li>
            <li>Real-time color name retrieval using an external API</li>
            <li>Dynamic color preview with contrasting text for optimal readability</li>
            <li>Single input field for each color format, accepting standardized color notation</li>
            <li>Easy-to-use copy functionality for color name and all color format values</li>
            <li>Responsive design for seamless use on various devices</li>
            <li>Error handling and user-friendly notifications</li>
            <li>Random color generation on initial load for inspiration</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Palette className="w-6 h-6 mr-2" />
            Tips and Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Use the tabs to switch between different color formats for input and exploration.</li>
            <li>Experiment with slight variations in color values to discover new color names.</li>
            <li>Copy color values directly to your clipboard for use in design software or code.</li>
            <li>Pay attention to the contrast between the background color and text to ensure readability in your designs.</li>
            <li>Use this tool in combination with other color theory resources to deepen your understanding of color relationships.</li>
            <li>Try inputting colors from your existing designs to find their official names and explore variations.</li>
            <li>Use the random color generation feature for inspiration or to discover new color combinations.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The Color Name Generator is more than just a tool—it's a gateway to color exploration and a valuable asset in any creative workflow. Whether you're a professional designer working on complex projects or an enthusiast exploring the world of color, our tool provides the insights and functionality you need to bring your color ideas to life. Start discovering and exploring colors today!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}