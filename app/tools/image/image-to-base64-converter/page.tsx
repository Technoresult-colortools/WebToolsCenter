'use client'

import React, { useState, useRef } from 'react'
import { Upload, X, Copy, Download, Image as ImageIcon, AlertCircle } from 'lucide-react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

interface ConvertedImage {
  name: string
  size: number
  type: string
  base64: string
}

export default function ImageToBase64Converter() {
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([])
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setError(null)

    const maxSizeInBytes = 5 * 1024 * 1024 // 5MB

    const validFiles = files.filter(file => {
      if (file.size > maxSizeInBytes) {
        setError(`File "${file.name}" exceeds the 5MB size limit.`)
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
      }
      reader.readAsDataURL(file)
    })
  }

  const copyToClipboard = (base64: string) => {
    navigator.clipboard.writeText(base64).then(() => {
      alert('Base64 string copied to clipboard!')
    })
  }

  const downloadBase64 = (base64: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = base64
    link.download = `${fileName.split('.')[0]}_base64.txt`
    link.click()
  }

  const removeImage = (index: number) => {
    setConvertedImages(prev => prev.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setConvertedImages([])
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Image to Base64 Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mb-2 mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Upload Images</h2>
            <label className="flex flex-col items-center justify-center h-64 px-4 py-6 bg-gray-700 text-blue-400 rounded-lg shadow-lg tracking-wide uppercase border-2 border-blue-400 border-dashed cursor-pointer hover:bg-blue-400 hover:text-white transition duration-300">
              <Upload size={48} />
              <span className="mt-2 text-base leading-normal">Select file(s)</span>
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

          {convertedImages.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Converted Images</h2>
                <button
                  onClick={clearAll}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-4">
                {convertedImages.map((img, index) => (
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
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <button
                        onClick={() => copyToClipboard(img.base64)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition duration-300 flex items-center"
                      >
                        <Copy size={14} className="mr-1" />
                        Copy Base64
                      </button>
                      <button
                        onClick={() => downloadBase64(img.base64, img.name)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition duration-300 flex items-center"
                      >
                        <Download size={14} className="mr-1" />
                        Download Base64
                      </button>
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
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About Image to Base64 Converter</h2>
              <p className="text-white">
                This tool allows you to convert image files into Base64 encoded strings. Base64 encoding is useful for embedding image data directly into HTML, CSS, or JavaScript files, or for sending image data as plain text.
              </p>          
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
              <p className="text-white">
                1. Click on the upload area or drag and drop image files.<br />
                2. The tool will automatically convert your images to Base64.<br />
                3. For each converted image, you can:<br />
                   - Copy the Base64 string to your clipboard<br />
                   - Download the Base64 string as a text file<br />
                   - View a preview of the image<br />
                4. You can remove individual images or clear all converted images.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="list-disc list-inside text-white">
                <li>Multiple file upload</li>
                <li>5MB file size limit per image</li>
                <li>Image preview</li>
                <li>Copy Base64 to clipboard</li>
                <li>Download Base64 as text file</li>
                <li>Remove individual images</li>
                <li>Clear all converted images</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}