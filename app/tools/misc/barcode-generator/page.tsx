'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Sliders, Download, Copy, RefreshCw, Check, AlertCircle } from 'lucide-react'
import JsBarcode from 'jsbarcode'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const barcodeTypes = [
  'CODE128',
  'EAN13',
  'EAN8',
  'UPC',
  'CODE39',
  'ITF14',
  'MSI',
  'pharmacode',
  'codabar'
]

const AdvancedBarcodeGenerator: React.FC = () => {
  const [barcodeData, setBarcodeData] = useState('1234567890')
  const [barcodeType, setBarcodeType] = useState('CODE128')
  const [width, setWidth] = useState(2)
  const [height, setHeight] = useState(100)
  const [fontSize, setFontSize] = useState(20)
  const [textMargin, setTextMargin] = useState(2)
  const [background, setBackground] = useState('#ffffff')
  const [lineColor, setLineColor] = useState('#000000')
  const [margin, setMargin] = useState(10)
  const [displayValue, setDisplayValue] = useState(true)
  const [format, setFormat] = useState('svg')
  const [barcodeImage, setBarcodeImage] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateBarcode = useCallback(() => {
    if (!barcodeData) {
      setError('Please enter barcode data')
      setBarcodeImage('')
      return
    }

    try {
      setError(null)
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, barcodeData, {
        format: barcodeType,
        width,
        height,
        fontSize,
        textMargin,
        background,
        lineColor,
        margin,
        displayValue,
      })

      if (format === 'svg') {
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svgElement.innerHTML = canvas.toDataURL().split(',')[1]
        const svgString = new XMLSerializer().serializeToString(svgElement)
        setBarcodeImage(`data:image/svg+xml;base64,${btoa(svgString)}`)
      } else {
        setBarcodeImage(canvas.toDataURL('image/png'))
      }
    } catch (err) {
      setError('Failed to generate barcode. Please check your input and try again.')
      setBarcodeImage('')
    }
  }, [barcodeData, barcodeType, width, height, fontSize, textMargin, background, lineColor, margin, displayValue, format])

  useEffect(() => {
    generateBarcode()
  }, [generateBarcode])

  const downloadBarcode = () => {
    if (!barcodeImage) return
    const link = document.createElement('a')
    link.href = barcodeImage
    link.download = `barcode.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyBarcodeToClipboard = () => {
    if (!barcodeImage) return
    navigator.clipboard.writeText(barcodeImage).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const resetSettings = () => {
    setBarcodeData('1234567890')
    setBarcodeType('CODE128')
    setWidth(2)
    setHeight(100)
    setFontSize(20)
    setTextMargin(2)
    setBackground('#ffffff')
    setLineColor('#000000')
    setMargin(10)
    setDisplayValue(true)
    setFormat('svg')
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Advanced Barcode Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Barcode Settings</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="barcodeData" className="block text-sm font-medium text-gray-300 mb-1">
                    Barcode Data
                  </label>
                  <input
                    type="text"
                    id="barcodeData"
                    value={barcodeData}
                    onChange={(e) => setBarcodeData(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  />
                </div>
                <div>
                  <label htmlFor="barcodeType" className="block text-sm font-medium text-gray-300 mb-1">
                    Barcode Type
                  </label>
                  <select
                    id="barcodeType"
                    value={barcodeType}
                    onChange={(e) => setBarcodeType(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  >
                    {barcodeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="width" className="block text-sm font-medium text-gray-300 mb-1">
                    Width
                  </label>
                  <input
                    type="range"
                    id="width"
                    min="1"
                    max="5"
                    step="0.5"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-white">{width}</span>
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">
                    Height
                  </label>
                  <input
                    type="range"
                    id="height"
                    min="50"
                    max="200"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-white">{height}</span>
                </div>
                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-300 mb-1">
                    Font Size
                  </label>
                  <input
                    type="range"
                    id="fontSize"
                    min="10"
                    max="30"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-white">{fontSize}</span>
                </div>
                <div>
                  <label htmlFor="textMargin" className="block text-sm font-medium text-gray-300 mb-1">
                    Text Margin
                  </label>
                  <input
                    type="range"
                    id="textMargin"
                    min="0"
                    max="10"
                    value={textMargin}
                    onChange={(e) => setTextMargin(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-white">{textMargin}</span>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="background" className="block text-sm font-medium text-gray-300 mb-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    id="background"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full h-10 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="lineColor" className="block text-sm font-medium text-gray-300 mb-1">
                    Line Color
                  </label>
                  <input
                    type="color"
                    id="lineColor"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="w-full h-10 rounded"
                  />
                </div>
                <div>
                  <label htmlFor="margin" className="block text-sm font-medium text-gray-300 mb-1">
                    Margin
                  </label>
                  <input
                    type="range"
                    id="margin"
                    min="0"
                    max="50"
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-white">{margin}</span>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="displayValue"
                    checked={displayValue}
                    onChange={(e) => setDisplayValue(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="displayValue" className="text-sm font-medium text-gray-300">
                    Display Value
                  </label>
                </div>
                <div>
                  <label htmlFor="format" className="block text-sm font-medium text-gray-300 mb-1">
                    Format
                  </label>
                  <select
                    id="format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                  >
                    <option value="svg">SVG</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Barcode Preview</h2>
            {error ? (
              <div className="bg-red-500 text-white p-4 rounded-lg flex items-center">
                <AlertCircle size={24} className="mr-2" />
                {error}
              </div>
            ) : barcodeImage ? (
              <div className="p-4 rounded-lg flex justify-center items-center" style={{ backgroundColor: background }}>
                <img src={barcodeImage} alt="Generated Barcode" className="max-w-full h-auto" />
              </div>
            ) : (
              <div className="bg-gray-700 text-white p-4 rounded-lg flex items-center justify-center h-32">
                No barcode generated yet
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={downloadBarcode}
              disabled={!barcodeImage}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} className="mr-2" />
              Download Barcode
            </button>
            <button
              onClick={copyBarcodeToClipboard}
              disabled={!barcodeImage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={resetSettings}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Reset Settings
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About Advanced Barcode Generator</h2>
              <p className="text-white">
                This Advanced Barcode Generator allows you to create customized barcodes for various purposes. 
                You can choose from multiple barcode types, adjust appearance settings, and download or copy the generated barcode.
              </p>          
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
              <p className="text-white">
                1. Enter the data you want to encode in the barcode.<br />
                2. Select the desired barcode type from the dropdown menu.<br />
                3. Adjust the width, height, font size, and other appearance settings.<br />
                4. Customize colors for the background and lines.<br />
                5. Choose whether to display the value and select the output format (SVG or PNG).<br />
                6. Preview the generated barcode in real-time.<br />
                7. Download the barcode or copy it to your clipboard.<br />
                8. Use the reset button to return to default settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="list-disc list-inside text-white">
                <li>Support for multiple barcode types (CODE128, EAN13, UPC, etc.)</li>
                <li>Customizable barcode dimensions and appearance</li>
                <li>Real-time preview of the generated barcode</li>
                <li>Color customization for background and lines</li>
                <li>Option to display or hide the barcode value</li>
                <li>SVG and PNG output formats</li>
                <li>Download and copy-to-clipboard functionality</li>
                <li>Reset option to quickly return to default settings</li>
                <li>Responsive design for various screen sizes</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AdvancedBarcodeGenerator