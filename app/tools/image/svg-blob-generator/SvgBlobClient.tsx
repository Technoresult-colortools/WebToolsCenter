'use client'
import React, { useState, useEffect, useRef } from 'react'
import Slider from "@/components/ui/Slider"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shuffle, Download, Info, Palette, Sliders, FileImage } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Toaster, toast } from 'react-hot-toast'


type Point = [number, number];

export default function SVGBlobGenerator() {
  const [fillColor, setFillColor] = useState('#474bff')
  const [growth, setGrowth] = useState(15)
  const [edgeCount, setEdgeCount] = useState(6)
  const [complexity, setComplexity] = useState(0.5)
  const [smoothness, setSmoothness] = useState(0.5)
  const [useImageBackground, setUseImageBackground] = useState(false)
  const [backgroundUrl, setBackgroundUrl] = useState('https://picsum.photos/seed/1/600/400')
  const [svgPath, setSvgPath] = useState('')
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    generateBlob()
  }, [growth, edgeCount, complexity, smoothness])

  const generateBlob = () => {
    const points: Point[] = []
    const angleStep = (Math.PI * 2) / edgeCount
    const baseRadius = 50 + growth * 2 // Increased base radius
    const maxRadius = 180 // Increased max radius

    for (let i = 0; i < edgeCount; i++) {
      const angle = i * angleStep
      const radius = Math.min(baseRadius + (Math.random() - 0.5) * growth * 3, maxRadius)
      const wobble = Math.sin(angle * complexity * 8) * growth * 0.5
      const x = Math.cos(angle) * (radius + wobble) + 200 // Centered at 200,200
      const y = Math.sin(angle) * (radius + wobble) + 200
      points.push([x, y])
    }

    const smoothPoints: Point[] = []
    const smoothFactor = smoothness * 0.5

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      const prevPoint = points[(i - 1 + points.length) % points.length]
      const nextPoint = points[(i + 1) % points.length]

      const smoothX = point[0] + (nextPoint[0] - prevPoint[0]) * smoothFactor
      const smoothY = point[1] + (nextPoint[1] - prevPoint[1]) * smoothFactor

      smoothPoints.push([smoothX, smoothY])
    }

    const path = `M${smoothPoints[0][0]},${smoothPoints[0][1]} ${smoothPoints.map((point, i) => {
      const nextPoint = smoothPoints[(i + 1) % smoothPoints.length]
      const midX = (point[0] + nextPoint[0]) / 2
      const midY = (point[1] + nextPoint[1]) / 2
      return `Q${point[0]},${point[1]} ${midX},${midY}`
    }).join(' ')} Z`

    setSvgPath(path)
  }

  const handleGrowthChange = (value: number) => {
    setGrowth(value)
  }

  const handleEdgeCountChange = (value: number) => {
    setEdgeCount(value)
  }

  const handleComplexityChange = (value: number) => {
    setComplexity(value)
  }

  const handleSmoothnessChange = (value: number) => {
    setSmoothness(value)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFillColor(e.target.value)
  }

  const handleBackgroundUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundUrl(e.target.value)
  }

  const handleShuffle = () => {
    generateBlob()
    toast.success('New blob shape generated!')
  }

  const handleShuffleImage = () => {
    const randomId = Math.floor(Math.random() * 1000)
    setBackgroundUrl(`https://picsum.photos/seed/${randomId}/600/400`)
    toast.success('New background image applied!')
  }

  const handleExport = (format: 'svg' | 'png') => {
    if (format === 'svg') {
      const svgContent = `
        <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="blob-shape">
              <path d="${svgPath}" />
            </clipPath>
          </defs>
          ${useImageBackground ? `
            <image href="${backgroundUrl}" width="400" height="400" clip-path="url(#blob-shape)" preserveAspectRatio="xMidYMid slice" />
          ` : `
            <path d="${svgPath}" fill="${fillColor}" />
          `}
        </svg>
      `
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'blob.svg'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('SVG exported successfully!')
    } else if (format === 'png') {
      if (svgRef.current) {
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 400
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image()
          const svgData = new XMLSerializer().serializeToString(svgRef.current)
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
            const pngUrl = canvas.toDataURL('image/png')
            const a = document.createElement('a')
            a.href = pngUrl
            a.download = 'blob.png'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            toast.success('PNG exported successfully!')
          }
          img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
        }
      }
    }
  }

  return (
    <ToolLayout
      title="SVG Blob Generator"
      description="Create unique, organic blob shapes with ease, perfect for enhancing your designs with customizable parameters and real-time previews"
    >

    <Toaster position="top-right" />

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-center">
              <svg ref={svgRef} width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="blob-shape">
                    <path d={svgPath} />
                  </clipPath>
                </defs>
                {useImageBackground ? (
                  <image href={backgroundUrl} width="400" height="400" clipPath="url(#blob-shape)" preserveAspectRatio="xMidYMid slice" />
                ) : (
                  <path d={svgPath} fill={fillColor} />
                )}
              </svg>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="fillColor">Blob Fill Color</Label>
                <div className="flex items-center space-x-2 ">
                  <Input
                    id="fillColor"
                    type="color"
                    value={fillColor}
                    onChange={handleColorChange}
                    className="w-12 h-12 p-1bg-transparent"
                  />
                  <Input
                    type="text"
                    value={fillColor}
                    onChange={handleColorChange}
                    className="flex-grow text-black"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="growth">Growth: {growth}</Label>
                <Slider
                  id="growth"
                  min={0}
                  max={50}
                  step={1}
                  value={growth}
                  onChange={handleGrowthChange}
                  
                />
              </div>
              
              <div>
                <Label htmlFor="edgeCount">Edge Count: {edgeCount}</Label>
                <Slider
                  id="edgeCount"
                  min={3}
                  max={20}
                  step={1}
                  value={edgeCount}
                  onChange={handleEdgeCountChange}
                />
              </div>

              <div>
                <Label htmlFor="complexity">Complexity: {complexity.toFixed(2)}</Label>
                <Slider
                  id="complexity"
                  min={0}
                  max={1}
                  step={0.01}
                  value={complexity}
                  onChange={handleComplexityChange}
                />
              </div>

              <div>
                <Label htmlFor="smoothness">Smoothness: {smoothness.toFixed(2)}</Label>
                <Slider
                  id="smoothness"
                  min={0}
                  max={1}
                  step={0.01}
                  value={smoothness}
                  onChange={handleSmoothnessChange}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="useImageBackground"
                  checked={useImageBackground}
                  onCheckedChange={setUseImageBackground}
                />
                <Label htmlFor="useImageBackground">Use Image Background</Label>
              </div>
              
              {useImageBackground && (
                <div>
                  <Label htmlFor="backgroundUrl">Background URL</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="backgroundUrl"
                      type="text"
                      value={backgroundUrl}
                      onChange={handleBackgroundUrlChange}
                      className="flex-grow"
                    />
                    <Button onClick={handleShuffleImage}>Random Image</Button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap space-x-4">
                <Button onClick={handleShuffle} className="flex-1 min-w-[150px] flex items-center justify-center px-6 py-3 space-x-2 mb-2">
                    <Shuffle className="h-4 w-4" />
                    <span>Shuffle Blob</span>
                </Button>
                <Button onClick={() => handleExport('svg')} className="flex-1 min-w-[150px] flex items-center justify-center px-6 py-3 space-x-2 mb-2">
                    <Download className="h-4 w-4" />
                    <span>Export SVG</span>
                </Button>
                <Button onClick={() => handleExport('png')} className="flex-1 min-w-[150px] flex items-center justify-center px-6 py-3 space-x-2 mb-2">
                    <Download className="h-4 w-4" />
                    <span>Export PNG</span>
                </Button>
            </div>


            </div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is the SVG Blob Generator?
          </h2>
          <p className="text-gray-300 mb-4">
            The SVG Blob Generator is a versatile and powerful tool that allows users to create customizable, organic blob shapes for various design and illustration purposes. Whether you're a designer, developer, or digital artist, this tool provides an intuitive interface to craft unique, abstract shapes that can enhance your visual projects.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Sliders className="w-6 h-6 mr-2" />
            Features of SVG Blob Generator
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Adjustable parameters: growth, edge count, complexity, and smoothness</li>
            <li>Custom fill color or image background option</li>
            <li>Real-time preview of your blob design</li>
            <li>Export your blob in SVG or PNG format</li>
            <li>Randomize blob shape or background image with a single click</li>
            <li>Responsive design for desktop and mobile use</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Palette className="w-6 h-6 mr-2" />
            How to Use SVG Blob Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Adjust the sliders for growth, edge count, complexity, and smoothness to shape your blob.</li>
            <li>Use the color picker to select your blob's fill color or enter a custom hex code.</li>
            <li>Enable "Use Image Background" to overlay a background image within the blob shape.</li>
            <li>Click "Shuffle Blob" to randomize the blob shape or "Shuffle Image" to change the background.</li>
            <li>Preview your blob in real-time as you make adjustments.</li>
            <li>When satisfied with the design, click "Export SVG" or "Export PNG" to download your blob.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Download className="w-6 h-6 mr-2" />
            Export Options
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>SVG (Scalable Vector Graphics): Ideal for web use and scalable designs</li>
            <li>PNG (Portable Network Graphics): Perfect for high-resolution raster images</li>
            <li>Custom dimensions available for PNG export</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Shuffle className="w-6 h-6 mr-2" />
            Randomization Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>"Shuffle Blob" generates a new random blob shape</li>
            <li>"Shuffle Image" selects a new random background image (when image background is enabled)</li>
            <li>Quick inspiration for new designs with a single click</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <FileImage className="w-6 h-6 mr-2" />
            Image Background Feature
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Upload your own image or use provided stock images</li>
            <li>Image is automatically cropped and fitted within the blob shape</li>
            <li>Combine custom shapes with images for unique visual effects</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Tips and Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Use higher growth settings to create more dynamic and abstract shapes.</li>
            <li>Edge count controls the complexity of the shape – higher values create more intricate blobs.</li>
            <li>Play with smoothness for either sharp or smooth transitions between edges.</li>
            <li>Combine low edge count with high complexity for interesting, organic shapes.</li>
            <li>Experiment with image backgrounds for creative masking effects.</li>
            <li>Use the randomize features to quickly generate new ideas.</li>
            <li>Export in SVG for scalable graphics, ideal for responsive web design.</li>
            <li>Use PNG export for high-resolution images suitable for print or detailed digital art.</li>
          </ul>
        </div>
  </ToolLayout>
  )
}