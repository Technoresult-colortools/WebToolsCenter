'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Checkbox from "@/components/ui/Checkbox"
import { Select } from '@/components/ui/select1';
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import { Upload, Download, RefreshCw, ArrowLeftRight, Info, Lightbulb, BookOpen, ImageIcon } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import NextImage from 'next/image'

const formatOptions = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
];

export default function EnhancedImageResizer() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [width, setWidth] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [preserveAspectRatio, setPreserveAspectRatio] = useState<boolean>(true)
  const [format, setFormat] = useState<string>('png')
  const [quality, setQuality] = useState<number>(90)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          setOriginalImage(img)
          setWidth(img.width)
          setHeight(img.height)
          setResizedImage(null)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
      toast.success('Image uploaded successfully!')
    }
  }

  const handleWidthChange = useCallback((newWidth: number) => {
    setWidth(newWidth)
    if (preserveAspectRatio && originalImage) {
      setHeight(Math.round(newWidth / (originalImage.width / originalImage.height)))
    }
  }, [preserveAspectRatio, originalImage])

  const handleHeightChange = useCallback((newHeight: number) => {
    setHeight(newHeight)
    if (preserveAspectRatio && originalImage) {
      setWidth(Math.round(newHeight * (originalImage.width / originalImage.height)))
    }
  }, [preserveAspectRatio, originalImage])

  const handlePreserveAspectRatioChange = (checked: boolean) => {
    setPreserveAspectRatio(checked)
    if (checked && originalImage) {
      setHeight(Math.round(width / (originalImage.width / originalImage.height)))
    }
  }

  const handleResize = () => {
    if (!originalImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(originalImage, 0, 0, width, height)

    const resizedDataUrl = canvas.toDataURL(`image/${format}`, quality / 100)
    setResizedImage(resizedDataUrl)
    toast.success('Image resized successfully!')
  }

  const handleDownload = () => {
    if (!resizedImage) return

    const link = document.createElement('a')
    link.href = resizedImage
    link.download = `resized-image.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Image downloaded as ${format.toUpperCase()}!`)
  }

  const handleReset = () => {
    if (originalImage) {
      setWidth(originalImage.width)
      setHeight(originalImage.height)
    }
    setResizedImage(null)
    setPreserveAspectRatio(true)
    setFormat('png')
    setQuality(90)
    toast.success('Settings reset to original!')
  }

  const handleSwapDimensions = () => {
    setWidth(height)
    setHeight(width)
  }

  return (
    <ToolLayout
      title="Enhanced Image Resizer"
      description="Quickly and easily resize your images with advanced options. Perfect for social media, web use, or any other platform requiring specific dimensions with optimal quality."
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Image</h2>
          <label className="flex flex-col items-center justify-center h-32 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
            <Upload size={32} />
            <span className="mt-2 text-base leading-normal">Select an image file</span>
            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
          </label>
        </div>

        {originalImage && (
          <>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Original Image</h3>
              <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
                <img 
                  src={originalImage.src} 
                  alt="Original" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <p className="text-white mt-2">Original size: {originalImage.width} x {originalImage.height}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Resize Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width" className="text-white mb-2 block">Width</Label>
                  <div className="flex items-center">
                    <Input
                      id="width"
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                    <span className="text-white ml-2">px</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="height" className="text-white mb-2 block">Height</Label>
                  <div className="flex items-center">
                    <Input
                      id="height"
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                    <span className="text-white ml-2">px</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <Button onClick={handleSwapDimensions} className="bg-blue-600 hover:bg-blue-700 text-white mr-4">
                  <ArrowLeftRight className="h-5 w-5 mr-2" />
                  Swap Dimensions
                </Button>
                <Checkbox
                  id=""
                  checked={preserveAspectRatio}
                  onChange={handlePreserveAspectRatioChange}
                />
                <Label
                  htmlFor="preserve-aspect-ratio"
                  className="text-white ml-2 cursor-pointer"
                >
                  Preserve aspect ratio
                </Label>
              </div>
            </div>

            <div className="mb-8">
              <Label htmlFor="format" className="text-white mb-2 block">Output Format</Label>
              <Select
                label="Select Format"
                options={formatOptions}
                selectedKey={format}
                onSelectionChange={(key) => setFormat(key)}
                className="max-w-full"
              />
            </div>

            <div className="mb-8">
              <Label htmlFor="quality" className="text-white mb-2 block">Quality</Label>
              <div className="flex items-center">
                <Slider
                  id="quality"
                  min={1}
                  max={100}
                  step={1}
                  value={quality}
                  onChange={(value) => setQuality(value)}
                  className="flex-grow"
                />
                <span className="text-white ml-4 min-w-[2.5rem] text-right">{quality}%</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button onClick={handleResize} className="bg-green-600 hover:bg-green-700 text-white">
                Resize Image
              </Button>
              <Button onClick={handleDownload} disabled={!resizedImage} className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                <Download className="h-5 w-5 mr-2" />
                Download Resized Image
              </Button>
              <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white">
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>

            {resizedImage && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Resized Image Preview</h3>
                <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
                  <img 
                    src={resizedImage} 
                    alt="Resized" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <p className="text-white mt-2">Resized to: {width} x {height}</p>
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About Enhanced Image Resizer
        </h2>
        <p className="text-gray-300 mb-4">
          The Enhanced Image Resizer is a powerful tool designed to help you quickly and easily resize your images with precision and flexibility. Whether you're preparing images for web use, social media, or any other purpose requiring specific dimensions, this tool offers a range of features to ensure you get the exact results you need.
        </p>
        <p className="text-gray-300 mb-4">
          With support for multiple image formats, adjustable quality settings, and the ability to preserve aspect ratios, our Image Resizer caters to both casual users and professionals who demand control over their image outputs.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/ImageResizerPreview.png?height=400&width=600" 
            alt="Screenshot of the Enhanced Image Resizer interface showing various resizing options and a sample resized image" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features of Enhanced Image Resizer
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Support for various image formats (PNG, JPEG, WebP, etc.)</li>
          <li>Precise width and height adjustments</li>
          <li>Option to preserve aspect ratio for proportional resizing</li>
          <li>Quick dimension swapping for easy orientation changes</li>
          <li>Multiple output formats: PNG, JPEG, and WebP</li>
          <li>Adjustable quality settings for optimized file sizes</li>
          <li>Real-time preview of resized images</li>
          <li>High-quality resizing algorithm for crisp results</li>
          <li>Easy one-click download of resized images</li>
          <li>Reset functionality to quickly start over</li>
          <li>Responsive design for use on various devices</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use Enhanced Image Resizer?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Click the "Select an image file" button or drag and drop an image onto the designated area.</li>
          <li>Once uploaded, you'll see a preview of the original image and its dimensions.</li>
          <li>Use the width and height inputs to set your desired dimensions for the resized image.</li>
          <li>Toggle the "Preserve aspect ratio" checkbox to maintain the image's proportions if needed.</li>
          <li>Click "Swap Dimensions" to quickly switch between portrait and landscape orientations.</li>
          <li>Choose your preferred output format (PNG, JPEG, or WebP) from the dropdown menu.</li>
          <li>Adjust the quality slider to balance between image quality and file size.</li>
          <li>Click "Resize Image" to generate a preview of your resized image.</li>
          <li>Review the resized image preview and its new dimensions.</li>
          <li>If satisfied, click "Download Resized Image" to save the result to your device.</li>
          <li>Use the "Reset" button at any time to revert all settings and start over.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Best Practices
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use the "Preserve aspect ratio" option to avoid image distortion when resizing.</li>
          <li>For images with text or sharp edges, PNG format often provides the best quality.</li>
          <li>JPEG is ideal for photographs and images with many colors, offering good compression.</li>
          <li>WebP often provides the best balance between quality and file size for web use.</li>
          <li>Experiment with the quality slider to find the optimal balance between image quality and file size.</li>
          <li>When enlarging images, be aware that it may result in some loss of quality or pixelation.</li>
          <li>For social media platforms, research the recommended image sizes for optimal display.</li>
          <li>Use the "Swap Dimensions" button to quickly create both landscape and portrait versions of your image.</li>
          <li>Always preview your resized image before downloading to ensure it meets your requirements.</li>
          <li>Consider the intended use of your image when choosing between quality and file size.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <ImageIcon className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Social Media:</strong> Resize images to fit various platform requirements (e.g., Instagram posts, Twitter headers, Facebook cover photos).</li>
          <li><strong>Web Development:</strong> Optimize images for faster loading times and responsive designs.</li>
          <li><strong>E-commerce:</strong> Create consistent product image sizes for your online store.</li>
          <li><strong>Graphic Design:</strong> Prepare images for use in layouts, presentations, or print materials.</li>
          <li><strong>Email Marketing:</strong> Resize images to fit email templates and improve delivery rates.</li>
          <li><strong>Blogging:</strong> Create featured images and thumbnails for your blog posts.</li>
          <li><strong>Photography:</strong> Quickly create web-friendly versions of high-resolution photos.</li>
          <li><strong>Digital Art:</strong> Resize artworks for online portfolios or print-on-demand services.</li>
          <li><strong>App Development:</strong> Prepare app icons and screenshots in various required sizes.</li>
          <li><strong>Document Creation:</strong> Resize images for inclusion in reports, whitepapers, or presentations.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          The Enhanced Image Resizer is a versatile tool that caters to a wide range of image resizing needs. Whether you're a professional designer, a social media manager, or simply someone who needs to resize images occasionally, this tool provides the flexibility and precision you need to achieve perfect results every time. Start resizing your images with confidence and ease!
        </p>
      </div>
    </ToolLayout>
  )
}