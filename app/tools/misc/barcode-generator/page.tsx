'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Download, Copy, RefreshCw, AlertCircle,} from 'lucide-react'
import JsBarcode from 'jsbarcode'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'

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
        const svgElement = canvas.previousSibling as SVGElement
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
    toast.success('Barcode downloaded successfully!')
  }

  const copyBarcodeToClipboard = () => {
    if (!barcodeImage) return
    navigator.clipboard.writeText(barcodeImage).then(() => {
      toast.success('Barcode copied to clipboard!')
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
    toast.success('Settings reset to default!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Advanced Barcode Generator</h1>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Barcode Preview</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Barcode Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label htmlFor="barcodeData" className="text-white mb-2 block">Barcode Data</Label>
                  <Input
                    id="barcodeData"
                    value={barcodeData}
                    onChange={(e) => setBarcodeData(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="barcodeType" className="text-white mb-2 block">Barcode Type</Label>
                  <Select value={barcodeType} onValueChange={setBarcodeType}>
                    <SelectTrigger id="barcodeType" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select barcode type" />
                    </SelectTrigger>
                    <SelectContent>
                      {barcodeTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="appearance" className="space-y-4">
                <div>
                  <Label htmlFor="width" className="text-white mb-2 block">Width: {width}</Label>
                  <Slider
                    id="width"
                    min={1}
                    max={5}
                    step={0.5}
                    value={width}
                    onChange={(value) => setWidth(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-white mb-2 block">Height: {height}</Label>
                  <Slider
                    id="height"
                    min={50}
                    max={200}
                    step={1}
                    value={height}
                    onChange={(value) => setHeight(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fontSize" className="text-white mb-2 block">Font Size: {fontSize}</Label>
                  <Slider
                    id="fontSize"
                    min={10}
                    max={30}
                    step={1}
                    value={fontSize}
                    onChange={(value) => setFontSize(value)}
                  />
                </div>
              </TabsContent>
              <TabsContent value="colors" className="space-y-4">
                <div>
                  <Label htmlFor="background" className="text-white mb-2 block">Background Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="background"
                      type="color"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="lineColor" className="text-white mb-2 block">Line Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="lineColor"
                      type="color"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={lineColor}
                      onChange={(e) => setLineColor(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4">
                <div>
                  <Label htmlFor="textMargin" className="text-white mb-2 block">Text Margin: {textMargin}</Label>
                  <Slider
                    id="textMargin"
                    min={0}
                    max={10}
                    step={1}
                    value={textMargin}
                    onChange={(value) => setTextMargin(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="margin" className="text-white mb-2 block">Margin: {margin}</Label>
                  <Slider
                    id="margin"
                    min={0}
                    max={50}
                    step={1}
                    value={margin}
                    onChange={(value) => setMargin(value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="displayValue" className="text-white">Display Value</Label>
                  <Switch
                    id="displayValue"
                    checked={displayValue}
                    onCheckedChange={setDisplayValue}
                  />
                </div>
                <div>
                  <Label htmlFor="format" className="text-white mb-2 block">Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="format" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="svg">SVG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button onClick={downloadBarcode} disabled={!barcodeImage} className="bg-green-500 hover:bg-green-600">
            <Download className="mr-2 h-4 w-4" /> Download Barcode
          </Button>
          <Button onClick={copyBarcodeToClipboard} disabled={!barcodeImage} className="bg-blue-500 hover:bg-blue-600">
            <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
          </Button>
          <Button onClick={resetSettings} className="bg-yellow-500 hover:bg-yellow-600">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Settings
          </Button>
        </div>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">About Advanced Barcode Generator</CardTitle>
          </CardHeader>
          <CardContent className="text-white space-y-4">
            <p>
              This Advanced Barcode Generator allows you to create customized barcodes for various purposes. 
              You can choose from multiple barcode types, adjust appearance settings, and download or copy the generated barcode.
            </p>
            <h3 className="text-xl font-semibold">How to Use It?</h3>
            <ol className="list-decimal list-inside">
              <li>Enter the data you want to encode in the barcode.</li>
              <li>Select the desired barcode type from the dropdown menu.</li>
              <li>Adjust the width, height, font size, and other appearance settings.</li>
              <li>Customize colors for the background and lines.</li>
              <li>Choose whether to display the value and select the output format (SVG or PNG).</li>
              <li>Preview the generated barcode in real-time.</li>Failed to generate barcode. Please check your input and try again.
              Barcode Settings
              Content
              Appearance
              Colors
              Advanced
              Barcode Data
              1234567890
              Barcode Type
              
              CODE128
              Download Barcode
              Copy to Clipboard
              Reset Settings
              
              <li>Download the barcode or copy it to your clipboard.</li>
              <li>Use the reset button to return to default settings.</li>
            </ol>
            <h3 className="text-xl font-semibold">Features</h3>
            <ul className="list-disc list-inside">
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
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

export default AdvancedBarcodeGenerator