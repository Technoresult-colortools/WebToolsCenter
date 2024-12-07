'use client'

import React, { useState, useEffect, useRef } from 'react'
import Slider from "@/components/ui/Slider"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Shuffle, Download, Info, Palette, Sliders, FileImage, Code, BookOpen, Lightbulb, Eye } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Toaster, toast } from 'react-hot-toast'
import NextImage from 'next/image'

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
    const baseRadius = 50 + growth * 2
    const maxRadius = 180

    for (let i = 0; i < edgeCount; i++) {
      const angle = i * angleStep
      const radius = Math.min(baseRadius + (Math.random() - 0.5) * growth * 3, maxRadius)
      const wobble = Math.sin(angle * complexity * 8) * growth * 0.5
      const x = Math.cos(angle) * (radius + wobble) + 200
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

  const getSVGContent = () => {
    return `
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
  }

  const handleExport = (format: 'svg' | 'png' | 'code') => {
    if (format === 'svg' || format === 'code') {
      const svgContent = getSVGContent()
      if (format === 'svg') {
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
      } else {
        navigator.clipboard.writeText(svgContent)
        toast.success('SVG code copied to clipboard!')
      }
    } else if (format === 'png') {
      if (svgRef.current) {
        const svgData = new XMLSerializer().serializeToString(svgRef.current)
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 400
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const img = new Image()
          img.onload = () => {
            ctx.drawImage(img, 0, 0)
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'blob.png'
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
                toast.success('PNG exported successfully!')
              }
            }, 'image/png')
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
                className="w-12 h-12 p-1 bg-transparent"
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
            <Button onClick={() => handleExport('code')} className="flex-1 min-w-[150px] flex items-center justify-center px-6 py-3 space-x-2 mb-2">
              <Code className="h-4 w-4" />
              <span>Copy SVG Code</span>
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
          The SVG Blob Generator is a powerful and user-friendly tool designed to create unique, organic blob shapes for various design purposes. Whether you're a web designer, graphic artist, or just someone looking to add a touch of creativity to your projects, this tool provides an intuitive interface to craft custom, scalable vector graphics with ease.
        </p>
        <p className="text-gray-300 mb-4">
          With a range of adjustable parameters and real-time preview, you can fine-tune your blob shapes to perfectly fit your design needs. The generator offers options for solid color fills or image backgrounds, allowing for versatile applications in web design, digital art, and more.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/SVGBlobPreview.png?height=400&width=600" 
            alt="Screenshot of the SVG Blob Generator interface showing blob customization options and a preview" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the SVG Blob Generator
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Adjust the "Growth" slider to control the overall size and expansion of the blob.</li>
          <li>Use the "Edge Count" slider to determine the number of points that form the blob's shape.</li>
          <li>Modify "Complexity" to add more intricate details and variations to the blob's edges.</li>
          <li>Adjust "Smoothness" to control how rounded or sharp the blob's curves appear.</li>
          <li>Choose a fill color using the color picker or enter a hex code for precise color selection.</li>
          <li>Toggle "Use Image Background" to fill the blob with an image instead of a solid color.</li>
          <li>If using an image background, enter a URL or click "Random Image" for variety.</li>
          <li>Click "Shuffle Blob" to generate a new random shape based on your current settings.</li>
          <li>Use the export options to download your blob as an SVG or PNG file, or copy the SVG code.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><Sliders className="w-4 h-4 inline-block mr-1" /> <strong>Customizable Parameters:</strong> Fine-tune growth, edge count, complexity, and smoothness</li>
          <li><Palette className="w-4 h-4 inline-block mr-1" /> <strong>Color Options:</strong> Choose any color for your blob or use an image background</li>
          <li><FileImage className="w-4 h-4 inline-block mr-1" /> <strong>Image Background:</strong> Fill your blob with images for unique effects</li>
          <li><Shuffle className="w-4 h-4 inline-block mr-1" /> <strong>Randomization:</strong> Quickly generate new shapes and apply random background images</li>
          <li><Download className="w-4 h-4 inline-block mr-1" /> <strong>Multiple Export Options:</strong> Save as SVG, PNG, or copy the SVG code directly</li>
          <li><Code className="w-4 h-4 inline-block mr-1" /> <strong>SVG Code Access:</strong> Get the raw SVG code for easy integration into your projects</li>
          <li><Eye className="w-4 h-4 inline-block mr-1" /> <strong>Real-time Preview:</strong> See changes instantly as you adjust parameters</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Creative Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Combine low edge count with high complexity for interesting, organic shapes.</li>
          <li>Use high smoothness for cloud-like blobs, or low smoothness for more abstract designs.</li>
          <li>Experiment with image backgrounds for creative masking effects in your designs.</li>
          <li>Generate multiple blobs with similar settings for a cohesive design language.</li>
          <li>Layer multiple SVG blobs with different opacities for depth and texture in your designs.</li>
          <li>Use the SVG code to create animated blobs in web projects using CSS or JavaScript.</li>
          <li>Combine blob shapes with text for unique logo designs or headers.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Design:</strong> Create unique background elements, headers, or section dividers</li>
          <li><strong>Graphic Design:</strong> Design abstract logos, icons, or decorative elements</li>
          <li><strong>Digital Art:</strong> Use as a base for digital illustrations or abstract art pieces</li>
          <li><strong>UI/UX Design:</strong> Craft organic shapes for buttons, avatars, or layout elements</li>
          <li><strong>Presentations:</strong> Add visual interest to slides with custom blob shapes</li>
          <li><strong>Social Media:</strong> Create eye-catching graphics for posts or profile pictures</li>
          <li><strong>Print Design:</strong> Incorporate organic shapes into brochures, posters, or packaging designs</li>
          <li><strong>Educational Materials:</strong> Use blobs to create engaging visuals for learning resources</li>
        </ul>

        <p className="text-gray-300 mt-6">
          Ready to unleash your creativity with unique, organic shapes? Our SVG Blob Generator offers endless possibilities for your design projects. Whether you're creating web graphics, digital art, or print materials, this tool provides the flexibility and ease of use you need to bring your ideas to life. Start experimenting with blob shapes now and elevate your designs to the next level!
        </p>
      </div>
    </ToolLayout>
  )
}