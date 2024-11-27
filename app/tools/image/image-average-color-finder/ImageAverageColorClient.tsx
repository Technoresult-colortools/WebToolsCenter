'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, X, Download, Droplet, Palette, Info, BookOpen, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Slider from "@/components/ui/Slider"
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import NextImage from 'next/image'

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
}

export default function ImageAverageColorFinder() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [averageColor, setAverageColor] = useState<Color | null>(null)
  const [dominantColors, setDominantColors] = useState<Color[]>([])
  const [sampleSize, setSampleSize] = useState(5)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dropZoneRef = useRef<HTMLLabelElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => setImageSrc(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current!
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, img.width, img.height)
        calculateColors()
      }
      img.src = imageSrc
    }
  }, [imageSrc, sampleSize])

  const calculateColors = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    let r = 0, g = 0, b = 0
    const colorMap: { [key: string]: number } = {}

    for (let i = 0; i < data.length; i += 4) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]

      const hex = rgbToHex(data[i], data[i + 1], data[i + 2])
      colorMap[hex] = (colorMap[hex] || 0) + 1
    }

    const pixelCount = data.length / 4
    const avgColor = getColorInfo(
      Math.round(r / pixelCount),
      Math.round(g / pixelCount),
      Math.round(b / pixelCount)
    )
    setAverageColor(avgColor)

    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, sampleSize)
      .map(([hex]) => {
        const rgb = hexToRgb(hex)!
        return getColorInfo(rgb.r, rgb.g, rgb.b)
      })

    setDominantColors(sortedColors)
  }

  const getColorInfo = (r: number, g: number, b: number): Color => {
    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)
    return { hex, rgb: { r, g, b }, hsl }
  }

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
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

    return {
      h: Math.round(h! * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const resetImage = () => {
    setImageSrc(null)
    setAverageColor(null)
    setDominantColors([])
  }

  const downloadColorPalette = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 500
    canvas.height = 100
    const ctx = canvas.getContext('2d')!

    const colors = [averageColor!, ...dominantColors]
    const colorWidth = canvas.width / colors.length

    colors.forEach((color, index) => {
      ctx.fillStyle = color.hex
      ctx.fillRect(index * colorWidth, 0, colorWidth, canvas.height)
    })

    const link = document.createElement('a')
    link.download = 'color-palette.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
    toast.success('Color palette downloaded successfully')
  }

  return (
    <ToolLayout
      title="Image Average Color Finder"
      description="Analyze images to find their average and dominant colors effortlessly. Perfect for designers, artists, and anyone looking to create cohesive color palettes for their projects"
    >
      <Toaster position="top-right" />
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mb-8 mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upload an Image</h2>
          {!imageSrc ? (
            <label
              ref={dropZoneRef}
              className={`flex flex-col items-center justify-center h-38 md:h-86 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 ${
                isDragging ? 'border-blue-500 bg-blue-400 bg-opacity-10' : 'border-blue-400 border-dashed'
              } cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <Upload size={38} />
              <span className="mt-2 text-base leading-normal">
                {isDragging ? 'Drop image here' : 'Select a file or drag and drop'}
              </span>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          ) : (
            <div className="relative">
              <img 
                src={imageSrc} 
                alt="Uploaded" 
                className="w-full h-48 md:h-96 object-contain bg-gray-700 rounded-lg"
              />
              <Button
                className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-1"
                onClick={resetImage}
                size="sm"
              >
                <X size={20} />
              </Button>
            </div>
          )}
        </div>

        {averageColor && (
          <div className="mt-8 bg-gray-700 rounded-lg p-4 md:p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white mb-2 md:mb-0">Color Analysis</h2>
              <Button
                onClick={downloadColorPalette}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Download size={16} className="mr-2" />
                Download Palette
              </Button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center mb-4">
              <Droplet className="w-5 h-5 mr-2 text-white" />
              <span className="font-medium text-white mr-2">Average Color:</span>
              <div
                className="w-6 h-6 rounded mr-2"
                style={{ backgroundColor: averageColor.hex }}
              ></div>
              <span className="text-white">{averageColor.hex}</span>
            </div>
            <div>
              <p className="text-gray-300 text-sm">
                RGB: {averageColor.rgb.r}, {averageColor.rgb.g}, {averageColor.rgb.b}
              </p>
              <p className="text-gray-300 text-sm">
                HSL: {averageColor.hsl.h}°, {averageColor.hsl.s}%, {averageColor.hsl.l}%
              </p>
            </div>
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Palette className="w-5 h-5 inline-block mr-2 text-white" />
                <span className="font-medium text-white">Dominant Colors:</span>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {dominantColors.map((color, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <span className="text-xs mt-1 text-white">{color.hex}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="sample-size" className="block text-sm font-medium text-white mb-1">
                Number of Dominant Colors: {sampleSize}
              </label>
              <Slider
                id="sample-size"
                min={1}
                max={10}
                step={1}
                value={sampleSize}
                onChange={(value) => setSampleSize(value)}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* About section remains unchanged */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Image Average Color Finder?
        </h2>
        <p className="text-gray-300 mb-4">
          The Image Average Color Finder is a powerful tool designed to analyze images and extract their color information. It calculates the average color of the entire image and identifies the dominant colors present. This tool is invaluable for designers, artists, and anyone working with color palettes in their projects.
        </p>
        <p className="text-gray-300 mb-4">
          Whether you're a professional designer looking to create cohesive color schemes, a digital artist seeking inspiration, or just someone curious about the colors in your favorite images, our Image Average Color Finder provides you with detailed color information and easy-to-use features.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/ImageAverageColorPreview.png?height=400&width=600" 
            alt="Screenshot of the Image Average Color Finder interface showing image upload area and color analysis results" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Image Average Color Finder?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Upload an image by dragging and dropping it into the designated area or by clicking to browse your files.</li>
          <li>Once your image is uploaded, the tool will automatically calculate the average color and identify dominant colors.</li>
          <li>View the average color displayed with its HEX, RGB, and HSL values.</li>
          <li>Explore the dominant colors extracted from the image.</li>
          <li>Adjust the number of dominant colors displayed using the slider (1-10 colors).</li>
          <li>Download the color palette as an image file for use in other applications.</li>
          <li>To analyze a different image, simply upload a new one or use the reset button.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Accurate calculation of the average color from uploaded images</li>
          <li>Identification and display of dominant colors in the image</li>
          <li>Adjustable number of dominant colors (1-10) for detailed analysis</li>
          <li>Color information provided in HEX, RGB, and HSL formats</li>
          <li>Downloadable color palette for easy integration with other tools</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Real-time updates as you adjust the number of dominant colors</li>
          <li>Simple and intuitive user interface for effortless color analysis</li>
          <li>Drag and drop functionality for easy image uploading</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Graphic Design:</strong> Extract color palettes from inspirational images for use in designs.</li>
          <li><strong>Web Design:</strong> Analyze website screenshots to create cohesive color schemes.</li>
          <li><strong>Digital Art:</strong> Find the perfect color balance for digital paintings and illustrations.</li>
          <li><strong>Photography:</strong> Understand the color composition of photographs for editing and retouching.</li>
          <li><strong>Branding:</strong> Ensure consistent color usage across various brand materials.</li>
          <li><strong>Interior Design:</strong> Extract color palettes from room photos for decoration ideas.</li>
          <li><strong>Fashion:</strong> Analyze clothing and accessory colors to create matching outfits.</li>
          <li><strong>Education:</strong> Teach color theory and analysis in art and design courses.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to explore the colors in your images? Start using our Image Average Color Finder tool now and unlock the power of color analysis for your projects. Whether you're working on a professional design or just curious about the colors in your favorite photos, our tool provides the insights you need. Try it out and see how it can enhance your color selection process and inspire your creative work!
        </p>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </ToolLayout>
  )
}