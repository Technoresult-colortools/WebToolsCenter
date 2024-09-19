'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Upload, X, Download, RefreshCw, Sliders, Eye, EyeOff } from 'lucide-react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

interface Filter {
  name: string
  cssFilter: string
  intensity: number
}

export default function ImageFilters() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null)
  const [intensity, setIntensity] = useState(100)
  const [showOriginal, setShowOriginal] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const filters: Filter[] = [
    { name: 'Grayscale', cssFilter: 'grayscale', intensity: 100 },
    { name: 'Sepia', cssFilter: 'sepia', intensity: 100 },
    { name: 'Blur', cssFilter: 'blur', intensity: 10 },
    { name: 'Brightness', cssFilter: 'brightness', intensity: 200 },
    { name: 'Contrast', cssFilter: 'contrast', intensity: 200 },
    { name: 'Hue Rotate', cssFilter: 'hue-rotate', intensity: 360 },
    { name: 'Invert', cssFilter: 'invert', intensity: 100 },
    { name: 'Saturate', cssFilter: 'saturate', intensity: 200 },
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
    const intensityValue = selectedFilter.cssFilter === 'blur' 
      ? `${intensity / 10}px` 
      : selectedFilter.cssFilter === 'hue-rotate'
        ? `${intensity}deg`
        : `${intensity}%`
    return `${selectedFilter.cssFilter}(${intensityValue})`
  }

  const downloadFilteredImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'filtered-image.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image Filters</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mb-2 mx-auto">
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
                <div className="relative h-96 bg-gray-700 rounded-lg overflow-hidden">
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
                <button
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600 transition duration-300"
                  onClick={resetImage}
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {imageSrc && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Apply Filters</h3>
                <button
                  onClick={toggleOriginal}
                  className={`px-4 py-2 rounded ${
                    showOriginal
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {showOriginal ? 'Show Filtered' : 'Show Original'}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {filters.map((filter) => (
                  <button
                    key={filter.name}
                    onClick={() => {
                      setSelectedFilter(filter)
                      setIntensity(filter.cssFilter === 'blur' ? 5 : 100)
                      setShowOriginal(false)
                    }}
                    className={`px-4 py-2 rounded ${
                      selectedFilter?.name === filter.name
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
              {selectedFilter && (
                <div className="mb-6">
                  <label htmlFor="intensity" className="block text-sm font-medium text-white mb-2">
                    Intensity
                  </label>
                  <div className="flex items-center">
                    <Sliders size={20} className="text-white mr-2" />
                    <input
                      type="range"
                      id="intensity"
                      min="0"
                      max={selectedFilter.intensity}
                      value={intensity}
                      onChange={(e) => {
                        setIntensity(Number(e.target.value))
                        setShowOriginal(false)
                      }}
                      className="w-full"
                    />
                    <span className="ml-2 text-white">{intensity}</span>
                  </div>
                </div>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setSelectedFilter(null)
                    applyFilter()
                    setShowOriginal(true)
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 flex items-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Reset Filter
                </button>
                <button
                  onClick={downloadFilteredImage}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Download Filtered Image
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About Image Filters</h2>
              <p className="text-white">
                This Image Filters tool allows you to apply various filters to your uploaded images. 
                You can adjust the intensity of each filter and compare the filtered image with the original. 
                Once you're satisfied with the result, you can download the filtered image.
              </p>          
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
              <p className="text-white">
                1. Upload an image by clicking on the upload area.<br />
                2. Select a filter from the available options.<br />
                3. Adjust the filter intensity using the slider.<br />
                4. Use the "Show Original" / "Show Filtered" button to compare the images.<br />
                5. Click "Reset Filter" to remove the current filter.<br />
                6. When satisfied, click "Download Filtered Image" to save your work.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Available Filters</h2>
              <ul className="list-disc list-inside text-white">
                <li>Grayscale</li>
                <li>Sepia</li>
                <li>Blur</li>
                <li>Brightness</li>
                <li>Contrast</li>
                <li>Hue Rotate</li>
                <li>Invert</li>
                <li>Saturate</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}