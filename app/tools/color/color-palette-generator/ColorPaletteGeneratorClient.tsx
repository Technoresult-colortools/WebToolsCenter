'use client'

import React, { useState, useEffect } from 'react'
import { Copy, RefreshCw, Download, Shuffle, Eye, Palette, Droplet, Grid, ImageIcon, Wand2, Lightbulb, Settings, Sun, Moon } from 'lucide-react'
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast, Toaster } from 'react-hot-toast'
import { ColorGrid } from '@/components/color-grid'
import { ImageUpload } from '@/components/image-upload'
import { ColorUtils, generatePaletteFromAPI, generatePaletteFromAI, fetchColorName } from '@/lib/color-utils'
import ToolLayout from '@/components/ToolLayout'

interface ColorInfo {
  hex: string
  rgb: { r: number, g: number, b: number } | null
  hsl: { h: number, s: number, l: number } | null
  name: string | null
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#DC143C')
  const [harmonyType, setHarmonyType] = useState('analogous')
  const [isLoading, setIsLoading] = useState(false)
  const [inputMethod, setInputMethod] = useState<'color' | 'grid' | 'image' | 'text'>('color')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [userInput, setUserInput] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [previewDarkMode, setPreviewDarkMode] = useState(false)
  const [openAIError, setOpenAIError] = useState<string | null>(null)
  const [palette, setPalette] = useState<ColorInfo[]>([
    { hex: '#000000', rgb: null, hsl: null, name: 'Black' },
    { hex: '#000000', rgb: null, hsl: null, name: 'Black' },
    { hex: '#000000', rgb: null, hsl: null, name: 'Black' },
    { hex: '#000000', rgb: null, hsl: null, name: 'Black' },
    { hex: '#000000', rgb: null, hsl: null, name: 'Black' }
  ])

  useEffect(() => {
    generatePalette()
  }, [])

  const generatePalette = async () => {
    setIsLoading(true)
    setOpenAIError(null)
    try {
      let colors: string[]
      if (inputMethod === 'text') {
        try {
          colors = await generatePaletteFromAI(userInput)
        } catch (aiError) {
          setOpenAIError(aiError instanceof Error ? aiError.message : 'Failed to generate AI palette')
          colors = await generatePaletteFromAPI(baseColor, harmonyType)
        }
      } else {
        colors = await generatePaletteFromAPI(baseColor, harmonyType)
      }

      while (colors.length < 5) {
        colors.push(ColorUtils.generateRandomColor())
      }

      const colorInfoPromises = colors.slice(0, 5).map(async (color) => ({
        hex: color,
        rgb: ColorUtils.hexToRgb(color),
        hsl: ColorUtils.hexToHsl(color),
        name: await fetchColorName(color) || color
      }))
      
      const colorInfo = await Promise.all(colorInfoPromises)
      setPalette(colorInfo)
      
      if (openAIError) {
        toast.error(`AI palette generation failed. Switched to default method: ${openAIError}`)
      } else {
        toast.success('Palette generated successfully')
      }
    } catch (error) {
      console.error('Error generating palette:', error)
      const defaultColors = [
        { hex: '#FF0000', rgb: ColorUtils.hexToRgb('#FF0000'), hsl: ColorUtils.hexToHsl('#FF0000'), name: 'Red' },
        { hex: '#00FF00', rgb: ColorUtils.hexToRgb('#00FF00'), hsl: ColorUtils.hexToHsl('#00FF00'), name: 'Green' },
        { hex: '#0000FF', rgb: ColorUtils.hexToRgb('#0000FF'), hsl: ColorUtils.hexToHsl('#0000FF'), name: 'Blue' },
        { hex: '#FFFF00', rgb: ColorUtils.hexToRgb('#FFFF00'), hsl: ColorUtils.hexToHsl('#FFFF00'), name: 'Yellow' },
        { hex: '#FF00FF', rgb: ColorUtils.hexToRgb('#FF00FF'), hsl: ColorUtils.hexToHsl('#FF00FF'), name: 'Magenta' }
      ]
      setPalette(defaultColors)
      toast.error(error instanceof Error ? error.message : 'Failed to generate palette')
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
      
      ctx.fillStyle = '#FFFFFF' 
      ctx.font = '12px Arial'
      ctx.fillText(color.hex, index * 100 + 10, 220)
      ctx.fillText(color.name || 'Unknown', index * 100 + 10, 240)
    })

    const link = document.createElement('a')
    link.download = 'color_palette.png'
    link.href = canvas.toDataURL()
    link.click()
    toast.success('Palette downloaded as PNG')
  }

  const handleImageUpload = (file: File) => {
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

  return (
    <ToolLayout
      title="Color Palette Generator"
      description="Craft the perfect color scheme for your next project"
    >
        <Toaster position="top-right" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            {openAIError && (
              <div className="bg-red-600/20 border border-red-600 rounded-lg p-4 mb-4">
                <p className="text-red-400">
                  AI Palette Generation Error: {openAIError}
                </p>
                <p className="text-sm text-red-300 mt-2">
                  Falling back to standard palette generation method.
                </p>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Color Palette Generator
              </CardTitle>
              <CardDescription className="text-gray-400">
                Craft the perfect color scheme for your next project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as 'color' | 'grid' | 'image' | 'text')}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="color" className="flex items-center justify-center">
                    <Droplet className="w-4 h-4 mr-2 md:mr-0" />
                    <span className="hidden md:inline ml-2">Color Input</span>
                  </TabsTrigger>
                  <TabsTrigger value="grid" className="flex items-center justify-center">
                    <Grid className="w-4 h-4 mr-2 md:mr-0" />
                    <span className="hidden md:inline ml-2">Color Grid</span>
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 mr-2 md:mr-0" />
                    <span className="hidden md:inline ml-2">Image Upload</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center justify-center">
                    <Wand2 className="w-4 h-4 mr-2 md:mr-0" />
                    <span className="hidden md:inline ml-2">AI Generation</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="color">
                  <div className="flex items-center">
                    <Input
                      type="color"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="w-12 h-12 p-1 mr-2 rounded"
                    />
                    <Input
                      type="text"
                      value={baseColor}
                      onChange={(e) => setBaseColor(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="grid">
                  <ColorGrid onColorSelect={setBaseColor} selectedColor={baseColor} />
                </TabsContent>
                <TabsContent value="image">
                  <ImageUpload onImageUpload={handleImageUpload} uploadedImage={uploadedImage} />
                </TabsContent>
                <TabsContent value="text">
                  <div className="space-y-2">
                    <label htmlFor="user-input" className="block text-sm font-medium text-gray-300">
                      Describe your desired color palette
                    </label>
                    <Textarea
                      id="user-input"
                      rows={4}
                      className="w-full px-3 py-2 text-gray-300 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="E.g., A warm sunset palette with orange and purple tones"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {inputMethod !== 'text' && (
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
              )}

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
              <Button onClick={() => setShowPreview(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </Button>
            </CardFooter>
          </Card>

          <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="bg-gray-700 text-white">
          <DialogHeader className="flex justify-between items-center">
            <div>
              <DialogTitle>Color Palette Preview</DialogTitle>
              <DialogDescription>See how your color palette looks in a sample layout</DialogDescription>
            </div>
            <Button onClick={() => setPreviewDarkMode(!previewDarkMode)} variant="outline" size="sm">
              {previewDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </DialogHeader>
          {palette.length === 5 && palette.every(color => color.hex) && (
            <div className={`space-y-8 ${previewDarkMode ? 'dark' : ''}`}>
              <div className="p-6 rounded-lg" style={{ backgroundColor: palette[0].hex }}>
                <h2 className="text-3xl font-bold mb-4" style={{ color: palette[1].hex }}>
                  Welcome to Our Website
                </h2>
                <p className="text-lg mb-4" style={{ color: palette[2].hex }}>
                  This is an example of how your color palette can be used effectively in web design.
                </p>
                <div className="flex space-x-4">
                  <button
                    style={{
                      backgroundColor: palette[3].hex,
                      color: ColorUtils.getContrastColor(palette[3].hex),
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Primary Button
                  </button>
                  <button
                    style={{
                      backgroundColor: palette[4].hex,
                      color: ColorUtils.getContrastColor(palette[4].hex),
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>
              <div className={`${previewDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} p-6 rounded-lg`}>
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
          {(!palette || palette.length < 5 || palette.some(color => !color.hex)) && (
            <p className="text-red-500">Unable to generate palette preview</p>
          )}
          <DialogFooter>
            <Button onClick={() => setShowPreview(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

          <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <Palette className="w-6 h-6 mr-2" />
                About Color Palette Generator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                The Color Palette Generator is a powerful tool designed for designers, artists, and developers to create harmonious color schemes for their projects. It offers multiple input methods and advanced features to generate, visualize, and export color palettes with ease.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Eye className="w-6 h-6 mr-2" />
                How to Use Color Palette Generator
              </h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Choose an input method: Color Input, Color Grid, Image Upload, or AI Generation.</li>
                <li>For Color Input, use the color picker or enter a hex code.</li>
                <li>For Color Grid, click on a color to select it as the base color.</li>
                <li>For Image Upload, select an image to extract its dominant color.</li>
                <li>For AI Generation, describe your desired color palette in words.</li>
                <li>If using Color Input, Grid, or Image Upload, select a harmony type.</li>
                <li>Click "Generate Palette" to create your color scheme.</li>
                <li>Explore the generated palette, copy colors, or download as PNG.</li>
                <li>Use the "Preview" feature to see how the palette looks in a sample layout.</li>
                <li>Regenerate or adjust inputs as needed to refine your palette.</li>
              </ol>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Key Features
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Multiple input methods for base color selection</li>
                <li>AI-powered palette generation from text descriptions</li>
                <li>Various color harmony types (analogous, monochromatic, triadic, etc.)</li>
                <li>Color information display (hex, RGB, HSL, and color name)</li>
                <li>One-click color copying to clipboard</li>
                <li>PNG export of generated palettes</li>
                <li>Interactive preview of palette usage in a sample layout</li>
                <li>Responsive design for use on various devices</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Tips and Tricks
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Experiment with different harmony types to find the perfect combination.</li>
                <li>Use the image upload feature to create palettes inspired by your favorite photos.</li>
                <li>Try the AI generation with specific themes or moods for unique color combinations.</li>
                <li>Use the preview feature to visualize how your palette works in a real-world context.</li>
                <li>Download your favorite palettes as PNG for easy sharing or integration into design software.</li>
                <li>Combine colors from different generated palettes to create custom schemes.</li>
                <li>Pay attention to contrast when selecting colors for text and backgrounds.</li>
                <li>Consider color psychology when choosing palettes for specific projects or brands.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
     
    </ToolLayout>
  )
}