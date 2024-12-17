'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, X, ImageIcon, ZoomIn, ZoomOut, BookOpen, Lightbulb, Info, Link2, Check, Maximize2, Sliders, AlertTriangle, Shield, Settings, Palette } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import Slider from "@/components/ui/Slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const filters = [
  // Original filters
  'Normal', 'Clarendon', 'Gingham', 'Moon', 'Lark', 'Reyes', 'Juno', 'Slumber', 'Crema', 'Ludwig', 'Aden', 'Perpetua',
  'Valencia', 'XProII', 'Hefe', 'Sierra', 'Amaro', 'Mayfair', 'Willow', 'Lo-Fi', 'Inkwell', 'Nashville', 'Stinson', 'Vesper',
  
  // New Popular Instagram Filters
  'Rise', 
  'Hudson', 
  'Earlybird', 
  'Brannan', 
  'Sutro', 
  'Toaster', 
  'Walden', 
  'Kelvin', 
  'F1977', 
  'Maven'
]

const filterStyles: { [key: string]: string } = {
  Normal: '',
  Clarendon: 'contrast(1.2) saturate(1.35)',
  Gingham: 'brightness(1.05) hue-rotate(-10deg)',
  Moon: 'grayscale(1) contrast(1.1) brightness(1.1)',
  Lark: 'contrast(0.9) brightness(1.1) saturate(1.1)',
  Reyes: 'sepia(0.22) brightness(1.1) contrast(0.85) saturate(0.75)',
  Juno: 'saturate(1.4) contrast(1.1) brightness(1.2)',
  Slumber: 'saturate(0.66) brightness(1.05)',
  Rise: "brightness(1.15) contrast(1.1) saturate(1.2) sepia(0.1)",
  Hudson: "brightness(1.2) contrast(0.9) saturate(1.1) hue-rotate(-10deg)",
  Earlybird: "sepia(0.4) contrast(1.1) brightness(0.9) saturate(1.2)",
  Brannan: "sepia(0.3) contrast(1.2) brightness(1.1) saturate(0.9)",
  Sutro: "sepia(0.4) contrast(1.2) brightness(0.9) saturate(1.1) hue-rotate(-10deg)",
  Toaster: "sepia(0.3) contrast(1.3) brightness(0.8) saturate(1.3)",
  Walden: "brightness(1.1) contrast(0.9) saturate(1.3) sepia(0.2)",
  Kelvin: "brightness(1.2) contrast(1.1) saturate(1.4) hue-rotate(10deg)",
  F1977: "contrast(1.4) saturate(1.2) sepia(0.3) brightness(0.9)",
  Maven: "brightness(1.1) contrast(1.2) saturate(1.1) hue-rotate(5deg)",
  Crema: 'contrast(0.9) brightness(1.1) saturate(1.1) sepia(0.2)',
  Ludwig: 'contrast(1.1) brightness(1.1) saturate(1.1) sepia(0.1)',
  Aden: 'contrast(0.9) brightness(1.2) saturate(0.85) hue-rotate(20deg)',
  Perpetua: 'contrast(1.1) brightness(1.25) saturate(1.1)',
  Amaro: "brightness(1.1) contrast(1.1) saturation(1.3) hue-rotate(15deg)",
  Mayfair: "brightness(1.1) contrast(1.2) sepia(0.2)",
  Willow: "saturate(0.8) contrast(1.1) brightness(1.1) sepia(0.3)",
  Hefe: "contrast(1.2) brightness(1.05) saturate(1.3)",
  Valencia: "brightness(1.1) contrast(1.1) sepia(0.3) saturate(1.2)",
  XProII: "contrast(1.2) brightness(1.1) saturate(1.4) sepia(0.2)",
  Sierra: "contrast(0.9) brightness(1.1) saturate(1.1) sepia(0.3)",
  Nashville: "brightness(1.2) contrast(1.1) sepia(0.2) saturate(1.3)",
  'Lo-Fi': "contrast(1.4) saturate(1.1)",
  Inkwell: "grayscale(1) brightness(1.2) contrast(1.05)",
  Stinson: "contrast(0.9) brightness(1.1) saturate(0.9)",
  Vesper: "contrast(1.1) brightness(1.1) saturate(1.2) sepia(0.1)"
}

export default function InstagramFilters() {
  const [image, setImage] = useState<string | null>(null)
  const [filter, setFilter] = useState('Normal')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [fileName, setFileName] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [zoom, setZoom] = useState(100)
  const [urlInput, setUrlInput] = useState('')
  const [downloadFormat, setDownloadFormat] = useState('png')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlUpload = async () => {
    if (!urlInput) {
      toast.error('Please enter an image URL')
      return
    }

    try {
      const response = await fetch(urlInput)
      const blob = await response.blob()
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
        setFileName(urlInput.split('/').pop() || 'image')
      }
      reader.readAsDataURL(blob)
      toast.success('Image loaded successfully!')
    } catch (error) {
      toast.error('Failed to load image from URL')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (imageRef.current) {
      const updateDimensions = () => {
        setDimensions({
          width: imageRef.current!.naturalWidth,
          height: imageRef.current!.naturalHeight
        })
      }
      imageRef.current.addEventListener('load', updateDimensions)
      return () => imageRef.current?.removeEventListener('load', updateDimensions)
    }
  }, [image])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (image) {
        if (e.key === 'ArrowLeft') {
          const currentIndex = filters.indexOf(filter)
          const newIndex = (currentIndex - 1 + filters.length) % filters.length
          setFilter(filters[newIndex])
        } else if (e.key === 'ArrowRight') {
          const currentIndex = filters.indexOf(filter)
          const newIndex = (currentIndex + 1) % filters.length
          setFilter(filters[newIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filter, image])

  const downloadImage = () => {
    if (imageRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = imageRef.current.naturalWidth
      canvas.height = imageRef.current.naturalHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.filter = `${filterStyles[filter]} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
        ctx.scale(zoom / 100, zoom / 100)
        ctx.drawImage(imageRef.current, 0, 0)
        
        const link = document.createElement('a')
        link.download = `instagram_${filter}.${downloadFormat}`
        
        if (downloadFormat === 'webp') {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                link.href = URL.createObjectURL(blob)
                link.click()
                URL.revokeObjectURL(link.href)
              }
            },
            'image/webp',
            0.9
          )
        } else {
          link.href = canvas.toDataURL(`image/${downloadFormat}`, 0.9)
          link.click()
        }
      }
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const resetAdjustments = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setZoom(100)
    setFilter('Normal')
  }

  const imageStyle = {
    filter: `${filterStyles[filter]} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    transform: `scale(${zoom / 100})`,
    maxHeight: '400px',
    maxWidth: '100%',
    objectFit: 'contain' as const,
    transition: 'transform 0.3s ease'
  }

  return (
    <ToolLayout
      title="Instagram Filters"
      description="Apply Instagram-style filters and effects to your images with advanced editing options"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        <CardContent className="space-y-6">
          {/* Image Preview Section */}
          <div
            className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer mb-6 relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {image ? (
              <div 
                className="relative w-full h-full flex items-center justify-center" 
                ref={fullscreenRef}
              >
                <div 
                  className="max-w-full max-h-full overflow-hidden"
                  style={{
                    width: `${100 * zoom / 100}%`,
                    height: `${100 * zoom / 100}%`,
                  }}
                >
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-contain"
                    style={{
                      ...imageStyle,
                      transform: `scale(${zoom / 100})`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {dimensions.width} x {dimensions.height}
                </div>
                {fileName && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {fileName}
                  </div>
                )}
                <Button
                  className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFullscreen()
                  }}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-gray-400 flex flex-col items-center justify-center h-64">
                <ImageIcon size={48} />
                <p className="mt-2">Click or drag and drop to upload an image</p>
              </div>
            )}
          </div>


          {/* Fullscreen Preview */}
          {isFullscreen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="relative w-3/4 h-3/4 max-h-screen p-4">
                <img
                  src={image!}
                  alt="Fullscreen preview"
                  className="w-full h-full overflow-hidden rounded-lg"
                  style={{
                    ...imageStyle,
                    maxHeight: '90vh',
                    maxWidth: '90vw'
                  }}
                />
                <Button
                  className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600"
                  onClick={toggleFullscreen}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>
          )}

          {/* Filter Previews */}
          {image && (
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <div className="flex gap-4 min-w-max">
                {filters.map((filterName) => (
                  <div
                    key={filterName}
                    className={`cursor-pointer transition-all ${
                      filter === filterName ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setFilter(filterName)}
                  >
                    <div className="w-24">
                      <img
                        src={image}
                        alt={filterName}
                        className="w-24 h-24 object-cover rounded-lg"
                        style={{
                          filter: filterStyles[filterName],
                        }}
                      />
                      <p className="text-center text-sm text-gray-300 mt-1">{filterName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls Section */}
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="download">
                <Download className="w-4 h-4 mr-2" />
                Download
              </TabsTrigger>
              <TabsTrigger value="adjust">
                <Sliders className="w-4 h-4 mr-2" />
                Adjust
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Upload Options</h3>
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter image URL..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className='text-gray-700'
                  />
                  <Button onClick={handleUrlUpload}>
                    <Link2 className="w-4 h-4 mr-2" />
                    Load URL
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="download" className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Download Options</h3>
              <div className="flex gap-2">
                <Select value={downloadFormat} onValueChange={setDownloadFormat}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={downloadImage} disabled={!image}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="adjust" className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Image Adjustments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brightness" className="text-white">Brightness: {brightness}%</Label>
                  <Slider
                    id="brightness"
                    min={0}
                    max={200}
                    step={1}
                    value={brightness}
                    onChange={(value) => setBrightness(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contrast" className="text-white">Contrast: {contrast}%</Label>
                  <Slider
                    id="contrast"
                    min={0}
                    max={200}
                    step={1}
                    value={contrast}
                    onChange={(value) => setContrast(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="saturation" className="text-white">Saturation: {saturation}%</Label>
                  <Slider
                    id="saturation"
                    min={0}
                    max={200}
                    step={1}
                    value={saturation}
                    onChange={(value) => setSaturation(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zoom" className="text-white">Zoom: {zoom}%</Label>
                  <Slider
                    id="zoom"
                    min={50}
                    max={200}
                    step={1}
                    value={zoom}
                    onChange={(value) => setZoom(value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

           {/* Action Buttons */}
           <div className="flex flex-wrap gap-2">
            <Button onClick={resetAdjustments} disabled={!image}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={() => setZoom(prev => Math.min(prev + 10, 200))} 
              disabled={!image}
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom In
            </Button>
            <Button 
              onClick={() => setZoom(prev => Math.max(prev - 10, 50))} 
              disabled={!image}
            >
              <ZoomOut className="w-4 h-4 mr-2" />
              Zoom Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Instagram Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The Instagram Filters tool is a powerful and versatile image editing application that brings the magic of Instagram's iconic filters to your browser. With 34 unique filters, including classic Instagram favorites and popular modern effects, this tool allows you to transform your photos with just a few clicks. Whether you're a social media enthusiast, a content creator, or simply someone who loves to enhance their photos, our tool provides a wide range of options to suit every style and mood.
          </p>

          <div className="my-8">
            <Image 
              src="/Images/InstagramFiltersPreview.png?height=400&width=600"  
              alt="Screenshot of the Enhanced Instagram Filters interface" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            Key Features of Instagram Filters
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>34 Instagram-style filters with live previews</li>
            <li>Classic and modern filter options</li>
            <li>Advanced image adjustments (brightness, contrast, saturation, zoom)</li>
            <li>Multiple upload options: file upload, drag & drop, and URL input</li>
            <li>Export in multiple formats: PNG, JPEG, and WebP</li>
            <li>Fullscreen editing mode for detailed work</li>
            <li>Keyboard navigation for quick filter selection</li>
            <li>Image information display (dimensions and filename)</li>
            <li>Responsive design for various screen sizes</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Palette className="w-6 h-6 mr-2" />
            Available Filters
          </h2>
          <p className="text-gray-300 mb-4">
            Our tool offers a wide range of filters, each designed to give your photos a unique look. Here's a breakdown of all 34 filters:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold mb-2">Classic Filters</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Normal:</strong> The original, unfiltered look</li>
                <li><strong>Clarendon:</strong> Brightens, highlights, and intensifies shadows for color vibrancy</li>
                <li><strong>Gingham:</strong> Slightly washes out the image for a vintage feel</li>
                <li><strong>Moon:</strong> Black and white filter with enhanced contrast</li>
                <li><strong>Lark:</strong> Brightens and adds a blue tint</li>
                <li><strong>Reyes:</strong> Gives a dusty, vintage look</li>
                <li><strong>Juno:</strong> Tints cool tones green, makes warm tones pop and whites glow</li>
                <li><strong>Slumber:</strong> Desaturates the image and adds a haze for a retro feel</li>
                <li><strong>Crema:</strong> Adds a creamy look that both warms and cools the image</li>
                <li><strong>Ludwig:</strong> Slight desaturation that also enhances light</li>
                <li><strong>Aden:</strong> This filter gives a blue/green natural look</li>
                <li><strong>Perpetua:</strong> Adds a pastel look for a fresh feel</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Modern Filters</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Valencia:</strong> Fades the image, increases exposure and warms the colors</li>
                <li><strong>X-Pro II:</strong> High contrast and warm tint for a dramatic effect</li>
                <li><strong>Hefe:</strong> High contrast and saturation with a similar effect to X-Pro II</li>
                <li><strong>Sierra:</strong> Gives a faded, softer look</li>
                <li><strong>Amaro:</strong> Adds light to an image, with the center of the photo more brightly exposed</li>
                <li><strong>Mayfair:</strong> Applies a warm pink tone, subtle vignetting to brighten the center</li>
                <li><strong>Willow:</strong> Monochromatic filter with subtle purple tones and a translucent glowing white border</li>
                <li><strong>Lo-Fi:</strong> Enriches color and adds strong shadows through the use of saturation and "warming" the temperature</li>
                <li><strong>Inkwell:</strong> Direct shift to black and white</li>
                <li><strong>Nashville:</strong> Warms the temperature, lowers contrast and increases exposure to give a light "pink" tint</li>
                <li><strong>Stinson:</strong> Subtle filter that lightens the image</li>
                <li><strong>Vesper:</strong> Adds a yellow tint for a vintage look</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold mb-2">Additional Popular Filters</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Rise:</strong> Adds a soft warm glow and subtle highlights</li>
                <li><strong>Hudson:</strong> Creates an icy illusion with heightened shadows, cool tint and dodged center</li>
                <li><strong>Earlybird:</strong> Gives a vintage, faded look with a sepia tint</li>
                <li><strong>Brannan:</strong> Increases contrast and exposure and adds a metallic tint</li>
                <li><strong>Sutro:</strong> Burns photo edges, increases highlights and shadows dramatically</li>
              </ul>
            </div>
            <div>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Toaster:</strong> Ages the image by "burning" the center and adds a dramatic vignette</li>
                <li><strong>Walden:</strong> Increases exposure and adds a yellow tint</li>
                <li><strong>Kelvin:</strong> Increases saturation and temperature to give a radiant "glow"</li>
                <li><strong>F1977:</strong> Gives a vintage, nostalgic feel with a 1970s-inspired look</li>
                <li><strong>Maven:</strong> Darkens images, increases shadows, and adds a slight purple tint</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use Instagram Filters?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Upload an image using file upload, drag & drop, or URL</li>
            <li>Browse through the filter previews and select your preferred style</li>
            <li>Use left and right arrow keys to navigate through filters quickly</li>
            <li>Fine-tune the image using the adjustment sliders (brightness, contrast, saturation, zoom)</li>
            <li>Toggle fullscreen mode for a better view and detailed editing</li>
            <li>Choose your preferred export format (PNG, JPEG, or WebP)</li>
            <li>Download your edited image</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips for Getting the Most Out of Your Filters
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Experiment with different filters to find the best match for your image's mood and content</li>
            <li>Use the adjustment sliders to fine-tune the filter effects and create your unique style</li>
            <li>Try combining filters with manual adjustments for more creative results</li>
            <li>Consider the subject of your photo when choosing a filter (e.g., vintage filters for old buildings, vibrant filters for nature shots)</li>
            <li>Use the fullscreen mode to check details and ensure quality across the entire image</li>
            <li>Remember that subtle enhancements often yield the most professional-looking results</li>
          </ul>

          <p className="text-gray-300 mt-6">
            With its extensive range of filters and intuitive interface, the Enhanced Instagram Filters tool empowers you to transform your photos and express your creativity. Whether you're aiming for a vintage look, a modern pop, or something in between, our tool has you covered. Start exploring the world of filters and elevate your photo editing game today!
          </p>
        </CardContent>
      </Card>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4B5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6B7280;
        }
      `}</style>
    </ToolLayout>
  )
}