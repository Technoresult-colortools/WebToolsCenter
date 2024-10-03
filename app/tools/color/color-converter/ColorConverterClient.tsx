'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/Button"
import Slider from "@/components/ui/Slider"
import { Copy, Palette,} from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ColorConverter: React.FC = () => {
  const [hex, setHex] = useState('#3498db')
  const [rgb, setRgb] = useState({ r: 52, g: 152, b: 219 })
  const [hsl, setHsl] = useState({ h: 204, s: 70, l: 53 })
  const [hsv, setHsv] = useState({ h: 204, s: 76, v: 86 })
  const [rgba, setRgba] = useState({ r: 52, g: 152, b: 219, a: 1 })
  const [activeTab, setActiveTab] = useState('hex')

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
      toast.success('Copied to clipboard!')
    }, () => {
      toast.error('Failed to copy')
    })
  }

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    updateAllFormats(randomHex)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Color Converter</h1>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Color Preview</CardTitle>
            <CardDescription className="text-gray-400">Current color: {hex}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div 
                className="w-full sm:w-64 h-32 rounded-lg shadow-inner" 
                style={{ backgroundColor: hex }}
              ></div>
              <div className="flex flex-col space-y-2">
                <Button onClick={() => copyToClipboard(hex)} className="w-full">
                  <Copy className="mr-2 h-4 w-4" /> Copy HEX
                </Button>
                <Button onClick={generateRandomColor} className="w-full">
                  <Palette className="mr-2 h-4 w-4" /> Random Color
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
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

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Color Converter</h2>
          <p className="text-gray-300 mb-4">
            Our Color Converter is a versatile tool that allows you to easily convert colors between various formats, including HEX, RGB, HSL, HSV, and RGBA. Whether you're working on web development, graphic design, or any other project involving colors, this tool ensures accurate and fast conversions for all your needs.
          </p>
          
          <h3 className="text-xl font-semibold text-white mt-6 mb-2">Key Features:</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>Support for multiple color formats: HEX, RGB, HSL, HSV, and RGBA</li>
            <li>Real-time color preview as you adjust values</li>
            <li>Sliders for precise color value adjustments</li>
            <li>Copy button for easy color value copying in any format</li>
            <li>Random color generation for inspiration</li>
            <li>Switch seamlessly between different color formats</li>
            <li>Responsive design for optimal use on all devices</li>
          </ul>

          <h3 className="text-xl font-semibold text-white mb-2">How to Use Color Converter?</h3>
          <ol className="list-decimal list-inside text-gray-300 mb-4">
            <li>Select the desired color format tab (HEX, RGB, HSL, HSV, or RGBA).</li>
            <li>Adjust the color values using either the input field or the interactive sliders.</li>
            <li>The color preview will update automatically in real-time as you make changes.</li>
            <li>Click the "Copy" buttons to copy the color value in your chosen format.</li>
            <li>If you want some inspiration, click the "Random Color" button to generate a random color.</li>
            <li>Easily switch between tabs to view the color in different formats.</li>
          </ol>

          <h3 className="text-xl font-semibold text-white mb-2">Tips and Tricks:</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>Experiment with the sliders for fine-tuned color adjustments across formats.</li>
            <li>Use the random color generator for creative inspiration or design exploration.</li>
            <li>Quickly switch between formats to compare color values in different coding schemes.</li>
            <li>Copy color values in multiple formats to ensure compatibility across various design tools.</li>
            <li>Take advantage of real-time previews to ensure your color looks perfect in every format.</li>
            <li>Bookmark commonly used colors for fast reference in future projects.</li>
            <li>Try converting colors between formats to better understand how they work together.</li>
          </ul>
        </div>

      </main>
      <Footer />
    </div>
  )
}

export default ColorConverter