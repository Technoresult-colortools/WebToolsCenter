'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Select } from '@/components/ui/select1';
import { Toaster, toast } from 'react-hot-toast'
import { Upload, Download, Info, BookOpen, Lightbulb, Trash, Eye, Scissors, SlidersIcon, Lock, RefreshCw, Smartphone } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'

const conversionMethodOptions = [
  { value: "default", label: "Default" },
  { value: "traced", label: "Traced Outlines" },
  { value: "pixel", label: "Pixel Perfect" },
];

export default function PNGtoSVGConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [svgData, setSvgData] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [colorReduction, setColorReduction] = useState(16)
  const [smoothing, setSmoothing] = useState(0)
  const [conversionMethod, setConversionMethod] = useState<'default' | 'traced' | 'pixel'>('default')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type === "image/png") {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setSvgData(null)
    } else {
      toast.error("Please select a valid PNG file.")
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "image/png") {
      setFile(droppedFile)
      setPreviewUrl(URL.createObjectURL(droppedFile))
      setSvgData(null)
    } else {
      toast.error("Please drop a valid PNG file.")
    }
  }

  const previewSVG = (svgData: string) => {
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.document.title = "SVG Preview";
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const convertToSVG = async () => {
    if (!file) {
      toast.error("Please select a PNG file first.")
      return
    }
  
    const toastId = toast.loading("Converting PNG to SVG...")
  
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
  
      const response = await fetch('/api/convertToSvg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: base64Data,
          options: {
            color: 'color', // Always use color mode
            turdSize: smoothing,
            threshold: Math.floor(255 * (1 - colorReduction / 256)),
            optCurve: true,
            optTolerance: 0.2
          }
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Conversion failed')
      }
  
      const svgData = await response.text()
      console.log('Received SVG:', svgData)
      setSvgData(svgData)
      toast.success("PNG converted to SVG successfully!", { id: toastId })
    } catch (error) {
      console.error('Conversion error:', error)
      toast.error(error instanceof Error ? error.message : "Error during conversion", { id: toastId })
    }
  }

  const downloadSVG = () => {
    if (!svgData) {
      toast.error("No SVG data available. Please convert a PNG file first.")
      return
    }

    const blob = new Blob([svgData], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const resetConverter = () => {
    setFile(null)
    setSvgData(null)
    setPreviewUrl(null)
    setColorReduction(16)
    setSmoothing(0)
    setConversionMethod('default')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success("Converter reset successfully!")
  }

  return (
    <ToolLayout
      title="PNG to SVG Converter"
      description="PNG to SVG Converter is a powerful tool that allows you to transform your PNG images into scalable vector graphics (SVG) format"
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Upload PNG</h2>
            <div 
              className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                type="file"
                accept=".png"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-400">Drag and drop a PNG file here, or click to select</p>
            </div>
            {previewUrl && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Preview:</h3>
                <img src={previewUrl} alt="Preview" className="max-w-full h-auto rounded-lg" />
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Conversion Settings</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="conversionMethod" className="text-white mb-2 block">Conversion Method</Label>
                <Select
                  label="Select Conversion Method"
                  options={conversionMethodOptions}
                  selectedKey={conversionMethod}
                  onSelectionChange={(key) => setConversionMethod(key as "default" | "traced" | "pixel")}
                  className="max-w-full"
                />
              </div>

              <div>
                <Label htmlFor="colorReduction" className="text-white mb-2 block">Color Reduction: {colorReduction}</Label>
                <Slider
                  id="colorReduction"
                  min={2}
                  max={256}
                  step={1}
                  value={colorReduction}
                  onChange={(value) => setColorReduction(value)}
                />
              </div>

              <div>
                <Label htmlFor="smoothing" className="text-white mb-2 block">Smoothing: {smoothing}</Label>
                <Slider
                  id="smoothing"
                  min={0}
                  max={10}
                  step={1}
                  value={smoothing}
                  onChange={(value) => setSmoothing(value)}
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Button onClick={convertToSVG} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Upload className="h-5 w-5 mr-2" />
                Convert to SVG
              </Button>
              <Button onClick={downloadSVG} className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={!svgData}>
                <Download className="h-5 w-5 mr-2" />
                Download SVG
              </Button>
              <Button onClick={resetConverter} variant="destructive" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Trash className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {svgData && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated SVG</h2>
            <div className="bg-white p-4 rounded-lg relative">
              <div 
                dangerouslySetInnerHTML={{ __html: svgData }} 
                className="text-sm overflow-x-auto"
                style={{ maxWidth: '100%', maxHeight: '400px', overflow: 'auto' }}
              />
              <Button 
                onClick={() => previewSVG(svgData)} 
                size="sm" 
                className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the PNG to SVG Converter?
        </h2>
        <p className="text-gray-300 mb-4">
          The PNG to SVG Converter is a powerful and user-friendly tool designed to transform your PNG (Portable Network Graphics) images into scalable vector graphics (SVG) format. This conversion process allows your images to be resized without loss of quality, making them ideal for responsive web design, high-resolution displays, and various graphic design applications.
        </p>
        <p className="text-gray-300 mb-4">
          With customizable settings for color reduction, smoothing, and conversion methods, our tool gives you complete control over the output. Whether you're a web developer, graphic designer, or just someone looking to optimize their images, our PNG to SVG Converter provides a seamless solution for your vector graphic needs.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/PngToSvgPreview.png?height=400&width=600" 
            alt="Screenshot of the PNG to SVG Converter interface showing conversion options and a sample converted image" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the PNG to SVG Converter
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Upload your PNG image by clicking on the designated area or dragging and dropping a file.</li>
          <li>Choose your preferred conversion method: Default, Traced Outlines, or Pixel Perfect.</li>
          <li>Adjust the color reduction setting to control the number of colors in the output SVG.</li>
          <li>Set the smoothing level to refine the edges of the converted image.</li>
          <li>Click "Convert to SVG" to process your image.</li>
          <li>Once converted, preview the SVG output directly in the browser.</li>
          <li>Download the converted SVG file or copy the SVG code for immediate use.</li>
          <li>Use the "Reset" button to start over with a new image or adjust your settings.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><Upload className="w-4 h-4 inline-block mr-1" /> <strong>Easy Upload:</strong> Drag-and-drop or click to upload PNG files</li>
          <li><Scissors className="w-4 h-4 inline-block mr-1" /> <strong>Multiple Conversion Methods:</strong> Choose between Default, Traced Outlines, and Pixel Perfect</li>
          <li><SlidersIcon className="w-4 h-4 inline-block mr-1" /> <strong>Customizable Settings:</strong> Adjust color reduction and smoothing for optimal results</li>
          <li><Eye className="w-4 h-4 inline-block mr-1" /> <strong>Real-time Preview:</strong> View your converted SVG instantly in the browser</li>
          <li><Download className="w-4 h-4 inline-block mr-1" /> <strong>Easy Download:</strong> Get your SVG file with a single click</li>
          <li><Lock className="w-4 h-4 inline-block mr-1" /> <strong>Secure Conversion:</strong> All processing is done client-side for maximum privacy</li>
          <li><RefreshCw className="w-4 h-4 inline-block mr-1" /> <strong>Quick Reset:</strong> Start over easily with the reset functionality</li>
          <li><Smartphone className="w-4 h-4 inline-block mr-1" /> <strong>Responsive Design:</strong> Use on any device, from desktop to mobile</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips for Optimal Conversion
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use high-quality PNG images for the best SVG output.</li>
          <li>Experiment with different conversion methods to find the best fit for your image.</li>
          <li>Adjust color reduction for a balance between file size and image quality.</li>
          <li>Use smoothing to reduce jagged edges in your converted SVG.</li>
          <li>For logos and icons, try the 'Traced Outlines' method for clean, scalable results.</li>
          <li>Use 'Pixel Perfect' for detailed illustrations or when preserving exact pixel information is crucial.</li>
          <li>Preview your SVG in different sizes to ensure it scales well before finalizing.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Create scalable graphics for responsive websites.</li>
          <li><strong>Graphic Design:</strong> Convert raster logos to vector format for professional printing.</li>
          <li><strong>User Interface Design:</strong> Develop crisp, scalable icons and UI elements.</li>
          <li><strong>Digital Publishing:</strong> Prepare images for high-quality digital publications.</li>
          <li><strong>Animation:</strong> Convert PNG frames to SVG for web-based animations.</li>
          <li><strong>Data Visualization:</strong> Transform charts and graphs into scalable vector formats.</li>
          <li><strong>E-commerce:</strong> Optimize product images for faster loading and better quality across devices.</li>
          <li><strong>Mobile App Development:</strong> Create resolution-independent graphics for various screen sizes.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          Ready to transform your PNG images into scalable, high-quality SVG graphics? Our PNG to SVG Converter offers the perfect balance of simplicity and powerful features. Whether you're working on web design, print materials, or digital art, this tool provides the flexibility you need to create stunning vector graphics. Try it now and experience the difference in your projects!
        </p>
      </div>
    </ToolLayout>
  )
}