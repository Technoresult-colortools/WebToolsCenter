'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Info, BookOpen, Lightbulb } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Shape = 'triangle' | 'rectangle' | 'pentagon' | 'hexagon' | 'octagon' | 'circle' | 'ellipse' | 'custom' | 
             'invertedTriangle' | 'trapezoid' | 'invertedTrapezoid' | 'parallelogram' | 'rhombus' | 'bevel' | 
             'chevronLeft' | 'chevronRight'

const initialShapes: Record<Shape, number[][]> = {
  triangle: [[50, 0], [100, 100], [0, 100]],
  rectangle: [[0, 0], [100, 0], [100, 100], [0, 100]],
  pentagon: [[50, 0], [100, 38], [82, 100], [18, 100], [0, 38]],
  hexagon: [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]],
  octagon: [[30, 0], [70, 0], [100, 30], [100, 70], [70, 100], [30, 100], [0, 70], [0, 30]],
  circle: [[50, 0], [100, 50], [50, 100], [0, 50]],
  ellipse: [[50, 0], [100, 50], [50, 100], [0, 50]],
  custom: [[50, 0], [100, 50], [50, 100], [0, 50]],
  invertedTriangle: [[0, 0], [100, 0], [50, 100]],
  trapezoid: [[20, 0], [80, 0], [100, 100], [0, 100]],
  invertedTrapezoid: [[0, 0], [100, 0], [80, 100], [20, 100]],
  parallelogram: [[25, 0], [100, 0], [75, 100], [0, 100]],
  rhombus: [[50, 0], [100, 50], [50, 100], [0, 50]],
  bevel: [[20, 0], [80, 0], [100, 20], [100, 80], [80, 100], [20, 100], [0, 80], [0, 20]],
  chevronLeft: [[0, 50], [50, 0], [100, 0], [50, 50], [100, 100], [50, 100]],
  chevronRight: [[0, 0], [50, 0], [100, 50], [50, 100], [0, 100], [50, 50]]
}

export default function ClipPathGenerator() {
  const [shape, setShape] = useState<Shape>('triangle')
  const [points, setPoints] = useState(initialShapes.triangle)
  const [clipPath, setClipPath] = useState('')
  const [imageUrl, setImageUrl] = useState('https://picsum.photos/seed/1/600/400')
  const [showOutside, setShowOutside] = useState(false)
  const [hideGuides, setHideGuides] = useState(false)
  const [useCustomBackground, setUseCustomBackground] = useState(false)
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState('')
  const [opacity, setOpacity] = useState(100)
  const [outsideColor, setOutsidecolor] = useState('#ffffff')
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const previewRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const activePointIndex = useRef(-1)

  useEffect(() => {
    updateClipPath()
  }, [points, width, height])

  useEffect(() => {
    setPoints(initialShapes[shape])
  }, [shape])

  const updateClipPath = () => {
    const offsetX = (100 - width) / 2
    const offsetY = (100 - height) / 2
    if (shape === 'circle') {
      setClipPath(`circle(${width / 2}% at 50% 50%)`)
    } else if (shape === 'ellipse') {
      setClipPath(`ellipse(${width / 2}% ${height / 2}% at 50% 50%)`)
    } else {
      const clipPathString = `polygon(${points.map(([x, y]) => `${offsetX + (x * width) / 100}% ${offsetY + (y * height) / 100}%`).join(', ')})`
      setClipPath(clipPathString)
    }
  }

  const handleShuffleImage = () => {
    const randomId = Math.floor(Math.random() * 1000)
    setImageUrl(`https://picsum.photos/seed/${randomId}/600/400`)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`clip-path: ${clipPath};`)
    toast.success('CSS copied to clipboard!')
  }

  const handleReset = () => {
    setShape('triangle')
    setPoints(initialShapes.triangle)
    setImageUrl('/placeholder.svg?height=400&width=600')
    setShowOutside(true)
    setHideGuides(false)
    setUseCustomBackground(false)
    setCustomBackgroundUrl('')
    setOpacity(100)
    setOutsidecolor('#ffffff')
    setWidth(100)
    setHeight(100)
  }

  const handleCustomBackgroundUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomBackgroundUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    e.preventDefault()
    isDragging.current = true
    activePointIndex.current = index
    if (previewRef.current) {
      previewRef.current.setPointerCapture(e.pointerId)
    }
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !previewRef.current) return

    const rect = previewRef.current.getBoundingClientRect()
    const x = Math.min(Math.max(0, ((e.clientX - rect.left) / rect.width) * 100), 100)
    const y = Math.min(Math.max(0, ((e.clientY - rect.top) / rect.height) * 100), 100)

    setPoints(prevPoints => {
      const newPoints = [...prevPoints]
      newPoints[activePointIndex.current] = [Math.round(x), Math.round(y)]
      return newPoints
    })
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    activePointIndex.current = -1
    if (previewRef.current) {
      previewRef.current.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CSS Clip Path Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Clip Path Preview</h2>
            <div 
              ref={previewRef}
              className="relative rounded-lg overflow-hidden touch-none border-4 border-gray-700"
              style={{ width: '100%', paddingBottom: '50.00%' }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <div className="absolute inset-0">
                <img 
                  src={useCustomBackground && customBackgroundUrl ? customBackgroundUrl : imageUrl} 
                  alt="Clipped image"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  style={{ 
                    clipPath: clipPath,
                    WebkitClipPath: clipPath,
                    opacity: opacity / 100,
                  }}
                />
                {!hideGuides && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-blue-500 opacity-50"></div>
                    <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-blue-500 opacity-50"></div>
                    <div className="absolute top-0 left-1/2 h-full border-l-2 border-dashed border-blue-500 opacity-50"></div>
                  </div>
                )}
                {showOutside && (
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      backgroundImage: `url(${useCustomBackground && customBackgroundUrl ? customBackgroundUrl : imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundColor: outsideColor,
                      opacity: 0.1,
                    }}
                  ></div>
                )}
                {!hideGuides && shape !== 'circle' && shape !== 'ellipse' && points.map(([x, y], index) => (
                  <div
                    key={index}
                    className="absolute w-6 h-6 bg-blue-500 rounded-full cursor-move touch-none"
                    style={{ 
                      left: `${((100 - width) / 2) + (x * width) / 100}%`, 
                      top: `${((100 - height) / 2) + (y * height) / 100}%`, 
                      transform: 'translate(-50%, -50%)' 
                    }}
                    onPointerDown={handlePointerDown(index)}
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={handleShuffleImage} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <RefreshCw className="h-5 w-5 mr-2" />
                Shuffle Image
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
            <Tabs defaultValue="shape" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4">
                <TabsTrigger value="shape">Shape</TabsTrigger>
                <TabsTrigger value="size">Size</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="background">Background</TabsTrigger>
              </TabsList>
              <TabsContent value="shape">
                <div>
                  <Label htmlFor="shape" className="text-white mb-2 block">Clip Path Shape</Label>
                  <Select value={shape} onValueChange={(value: Shape) => setShape(value)}>
                    <SelectTrigger id="shape" className="w-40 bg-gray-700 text-white border-gray-600 ">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent className="w-40 bg-gray-700 text-white border-gray-600">
                      <SelectItem value="triangle">Triangle</SelectItem>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="pentagon">Pentagon</SelectItem>
                      <SelectItem value="hexagon">Hexagon</SelectItem>
                      <SelectItem value="octagon">Octagon</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="ellipse">Ellipse</SelectItem>
                      <SelectItem value="invertedTriangle">Inverted Triangle</SelectItem>
                      <SelectItem value="trapezoid">Trapezoid</SelectItem>
                      <SelectItem value="invertedTrapezoid">Inverted Trapezoid</SelectItem>
                      <SelectItem value="parallelogram">Parallelogram</SelectItem>
                      <SelectItem value="rhombus">Rhombus</SelectItem>
                      <SelectItem value="bevel">Bevel</SelectItem>
                      <SelectItem value="chevronLeft">Chevron Left</SelectItem>
                      <SelectItem value="chevronRight">Chevron Right</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="size">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="width" className="text-white mb-2 block">Width: {width}%</Label>
                    <Slider
                      id="width"
                      min={0}
                      max={100}
                      step={1}
                      value={width}
                      onChange={(value) => setWidth(value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-white mb-2 block">Height: {height}%</Label>
                    <Slider
                      id="height"
                      min={0}
                      max={100}
                      step={1}
                      value={height}
                      onChange={(value) => setHeight(value)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="appearance">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="opacity" className="text-white mb-2 block">Opacity: {opacity}%</Label>
                    <Slider
                      id="opacity"
                      min={0}
                      max={100}
                      step={1}
                      value={opacity}
                      onChange={(value) => setOpacity(value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-outside" className="text-white">Show Outside</Label>
                    <Switch
                      id="show-outside"
                      checked={showOutside}
                      onCheckedChange={setShowOutside}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hide-guides" className="text-white">Hide Guides and Points</Label>
                    <Switch
                      id="hide-guides"
                      checked={hideGuides}
                      onCheckedChange={setHideGuides}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="background">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-custom-background" className="text-white">Use Custom Background</Label>
                    <Switch
                      id="use-custom-background"
                      checked={useCustomBackground}
                      onCheckedChange={setUseCustomBackground}
                    />
                  </div>
                  {useCustomBackground && (
                    <div>
                      <Label htmlFor="custom-background" className="text-white mb-2 block">Custom Background Image</Label>
                      <Input
                        id="custom-background"
                        type="file"
                        accept="image/*"
                        onChange={handleCustomBackgroundUpload}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <code className="text-white whitespace-pre-wrap break-all">
                clip-path: {clipPath};
              </code>
            </div>
            <div className="mt-4 flex flex-wrap justify-end space-x-2 space-y-2 sm:space-y-0">
              <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                Reset
              </Button>
              <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Copy className="h-5 w-5 mr-2" />
                Copy CSS
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is Clip Path Generator?
          </h2>
          <p className="text-gray-300 mb-4">
            The Clip Path Generator is a visual tool designed to help developers and designers create and customize clip-path shapes. A clip-path allows you to define a portion of an element (usually an image) that should be visible, while the rest is hidden, making it perfect for creative designs and dynamic interfaces.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use Clip Path Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Select a clip-path shape from the dropdown menu in the <strong>Shape</strong> tab.</li>
            <li>Adjust the shape by dragging the blue dots for polygon shapes.</li>
            <li>Use the width and height sliders in the <strong>Size</strong> tab to control the size of the inside border.</li>
            <li>Adjust transparency using the opacity slider in the <strong>Appearance</strong> tab.</li>
            <li>Toggle "Show Outside" to highlight the area outside the clipped shape.</li>
            <li>Click "Hide Guides and Points" to remove guide lines and control points for a clean preview.</li>
            <li>Change the preview image by clicking "Shuffle Image."</li>
            <li>Upload a custom background image by enabling the "Use Custom Background" option in the <strong>Background</strong> tab.</li>
            <li>Copy the generated CSS for the clip-path or reset everything to the default settings using the <strong>Reset</strong> option.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Multiple pre-defined clip-path shapes for quick selection.</li>
            <li>Custom shape option for advanced clipping control.</li>
            <li>Interactive shape adjustment with draggable points, working seamlessly on both desktop and mobile devices.</li>
            <li>Real-time width and height sliders for precise inside border resizing.</li>
            <li>Preview of the clipped image in real-time as you make adjustments.</li>
            <li>Opacity control to adjust the transparency of the clipped section.</li>
            <li>Option to show or hide the area outside the clip-path for better visualization.</li>
            <li>Toggleable guide lines and control points for precise positioning of custom shapes.</li>
            <li>Image shuffling for quickly testing the clip-path on different images.</li>
            <li>Custom background image upload for more personalized clipping experiences.</li>
            <li>One-click CSS code generation for easy integration into your project.</li>
            <li>Reset option for restoring default settings instantly.</li>
            <li>Responsive design for use across various devices, including mobile.</li>
            <li>Tabbed interface for easy navigation of settings and options.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}