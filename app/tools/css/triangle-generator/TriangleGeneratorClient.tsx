'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, Toaster } from 'react-hot-toast'
import { Copy, RefreshCw, Download, Info, Lightbulb, BookOpen, Palette, Maximize2, X, Sliders } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Image from 'next/image'

type TriangleDirection = 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left'

export default function CSSTriangleGenerator() {
  const [direction, setDirection] = useState<TriangleDirection>('top')
  const [color, setColor] = useState('#3498db')
  const [size, setSize] = useState(100)
  const [rotate, setRotate] = useState(0)
  const [opacity, setOpacity] = useState(1)
  const [borderRadius, setBorderRadius] = useState(0)
  const [generatedCSS, setGeneratedCSS] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const generateCSS = () => {
    let css = `
.triangle {
  width: 0;
  height: 0;
  border-style: solid;
`

    const halfSize = size / 2
    let borderWidths = ''
    let borderColors = ''

    switch (direction) {
      case 'top':
        borderWidths = `0 ${halfSize}px ${size}px ${halfSize}px`
        borderColors = `transparent transparent ${color} transparent`
        break
      case 'top-right':
        borderWidths = `0 ${size}px ${size}px 0`
        borderColors = `transparent ${color} transparent transparent`
        break
      case 'right':
        borderWidths = `${halfSize}px 0 ${halfSize}px ${size}px`
        borderColors = `transparent transparent transparent ${color}`
        break
      case 'bottom-right':
        borderWidths = `0 0 ${size}px ${size}px`
        borderColors = `transparent transparent ${color} transparent`
        break
      case 'bottom':
        borderWidths = `${size}px ${halfSize}px 0 ${halfSize}px`
        borderColors = `${color} transparent transparent transparent`
        break
      case 'bottom-left':
        borderWidths = `${size}px 0 0 ${size}px`
        borderColors = `transparent transparent transparent ${color}`
        break
      case 'left':
        borderWidths = `${halfSize}px ${size}px ${halfSize}px 0`
        borderColors = `transparent ${color} transparent transparent`
        break
      case 'top-left':
        borderWidths = `${size}px ${size}px 0 0`
        borderColors = `${color} transparent transparent transparent`
        break
    }

    css += `  border-width: ${borderWidths};
  border-color: ${borderColors};
  opacity: ${opacity};
  transform: rotate(${rotate}deg);
`

    if (borderRadius > 0) {
      css += `  border-radius: ${borderRadius}%;
`
    }

    css += `}`

    setGeneratedCSS(css)
  }

  useEffect(() => {
    generateCSS()
  }, [direction, color, size, rotate, opacity, borderRadius])

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCSS)
    toast.success('CSS copied to clipboard!')
  }

  const handleReset = () => {
    setDirection('top')
    setColor('#3498db')
    setSize(100)
    setRotate(0)
    setOpacity(1)
    setBorderRadius(0)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedCSS], {type: 'text/css'})
    element.href = URL.createObjectURL(file)
    element.download = 'triangle.css'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('CSS file downloaded!')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const renderTrianglePreview = () => (
    <div
      className="triangle"
      style={{
        width: 0,
        height: 0,
        borderStyle: 'solid',
        borderWidth: direction === 'top' ? `0 ${size / 2}px ${size}px ${size / 2}px` :
                    direction === 'top-right' ? `0 ${size}px ${size}px 0` :
                    direction === 'right' ? `${size / 2}px 0 ${size / 2}px ${size}px` :
                    direction === 'bottom-right' ? `0 0 ${size}px ${size}px` :
                    direction === 'bottom' ? `${size}px ${size / 2}px 0 ${size / 2}px` :
                    direction === 'bottom-left' ? `${size}px 0 0 ${size}px` :
                    direction === 'left' ? `${size / 2}px ${size}px ${size / 2}px 0` :
                    `${size}px ${size}px 0 0`,
        borderColor: direction === 'top' ? `transparent transparent ${color} transparent` :
                    direction === 'top-right' ? `transparent ${color} transparent transparent` :
                    direction === 'right' ? `transparent transparent transparent ${color}` :
                    direction === 'bottom-right' ? `transparent transparent ${color} transparent` :
                    direction === 'bottom' ? `${color} transparent transparent transparent` :
                    direction === 'bottom-left' ? `transparent transparent transparent ${color}` :
                    direction === 'left' ? `transparent ${color} transparent transparent` :
                    `${color} transparent transparent transparent`,
        opacity: opacity,
        transform: `rotate(${rotate}deg)`,
        borderRadius: `${borderRadius}%`,
      }}
    />
  )

  return (
    <ToolLayout
      title="CSS Triangle Generator"
      description="Create customizable CSS triangles with advanced options and features"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardContent>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
              <div className="relative">
                <div 
                  className="w-full bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden"
                  style={{ height: `${Math.max(256, size)}px` }}
                >
                  {renderTrianglePreview()}
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
            </div>

            <Tabs defaultValue="basic">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">
                  <Sliders className="h-4 w-4 mr-2" />
                  Basic Settings
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Palette className="h-4 w-4 mr-2" />
                  Advanced Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="direction" className="text-white mb-2 block">Direction</Label>
                    <Select value={direction} onValueChange={(value: TriangleDirection) => setDirection(value)}>
                      <SelectTrigger id="direction" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color" className="text-white mb-2 block">Triangle Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="size" className="text-white mb-2 block">Size: {size}px</Label>
                    <Slider
                      id="size"
                      min={20}
                      max={500}
                      step={1}
                      value={size}
                      onChange={(value) => setSize(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rotate" className="text-white mb-2 block">Rotate: {rotate}°</Label>
                    <Slider
                      id="rotate"
                      min={0}
                      max={360}
                      step={1}
                      value={rotate}
                      onChange={(value) => setRotate(value)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced">
                <div className="space-y-4">
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

                  <div>
                    <Label htmlFor="borderRadius" className="text-white mb-2 block">Border Radius: {borderRadius}%</Label>
                    <Slider
                      id="borderRadius"
                      min={0}
                      max={50}
                      step={1}
                      value={borderRadius}
                      onChange={(value) => setBorderRadius(value)}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
              
              {/* CSS Code Container */}
              <div className="bg-gray-700 p-4 rounded-lg overflow-auto">
                <code className="text-white whitespace-pre-wrap break-all">
                  {generatedCSS}
                </code>
              </div>
              
              {/* Buttons */}
              <div className="mt-4 flex flex-col space-y-2 md:flex-row md:justify-end md:space-y-0 md:space-x-2">
                <Button
                  onClick={handleReset}
                  variant="destructive"
                  className="text-white border-white hover:bg-gray-700"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Copy className="h-5 w-5 mr-2" />
                  Copy CSS
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download CSS
                </Button>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-3/4 h-3/4 max-h-screen p-4">
            <Button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="w-full h-full overflow-hidden rounded-lg bg-gray-700 flex items-center justify-center">
              {renderTrianglePreview()}
            </div>
          </div>
        </div>
      )}

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is CSS Triangle Generator?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The CSS Triangle Generator is a powerful tool for creating customizable CSS triangles without using images. It offers a range of options to adjust the triangle's appearance, including direction, size, color, opacity, rotation, and border radius. This tool is perfect for web designers and developers looking to add decorative elements or create unique layouts using pure CSS.
          </p>
          <p className="text-gray-300 mb-4">
            With real-time preview and instant CSS generation, this tool streamlines the process of creating triangle shapes that can be easily integrated into your web projects. Whether you're designing a tooltip, a decorative header, or a unique button, the CSS Triangle Generator provides the flexibility and precision you need.
          </p>

          <div className="my-8">
              <Image 
                src="/Images/CSSTrianglePreview.png?height=400&width=600" 
                alt="Screenshot of the CSS Triangle Generator tool" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use CSS Triangle Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Choose a triangle direction from the dropdown menu (8 options available).</li>
            <li>Set the triangle's color using the color picker or by entering a hex value.</li>
            <li>Adjust the size using the slider.</li>
            <li>Rotate the triangle using the rotation slider.</li>
            <li>Fine-tune the opacity for transparent effects.</li>
            <li>Add border radius for rounded corners.</li>
            <li>Preview your triangle in real-time in the preview area.</li>
            <li>Use the fullscreen button to view your triangle in a larger format.</li>
            <li>Copy the generated CSS code or download it as a CSS file.</li>
            <li>Use the Reset button to return to default settings if needed.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Eight different triangle directions for versatile design options</li>
            <li>Custom color selection with color picker and hex input</li>
            <li>Precise size control with a slider</li>
            <li>Rotation feature for angled triangles</li>
            <li>Opacity control for transparent triangles</li>
            <li>Border radius option for creating rounded triangles</li>
            <li>Real-time preview of the triangle as you adjust settings</li>
            <li>Fullscreen preview mode for detailed inspection</li>
            <li>Tabbed interface separating basic and advanced settings</li>
            <li>Generated CSS code with one-click copy functionality</li>
            <li>Option to download the CSS as a file</li>
            <li>Reset feature to quickly return to default settings</li>
            <li>Responsive design for use on various devices</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>UI Elements:</strong> Create custom tooltips, dropdown menus, or accordion indicators.</li>
            <li><strong>Decorative Shapes:</strong> Add triangular design elements to headers, footers, or dividers.</li>
            <li><strong>Buttons and Icons:</strong> Design play buttons, directional indicators, or custom bullet points.</li>
            <li><strong>Background Patterns:</strong> Generate repeating triangle patterns for unique backgrounds.</li>
            <li><strong>Infographics:</strong> Create triangular elements for data visualization or timelines.</li>
            <li><strong>Logo Design:</strong> Incorporate triangular shapes into logo designs or branding elements.</li>
            <li><strong>Navigation:</strong> Design triangular navigation elements or breadcrumbs.</li>
            <li><strong>Responsive Design:</strong> Create adaptable triangular elements that work across different screen sizes.</li>
            <li><strong>CSS Art:</strong> Use triangles as building blocks for more complex CSS-only illustrations.</li>
            <li><strong>Educational Tools:</strong> Teach geometry concepts or demonstrate CSS capabilities in web design courses.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The CSS Triangle Generator empowers designers and developers to create customizable triangular elements for their web projects. By providing an intuitive interface for adjusting various properties, along with real-time previews and easy CSS generation, this tool bridges the gap between design concept and implementation. Whether you're aiming for simple, clean shapes or more complex decorative elements, the CSS Triangle Generator gives you the control and flexibility you need to bring your creative vision to life using pure CSS.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

