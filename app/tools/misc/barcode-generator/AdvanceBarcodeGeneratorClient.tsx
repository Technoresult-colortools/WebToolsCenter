'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { Download, Copy, RefreshCw } from 'lucide-react'
import JsBarcode from 'jsbarcode'
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const barcodeTypes = [
  'CODE128', 'EAN13', 'EAN8', 'UPC', 'CODE39',
  'ITF14', 'MSI', 'pharmacode', 'codabar'
]

export default function BarCodeGenerator() {
  const [barcodeData, setBarcodeData] = useState('1234567890')
  const [barcodeType, setBarcodeType] = useState('CODE128')
  const [width, setWidth] = useState(2)
  const [height, setHeight] = useState(100)
  const [fontSize, setFontSize] = useState(20)
  const [background, setBackground] = useState('#ffffff')
  const [lineColor, setLineColor] = useState('#000000')
  const [showText, setShowText] = useState(true)
  const [svgData, setSvgData] = useState('')

  useEffect(() => {
    generateBarcode()
  }, [barcodeData, barcodeType, width, height, fontSize, background, lineColor, showText])

  const generateBarcode = () => {
    try {
      const canvas = document.createElement('canvas')
      JsBarcode(canvas, barcodeData, {
        format: barcodeType,
        width,
        height,
        fontSize,
        background,
        lineColor,
        displayValue: showText
      })
      setSvgData(canvas.toDataURL('image/png'))
    } catch (error) {
      toast.error('Error generating barcode. Please check your input.')
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = svgData
    link.download = `barcode-${barcodeData}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Barcode downloaded successfully!')
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(svgData).then(() => {
      toast.success('Barcode SVG copied to clipboard!')
    }, () => {
      toast.error('Failed to copy barcode SVG.')
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <Toaster position="top-right" />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Bar Code Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
              <h2 className="text-2xl font-bold text-white mb-4">Generated Barcode</h2>
              <div className="bg-white p-4 rounded-md mb-4">
                {svgData && <img src={svgData} alt="Generated Barcode" className="mx-auto" />}
              </div>
              <div className="flex space-x-4">
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </Button>
                <Button onClick={handleCopyToClipboard} className="bg-green-600 hover:bg-green-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy SVG
                </Button>
                <Button onClick={generateBarcode} className="bg-purple-600 hover:bg-purple-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Barcode Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="barcode-data" className="text-white mb-2 block">Barcode Data</Label>
                  <Input
                    id="barcode-data"
                    value={barcodeData}
                    onChange={(e) => setBarcodeData(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

                <div>
                  <Label htmlFor="barcode-type" className="text-white mb-2 block">Barcode Type</Label>
                  <Select value={barcodeType} onValueChange={setBarcodeType}>
                    <SelectTrigger id="barcode-type" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select barcode type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      {barcodeTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="width-slider" className="text-white mb-2 block">Width: {width}</Label>
                  <Slider
                    id="width-slider"
                    min={1}
                    max={5}
                    step={0.1}
                    value={width}
                    onChange={(value) => setWidth(value)}
                  />
                </div>

                <div>
                  <Label htmlFor="height-slider" className="text-white mb-2 block">Height: {height}</Label>
                  <Slider
                    id="height-slider"
                    min={50}
                    max={200}
                    step={1}
                    value={height}
                    onChange={(value) => setHeight(value)}
                  />
                </div>

                <div>
                  <Label htmlFor="font-size-slider" className="text-white mb-2 block">Font Size: {fontSize}</Label>
                  <Slider
                    id="font-size-slider"
                    min={10}
                    max={30}
                    step={1}
                    value={fontSize}
                    onChange={(value) => setFontSize(value)}
                  />
                </div>

                <div>
                  <Label htmlFor="background-color" className="text-white mb-2 block">Background Color</Label>
                  <Input
                    id="background-color"
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 h-10 w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="line-color" className="text-white mb-2 block">Line Color</Label>
                  <Input
                    id="line-color"
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 h-10 w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-text"
                    checked={showText}
                    onCheckedChange={setShowText}
                  />
                  <Label htmlFor="show-text" className="text-white">Show Text</Label>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Bar Code Generator</h2>
          <p className="text-gray-300 mb-4">
            Our Bar Code Generator is a powerful tool designed to create customizable barcodes for various purposes. Whether you need barcodes for inventory management, product labeling, or any other application, this generator offers a wide range of options to create barcodes that meet your specific requirements.
          </p>
          <h3 className="text-xl font-bold text-white mt-4 mb-2">Key Features:</h3>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>🔢 <strong>Multiple Barcode Types:</strong> Support for various barcode formats including CODE128, EAN13, UPC, CODE39, and more.</li>
            <li>🎨 <strong>Customizable Appearance:</strong> Adjust width, height, colors, and font size to match your needs.</li>
            <li>📏 <strong>Flexible Sizing:</strong> Create barcodes of different sizes to fit various applications.</li>
            <li>🖼️ <strong>Background Color:</strong> Customize the background color to match your design requirements.</li>
            <li>✍️ <strong>Text Display Options:</strong> Choose whether to display the barcode text or hide it.</li>
            <li>💾 <strong>Easy Download:</strong> Download your generated barcode as a PNG image.</li>
            <li>📋 <strong>Copy SVG:</strong> Copy the barcode as SVG for easy integration into digital designs.</li>
            <li>🔄 <strong>Instant Regeneration:</strong> Quickly regenerate barcodes with new settings.</li>
          </ul>
          <h3 className="text-xl font-bold text-white mb-2">How to Use:</h3>
          <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">
            <li>Enter the data you want to encode in the "Barcode Data" field.</li>
            <li>Select the appropriate barcode type from the dropdown menu.</li>
            <li>Adjust the width, height, and font size using the sliders.</li>
            <li>Choose background and line colors using the color pickers.</li>
            <li>Toggle the "Show Text" switch to display or hide the barcode text.</li>
            <li>The barcode will automatically generate based on your settings.</li>
            <li>Use the "Download" button to save the barcode as a PNG image.</li>
            <li>Use the "Copy SVG" button to copy the barcode as an SVG for digital use.</li>
            <li>Click "Regenerate" if you want to refresh the barcode with the same settings.</li>
          </ol>
          <h3 className="text-xl font-bold text-white mb-2">Tips and Tricks:</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Ensure your barcode data matches the format required by the selected barcode type.</li>
            <li>For retail applications, consider using EAN13 or UPC formats which are widely recognized.</li>
            <li>Adjust the width and height to ensure the barcode is easily scannable in your intended application.</li>
            <li>Use contrasting colors for the background and lines to improve scannability.</li>
            <li>Test your generated barcodes with different scanners to ensure compatibility.</li>
            <li>When printing barcodes, ensure your printer resolution is high enough for clear reproduction.</li>
            <li>For digital use, the SVG format provides better scalability without loss of quality.</li>
            <li>Regularly update your barcode data to reflect changes in your inventory or product information.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}