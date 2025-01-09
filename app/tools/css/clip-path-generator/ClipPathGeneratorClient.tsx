'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select } from './select1';
import Slider from "@/components/ui/Slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Info, BookOpen, Lightbulb, ShapesIcon, ShrinkIcon, EyeIcon, ImageIcon, Triangle, Square, Pentagon, Hexagon, Octagon, Circle, EllipsisIcon, ChevronLeft, ChevronRight, ArrowLeft, ArrowRight, Plus, X, Star, MessageSquare, Heart, Shapes } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'


type Shape = 'triangle' | 'rectangle' | 'pentagon' | 'hexagon' | 'octagon' | 'circle' | 'ellipse' | 'custom' | 
             'invertedTriangle' | 'trapezoid' | 'invertedTrapezoid' | 'parallelogram' | 'rhombus' | 'bevel' | 
             'chevronLeft' | 'chevronRight' | 'arrowheadLeft' | 'arrowheadRight' | 'arrowLeft' | 'arrowRight' |
             'plus' | 'cross' | 'star' | 'messageBox' | 'heart' | 'diamond';

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
  chevronRight: [[0, 0], [50, 0], [100, 50], [50, 100], [0, 100], [50, 50]],
  arrowheadLeft: [[100, 0], [75, 50], [100, 100], [0, 50]], 
  arrowheadRight: [[0, 0], [100, 50], [0, 100], [25, 50]], 
  arrowLeft: [[0, 50], [50, 0], [50, 30], [100, 30], [100, 70], [50, 70], [50, 100]],
  arrowRight: [[100, 50], [50, 0], [50, 30], [0, 30], [0, 70], [50, 70], [50, 100]],
  plus: [[40, 0], [60, 0], [60, 40], [100, 40], [100, 60], [60, 60], [60, 100], [40, 100], [40, 60], [0, 60], [0, 40], [40, 40]],
  cross: [[20, 0], [40, 0], [40, 20], [60, 20], [60, 0], [80, 0], [80, 20], [100, 20], [100, 40], [80, 40], [80, 60], [100, 60], [100, 80], [80, 80], [80, 100], [60, 100], [60, 80], [40, 80], [40, 100], [20, 100], [20, 80], [0, 80], [0, 60], [20, 60], [20, 40], [0, 40], [0, 20], [20, 20]],
  star: [[50, 0], [61, 35], [98, 35], [68, 57], [79, 91], [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]],
  messageBox: [[0, 0], [100, 0], [100, 75], [30, 75], [10, 100], [10, 75], [0, 75]],
  heart: [[30, 0], [50, 15], [70, 0], [90, 10], [100, 35], [80, 70], [50, 100], [20, 70], [0, 35], [10, 10]],
  diamond: [[25, 0], [75, 0], [100, 25], [50, 100], [0, 25]]
};

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

  const ShapeIcon = ({ shape }: { shape: Shape }) => {
    switch (shape) {
      case 'triangle': return <Triangle className="w-4 h-4" />;
      case 'rectangle': return <Square className="w-4 h-4" />;
      case 'pentagon': return <Pentagon className="w-4 h-4" />;
      case 'hexagon': return <Hexagon className="w-4 h-4" />;
      case 'octagon': return <Octagon className="w-4 h-4" />;
      case 'circle': return <Circle className="w-4 h-4" />;
      case 'ellipse': return <EllipsisIcon className="w-4 h-4" />;
      case 'invertedTriangle': return <Triangle className="w-4 h-4 transform rotate-180" />;
      case 'trapezoid': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M4 18L8 6h8l4 12H4z" />
        </svg>
      );
      case 'invertedTrapezoid': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M4 6l4 12h8l4-12H4z" />
        </svg>
      );
      case 'parallelogram': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M6 18l4-12h8l-4 12H6z" />
        </svg>
      );
      case 'rhombus': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M12 2l10 10-10 10L2 12 12 2z" />
        </svg>
      );
      case 'bevel': return <Octagon className="w-4 h-4" />;
      case 'chevronLeft': return <ChevronLeft className="w-4 h-4" />;
      case 'chevronRight': return <ChevronRight className="w-4 h-4" />;
      case 'arrowheadLeft': return <ChevronLeft className="w-4 h-4" />;
      case 'arrowheadRight': return <ChevronRight className="w-4 h-4" />;
      case 'arrowLeft': return <ArrowLeft className="w-4 h-4" />;
      case 'arrowRight': return <ArrowRight className="w-4 h-4" />;
      case 'plus': return <Plus className="w-4 h-4" />;
      case 'cross': return <X className="w-4 h-4" />;
      case 'star': return <Star className="w-4 h-4" />;
      case 'messageBox': return <MessageSquare className="w-4 h-4" />;
      case 'heart': return <Heart className="w-4 h-4" />;
      case 'diamond': return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M12 2l10 10-10 10L2 12 12 2z" />
        </svg>
      );
      default: return <Shapes className="w-4 h-4" />;
    }
  };


  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false
    activePointIndex.current = -1
    if (previewRef.current) {
      previewRef.current.releasePointerCapture(e.pointerId)
    }
  }

  return (
    <ToolLayout
      title="CSS Clip Path Generator"
      description="Create and customize clip-path shapes"
    >

    <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Clip Path Preview</h2>
              
                <div 
                  ref={previewRef}
                  className="relative rounded-lg overflow-hidden touch-none border-4 border-gray-700"
                  style={{ width: '100%', paddingBottom: '50.00%'}}
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
                    {!hideGuides && shape !== 'circle' && shape !== 'ellipse' && points && points.length > 0 && points.map(([x, y], index) => (
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
              <TabsList className="grid w-full grid-cols-4 gap-2 mb-4">
                <TabsTrigger value="shape" className="flex items-center justify-center">
                  <ShapesIcon className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Shape</span>
                </TabsTrigger>
                <TabsTrigger value="size" className="flex items-center justify-center">
                  <ShrinkIcon className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Size</span>
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center justify-center">
                  <EyeIcon className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="background" className="flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Background</span>
                </TabsTrigger>
              </TabsList>
                <TabsContent value="shape">
                <div className="mt-4">
                  <Label htmlFor="shape" className="text-white mb-2 block">Clip Path Shape</Label>
                  <Select
                    label="Select Shape"
                    selectedKey={shape}
                    onSelectionChange={(value: Shape) => setShape(value)}
                    placeholder="Select shape"
                    className="w-full sm:w-64"
                    options={[
                      {
                        value: "group-basic",
                        label: "Basic Shapes",
                        isLabel: true
                      },
                      {
                        value: "triangle",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="triangle" />
                            <span>Triangle</span>
                          </div>
                        )
                      },
                      {
                        value: "rectangle",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="rectangle" />
                            <span>Rectangle</span>
                          </div>
                        )
                      },
                      {
                        value: "circle",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="circle" />
                            <span>Circle</span>
                          </div>
                        )
                      },
                      {
                        value: "ellipse",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="ellipse" />
                            <span>Ellipse</span>
                          </div>
                        )
                      },
                      {
                        value: "group-polygons",
                        label: "Polygons",
                        isLabel: true
                      },
                      {
                        value: "pentagon",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="pentagon" />
                            <span>Pentagon</span>
                          </div>
                        )
                      },
                      {
                        value: "hexagon",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="hexagon" />
                            <span>Hexagon</span>
                          </div>
                        )
                      },
                      {
                        value: "octagon",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="octagon" />
                            <span>Octagon</span>
                          </div>
                        )
                      },
                      {
                        value: "group-arrows",
                        label: "Arrows",
                        isLabel: true
                      },
                      {
                        value: "chevronLeft",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="chevronLeft" />
                            <span>Chevron Left</span>
                          </div>
                        )
                      },
                      {
                        value: "chevronRight",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="chevronRight" />
                            <span>Chevron Right</span>
                          </div>
                        )
                      },
                      {
                        value: "arrowLeft",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="arrowLeft" />
                            <span>Arrow Left</span>
                          </div>
                        )
                      },
                      {
                        value: "arrowRight",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="arrowRight" />
                            <span>Arrow Right</span>
                          </div>
                        )
                      },
                      {
                        value: "group-special",
                        label: "Special Shapes",
                        isLabel: true
                      },
                      {
                        value: "star",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="star" />
                            <span>Star</span>
                          </div>
                        )
                      },
                      {
                        value: "heart",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="heart" />
                            <span>Heart</span>
                          </div>
                        )
                      },
                      {
                        value: "messageBox",
                        label: (
                          <div className="flex items-center gap-2">
                            <ShapeIcon shape="messageBox" />
                            <span>Message Box</span>
                          </div>
                        )
                      },
                      {
                        value: "group-other",
                        label: "Other",
                        isLabel: true
                      },
                      {
                        value: "custom",
                        label: (
                          <div className="flex items-center gap-2">
                            <Shapes className="w-4 h-4" />
                            <span>Custom</span>
                          </div>
                        )
                      }
                    ]}
                  />
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
                <Button onClick={handleReset} variant="destructive" className="text-white border-white hover:bg-gray-700">
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
              What is the Clip Path Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              Imagine you're a digital artist with a magical pair of scissors that can cut any shape out of an image. That's essentially what our <Link href="#how-to-use" className="text-blue-400 hover:underline">Clip Path Generator</Link> does! It's a fun and intuitive tool that lets you create custom shapes to reveal parts of an image while hiding others. Whether you're a web designer looking to add some flair to your site or a developer trying to create unique UI elements, this tool is your new best friend.
            </p>
            <p className="text-gray-300 mb-4">
              With the Clip Path Generator, you can transform boring rectangles into exciting polygons, turn square profile pictures into perfect circles, or even create complex custom shapes that bring your creative vision to life. It's like having a digital exacto knife that never gets dull!
            </p>

            <div className="my-8">
              <Image 
                src="/Images/ClipPathPreview.png?height=400&width=600" 
                alt="Screenshot of the Clip Path Generator interface showing various shape options and controls" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>

            <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Clip Path Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              Using our Clip Path Generator is as easy as pie. Here's a step-by-step guide to get you started:
            </p>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>First, head over to the <strong>Shape</strong> tab and pick your poison. We've got a whole geometry set including:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Basic shapes: <Link href="#triangle" className="text-blue-400 hover:underline">triangle</Link>, <Link href="#rectangle" className="text-blue-400 hover:underline">rectangle</Link>, <Link href="#circle" className="text-blue-400 hover:underline">circle</Link>, and <Link href="#ellipse" className="text-blue-400 hover:underline">ellipse</Link></li>
                  <li>Polygons: <Link href="#pentagon" className="text-blue-400 hover:underline">pentagon</Link>, <Link href="#hexagon" className="text-blue-400 hover:underline">hexagon</Link>, and <Link href="#octagon" className="text-blue-400 hover:underline">octagon</Link></li>
                  <li>Quadrilaterals: <Link href="#trapezoid" className="text-blue-400 hover:underline">trapezoid</Link>, <Link href="#parallelogram" className="text-blue-400 hover:underline">parallelogram</Link>, and <Link href="#rhombus" className="text-blue-400 hover:underline">rhombus</Link></li>
                  <li>Arrows: <Link href="#chevron" className="text-blue-400 hover:underline">chevron</Link> (left and right), <Link href="#arrow" className="text-blue-400 hover:underline">arrow</Link> (left and right)</li>
                  <li>Special shapes: <Link href="#star" className="text-blue-400 hover:underline">star</Link>, <Link href="#heart" className="text-blue-400 hover:underline">heart</Link>, <Link href="#message-box" className="text-blue-400 hover:underline">message box</Link>, <Link href="#cross" className="text-blue-400 hover:underline">cross</Link>, and <Link href="#plus" className="text-blue-400 hover:underline">plus</Link></li>
                  <li>And for the adventurous, a <Link href="#custom" className="text-blue-400 hover:underline">custom</Link> option!</li>
                </ul>
              </li>
              <li>See those blue dots? They're not just for show. Grab 'em and drag 'em to sculpt your shape. It's like playing with digital play-doh!</li>
              <li>Want to supersize or shrink your creation? The <strong>Size</strong> tab is your friend. Slide those width and height controls and watch your shape transform.</li>
              <li>Feeling a bit transparent? Pop over to the <strong>Appearance</strong> tab and play with the opacity. It's like adjusting the volume, but for visibility!</li>
              <li>Curious about what's outside the box? Toggle "Show Outside" and peek behind the curtain.</li>
              <li>Need a cleaner view? Hit "Hide Guides and Points" and watch those blue dots disappear like magic.</li>
              <li>Bored with the current image? Give "Shuffle Image" a click and watch the background change faster than a chameleon on a disco floor.</li>
              <li>Got a specific image in mind? Head to the <strong>Background</strong> tab, enable "Use Custom Background," and upload your masterpiece.</li>
              <li>Happy with your creation? Hit that "Copy CSS" button and paste the code into your project. It's like teleporting your design straight into your website!</li>
              <li>Made a mess? No worries! The <strong>Reset</strong> button is like a digital eraser. One click, and you're back to square one (or triangle one, if that's your starting shape).</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features That'll Make You Go "Wow!"
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>A smorgasbord of pre-defined shapes: From simple circles to complex stars, we've got shapes that'll make geometry teachers proud.</li>
              <li>Feeling artistic? Our custom shape option lets you channel your inner Picasso.</li>
              <li>Interactive shape tweaking: Drag those points around like you're conducting a symphony of shapes.</li>
              <li>Real-time preview: Watch your creation come to life faster than you can say "clip-path"!</li>
              <li>Opacity control: Because sometimes, you want your images to play hide and seek.</li>
              <li>Show/hide outside areas: It's like having X-ray vision for your designs.</li>
              <li>Guide lines and control points: For when you need to be precise down to the pixel.</li>
              <li>Image roulette: Keep clicking "Shuffle Image" and turn it into a game of "Guess That Picture"!</li>
              <li>BYO Background: Upload your own images and clip them to your heart's content.</li>
              <li>One-click code copying: Because life's too short to type out CSS by hand.</li>
              <li>Reset button: For those "oops" moments or when you just want to start fresh.</li>
              <li>Responsive design: Whether you're on a giant desktop or a tiny phone, our tool fits like a glove.</li>
              <li>Tabbed interface: Navigate through options easier than changing channels on your TV.</li>
            </ul>
            <p className="text-gray-300 mt-4">
              So, what are you waiting for? Dive in, start clipping, and let your creativity run wild! Who knows? You might just create the next big thing in web design. And remember, in the world of Clip Path Generator, there are no mistakes, only happy little accidents!
            </p>
          </div>
  </ToolLayout>
  )
}