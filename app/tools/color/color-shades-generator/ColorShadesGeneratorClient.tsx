'use client'

import React, { useCallback, useState, useEffect } from 'react'
import { Copy, Info, BookOpen, Lightbulb, AlertCircle, RefreshCw, Download, Palette, Eye, Code } from 'lucide-react'
import Input from "@/components/ui/Input"
import Image from 'next/image'
import Slider from "@/components/ui/Slider"
import { Button } from "@/components/ui/Button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast, Toaster } from 'react-hot-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select } from '@/components/ui/select1';
import ToolLayout from '@/components/ToolLayout'

interface Shade {
  hex: string
  rgb: [number, number, number]
  hsv: [number, number, number]
  hsl: [number, number, number]
  cmyk: [number, number, number, number]
}

const colorConversions = {
  hexToRgb: (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  },
  rgbToHex: (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  },
  rgbToHsv: (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0
    const s = max === 0 ? 0 : (max - min) / max, v = max
    if (max !== min) {
      const d = max - min
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)]
  },
  rgbToHsl: (r: number, g: number, b: number): [number, number, number] => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0 
    const l = (max + min) / 2;
  
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
  
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  },
  
  rgbToCmyk: (r: number, g: number, b: number): [number, number, number, number] => {
    let c = 1 - (r / 255)
    let m = 1 - (g / 255)
    let y = 1 - (b / 255)
    const k = Math.min(c, Math.min(m, y))
    c = (c - k) / (1 - k)
    m = (m - k) / (1 - k)
    y = (y - k) / (1 - k)
    return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)]
  }
}

export default function ColorShadesGenerator() {
  const [baseColor, setBaseColor] = useState('#3da013')
  const [shadeCount, setShadeCount] = useState(10)
  const [shades, setShades] = useState<Shade[]>([])
  const [selectedShade, setSelectedShade] = useState<Shade | null>(null)
  const [error, setError] = useState<string>('')
  const [shadeType, setShadeType] = useState<'tint' | 'shade' | 'both'>('both')

  const generateShades = useCallback((hex: string, count: number, type: 'tint' | 'shade' | 'both'): Shade[] => {
    const [r, g, b] = colorConversions.hexToRgb(hex)
    const shades: Shade[] = []

    if (type === 'both') {
      const halfCount = Math.floor(count / 2)
      shades.push(...generateShades(hex, halfCount, 'shade'))
      shades.push(...generateShades(hex, count - halfCount, 'tint').reverse())
    } else {
      for (let i = 0; i < count; i++) {
        const factor = i / (count - 1)
        let shadeR, shadeG, shadeB
        if (type === 'tint') {
          shadeR = Math.round(r + (255 - r) * factor)
          shadeG = Math.round(g + (255 - g) * factor)
          shadeB = Math.round(b + (255 - b) * factor)
        } else {
          shadeR = Math.round(r * (1 - factor))
          shadeG = Math.round(g * (1 - factor))
          shadeB = Math.round(b * (1 - factor))
        }
        const shadeHex = colorConversions.rgbToHex(shadeR, shadeG, shadeB)
        shades.push({
          hex: shadeHex,
          rgb: [shadeR, shadeG, shadeB],
          hsv: colorConversions.rgbToHsv(shadeR, shadeG, shadeB),
          hsl: colorConversions.rgbToHsl(shadeR, shadeG, shadeB),
          cmyk: colorConversions.rgbToCmyk(shadeR, shadeG, shadeB)
        })
      }
    }

    return shades
  }, [])

  useEffect(() => {
    setError('')
    if (!/^#[0-9A-Fa-f]{6}$/.test(baseColor)) {
      setError('Please enter a valid hex color code.')
      return
    }
    const newShades = generateShades(baseColor, shadeCount, shadeType)
    setShades(newShades)
    setSelectedShade(newShades[Math.floor(newShades.length / 2)])
  }, [baseColor, shadeCount, shadeType, generateShades])

  const handleCopyColor = (colorValue: string) => {
    navigator.clipboard.writeText(colorValue)
    toast.success(`Copied ${colorValue} to clipboard`)
  }

  const handleRandomColor = () => {
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
    setBaseColor(randomColor)
  }

  const handleDownloadPalette = () => {
    const canvas = document.createElement('canvas')
    canvas.width = shades.length * 100
    canvas.height = 200
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    shades.forEach((shade, index) => {
      ctx.fillStyle = shade.hex
      ctx.fillRect(index * 100, 0, 100, 150)
      ctx.fillStyle = '#000000'
      ctx.font = '12px Arial'
      ctx.fillText(shade.hex, index * 100 + 10, 170)
      ctx.fillText(`RGB: ${shade.rgb.join(',')}`, index * 100 + 10, 190)
    })

    const link = document.createElement('a')
    link.download = 'color_palette.png'
    link.href = canvas.toDataURL()
    link.click()
    toast.success('Palette downloaded as PNG')
  }

  return (
    <ToolLayout
      title="Color Shades Generator"
      description="Generate and explore harmonious color shades for your projects with advanced features"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Color Shades Generator
          </CardTitle>
          <CardDescription className="text-gray-400">
            Create beautiful color palettes with advanced shade generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            type="text"
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
            className="flex-grow bg-gray-700 text-white border-gray-600 w-full sm:w-auto"
            placeholder="Enter HEX color"
          />
          <div className="relative">
            <input
              id="color-picker"
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="sr-only"
            />
            <label
              htmlFor="color-picker"
              className="w-12 h-12 rounded cursor-pointer border-2 border-white/20 flex items-center justify-center"
              style={{ backgroundColor: baseColor }}
            >
              <div className="w-8 h-8 rounded-sm border border-white/40"></div>
            </label>
          </div>
          <Button
            onClick={handleRandomColor}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Random
          </Button>
        </div>



          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Shade Count: {shadeCount}
            </label>
            <Slider
              min={2}
              max={20}
              step={1}
              value={shadeCount}
              onChange={(value) => setShadeCount(value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Shade Type
            </label>
            <Select
                label="Select shade type"
                options={[
                  { value: "tint", label: "Tint (Lighter)" },
                  { value: "shade", label: "Shade (Darker)" },
                  { value: "both", label: "Both" },
                ]}
                selectedKey={shadeType}
                onSelectionChange={setShadeType}
                placeholder="Select shade type"
                className="w-full "
              />

          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex mb-6" id="shades-container">
            {shades.map((shade, index) => (
              <div
                key={index}
                className="flex-1 h-20 shade cursor-pointer transition-transform hover:scale-105"
                style={{ backgroundColor: shade.hex }}
                onClick={() => setSelectedShade(shade)}
              ></div>
            ))}
          </div>

          <Button onClick={handleDownloadPalette} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Download className="mr-2 h-4 w-4" /> Download Palette
          </Button>
        </CardContent>
      </Card>

      {selectedShade && (
        <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-white mb-4">Selected Shade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row">
              <div 
                className="w-full md:w-1/3 h-48 rounded-md mb-4 md:mb-0"
                style={{ backgroundColor: selectedShade.hex }}
              ></div>
              <div className="w-full md:w-2/3 md:ml-4 space-y-2">
                <Tabs defaultValue="hex">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="hex">HEX</TabsTrigger>
                    <TabsTrigger value="rgb">RGB</TabsTrigger>
                    <TabsTrigger value="hsl">HSL</TabsTrigger>
                    <TabsTrigger value="hsv">HSV</TabsTrigger>
                    <TabsTrigger value="cmyk">CMYK</TabsTrigger>
                  </TabsList>
                  <TabsContent value="hex" className="flex items-center justify-between">
                    <span className="text-white">{selectedShade.hex}</span>
                    <Button onClick={() => handleCopyColor(selectedShade.hex)} className="p-1">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TabsContent>
                  <TabsContent value="rgb" className="flex items-center justify-between">
                    <span className="text-white">rgb({selectedShade.rgb.join(', ')})</span>
                    <Button onClick={() => handleCopyColor(`rgb(${selectedShade.rgb.join(', ')})`)} className="p-1">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TabsContent>
                  <TabsContent value="hsl" className="flex items-center justify-between">
                    <span className="text-white">hsl({selectedShade.hsl.join(', ')})</span>
                    <Button onClick={() => handleCopyColor(`hsl(${selectedShade.hsl.join(', ')})`)} className="p-1">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TabsContent>
                  <TabsContent value="hsv" className="flex items-center justify-between">
                    <span className="text-white">hsv({selectedShade.hsv.join(', ')})</span>
                    <Button onClick={() => handleCopyColor(`hsv(${selectedShade.hsv.join(', ')})`)} className="p-1">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TabsContent>
                  <TabsContent value="cmyk" className="flex items-center justify-between">
                    <span className="text-white">cmyk({selectedShade.cmyk.join(', ')})</span>
                    <Button onClick={() => handleCopyColor(`cmyk(${selectedShade.cmyk.join(', ')})`)} className="p-1">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Color Shades Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-300">
              The Color Shades Generator is a sophisticated tool designed for designers, developers, and color enthusiasts. It allows you to generate a range of harmonious color shades based on a single base color. This tool is perfect for creating color palettes, exploring color relationships, and ensuring color consistency in your projects.
            </p>
          </section>
          <div className="my-8">
            <Image
              src="/Images/ColorShadesPreview.png?height=400&width=600"
              alt="Screenshot of the Enhanced Color Name Generator interface showing color inputs and preview"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>

          <section>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Color Shades Generator?
            </h3>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Enter a hex color code or use the color picker to select a base color.</li>
              <li>Adjust the slider to choose the number of shades you want to generate (between 2 and 20).</li>
              <li>Select the shade type: tint (lighter), shade (darker), or both.</li>
              <li>Click on the generated shades to view their details in various color formats.</li>
              <li>Use the copy button next to each color value to easily copy it to your clipboard.</li>
              <li>Download the entire palette as a PNG image for easy reference and sharing.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Generate up to 20 color shades based on a single base color</li>
              <li>Choose between tints, shades, or a combination of both</li>
              <li>View color information in HEX, RGB, HSL, HSV, and CMYK formats</li>
              <li>One-click copy functionality for all color formats</li>
              <li>Download the entire palette as a PNG image</li>
              <li>Random color generation for inspiration</li>
              <li>Real-time updates as you adjust settings</li>
              <li>Responsive design for use on various devices</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <Palette className="w-6 h-6 mr-2" />
              Applications and Use Cases
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li><strong>Web Design:</strong> Create consistent color schemes for websites and user interfaces.</li>
              <li><strong>Graphic Design:</strong> Develop color palettes for logos, branding, and marketing materials.</li>
              <li><strong>Digital Art:</strong> Explore color variations for digital illustrations and paintings.</li>
              <li><strong>Print Design:</strong> Ensure color consistency across various printed materials.</li>
              <li><strong>Product Design:</strong> Create color schemes for physical products and packaging.</li>
              <li><strong>Data Visualization:</strong> Generate color scales for charts, graphs, and infographics.</li>
              <li><strong>Accessibility Testing:</strong> Test color contrasts and readability with different shades.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              Tips for Effective Use
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Experiment with different base colors to discover unique palettes.</li>
              <li>Use the tint and shade options to create monochromatic color schemes.</li>
              <li>Combine multiple generated palettes to create more complex color systems.</li>
              <li>Consider color psychology when selecting base colors for your projects.</li>
              <li>Test your color palettes in different lighting conditions and on various devices.</li>
              <li>Use the CMYK values when preparing designs for print production.</li>
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
              <li>Create a color system with primary, secondary, and accent colors using different shades</li>
              <li>Utilize the downloaded PNG palette to import colors into design tools</li>
              <li>Use the various color formats (HEX, RGB, HSL) as needed for different contexts in your code</li>
              <li>Consider creating a style guide that incorporates your generated color palette for consistent usage across your project or organization</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}