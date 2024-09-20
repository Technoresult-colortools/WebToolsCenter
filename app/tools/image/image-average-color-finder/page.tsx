'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, X, Download, Droplet, Palette } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImageSrc(e.target?.result as string)
      reader.readAsDataURL(file)
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
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image Average Color Finder</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mb-2 mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Upload an Image</h2>
            {!imageSrc ? (
              <label className="flex flex-col items-center justify-center h-96 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
                <Upload size={48} />
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            ) : (
              <div className="relative">
                <img 
                  src={imageSrc} 
                  alt="Uploaded" 
                  className="w-full h-96 object-contain bg-gray-700 rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600 transition duration-300"
                  onClick={resetImage}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {averageColor && (
            <div className="mt-8 bg-gray-700 rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Color Analysis</h2>
                <button
                  onClick={downloadColorPalette}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Download Palette
                </button>
              </div>
              <div className="flex items-center mb-4">
                <Droplet className="w-5 h-5 mr-2 text-white" />
                <span className="font-medium text-white">Average Color:</span>
                <div
                  className="w-6 h-6 rounded ml-2"
                  style={{ backgroundColor: averageColor.hex }}
                ></div>
                <span className="ml-2 text-white">{averageColor.hex}</span>
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
                <div className="grid grid-cols-5 gap-2 mt-2">
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
                <label htmlFor="sample-size" className="block text-sm font-medium text-white">
                  Number of Dominant Colors
                </label>
                <input
                  type="range"
                  id="sample-size"
                  min="1"
                  max="10"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number(e.target.value))}
                  className="mt-1 w-full"
                />
                <span className="text-sm text-white">{sampleSize}</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About Image Average Color Finder</h2>
              <p className="text-white">
                The Image Average Color Finder tool allows you to upload an image and analyze its colors. 
                It calculates the average color of the entire image and identifies the most dominant colors. 
                This tool is useful for designers, artists, and anyone working with color palettes.
              </p>          
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Upload the Image?</h2>
              <p className="text-white">
                To upload an image, click on the designated area to browse and select your image from your device.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
              <p className="text-white">
                After uploading your image, the tool will automatically calculate the average color and identify the dominant colors. 
                You can adjust the number of dominant colors displayed using the slider. 
                The color information is provided in HEX, RGB, and HSL formats. 
                Use the "Download Palette" button to save the color palette as an image file.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  )
}