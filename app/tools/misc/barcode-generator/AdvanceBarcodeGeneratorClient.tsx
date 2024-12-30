'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select } from '@/components/ui/select1';
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { Download, Copy, RefreshCw, Info, Lightbulb, BookOpen, Share2 } from 'lucide-react'
import JsBarcode from 'jsbarcode'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Image from 'next/image'

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
    <ToolLayout
      title="Barcode Generator"
      description="Create Customized Barcode for various purposes"
    >

      <Toaster position="top-right" />

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
              <h2 className="text-2xl font-bold text-white mb-4">Generated Barcode</h2>
              <div className="bg-white p-4 rounded-md mb-4">
                {svgData && <img src={svgData} alt="Generated Barcode" className="mx-auto" />}
              </div>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button onClick={handleDownload} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download
                </Button>
                <Button onClick={handleCopyToClipboard} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy SVG
                </Button>
                <Button onClick={generateBarcode} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">
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
                  <Label htmlFor="barcode-type" className="text-white mb-2 block">
                    Barcode Type
                  </Label>
                  <Select
                    label="Select barcode type"
                    options={barcodeTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    selectedKey={barcodeType}
                    onSelectionChange={(key) => setBarcodeType(key as string)}
                    
                  />
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

        <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About BarCode Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          Our BarCode Generator is a powerful tool designed to create customizable barcodes for various purposes. Whether you need barcodes for inventory management, product labeling, or any other application, this generator offers a wide range of options to create barcodes that meet your specific requirements.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/BarCodeGeneratorPreview.png?height=400&width=600" 
            alt="Screenshot of the Bar Code Generator interface showing barcode options and generated barcode" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>🔢 Multiple Barcode Types: Support for various barcode formats including CODE128, EAN13, UPC, CODE39, and more.</li>
          <li>🎨 Customizable Appearance: Adjust width, height, colors, and font size to match your needs.</li>
          <li>📏 Flexible Sizing: Create barcodes of different sizes to fit various applications.</li>
          <li>🖼️ Background Color: Customize the background color to match your design requirements.</li>
          <li>✍️ Text Display Options: Choose whether to display the barcode text or hide it.</li>
          <li>💾 Easy Download: Download your generated barcode as a PNG image.</li>
          <li>📋 Copy SVG: Copy the barcode as SVG for easy integration into digital designs.</li>
          <li>🔄 Instant Regeneration: Quickly regenerate barcodes with new settings.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use BarCode Generator?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
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

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips & Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Ensure your barcode data matches the format required by the selected barcode type.</li>
          <li>For retail applications, consider using EAN13 or UPC formats which are widely recognized.</li>
          <li>Adjust the width and height to ensure the barcode is easily scannable in your intended application.</li>
          <li>Use contrasting colors for the background and lines to improve scannability.</li>
          <li>Test your generated barcodes with different scanners to ensure compatibility.</li>
          <li>When printing barcodes, ensure your printer resolution is high enough for clear reproduction.</li>
          <li>For digital use, the SVG format provides better scalability without loss of quality.</li>
          <li>Regularly update your barcode data to reflect changes in your inventory or product information.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Share2 className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Retail: Generate barcodes for product labeling and inventory management.</li>
          <li>Logistics: Create barcodes for tracking packages and shipments.</li>
          <li>Libraries: Generate barcodes for book cataloging and checkout systems.</li>
          <li>Healthcare: Produce barcodes for patient identification and medication tracking.</li>
          <li>Asset Management: Create barcodes for tracking company assets and equipment.</li>
          <li>Event Management: Generate ticket barcodes for events and conferences.</li>
          <li>Manufacturing: Use barcodes for production line tracking and quality control.</li>
          <li>Warehousing: Implement barcode systems for efficient inventory control.</li>
          <li>Marketing: Create QR codes (a type of 2D barcode) for promotional materials and product packaging.</li>
          <li>Document Management: Use barcodes for organizing and retrieving important documents.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          The Bar Code Generator is an essential tool for businesses and individuals looking to implement efficient tracking and identification systems. By providing a wide range of customization options and supporting multiple barcode formats, this tool enables users to create barcodes tailored to their specific needs. Whether you're managing inventory, organizing assets, or streamlining operations, our Bar Code Generator offers the flexibility and functionality to support your barcode generation requirements.
        </p>
      </CardContent>
    </Card>
  </ToolLayout>
  )
}