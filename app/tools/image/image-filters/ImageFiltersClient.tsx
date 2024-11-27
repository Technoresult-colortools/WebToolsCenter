'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, X, Download, RefreshCw, Sliders, Eye, EyeOff, Info, BookOpen, Lightbulb, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Filter {
  name: string
  cssFilter: string
  intensity: number
  unit?: string
}

export default function EnhancedImageFilters() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null)
  const [intensity, setIntensity] = useState(100)
  const [showOriginal, setShowOriginal] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const filters: Filter[] = [
    { name: 'Grayscale', cssFilter: 'grayscale', intensity: 100, unit: '%' },
    { name: 'Sepia', cssFilter: 'sepia', intensity: 100, unit: '%' },
    { name: 'Blur', cssFilter: 'blur', intensity: 10, unit: 'px' },
    { name: 'Brightness', cssFilter: 'brightness', intensity: 200, unit: '%' },
    { name: 'Contrast', cssFilter: 'contrast', intensity: 200, unit: '%' },
    { name: 'Hue Rotate', cssFilter: 'hue-rotate', intensity: 360, unit: 'deg' },
    { name: 'Invert', cssFilter: 'invert', intensity: 100, unit: '%' },
    { name: 'Saturate', cssFilter: 'saturate', intensity: 200, unit: '%' },
    { name: 'Opacity', cssFilter: 'opacity', intensity: 100, unit: '%' },
    { name: 'Drop Shadow', cssFilter: 'drop-shadow', intensity: 20, unit: 'px' },
    { name: 'Vintage', cssFilter: 'custom', intensity: 100, unit: '%' },
    { name: 'Cold', cssFilter: 'custom', intensity: 100, unit: '%' },
  ]

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string)
        setSelectedFilter(null)
        setIntensity(100)
        setShowOriginal(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const applyFilter = () => {
    if (!imageSrc || !canvasRef.current || !imageRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = imageRef.current.naturalWidth
    canvas.height = imageRef.current.naturalHeight

    ctx.filter = getFilterString()
    ctx.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height)
  }

  useEffect(() => {
    if (imageSrc && imageRef.current) {
      imageRef.current.onload = applyFilter
    }
  }, [imageSrc])

  useEffect(() => {
    applyFilter()
  }, [selectedFilter, intensity])

  const getFilterString = () => {
    if (!selectedFilter) return 'none'
    
    const intensityValue = `${intensity}${selectedFilter.unit || ''}`
    
    switch (selectedFilter.name) {
      case 'Drop Shadow':
        return `drop-shadow(0 0 ${intensityValue} rgba(0,0,0,0.5))`
      case 'Vintage':
        return `sepia(${intensity}%) saturate(150%) hue-rotate(-15deg)`
      case 'Cold':
        return `saturate(${intensity}%) hue-rotate(180deg)`
      default:
        return `${selectedFilter.cssFilter}(${intensityValue})`
    }
  }

  const downloadFilteredImage = (format: string) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let imageDataUrl: string

    switch (format) {
      case 'image/jpeg':
        imageDataUrl = canvas.toDataURL('image/jpeg', 1.0)
        break
      case 'image/webp':
        imageDataUrl = canvas.toDataURL('image/webp', 1.0)
        break
      default:
        imageDataUrl = canvas.toDataURL('image/png')
    }

    const link = document.createElement('a')
    link.download = `filtered-image.${format.split('/')[1]}`
    link.href = imageDataUrl
    link.click()
    toast.success(`Image downloaded successfully as ${format.split('/')[1].toUpperCase()}!`)
  }

  const resetImage = () => {
    setImageSrc(null)
    setSelectedFilter(null)
    setIntensity(100)
    setShowOriginal(true)
  }

  const toggleOriginal = () => {
    setShowOriginal(!showOriginal)
  }

  return (
    <ToolLayout
      title="Enhanced Image Filters"
      description="Transform your photos with our advanced image filtering tool. Apply a wide range of effects, adjust intensities, and create stunning visuals with ease."
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mb-8 mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upload an Image</h2>
          {!imageSrc ? (
            <label className="flex flex-col items-center justify-center h-64 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
              <Upload size={48} />
              <span className="mt-2 text-base leading-normal">Select a file</span>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            </label>
          ) : (
            <div className="relative">
              <div className="relative h-64 md:h-96 bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  ref={imageRef}
                  src={imageSrc} 
                  alt="Original" 
                  className="w-full h-full object-contain"
                  style={{ display: showOriginal ? 'block' : 'none' }}
                />
                <canvas 
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                  style={{ display: showOriginal ? 'none' : 'block' }}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={resetImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {imageSrc && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Apply Filters</h3>
              <Button
                variant="outline"
                onClick={toggleOriginal}
                className="flex items-center"
              >
                {showOriginal ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                {showOriginal ? 'Show Filtered' : 'Show Original'}
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {filters.map((filter) => (
                <Button
                  key={filter.name}
                  variant={selectedFilter?.name === filter.name ? "default" : "secondary"}
                  onClick={() => {
                    setSelectedFilter(filter)
                    setIntensity(filter.name === 'Blur' || filter.name === 'Drop Shadow' ? 5 : 100)
                    setShowOriginal(false)
                  }}
                >
                  {filter.name}
                </Button>
              ))}
            </div>
            {selectedFilter && (
              <div className="mb-6">
                <label htmlFor="intensity" className="block text-sm font-medium text-white mb-2">
                  Intensity
                </label>
                <div className="flex items-center space-x-2">
                  <Sliders className="text-white h-4 w-4" />
                  <Slider
                    id="intensity"
                    min={0}
                    max={selectedFilter.intensity}
                    step={1}
                    value={intensity}
                    onChange={(value) => {
                      setIntensity(value)
                      setShowOriginal(false)
                    }}
                    className="flex-grow"
                  />
                  <span className="text-white min-w-[2.5rem] text-right">{intensity}{selectedFilter.unit}</span>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedFilter(null)
                  applyFilter()
                  setShowOriginal(true)
                }}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" />
                    Download Filtered Image
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-700 text-white border-gray-600">
                  <DropdownMenuItem onClick={() => downloadFilteredImage('image/png')}>
                    Download as PNG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadFilteredImage('image/jpeg')}>
                    Download as JPEG
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => downloadFilteredImage('image/webp')}>
                    Download as WebP
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Enhanced Image Filters Tool?
        </h2>
        <p className="text-gray-300 mb-4">
          The Enhanced Image Filters tool is a powerful, user-friendly application designed to transform your photos with just a few clicks. Whether you're a professional photographer, a social media enthusiast, or someone who loves to experiment with images, our tool provides a wide array of filters and adjustments to bring your creative vision to life.
        </p>
        <p className="text-gray-300 mb-4">
          With our diverse selection of filters and the ability to fine-tune their intensity, you have complete control over the look and feel of your images. From classic effects like Grayscale and Sepia to more advanced filters like Hue Rotation and Custom Shadows, our tool caters to both simple adjustments and complex image manipulations.
        </p>
        <p className="text-gray-300 mb-4">
          Perfect for quickly editing photos for social media, creating unique visual content for your blog, or experimenting with different styles for your digital art, the Enhanced Image Filters tool streamlines your workflow and helps you achieve stunning results effortlessly.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/ImageFiltersPreview.png?height=400&width=600" 
            alt="Screenshot of the Enhanced Image Filters interface showing various filter options and a sample filtered image" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use Enhanced Image Filters
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Upload an image by clicking on the designated area or dragging and dropping a file.</li>
          <li>Browse through the available filters and click on one to apply it to your image.</li>
          <li>Use the intensity slider to adjust the strength of the selected filter.</li>
          <li>Toggle between the original and filtered image using the "Show Original" / "Show Filtered" button.</li>
          <li>Experiment with different filters and intensities until you achieve your desired look.</li>
          <li>Click the "Reset Filter" button to remove the current filter and start over.</li>
          <li>Once satisfied, click "Download Filtered Image" and choose your preferred format (PNG, JPEG, or WebP).</li>
          <li>To start with a new image, click the "X" button on the current image and upload a new one.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Wide range of filters including classic and advanced options</li>
          <li>Real-time filter preview for instant feedback</li>
          <li>Adjustable filter intensity for precise control</li>
          <li>Easy comparison between original and filtered images</li>
          <li>High-quality image output for professional results</li>
          <li>Multiple download formats: PNG, JPEG, and WebP</li>
          <li>User-friendly interface suitable for all skill levels</li>
          <li>Responsive design for seamless use on various devices</li>
          <li>No account or sign-up required for quick and easy access</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Creative Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Layer filters by applying one, downloading, then re-uploading and applying another for unique effects.</li>
          <li>Use the Brightness and Contrast filters to enhance poorly lit images before applying artistic filters.</li>
          <li>Experiment with the Hue Rotate filter for unexpected and vibrant color combinations.</li>
          <li>Apply the Vintage filter to modern photos for a nostalgic, retro feel.</li>
          <li>Utilize the Blur filter subtly to create a soft focus effect, perfect for portraits or dreamy landscapes.</li>
          <li>Combine the Sepia filter with reduced opacity to create a subtle aged look without losing all color.</li>
          <li>Use the Drop Shadow filter to make text or objects in your image pop and stand out more.</li>
          <li>Try the Invert filter for creating interesting negative-like images, great for artistic projects.</li>
          <li>Adjust the intensity slider in small increments for more precise control over the filter effect.</li>
          <li>Experiment with combining complementary filters like Saturate and Contrast for enhanced vibrancy.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Social Media:</strong> Quickly edit and enhance photos for Instagram, Facebook, or Twitter posts.</li>
          <li><strong>E-commerce:</strong> Improve product images to make them more attractive to potential buyers.</li>
          <li><strong>Blogging:</strong> Create eye-catching featured images for blog posts and articles.</li>
          <li><strong>Digital Art:</strong> Use as a starting point for digital paintings or mixed media artwork.</li>
          <li><strong>Photography:</strong> Enhance or stylize photographs for portfolios or exhibitions.</li>
          <li><strong>Graphic Design:</strong> Quickly adjust images for use in various design projects.</li>
          <li><strong>Marketing:</strong> Create visually appealing graphics for digital marketing campaigns.</li>
          <li><strong>Education:</strong> Use in visual arts classes to teach about color theory and image manipulation.</li>
          <li><strong>Personal Projects:</strong> Enhance personal photos for albums, scrapbooks, or social sharing.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          Ready to transform your images? Dive into our Enhanced Image Filters tool now and unlock your creative potential. Whether you're working on a professional project or just want to add some flair to your personal photos, our tool provides the flexibility and power you need to achieve outstanding results. Start experimenting with filters today and see how it can revolutionize your image editing process!
        </p>
      </div>
    </ToolLayout>
  )
}