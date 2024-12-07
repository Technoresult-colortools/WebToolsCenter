'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Copy, RefreshCw, Download, Shuffle, Info, BookOpen, Lightbulb, Palette, Eye, Code, ImageIcon, Grid, Check } from 'lucide-react'
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'

const colormindAPI = 'http://colormind.io/api/'

interface ColorInfo {
  hex: string
  rgb: string
  hsl: string
  name: string
}

const ColorUtils = {
  generateRandomColor: (): string => {
    return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
  },

  hexToRgb: (hex: string): string => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return `rgb(${r}, ${g}, ${b})`
  },

  hexToHsl: (hex: string): string => {
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255
  
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
  
    if (max !== min) {
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
  },

  rgbToHex: (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  },

  getContrastColor: (hexColor: string): string => {
    const rgb = parseInt(hexColor.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >>  8) & 0xff
    const b = (rgb >>  0) & 0xff
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return luma < 128 ? '#ffffff' : '#000000'
  }
}

const COLOR_GRID = [
  ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'],
  ['#FCE4EC', '#F8BBD0', '#F48FB1', '#F06292', '#EC407A', '#E91E63', '#D81B60', '#C2185B', '#AD1457', '#880E4F'],
  ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A', '#4A148C'],
  ['#EDE7F6', '#D1C4E9', '#B39DDB', '#9575CD', '#7E57C2', '#673AB7', '#5E35B1', '#512DA8', '#4527A0', '#311B92'],
  ['#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB', '#5C6BC0', '#3F51B5', '#3949AB', '#303F9F', '#283593', '#1A237E'],
  ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
  ['#E1F5FE', '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4', '#039BE5', '#0288D1', '#0277BD', '#01579B'],
  ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA', '#00BCD4', '#00ACC1', '#0097A7', '#00838F', '#006064']
]

async function fetchColorName(hex: string): Promise<string> {
  try {
    const response = await fetch(`https://www.thecolorapi.com/id?hex=${hex.replace('#', '')}`)
    const data = await response.json()
    return data.name.value
  } catch (error) {
    console.error('Error fetching color name:', error)
    return 'Unknown'
  }
}

async function generatePaletteFromAPI(baseColor: string, harmonyType: string = 'default'): Promise<string[]> {
  const input = baseColor ? [[...baseColor.match(/\w\w/g)!.map(x => parseInt(x, 16))]] : []
  let model = 'default'
  
  switch (harmonyType) {
    case 'analogous':
      model = 'default'
      break
    case 'monochromatic':
      model = 'ui'
      break
    case 'triadic':
      model = 'default'
      input.push([...input[0].map(x => (x + 85) % 255)])
      input.push([...input[0].map(x => (x + 170) % 255)])
      break
    case 'complementary':
      model = 'default'
      input.push([...input[0].map(x => 255 - x)])
      break
    case 'split-complementary':
      model = 'default'
      input.push([...input[0].map(x => (255 - x + 42) % 255)])
      input.push([...input[0].map(x => (255 - x - 42) % 255)])
      break
    case 'tetradic':
      model = 'default'
      input.push([...input[0].map(x => (x + 64) % 255)])
      input.push([...input[0].map(x => (x + 128) % 255)])
      input.push([...input[0].map(x => (x + 192) % 255)])
      break
  }

  const response = await fetch(colormindAPI, {
    method: 'POST',
    body: JSON.stringify({ model, input })
  })
  const data = await response.json()
  return data.result.map((rgb: number[]) => ColorUtils.rgbToHex(rgb[0], rgb[1], rgb[2]))
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#DC143C')  // Crimson as default
  const [palette, setPalette] = useState<ColorInfo[]>([])
  const [harmonyType, setHarmonyType] = useState('analogous')
  const [isLoading, setIsLoading] = useState(false)
  const [inputMethod, setInputMethod] = useState<'color' | 'grid' | 'image'>('color')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    generatePalette()
  }, [])

  const generatePalette = async () => {
    setIsLoading(true)
    try {
      const colors = await generatePaletteFromAPI(baseColor, harmonyType)
      const colorInfoPromises = colors.slice(0, 5).map(async (color) => ({
        hex: color,
        rgb: ColorUtils.hexToRgb(color),
        hsl: ColorUtils.hexToHsl(color),
        name: await fetchColorName(color)
      }))
      const colorInfo = await Promise.all(colorInfoPromises)
      setPalette(colorInfo)
      toast.success('Palette generated successfully')
    } catch (error) {
      console.error('Error generating palette:', error)
      toast.error('Failed to generate palette. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyColor = (color: string, format: string) => {
    navigator.clipboard.writeText(color)
    toast.success(`Copied ${format} to clipboard`)
  }

  const handleDownloadPalette = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 500
    canvas.height = 300
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    palette.forEach((color, index) => {
      ctx.fillStyle = color.hex
      ctx.fillRect(index * 100, 0, 100, 200)
      ctx.fillStyle = ColorUtils.getContrastColor(color.hex)
      ctx.font = '12px Arial'
      ctx.fillText(color.hex, index * 100 + 10, 220)
      ctx.fillText(color.name, index * 100 + 10, 240)
    })

    const link = document.createElement('a')
    link.download = 'color_palette.png'
    link.href = canvas.toDataURL()
    link.click()
    toast.success('Palette downloaded as PNG')
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0)
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const data = imageData.data
            let r = 0, g = 0, b = 0
            for (let i = 0; i < data.length; i += 4) {
              r += data[i]
              g += data[i + 1]
              b += data[i + 2]
            }
            r = Math.floor(r / (data.length / 4))
            g = Math.floor(g / (data.length / 4))
            b = Math.floor(b / (data.length / 4))
            const avgColor = ColorUtils.rgbToHex(r, g, b)
            setBaseColor(avgColor)
            setUploadedImage(e.target?.result as string)
            toast.success(`Base color extracted: ${avgColor}`)
            generatePalette()
          }
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleColorSelect = (color: string) => {
    setBaseColor(color)
    toast.success(`Selected color: ${color}`)
    generatePalette()
  }

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Create stunning color palettes with AI-powered suggestions and advanced features"
    >
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Color Palette Generator
            </CardTitle>
            <CardDescription className="text-gray-400">
              Craft the perfect color scheme for your next project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as 'color' | 'grid' | 'image')}>
              <TabsList>
                <TabsTrigger value="color">Color Input</TabsTrigger>
                <TabsTrigger value="grid">Color Grid</TabsTrigger>
                <TabsTrigger value="image">Image Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="color">
                <div className="flex items-center">
                  <Input
                    type="color"
                    value={baseColor}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="w-12 h-12 p-1 mr-2 rounded"
                  />
                  <Input
                    type="text"
                    value={baseColor}
                    onChange={(e) => handleColorSelect(e.target.value)}
                    className="flex-grow bg-gray-700 text-white border-gray-600"
                  />
                </div>
              </TabsContent>
              <TabsContent value="grid">
                <div className="grid grid-cols-10 gap-2">
                  {COLOR_GRID.map((row, i) => (
                    <React.Fragment key={i}>
                      {row.map((color, j) => (
                        <button
                          key={`${i}-${j}`}
                          className="w-full aspect-square rounded-lg transition-transform hover:scale-110 relative group"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorSelect(color)}
                        >
                          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs rounded-lg transition-opacity">
                            {color}
                          </span>
                          {color === baseColor && (
                            <Check className="absolute top-1 right-1 text-white" />
                          )}
                        </button>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="image">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                      ref={fileInputRef}
                    />
                  </label>
                </div>
                {uploadedImage && (
                  <div className="mt-4">
                    <img src={uploadedImage} alt="Uploaded image" className="max-w-full h-auto rounded-lg" />
                    <p className="mt-2 text-sm text-gray-300">Base color extracted: {baseColor}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div>
              <label htmlFor="harmony-type" className="block text-sm font-medium text-gray-300 mb-2">
                Harmony Type
              </label>
              <Select value={harmonyType} onValueChange={setHarmonyType}>
                <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select harmony type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="analogous">Analogous</SelectItem>
                  <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="split-complementary">Split Complementary</SelectItem>
                  <SelectItem value="tetradic">Tetradic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generatePalette}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Shuffle className="h-5 w-5 mr-2" />
              )}
              Generate Palette
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white mb-4">Generated Palette</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {palette.map((color, index) => (
                <div key={index} className="flex-1 min-w-[150px]">
                  <div
                    className="w-full h-24 rounded-t-lg relative group transition-all duration-300 ease-in-out hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-t-lg">
                      <Button
                        onClick={() => handleCopyColor(color.hex, 'HEX')}
                        className="bg-white/10 hover:bg-white/20 text-white p-1 rounded-full"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-3 rounded-b-lg">
                    <p className="text-white font-semibold truncate">{color.name}</p>
                    <p className="text-gray-300 text-sm">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4 mt-6">
            <Button onClick={generatePalette} className="bg-green-600 hover:bg-green-700 text-white">
              <RefreshCw className="h-5 w-5 mr-2" />
              Regenerate
            </Button>
            <Button onClick={handleDownloadPalette} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download PNG
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white mb-4">Color Palette Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {palette.length > 0 && (
              <div className="space-y-8">
                <div className="p-6 rounded-lg" style={{ backgroundColor: palette[0].hex }}>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: palette[1].hex }}>
                    Welcome to Our Website
                  </h2>
                  <p className="text-lg mb-4" style={{ color: palette[2].hex }}>
                    This is an example of how your color palette can be used effectively in web design.
                  </p>
                  <div className="flex space-x-4">
                    <Button style={{ backgroundColor: palette[3].hex, color: palette[0].hex }}>
                      Primary Button
                    </Button>
                    <Button style={{ backgroundColor: palette[4].hex, color: palette[0].hex }}>
                      Secondary Button
                    </Button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-2xl font-semibold mb-4" style={{ color: palette[0].hex }}>
                    Color Palette Usage
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li style={{ color: palette[1].hex }}>Use {palette[0].name} as the primary background color</li>
                    <li style={{ color: palette[2].hex }}>Use {palette[1].name} for main headings</li>
                    <li style={{ color: palette[3].hex }}>Use {palette[2].name} for body text</li>
                    <li style={{ color: palette[4].hex }}>Use {palette[3].name} and {palette[4].name} for buttons and accents</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Color Palette Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
              <p className="text-gray-300">
                The Advanced Color Palette Generator is a sophisticated tool designed for designers, developers, and creative professionals. It leverages AI-powered color suggestions and advanced features to create harmonious and visually appealing color schemes for various projects.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                How to Use Color Palette Generator?
              </h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Choose a base color using the color input, color grid, or by uploading an image.</li>
                <li>Select a harmony type from the dropdown menu to influence the palette generation.</li>
                <li>Click "Generate Palette" to create your AI-powered color scheme.</li>
                <li>Explore the generated palette of 5 colors.</li>
                <li>Copy individual colors by clicking on them.</li>
                <li>Download the entire palette as a PNG image with color information.</li>
                <li>Use the preview section to see how your colors work together in a real-world context.</li>
              </ol>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Key Features
              </h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>AI-powered palette generation using the Colormind API</li>
                <li>Multiple input methods: direct color input, color grid, and image upload</li>
                <li>Six harmony types: Analogous, Monochromatic, Triadic, Complementary, Split Complementary, and Tetradic</li>
                <li>Fixed palette size of 5 colors for consistency</li>
                <li>Color naming powered by the Color API</li>
                <li>One-click color copying</li>
                <li>Download palette as a PNG image with color information</li>
                <li>Interactive preview section for real-world color application</li>
                <li>Responsive design for use on various devices</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                <Palette className="w-6 h-6 mr-2" />
                Color Harmony Types
              </h3>
              <p className="text-gray-300">
                Our Advanced Color Palette Generator uses sophisticated color theory principles and AI algorithms to create harmonious color schemes. The different harmony types available are:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
                <li><strong>Analogous:</strong> Colors that are adjacent to each other on the color wheel</li>
                <li><strong>Monochromatic:</strong> Different shades and tints of the same color</li>
                <li><strong>Triadic:</strong> Three colors equally spaced around the color wheel</li>
                <li><strong>Complementary:</strong> Colors opposite each other on the color wheel</li>
                <li><strong>Split Complementary:</strong> A base color and two colors adjacent to its complement</li>
                <li><strong>Tetradic:</strong> Four colors arranged into two complementary pairs</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                <Eye className="w-6 h-6 mr-2" />
                Accessibility Considerations
              </h3>
              <p className="text-gray-300">
                When using the generated color palettes, keep in mind the importance of accessibility in design:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
                <li>Use the preview section to check readability of different color combinations</li>
                <li>Ensure sufficient contrast between text and background colors</li>
                <li>Consider color-blind friendly palettes for inclusive design</li>
                <li>Test your designs with accessibility tools for best results</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                <Code className="w-6 h-6 mr-2" />
                Integration Tips
              </h3>
              <p className="text-gray-300">
                To make the most of your generated color palettes in your projects:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-2">
                <li>Use CSS variables to easily apply and update colors throughout your project</li>
                <li>Create a color system with primary, secondary, and accent colors</li>
                <li>Utilize the downloaded PNG palette to import colors into design tools</li>
                <li>Experiment with different harmony types to find the perfect color scheme for your project</li>
                <li>Use the preview section as inspiration for applying colors to your own designs</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}