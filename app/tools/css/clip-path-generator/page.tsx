'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw,} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Shape = 'triangle' | 'rectangle' | 'pentagon' | 'hexagon' | 'octagon' | 'circle' | 'ellipse' | 'custom'

const initialShapes: Record<Shape, number[][]> = {
  triangle: [[50, 0], [100, 100], [0, 100]],
  rectangle: [[0, 0], [100, 0], [100, 100], [0, 100]],
  pentagon: [[50, 0], [100, 38], [82, 100], [18, 100], [0, 38]],
  hexagon: [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]],
  octagon: [[30, 0], [70, 0], [100, 30], [100, 70], [70, 100], [30, 100], [0, 70], [0, 30]],
  circle: [[50, 0], [100, 50], [50, 100], [0, 50]],
  ellipse: [[50, 0], [100, 50], [50, 100], [0, 50]],
  custom: [[50, 0], [100, 50], [50, 100], [0, 50]],
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
  const previewRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const activePointIndex = useRef(-1)

  useEffect(() => {
    updateClipPath()
  }, [points])

  useEffect(() => {
    setPoints(initialShapes[shape])
  }, [shape])

  const updateClipPath = () => {
    if (shape === 'circle') {
      setClipPath(`circle(50% at 50% 50%)`)
    } else if (shape === 'ellipse') {
      setClipPath(`ellipse(50% 25% at 50% 50%)`)
    } else {
      const clipPathString = `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(', ')})`
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
    setOutsidecolor('#ffffff');
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

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    isDragging.current = true
    activePointIndex.current = index
  }

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const handleMouseUp = () => {
    isDragging.current = false
    activePointIndex.current = -1
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CSS Clip Path Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Clip Path Preview</h2>
              <div 
                ref={previewRef}
                className="relative rounded-lg overflow-hidden"
                style={{ width: '100%', paddingBottom: '66.67%' }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
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
                      opacity: 0.2,
                    }}
                  ></div>
                )}
                {shape !== 'circle' && shape !== 'ellipse' && points.map(([x, y], index) => (
                  <div
                    key={index}
                    className="absolute w-3 h-3 bg-blue-500 rounded-full cursor-move"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                    onMouseDown={handleMouseDown(index)}
                  />
                ))}
              </div>
              <div className="mt-4">
                <Button onClick={handleShuffleImage} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Shuffle Image
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mt-4 text-white mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shape" className="text-white mb-2 block">Clip Path Shape</Label>
                  <Select value={shape} onValueChange={(value: Shape) => setShape(value)}>
                    <SelectTrigger id="shape" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="triangle">Triangle</SelectItem>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="pentagon">Pentagon</SelectItem>
                      <SelectItem value="hexagon">Hexagon</SelectItem>
                      <SelectItem value="octagon">Octagon</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="ellipse">Ellipse</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                  <Label htmlFor="hide-guides" className="text-white">Hide Guides</Label>
                  <Switch
                    id="hide-guides"
                    checked={hideGuides}
                    onCheckedChange={setHideGuides}
                  />
                </div>

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
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <code className="text-white whitespace-pre-wrap break-all">
                clip-path: {clipPath};
              </code>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
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

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Select a clip-path shape from the dropdown menu.</li>
            <li>Adjust the shape by dragging the blue dots (for polygon shapes).</li>
            <li>Use the opacity slider to adjust the transparency of the clipped image.</li>
            <li>Toggle "Show Outside" to highlight the clipped area.</li>
            <li>Use "Hide Guides" to remove the guide lines from the preview.</li>
            <li>Click "Shuffle Image" to change the preview image.</li>
            <li>Enable "Use Custom Background" to upload your own image.</li>
            <li>Copy the generated CSS or reset to default settings.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Multiple pre-defined clip-path shapes (triangle, rectangle, pentagon, hexagon, octagon, circle, ellipse)</li>
            <li>Custom shape option for advanced clipping</li>
            <li>Interactive shape adjustment with draggable points</li>
            <li>Real-time preview of the clipped image</li>
            <li>Opacity control for the clipped area</li>
            <li>Option to show/hide the area outside the clip-path</li>
            <li>Toggleable guide lines for precise positioning</li>
            <li>Image shuffling for quick visualization with different images</li>
            <li>Custom background image upload</li>
            <li>Generated CSS code with one-click copy functionality</li>
            <li>Reset option to quickly return to default settings</li>
            <li>Responsive design for use on various devices</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}