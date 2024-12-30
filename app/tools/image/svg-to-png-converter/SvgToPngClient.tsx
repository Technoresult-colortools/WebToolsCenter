'use client'

import React, { useState, useRef, useCallback } from 'react'
import NextImage from 'next/image'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Select } from '@/components/ui/select1';
import { Toaster, toast } from 'react-hot-toast'
import { Upload, Download, RefreshCw, Eye, EyeOff, AlertTriangle, Info, BookOpen, Lightbulb, Sliders, Palette, Copy, Maximize2 } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'

const exportSizeOptions = [
  { value: "custom", label: "Custom" },
  { value: "1200x630", label: "OG Image (1200x630)" },
  { value: "1080x1080", label: "Instagram Square (1080x1080)" },
  { value: "1080x1920", label: "Instagram Story (1080x1920)" },
  { value: "1280x720", label: "YouTube Thumbnail (1280x720)" },
];

export default function SvgToPngConverter() {
  const [svgFile, setSvgFile] = useState<File | null>(null)
  const [svgUrl, setSvgUrl] = useState<string>('')
  const [pngUrl, setPngUrl] = useState<string>('')
  const [scale, setScale] = useState<number>(1)
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
  const [showBackground, setShowBackground] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })
  const [exportSize, setExportSize] = useState<string>('custom')
  const [customWidth, setCustomWidth] = useState<number>(0)
  const [customHeight, setCustomHeight] = useState<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'image/svg+xml') {
      setSvgFile(file)
      const url = URL.createObjectURL(file)
      setSvgUrl(url)
      setPngUrl('')
      setError(null)
      loadSvgDimensions(url)
      toast.success('SVG file uploaded successfully!')
    } else {
      toast.error('Please upload a valid SVG file.')
    }
  }

  const handleUrlInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setSvgUrl(url)
    setPngUrl('')
    setError(null)
    if (url) {
      loadSvgDimensions(url)
    }
  }

  const loadSvgDimensions = (url: string) => {
    const img = new Image()
    img.onload = () => {
      setSvgDimensions({ width: img.width, height: img.height })
      setCustomWidth(img.width)
      setCustomHeight(img.height)
    }
    img.onerror = () => {
      setError('Failed to load SVG dimensions.')
      toast.error('Failed to load SVG.')
    }
    img.src = url
  }

  const handleConvert = useCallback(async () => {
    if (!svgUrl) {
      toast.error('Please upload an SVG file or enter a valid SVG URL.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(svgUrl)
      if (!response.ok) throw new Error('Failed to fetch SVG')
      const svgText = await response.text()
      
      const img = new Image()
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          if (ctx) {
            let targetWidth, targetHeight
            if (exportSize === 'custom') {
              targetWidth = customWidth
              targetHeight = customHeight
            } else {
              const [width, height] = exportSize.split('x').map(Number)
              targetWidth = width
              targetHeight = height
            }

            canvas.width = targetWidth
            canvas.height = targetHeight

            if (showBackground) {
              ctx.fillStyle = backgroundColor
              ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            const aspectRatio = img.width / img.height
            let drawWidth = targetWidth
            let drawHeight = targetHeight
            if (targetWidth / targetHeight > aspectRatio) {
              drawWidth = targetHeight * aspectRatio
            } else {
              drawHeight = targetWidth / aspectRatio
            }
            const x = (targetWidth - drawWidth) / 2
            const y = (targetHeight - drawHeight) / 2

            ctx.drawImage(img, x, y, drawWidth, drawHeight)

            try {
              const pngDataUrl = canvas.toDataURL('image/png')
              setPngUrl(pngDataUrl)
              toast.success('SVG converted to PNG successfully!')
            } catch (e) {
              setError('Failed to generate PNG. The image might be tainted by cross-origin data.')
              toast.error('Conversion failed. Please try uploading the SVG file directly.')
            }
          }
        }
        setIsLoading(false)
      }
      img.onerror = () => {
        setError('Failed to load SVG. Please check the URL or file.')
        toast.error('Failed to load SVG.')
        setIsLoading(false)
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgText)
    } catch (e) {
      setError('Failed to fetch or process the SVG. It might be due to CORS restrictions.')
      toast.error('Failed to process SVG. Try uploading the file directly.')
      setIsLoading(false)
    }
  }, [svgUrl, scale, backgroundColor, showBackground, exportSize, customWidth, customHeight])

  const handleDownload = () => {
    if (pngUrl) {
      const link = document.createElement('a')
      link.href = pngUrl
      link.download = 'converted-image.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('PNG file downloaded successfully!')
    } else {
      toast.error('Please convert the SVG to PNG first.')
    }
  }

  const handleReset = () => {
    setSvgFile(null)
    setSvgUrl('')
    setPngUrl('')
    setScale(1)
    setBackgroundColor('#ffffff')
    setShowBackground(true)
    setError(null)
    setExportSize('custom')
    setCustomWidth(0)
    setCustomHeight(0)
    toast.success('All settings reset.')
  }

  const handleCopySvgCode = async () => {
    if (svgUrl) {
      try {
        const response = await fetch(svgUrl)
        const svgText = await response.text()
        await navigator.clipboard.writeText(svgText)
        toast.success('SVG code copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy SVG code. Please try again.')
      }
    } else {
      toast.error('Please upload an SVG file or enter a valid SVG URL first.')
    }
  }

  return (
    <ToolLayout
      title="SVG to PNG Converter"
      description="Effortlessly transform your scalable vector graphics into high-quality PNG images with customizable options for perfect results"
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Upload SVG or Enter URL</h2>
          <div className="flex flex-col space-y-4">
            <label className="flex flex-col items-center justify-center h-32 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
              <Upload size={32} />
              <span className="mt-2 text-base leading-normal">Select SVG file</span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".svg,image/svg+xml" />
            </label>
            {svgFile && (
              <p className="text-white mt-2">Uploaded File: {svgFile.name}</p>
            )}
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Or enter SVG URL"
                value={svgUrl}
                onChange={handleUrlInput}
                className="flex-grow bg-gray-700 text-white border-gray-600"
              />
              <Button onClick={handleConvert} className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                {isLoading ? 'Converting...' : 'Convert'}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-600 text-white rounded-lg flex items-center">
            <AlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
        )}

        {svgUrl && !error && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">SVG Preview</h3>
            {svgDimensions.width > 0 && svgDimensions.height > 0 && (
              <div className="mb-4 text-white">
                <p>SVG Dimensions: {svgDimensions.width} x {svgDimensions.height}</p>
              </div>
            )}
            <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
              <NextImage 
                src={svgUrl} 
                alt="SVG Preview"
                fill 
                style={{ 
                  objectFit: 'contain',
                  backgroundColor: showBackground ? backgroundColor : 'transparent'
                }}
              />
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Conversion Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scale-slider" className="text-white mb-2 block">Scale: {scale.toFixed(1)}x</Label>
              <Slider
                id="scale-slider"
                min={0.1}
                max={5}
                step={0.1}
                value={scale}
                onChange={(value) => setScale(value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="background-color" className="text-white mb-2 block">Background Color</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="background-color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-grow bg-gray-700 text-white border-gray-600"
                />
                <Button
                  onClick={() => setShowBackground(!showBackground)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {showBackground ? <EyeOff size={20} /> : <Eye size={20} />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="export-size" className="text-white mb-2 block">Export Size</Label>
              <Select
                label="Select export size"
                options={exportSizeOptions}
                selectedKey={exportSize}
                onSelectionChange={(key) => setExportSize(key)}
                className="w-full"
              />
            </div>
            {exportSize === 'custom' && (
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div>
                <Label htmlFor="custom-width" className="text-white mb-2 block">
                  Width
                </Label>
                <Input
                  id="custom-width"
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(Number(e.target.value))}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="custom-height" className="text-white mb-2 block">
                  Height
                </Label>
                <Input
                  id="custom-height"
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(Number(e.target.value))}
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
            </div>
            
            )}
          </div>
        </div>

        {pngUrl && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-4">PNG Preview</h3>
            <div className="relative h-64 bg-gray-700 rounded-lg overflow-hidden">
              <NextImage
                src={pngUrl}
                alt="PNG Preview"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4">
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download size={20} />
            <span className="ml-2">Download PNG</span>
          </Button>
          <Button onClick={handleCopySvgCode} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Copy size={20} />
            <span className="ml-2">Copy SVG Code</span>
          </Button>
          <Button onClick={handleReset} className="bg-yellow-600 hover:bg-yellow-700 text-white">
            <RefreshCw size={20} />
            <span className="ml-2">Reset</span>
          </Button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the SVG to PNG Converter?
        </h2>
        <p className="text-gray-300 mb-4">
          The SVG to PNG Converter is a powerful and user-friendly tool designed to transform Scalable Vector Graphics (SVG) into high-quality Portable Network Graphics (PNG) images. This tool is perfect for designers, developers, and anyone working with vector graphics who needs to convert their scalable designs into raster format for various applications.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/SVGToPNGPreview.png?height=400&width=600" 
            alt="Screenshot of the SVG to PNG Converter interface showing conversion options and a sample converted image" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the SVG to PNG Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Upload your SVG file using the file input or enter a valid SVG URL.</li>
          <li>Adjust the scale to increase or decrease the size of the output PNG.</li>
          <li>Choose a background color for the PNG (optional).</li>
          <li>Toggle background visibility to create transparent PNGs.</li>
          <li>Select an export size preset or enter custom dimensions.</li>
          <li>Click the "Convert" button to generate the PNG image.</li>
          <li>Preview the converted PNG image.</li>
          <li>Download the PNG or copy the original SVG code.</li>
          <li>Use the "Reset" button to start a new conversion.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><Upload className="w-4 h-4 inline-block mr-1" /> <strong>Easy Upload:</strong> Support for both file upload and SVG URL input</li>
          <li><Sliders className="w-4 h-4 inline-block mr-1" /> <strong>Customizable Output:</strong> Adjust scale, background color, and transparency</li>
          <li><Palette className="w-4 h-4 inline-block mr-1" /> <strong>Background Options:</strong> Choose any color or create transparent PNGs</li>
          <li><Maximize2 className="w-4 h-4 inline-block mr-1" /> <strong>Flexible Sizing:</strong> Preset export sizes or custom dimensions</li>
          <li><Eye className="w-4 h-4 inline-block mr-1" /> <strong>Real-time Preview:</strong> See your converted PNG before downloading</li>
          <li><Download className="w-4 h-4 inline-block mr-1" /> <strong>Multiple Export Options:</strong> Download PNG or copy original SVG code</li>
          <li><RefreshCw className="w-4 h-4 inline-block mr-1" /> <strong>Quick Reset:</strong> Easily start a new conversion</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Sliders className="w-6 h-6 mr-2" />
          Advanced Options
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Scale Adjustment:</strong> Fine-tune the size of your PNG output</li>
          <li><strong>Custom Dimensions:</strong> Set exact pixel dimensions for your PNG</li>
          <li><strong>Background Toggle:</strong> Switch between colored and transparent backgrounds</li>
          <li><strong>Color Picker:</strong> Choose any color for your PNG background</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Download className="w-6 h-6 mr-2" />
          Export Options
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>PNG Download:</strong> Save your converted image in high-quality PNG format</li>
          <li><strong>SVG Code Copy:</strong> Copy the original SVG code for use in other projects</li>
          <li><strong>Preset Sizes:</strong> Quick selection of common image dimensions for social media and web use</li>
          <li><strong>Custom Size:</strong> Specify exact dimensions for your exported PNG</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips for Optimal Conversion
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use high-quality SVG files for the best PNG output.</li>
          <li>Adjust the scale to find the right balance between file size and image quality.</li>
          <li>Experiment with background colors to enhance your design.</li>
          <li>Use transparent backgrounds for logos or icons that need to be placed on various colored backgrounds.</li>
          <li>Choose preset sizes for quick conversions tailored to specific platforms.</li>
          <li>For precise control, use custom dimensions to fit your exact requirements.</li>
          <li>Preview your PNG before downloading to ensure it meets your expectations.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Convert SVG icons and logos to PNG for broader browser support</li>
          <li><strong>Graphic Design:</strong> Create raster versions of vector designs for various applications</li>
          <li><strong>Social Media:</strong> Prepare images in correct sizes for different social platforms</li>
          <li><strong>Print Design:</strong> Convert vector graphics to high-resolution PNGs for print materials</li>
          <li><strong>App Development:</strong> Generate PNG assets from SVG designs for mobile applications</li>
          <li><strong>E-commerce:</strong> Create product images and thumbnails from vector graphics</li>
          <li><strong>Digital Marketing:</strong> Prepare banner ads and visual content in PNG format</li>
        </ul>

        <p className="text-gray-300 mt-6">
          Whether you're a web developer, graphic designer, or digital content creator, our SVG to PNG Converter offers a seamless solution for transforming your vector graphics into versatile PNG images. With its user-friendly interface and powerful features, you can quickly and easily convert your SVGs to high-quality PNGs tailored to your specific needs. Start converting your SVGs today and unlock new possibilities for your digital projects!
        </p>
      </div>
    </ToolLayout>
  )
}