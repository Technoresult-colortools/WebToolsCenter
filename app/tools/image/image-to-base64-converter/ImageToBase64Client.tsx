'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, Copy, Download, ImageIcon, AlertCircle, Info, BookOpen, Lightbulb, FileText, Trash2 } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Toaster, toast } from 'react-hot-toast'
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NextImage from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ConvertedImage {
  name: string
  size: number
  type: string
  base64: string
}

export default function ImageToBase64Converter() {
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'converted'>('upload')
  const [sortOrder, setSortOrder] = useState<'name' | 'size' | 'type'>('name')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    let files: FileList | null = null
    if (event.type === 'change') {
      files = (event as React.ChangeEvent<HTMLInputElement>).target.files
    } else if (event.type === 'drop') {
      files = (event as React.DragEvent<HTMLDivElement | HTMLLabelElement>).dataTransfer.files
    }

    if (!files) return

    setError(null)

    const maxSizeInBytes = 10 * 1024 * 1024 // 10MB

    const validFiles = Array.from(files).filter(file => {
      if (file.size > maxSizeInBytes) {
        setError(`File "${file.name}" exceeds the 10MB size limit.`)
        toast.error(`File "${file.name}" exceeds the 10MB size limit.`)
        return false
      }
      return true
    })

    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setConvertedImages(prev => [...prev, {
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64
        }])
        toast.success(`${file.name} converted successfully!`)
      }
      reader.readAsDataURL(file)
    })

    setActiveTab('converted')
  }, []);

  const copyToClipboard = useCallback((base64: string) => {
    navigator.clipboard.writeText(base64).then(() => {
      toast.success('Base64 string copied to clipboard!')
    })
  }, [])

  const downloadBase64 = useCallback((base64: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = base64
    link.download = `${fileName.split('.')[0]}_base64.txt`
    link.click()
    toast.success(`Base64 string for ${fileName} downloaded!`)
  }, [])

  const removeImage = useCallback((index: number) => {
    setConvertedImages(prev => prev.filter((_, i) => i !== index))
    toast.success('Image removed from the list.')
  }, [])

  const clearAll = useCallback(() => {
    setConvertedImages([])
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('All images cleared.')
  }, [])


  const sortedImages = [...convertedImages].sort((a, b) => {
    switch (sortOrder) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return a.size - b.size
      case 'type':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  const downloadAllBase64 = useCallback(async () => {
    try {
      const JSZip = (await import('jszip')).default
      const zip = new JSZip()
      
      convertedImages.forEach(img => {
        zip.file(`${img.name.split('.')[0]}_base64.txt`, img.base64)
      })
      
      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = 'base64_images.zip'
      link.click()
      toast.success('All Base64 strings downloaded as ZIP!')
    } catch (error) {
      console.error('Error creating zip file:', error)
      toast.error('Failed to create ZIP file. Please try again.')
    }
  }, [convertedImages])

  return (
    <ToolLayout
      title="Image to Base64 Converter"
      description="Effortlessly convert your images to Base64 encoded strings for easy embedding in HTML, CSS, or JavaScript"
    >
      <Toaster position="top-right" />

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'converted')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="converted">Converted Images</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mb-2 mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Upload Images</h2>
              <label
                className="flex flex-col items-center justify-center h-54 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300"
              >
                <Upload size={48} />
                <span className="mt-2 text-base leading-normal">Select or drop file(s)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                />
              </label>
              {error && (
                <div className="mt-4 p-4 bg-red-500 text-white rounded-lg flex items-center">
                  <AlertCircle className="mr-2" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="converted">
          {convertedImages.length > 0 && (
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mb-2 mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Converted Images</h2>
                <div className="flex space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Sort By</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-700 text-white border-gray-600">
                      <DropdownMenuItem onClick={() => setSortOrder('name')}>Name</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder('size')}>Size</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder('type')}>Type</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={downloadAllBase64} className="bg-green-500 hover:bg-green-600">
                    <Download size={14} className="mr-2" />
                    Download All
                  </Button>
                  <Button onClick={clearAll} className="bg-red-500 hover:bg-red-600">
                    <Trash2 size={14} className="mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {sortedImages.map((img, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">{img.name}</h3>
                      <button
                        onClick={() => removeImage(index)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex items-center mb-2">
                      <ImageIcon className="w-5 h-5 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-400">{(img.size / 1024).toFixed(2)} KB</span>
                      <FileText className="w-5 h-5 ml-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-400">{img.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Button
                        onClick={() => copyToClipboard(img.base64)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Copy size={14} className="mr-2" />
                        Copy Base64
                      </Button>
                      <Button
                        onClick={() => downloadBase64(img.base64, img.name)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Download size={14} className="mr-2" />
                        Download Base64
                      </Button>
                    </div>
                    <div className="relative h-40 bg-gray-600 rounded-lg overflow-hidden">
                      <img
                        src={img.base64}
                        alt={img.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold text-white mb-1">Base64 Preview:</h4>
                      <p className="text-xs text-gray-400 break-all">
                        {img.base64.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Image to Base64 Converter?
        </h2>
        <p className="text-gray-300 mb-4">
          The Image to Base64 Converter is a powerful tool designed to transform image files into Base64 encoded strings. This conversion process is essential for developers and designers who need to embed image data directly into their HTML, CSS, or JavaScript files, or for those who need to transmit image data as plain text in various applications.
        </p>
        <p className="text-gray-300 mb-4">
          Base64 encoding is a method of representing binary data using a set of 64 characters. This makes it possible to include image data within text-based formats, which is particularly useful in web development and data transmission scenarios where binary data cannot be directly used.
        </p>
        <div className="my-8">
          <NextImage 
            src="/Images/ImagetoBase64Preview.png?height=400&width=600" 
            alt="Screenshot of the Image to Base64 Converter is a powerful tool designed to transform image files into Base64 encoded strings." 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Image to Base64 Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Navigate to the "Upload" tab.</li>
          <li>Click on the upload area to select image files or drag and drop image files into the designated zone.</li>
          <li>The tool will automatically convert your images to Base64 format.</li>
          <li>Switch to the "Converted Images" tab to view and manage your converted images.</li>
          <li>For each converted image, you can:</li>
          <ul className="list-disc list-inside ml-6 text-gray-300 space-y-2 text-sm md:text-base">
            <li>Copy the Base64 string to your clipboard.</li>
            <li>Download the Base64 string as a text file.</li>
            <li>View a preview of the image.</li>
            <li>Remove individual images as needed.</li>
          </ul>
          <li>Use the "Sort By" dropdown to organize your converted images.</li>
          <li>Download all Base64 strings as a ZIP file or clear all converted images using the respective buttons.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features of Image to Base64 Converter
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Support for multiple image file uploads.</li>
          <li>Drag and drop functionality for easy file selection.</li>
          <li>Preview converted images before copying or downloading.</li>
          <li>Copy Base64 encoded strings directly to your clipboard.</li>
          <li>Download individual Base64 encoded strings as text files.</li>
          <li>Batch download all converted Base64 strings as a ZIP file.</li>
          <li>Sort converted images by name, size, or file type.</li>
          <li>Remove individual images or clear all converted images.</li>
          <li>10MB file size limit per image for optimal performance.</li>
          <li>Responsive design for seamless use on desktop and mobile devices.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Embed small images directly into HTML or CSS files to reduce HTTP requests and improve page load times.</li>
          <li><strong>Email Templates:</strong> Include images in HTML emails without relying on external image hosting.</li>
          <li><strong>Data URIs:</strong> Create data URIs for use in web applications, allowing inline embedding of resources.</li>
          <li><strong>API Development:</strong> Transmit image data as part of JSON payloads in RESTful APIs.</li>
          <li><strong>Canvas Manipulation:</strong> Load images into HTML5 canvas elements for further processing or manipulation.</li>
          <li><strong>Offline Applications:</strong> Store image data within IndexedDB or localStorage for offline-capable web apps.</li>
          <li><strong>Version Control:</strong> Include small images in version-controlled documents or markdown files.</li>
          <li><strong>Data Visualization:</strong> Embed icons or small graphics in data visualization libraries that accept Base64 encoded images.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <AlertCircle className="w-6 h-6 mr-2" />
          Limitations and Considerations
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Base64 encoding increases the file size by approximately 33%, which may not be ideal for large images.</li>
          <li>The tool has a 10MB file size limit per image to ensure optimal performance.</li>
          <li>Base64 encoded images cannot leverage browser caching, potentially impacting performance for frequently used images.</li>
          <li>Some older browsers may have limitations on the maximum length of data URIs they can handle.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          The Image to Base64 Converter is an invaluable tool for developers, designers, and anyone working with web technologies. By simplifying the process of converting images to Base64 strings, it enables seamless integration of image data into various web development workflows. Whether you're optimizing web performance, working on offline applications, or streamlining your development process, this tool provides a quick and efficient solution for your image encoding needs.
        </p>
      </div>
    </ToolLayout>
  )
}