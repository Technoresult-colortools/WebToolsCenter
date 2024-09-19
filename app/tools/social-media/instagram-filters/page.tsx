'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, Download, RefreshCw, Maximize2, Minimize2, Image as ImageIcon } from 'lucide-react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

const filters = [
  'Normal', 'Clarendon', 'Gingham', 'Moon', 'Lark', 'Reyes', 'Juno', 'Slumber', 'Crema', 'Ludwig', 'Aden', 'Perpetua', 'Valencia', 'XProII', 'Hefe', 'Sierra', 'Amaro', 'Mayfair', 'Willow',
]

const filterStyles = {
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
    Walden: "saturate(1.2) sepia(0.2) brightness(1.1) contrast(1.1)",
    Hefe: "contrast(1.2) brightness(1.05) saturate(1.3)",
    Valencia: "brightness(1.1) contrast(1.1) sepia(0.3) saturate(1.2)",
    XProII: "contrast(1.2) brightness(1.1) saturate(1.4) sepia(0.2)",
    Sierra: "contrast(0.9) brightness(1.1) saturate(1.1) sepia(0.3)",
    Nashville: "brightness(1.2) contrast(1.1) sepia(0.2) saturate(1.3)",
  };

const InstagramFilters: React.FC = () => {
  const [image, setImage] = useState<string | null>(null)
  const [filter, setFilter] = useState('Normal')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

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

  const downloadImage = () => {
    if (imageRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = imageRef.current.naturalWidth
      canvas.height = imageRef.current.naturalHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.filter = filterStyles[filter as keyof typeof filterStyles]
        ctx.drawImage(imageRef.current, 0, 0)
        const link = document.createElement('a')
        link.download = `instagram_${filter}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Instagram Filters</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <div
              className="border-2 border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {image ? (
                <div className="relative">
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Uploaded"
                    className="max-w-full h-auto mx-auto"
                    style={{
                      filter: filterStyles[filter as keyof typeof filterStyles],
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }}
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

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-8">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
              disabled={!image}
            >
              <Upload className="mr-2" />
              Change Image
            </button>
            <button
              onClick={downloadImage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
              disabled={!image}
            >
              <Download className="mr-2" />
              Download
            </button>
            <button
              onClick={() => {
                setImage(null)
                setFilter('Normal')
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center"
              disabled={!image}
            >
              <RefreshCw className="mr-2" />
              Reset
            </button>
            <button
              onClick={toggleFullscreen}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300 flex items-center"
            >
              {isFullscreen ? <Minimize2 className="mr-2" /> : <Maximize2 className="mr-2" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About Instagram Filters</h2>
              <p className="text-white">
                This Instagram Filters tool allows you to apply popular Instagram-style filters to your images. 
                You can upload an image, choose from various filters, and download the edited result. 
                The tool provides a real-time preview of the applied filter and displays the image dimensions.
              </p>          
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
              <p className="text-white">
                1. Upload an image by clicking on the upload area or dragging and dropping a file.<br />
                2. Select a filter from the available options to apply it to your image.<br />
                3. Use the "Change Image" button to upload a different image.<br />
                4. Click the "Download" button to save your filtered image.<br />
                5. Use the "Reset" button to remove the current image and filter.<br />
                6. Toggle fullscreen mode for a better view of your image.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="list-disc list-inside text-white">
                <li>12 popular Instagram-style filters</li>
                <li>Real-time filter preview</li>
                <li>Image dimension display</li>
                <li>Drag and drop image upload</li>
                <li>Responsive design for various screen sizes</li>
                <li>Download filtered images</li>
                <li>Fullscreen mode for better viewing</li>
                <li>Reset functionality</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default InstagramFilters