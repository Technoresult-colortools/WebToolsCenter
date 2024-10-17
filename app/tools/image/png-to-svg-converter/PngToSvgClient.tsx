'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Upload, Download, Info, BookOpen, Lightbulb, Trash, Eye } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools';


export default function PNGtoSVGConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [svgData, setSvgData] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [colorReduction, setColorReduction] = useState(16)
  const [smoothing, setSmoothing] = useState(0)
  const [grayscale, setGrayscale] = useState(false)
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
            color: grayscale ? 'black' : 'color',
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
    setGrayscale(false)
    setConversionMethod('default')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success("Converter reset successfully!")
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
        <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                PNG to SVG Converter
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                PNG to SVG Converter is a powerful tool that allows you to transform your PNG images into scalable vector graphics (SVG) format.
            </p>
        </div>

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
                    <Select value={conversionMethod} onValueChange={(value: 'default' | 'traced' | 'pixel') => setConversionMethod(value)}>
                      <SelectTrigger id="conversionMethod" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select conversion method" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="traced">Traced Outlines</SelectItem>
                        <SelectItem value="pixel">Pixel Perfect</SelectItem>
                      </SelectContent>
                    </Select>
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

                  <div className="flex items-center justify-between">
                    <Label htmlFor="grayscale" className="text-white">Convert to Grayscale</Label>
                    <Switch
                      id="grayscale"
                      checked={grayscale}
                      onCheckedChange={setGrayscale}
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
                  <Button onClick={resetConverter} variant="outline" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
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
              The PNG to SVG Converter is a powerful tool that allows you to transform your PNG (Portable Network Graphics) images into scalable vector graphics (SVG) format. This conversion process enables your images to be resized without loss of quality, making them perfect for responsive web design and high-resolution displays.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the PNG to SVG Converter
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Upload your PNG file by dragging and dropping it into the designated area or clicking to select a file.</li>
              <li>Choose a conversion method: Default, Traced Outlines, or Pixel Perfect.</li>
              <li>Adjust the color reduction to control the number of colors in the output SVG.</li>
              <li>Set the smoothing level to refine the edges of the converted image.</li>
              <li>Optionally, enable the grayscale conversion for a black and white SVG.</li>
              <li>Click the "Convert to SVG" button to process your image.</li>
              <li>Once converted, you can preview the SVG, download it, or copy the SVG code.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Support for PNG image uploads</li>
              <li>Drag and drop functionality</li>
              <li>Multiple conversion methods</li>
              <li>Color reduction control</li>
              <li>Smoothing adjustment</li>
              <li>Grayscale option</li>
              <li>Real-time preview</li>
              <li>One-click download</li>
              <li>Mobile-responsive design</li>
            </ul>
          </div>
        </main>
       </div> 
      <Footer />
    </div>
  )
}