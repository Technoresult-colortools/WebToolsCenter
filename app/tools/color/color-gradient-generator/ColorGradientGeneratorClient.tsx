'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/Button"
import Input  from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Select } from '@/components/ui/select1';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Copy, Download, Plus, Minus, RotateCcw, Shuffle, Info, BookOpen, Lightbulb, Palette, Code, Maximize2, X } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'

type GradientType = 'linear' | 'radial' | 'conic'
type ColorStop = { color: string; position: number }

export default function GradientGeneratorPage() {
  const [stops, setStops] = useState<ColorStop[]>([
    { color: '#833ab4', position: 20 },
    { color: '#fd1d1d', position: 49 },
    { color: '#fcb045', position: 78 },
  ])
  const [gradientType, setGradientType] = useState<GradientType>('linear')
  const [angle, setAngle] = useState(45)
  const [repeating, setRepeating] = useState(false)
  const [cssCode, setCssCode] = useState('')
  const [activeTab, setActiveTab] = useState<'gradient' | 'css'>('gradient')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [centerX, setCenterX] = useState(50)
  const [centerY, setCenterY] = useState(50)
  const [shape, setShape] = useState<'circle' | 'ellipse'>('circle')
  const [size, setSize] = useState<'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner'>('farthest-corner')

  const generateCssCode = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position)
    const stopsString = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ')

    let gradientString = ''
    if (gradientType === 'linear') {
      gradientString = `${repeating ? 'repeating-' : ''}linear-gradient(${angle}deg, ${stopsString})`
    } else if (gradientType === 'radial') {
      gradientString = `${repeating ? 'repeating-' : ''}radial-gradient(${shape} ${size} at ${centerX}% ${centerY}%, ${stopsString})`
    } else if (gradientType === 'conic') {
      gradientString = `${repeating ? 'repeating-' : ''}conic-gradient(from ${angle}deg at ${centerX}% ${centerY}%, ${stopsString})`
    }

    setCssCode(`background: ${gradientString};`)
  }, [stops, gradientType, angle, repeating, shape, size, centerX, centerY])

  useEffect(() => {
    generateCssCode()
  }, [generateCssCode])

  const addStop = () => {
    if (stops.length < 5) {
      const newColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`
      setStops([...stops, { color: newColor, position: 50 }])
    } else {
      toast.error('Maximum 5 color stops allowed')
    }
  }

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      setStops(stops.filter((_, i) => i !== index))
    } else {
      toast.error('Minimum 2 color stops required')
    }
  }

  const updateStop = (index: number, color: string, position: number) => {
    const newStops = [...stops]
    newStops[index] = { color, position }
    setStops(newStops)
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cssCode)
    toast.success('CSS code copied to clipboard')
  }

  const handleDownloadImage = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 1000
    const ctx = canvas.getContext('2d')
    if (ctx) {
      let gradient: CanvasGradient | null = null
      if (gradientType === 'linear') {
        gradient = ctx.createLinearGradient(0, 0, 1000, 1000)
      } else if (gradientType === 'radial') {
        gradient = ctx.createRadialGradient(centerX * 10, centerY * 10, 0, centerX * 10, centerY * 10, 500)
      } else {
        gradient = ctx.createConicGradient(angle * Math.PI / 180, centerX * 10, centerY * 10)
      }
      if (gradient) {
        stops.forEach(stop => gradient!.addColorStop(stop.position / 100, stop.color))
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, 1000, 1000)
        
        const link = document.createElement('a')
        link.download = 'gradient.png'
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  const resetGradient = () => {
    setStops([
      { color: '#833ab4', position: 20 },
      { color: '#fd1d1d', position: 49 },
      { color: '#fcb045', position: 78 },
    ])
    setGradientType('linear')
    setAngle(45)
    setRepeating(false)
    setCenterX(50)
    setCenterY(50)
    setShape('circle')
    setSize('farthest-corner')
  }

  const generateRandomGradient = () => {
    const randomStops = Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => ({
      color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
      position: Math.floor(Math.random() * 101),
    }))
    setStops(randomStops)
    setGradientType(['linear', 'radial', 'conic'][Math.floor(Math.random() * 3)] as GradientType)
    setAngle(Math.floor(Math.random() * 361))
    setRepeating(Math.random() > 0.5)
    setCenterX(Math.floor(Math.random() * 101))
    setCenterY(Math.floor(Math.random() * 101))
    setShape(Math.random() > 0.5 ? 'circle' : 'ellipse')
    setSize(['closest-side', 'farthest-side', 'closest-corner', 'farthest-corner'][Math.floor(Math.random() * 4)] as 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <ToolLayout
      title="Color Gradient Generator"
      description="Create stunning CSS gradients with advanced features and a modern interface"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Gradient Preview</CardTitle>
          <CardDescription className="text-gray-400">Customize your gradient below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div 
              className="w-full h-64 rounded-lg mb-4 transition-all duration-300 ease-in-out"
              style={{ background: cssCode ? cssCode.split(': ')[1]?.slice(0, -1) || '' : '' }}
            />
            <Button
              size="sm"
              variant="secondary"
              onClick={toggleFullscreen}
              className="absolute bottom-2 right-2"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 shadow-lg rounded-lg p-6 mb-8 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Gradient Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'gradient' | 'css')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="gradient">
                <Palette className="h-4 w-4 mr-2" />
                Gradient
              </TabsTrigger>
              <TabsTrigger value="css">
                <Code className="h-4 w-4 mr-2" />
                CSS
              </TabsTrigger>
            </TabsList>
            <TabsContent value="gradient">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="gradient-type" className="text-white">Gradient Type</Label>
                    <Select
                      label="Select gradient type"
                      options={[
                        { value: "linear", label: "Linear" },
                        { value: "radial", label: "Radial" },
                        { value: "conic", label: "Conic" },
                      ]}
                      selectedKey={gradientType}
                      onSelectionChange={(value) => setGradientType(value as GradientType)}
                      placeholder="Select gradient type"
                  
                    />

                  </div>
                  {gradientType !== 'radial' && (
                    <div>
                      <Label htmlFor="angle-slider" className="text-white">Angle: {angle}°</Label>
                      <Slider
                        id="angle-slider"
                        min={0}
                        max={360}
                        step={1}
                        value={angle}
                        onChange={(value) => setAngle(value)}
                        className='mt-2'
                      />
                    </div>
                  )}
                  {gradientType !== 'linear' && (
                    <>
                      <div>
                        <Label htmlFor="center-x" className="text-white">Center X: {centerX}%</Label>
                        <Slider
                          id="center-x"
                          min={0}
                          max={100}
                          step={1}
                          value={centerX}
                          onChange={(value) => setCenterX(value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="center-y" className="text-white">Center Y: {centerY}%</Label>
                        <Slider
                          id="center-y"
                          min={0}
                          max={100}
                          step={1}
                          value={centerY}
                          onChange={(value) => setCenterY(value)}
                        />
                      </div>
                    </>
                  )}
                  {gradientType === 'radial' && (
                    <>
                      <div>
                        <Label htmlFor="shape" className="text-white">Shape</Label>
                        <Select
                          label="Select shape"
                          options={[
                            { value: "circle", label: "Circle" },
                            { value: "ellipse", label: "Ellipse" },
                          ]}
                          selectedKey={shape}
                          onSelectionChange={(value) => setShape(value as 'circle' | 'ellipse')}
                          placeholder="Select shape"
              
                        />

                      </div>
                      <div>
                        <Label htmlFor="size" className="text-white">Size</Label>
                        <Select
                          label="Select size"
                          options={[
                            { value: "closest-side", label: "Closest Side" },
                            { value: "farthest-side", label: "Farthest Side" },
                            { value: "closest-corner", label: "Closest Corner" },
                            { value: "farthest-corner", label: "Farthest Corner" },
                          ]}
                          selectedKey={size}
                          onSelectionChange={(value) => setSize(value as 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner')}
                          placeholder="Select size"
          
                        />

                      </div>
                    </>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="repeating"
                      checked={repeating}
                      onCheckedChange={setRepeating}
                    />
                    <Label htmlFor="repeating" className="text-white">Repeating Gradient</Label>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-4">Color Stops</h2>
                  {stops.map((stop, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-4">
                      <Input
                        type="color"
                        value={stop.color}
                        onChange={(e) => updateStop(index, e.target.value, stop.position)}
                        className="w-12 h-12 p-1 rounded"
                      />
                      <Input
                        type="text"
                        value={stop.color}
                        onChange={(e) => updateStop(index, e.target.value, stop.position)}
                        className="w-24 bg-gray-700 text-white"
                      />
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={stop.position}
                        onChange={(value) => updateStop(index, stop.color, value)}
                        className="w-full"
                      />
                      <Button onClick={() => removeStop(index)} size="sm" variant="destructive">
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={addStop} className="w-full mb-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color Stop
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="css">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="css-code" className="text-white">CSS Code</Label>
                  <div className="flex items-center">
                    <Input
                      id="css-code"
                      value={cssCode}
                      readOnly
                      className="flex-grow bg-gray-700 mt-2 text-white"
                    />
                    <Button onClick={handleCopyCode} className="ml-2 mt-2" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
            <Button onClick={handleDownloadImage} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
            <Button onClick={resetGradient} variant="destructive" className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={generateRandomGradient} className="flex-1">
              <Shuffle className="h-4 w-4 mr-2" />
              Random
            </Button>
          </div>
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
              className="w-full h-full rounded-lg transition-all duration-300 ease-in-out"
              style={{ background: cssCode ? cssCode.split(': ')[1]?.slice(0, -1) || '' : '' }}
            />
          </div>
        </div>
      )}

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Color Gradient Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The Color Gradient Generator is a powerful and intuitive tool designed for web developers, designers, and creative professionals. It allows you to create stunning CSS gradients with advanced customization options, providing a seamless experience for both beginners and experts.
          </p>
          <div className="my-8">
          <Image
            src="/Images/ColorGradientPreview.png?height=400&width=600"
            alt="Screenshot of the CMYK to RGB Converter interface showing CMYK input sliders, RGB output, and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use Color Gradient Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Choose a gradient type: linear, radial, or conic.</li>
            <li>Adjust the angle for linear and conic gradients using the slider.</li>
            <li>For radial and conic gradients, set the center point using the X and Y sliders.</li>
            <li>Customize radial gradients further by selecting the shape and size.</li>
            <li>Toggle the "Repeating Gradient" switch for a repeating pattern.</li>
            <li>Add or remove color stops (minimum 2, maximum 5) using the "+" and "-" buttons.</li>
            <li>Adjust each color stop's color using the color picker or by entering a hex code.</li>
            <li>Fine-tune the position of each color stop using the sliders.</li>
            <li>Preview your gradient in fullscreen mode for a better view.</li>
            <li>Copy the generated CSS code or download the gradient as a PNG image.</li>
            <li>Use the Reset button to start over with default settings.</li>
            <li>Try the Random button to generate unexpected color combinations and gradient types.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Support for linear, radial, and conic gradients with advanced customization.</li>
            <li>Up to 5 color stops for complex gradients.</li>
            <li>Angle adjustment for linear and conic gradients.</li>
            <li>Center point control for radial and conic gradients.</li>
            <li>Shape and size options for radial gradients.</li>
            <li>Repeating gradient option.</li>
            <li>Real-time CSS code generation.</li>
            <li>One-click CSS code copying.</li>
            <li>PNG export functionality with high resolution.</li>
            <li>Random gradient generation for inspiration.</li>
            <li>Fullscreen preview mode.</li>
            <li>Modern, responsive design for use on various devices.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips and Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Experiment with different gradient types to achieve unique effects.</li>
            <li>Use the repeating gradient option to create patterns and textures.</li>
            <li>Combine multiple gradients in your CSS for more complex backgrounds.</li>
            <li>Try the random button for inspiration when you're stuck or want to explore new color combinations.</li>
            <li>Adjust color stop positions to create smooth or abrupt color transitions.</li>
            <li>Use the fullscreen preview to see how your gradient looks on larger screens.</li>
            <li>For web design, copy the CSS code directly into your stylesheet.</li>
            <li>Download PNG images for use in graphic design projects or presentations.</li>
            <li>Use conic gradients for creating pie charts or circular progress indicators.</li>
            <li>Explore color theory to create harmonious color combinations.</li>
            <li>Experiment with radial gradient shapes and sizes for unique focal points in your designs.</li>
            <li>Use the center point controls to create off-center or asymmetrical gradients.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            Whether you're creating eye-catching backgrounds for websites, designing user interfaces, or generating assets for print materials, the Enhanced Color Gradient Generator provides the flexibility and power you need to bring your creative visions to life. Start exploring the possibilities and elevate your designs with stunning gradients today!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}