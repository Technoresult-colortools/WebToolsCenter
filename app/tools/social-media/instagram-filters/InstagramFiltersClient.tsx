'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, Maximize2, Minimize2, Image as ImageIcon, RotateCcw, RotateCw, ZoomIn, ZoomOut, BookOpen, Lightbulb, Info } from 'lucide-react'
import Slider from "@/components/ui/Slider"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, } from 'react-hot-toast'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/sidebarTools';

const filters = [
  'Normal', 'Clarendon', 'Gingham', 'Moon', 'Lark', 'Reyes', 'Juno', 'Slumber', 'Crema', 'Ludwig', 'Aden', 'Perpetua',
  'Valencia', 'XProII', 'Hefe', 'Sierra', 'Amaro', 'Mayfair', 'Willow', 'Lo-Fi', 'Inkwell', 'Nashville', 'Stinson', 'Vesper'
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

const InstagramFiltersClient: React.FC = () => {
  const [image, setImage] = useState<string | null>(null)
  const [filter, setFilter] = useState('Normal')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(100)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const fullscreenRef = useRef<HTMLDivElement>(null)
  

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
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
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const downloadImage = () => {
    if (imageRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = imageRef.current.naturalWidth
      canvas.height = imageRef.current.naturalHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.filter = `${filterStyles[filter]} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(zoom / 100, zoom / 100)
        ctx.drawImage(imageRef.current, -canvas.width / 2, -canvas.height / 2)
        const link = document.createElement('a')
        link.download = `instagram_${filter}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const resetAdjustments = () => {
    setBrightness(100)
    setContrast(100)
    setSaturation(100)
    setRotation(0)
    setZoom(100)
    setFilter('Normal')
  }

  const imageStyle = {
    filter: `${filterStyles[filter]} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
    transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
    maxHeight: '400px',
    objectFit: 'contain' as const
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow px-4 py-12 overflow-x-hidden">
            <div className="max-w-4xl mx-auto">
            <div className="mb-12 text-center px-4">
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                Instagram Filters
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Enhance your photos with Instagram-style filters and advanced image adjustments
              </p>
            </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div
                  className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {image ? (
                    <div className="relative" ref={fullscreenRef}>
                      <img
                        ref={imageRef}
                        src={image}
                        alt="Uploaded"
                        className="max-w-full h-auto mx-auto"
                        style={imageStyle}
                      />
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                        {dimensions.width} x {dimensions.height}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center justify-center h-64">
                      <ImageIcon size={48} />
                      <p className="mt-2">Click or drag and drop to upload an image</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="filter" className="text-white mb-2 block">Filter</Label>
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger id="filter" className="w-full bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select a filter" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white max-h-40 overflow-y-auto">
                      {filters.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                </div>

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
                  <Label htmlFor="rotation" className="text-white">Rotation: {rotation}°</Label>
                  <Slider
                    id="rotation"
                    min={-180}
                    max={180}
                    step={1}
                    value={rotation}
                    onChange={(value) => setRotation(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zoom" className="text-white">Zoom: {zoom}%</Label>
                  <Slider
                    id="zoom"
                    min={50}
                    max={100}
                    step={1}
                    value={zoom}
                    onChange={(value) => setZoom(value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button onClick={() => fileInputRef.current?.click()} disabled={!image}>
                <Upload className="mr-2" />
                Change Image
              </Button>
              <Button onClick={downloadImage} disabled={!image}>
                <Download className="mr-2" />
                Download
              </Button>
              <Button onClick={resetAdjustments} disabled={!image}>
                <RefreshCw className="mr-2" />
                Reset
              </Button>
              <Button onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 className="mr-2" /> : <Maximize2 className="mr-2" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
              <Button onClick={() => setRotation(prev => prev - 90)} disabled={!image}>
                <RotateCcw className="mr-2" />
                Rotate Left
              </Button>
              <Button onClick={() => setRotation(prev => prev + 90)} disabled={!image}>
                <RotateCw className="mr-2" />
                Rotate Right
              </Button>
              <Button onClick={() => setZoom(prev => Math.min(prev + 10, 200))} disabled={!image}>
                <ZoomIn className="mr-2" />
                Zoom In
              </Button>
              <Button onClick={() => setZoom(prev => Math.max(prev - 10, 50))} disabled={!image}>
                <ZoomOut className="mr-2" />
                Zoom Out
              </Button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Instagram Filters
            </h2>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Our Instagram Filters tool is a powerful image editor that allows you to apply popular Instagram-style filters to your photos.
              With a wide range of filters and adjustment options, you can enhance your images and achieve the perfect look for your social media posts.
            </p>

            <h3 className="text-xl md:text-2xl font-semibold text-white mt-6 mb-2 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features:
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base mb-4">
              <li>24 Instagram-inspired filters</li>
              <li>Real-time filter preview</li>
              <li>Advanced image adjustments (brightness, contrast, saturation)</li>
              <li>Rotation and zoom capabilities</li>
              <li>Fullscreen mode for detailed editing</li>
              <li>Easy image upload via drag-and-drop or file selection</li>
              <li>Image dimension display</li>
              <li>One-click download of edited images</li>
            </ul>

            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Instagram Filter?:
            </h3>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base mb-4">
              <li>Upload an image by clicking the upload area or dragging and dropping a file.</li>
              <li>Choose a filter from the dropdown menu to apply it to your image.</li>
              <li>Fine-tune your image using the adjustment sliders (brightness, contrast, saturation).</li>
              <li>Rotate or zoom your image if needed.</li>
              <li>Use the fullscreen mode for a better view of your edits.</li>
              <li>When satisfied, click the "Download" button to save your edited image.</li>
              <li>Use the "Reset" button to revert all changes.</li>
            </ol>

            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks:
            </h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Experiment with different filters to find the best look for your image.</li>
              <li>Use the adjustment sliders to fine-tune the filter effects.</li>
              <li>Combine rotation and zoom for creative compositions.</li>
              <li>Use fullscreen mode for precise adjustments on detailed images.</li>
              <li>Try applying a filter and then adjusting the saturation for unique effects.</li>
              <li>Use the "Reset" button to quickly compare your edits with the original image.</li>
              <li>Remember that subtle adjustments often yield the best results.</li>
              <li>Save multiple versions of your edited image to compare different styles.</li>
            </ul>
          </div>

        </div> 

        </main>

      </div>
      <Footer />
    </div>
  )
}

export default InstagramFiltersClient