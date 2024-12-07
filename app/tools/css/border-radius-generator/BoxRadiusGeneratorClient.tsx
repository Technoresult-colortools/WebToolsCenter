'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Download, Info, BookOpen, Lightbulb, Maximize2, X, } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import NextImage from 'next/image'

type BorderRadius = {
  topLeft: number
  topRight: number
  bottomRight: number
  bottomLeft: number
}

type BorderRadiusUnit = 'px' | '%' | 'em' | 'rem'


const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']

export default function EnhancedBorderRadiusGenerator() {
  const [borderRadius, setBorderRadius] = useState<BorderRadius>({
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0
  })
  const [width, setWidth] = useState(200)
  const [height, setHeight] = useState(200)
  const [backgroundColor, setBackgroundColor] = useState('#3498db')
  const [css, setCSS] = useState('')
  const [unit, setUnit] = useState<BorderRadiusUnit>('px')
  const [linked, setLinked] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [borderWidth, setBorderWidth] = useState(0)
  const [borderColor, setBorderColor] = useState('#000000')
  const [borderStyle, setBorderStyle] = useState('solid')
  const [showPreview] = useState(true)

  useEffect(() => {
    generateCSS()
  }, [borderRadius, width, height, backgroundColor, unit, borderWidth, borderColor, borderStyle])

  const generateCSS = () => {
    const { topLeft, topRight, bottomRight, bottomLeft } = borderRadius
    const borderRadiusCSS = `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`
    const generatedCSS = `
.border-radius-example {
  width: ${width}px;
  height: ${height}px;
  background-color: ${backgroundColor};
  border-radius: ${borderRadiusCSS};
  border-width: ${borderWidth}px;
  border-color: ${borderColor};
  border-style: ${borderStyle};
}`
    setCSS(generatedCSS)
  }

  const handleRadiusChange = (corner: keyof BorderRadius, value: number) => {
    if (linked) {
      setBorderRadius({
        topLeft: value,
        topRight: value,
        bottomRight: value,
        bottomLeft: value
      })
    } else {
      setBorderRadius(prev => ({ ...prev, [corner]: value }))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'border-radius.css'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('CSS file downloaded!')
  }

  const handleReset = () => {
    setBorderRadius({ topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 })
    setWidth(200)
    setHeight(200)
    setBackgroundColor('#3498db')
    setUnit('px')
    setLinked(false)
    setBorderWidth(0)
    setBorderColor('#000000')
    setBorderStyle('solid')
  }

 

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const renderPreview = () => (
    <div
      className="border-radius-example"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: backgroundColor,
        borderRadius: `${borderRadius.topLeft}${unit} ${borderRadius.topRight}${unit} ${borderRadius.bottomRight}${unit} ${borderRadius.bottomLeft}${unit}`,
        borderWidth: `${borderWidth}px`,
        borderColor: borderColor,
        borderStyle: borderStyle
      }}
    ></div>
  )

  return (
    <ToolLayout
      title="Border Radius Generator"
      description="Create visually appealing and modern UI elements by customizing the corner radii and border properties of boxes"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 shadow-lg p-6 md:p-8 max-w-4xl mx-auto mb-8">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
              <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-center relative" style={{ minHeight: '300px' }}>
                {showPreview && renderPreview()}
                <Button
                  onClick={toggleFullscreen}
                  className="absolute bottom-2 right-2 bg-gray-600 hover:bg-gray-500"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              
                
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <Tabs defaultValue="corners" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="corners">Corners</TabsTrigger>
                  <TabsTrigger value="box">Box</TabsTrigger>
                  <TabsTrigger value="border">Border</TabsTrigger>
                </TabsList>
                <TabsContent value="corners" className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="unit" className="text-white mr-4">Unit:</Label>
                    <Select value={unit} onValueChange={(value: BorderRadiusUnit) => setUnit(value)}>
                      <SelectTrigger id="unit" className="w-24 bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                        <SelectItem value="em">em</SelectItem>
                        <SelectItem value="rem">rem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="linked" className="text-white">Link Corners</Label>
                    <Switch
                      id="linked"
                      checked={linked}
                      onCheckedChange={setLinked}
                    />
                  </div>
                  {(Object.keys(borderRadius) as Array<keyof BorderRadius>).map((corner) => (
                    <div key={corner}>
                      <Label htmlFor={corner} className="text-white capitalize">{corner.replace(/([A-Z])/g, ' $1').trim()}: {borderRadius[corner]}{unit}</Label>
                      <Slider
                        id={corner}
                        min={0}
                        max={unit === 'px' ? 100 : unit === '%' ? 50 : 10}
                        step={unit === 'px' ? 1 : 0.1}
                        value={borderRadius[corner]}
                        onChange={(value) => handleRadiusChange(corner, value)}
                        className='mt-2'
                      />
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="box" className="space-y-4">
                  <div>
                    <Label htmlFor="width" className="text-white">Width: {width}px</Label>
                    <Slider
                      id="width"
                      min={50}
                      max={400}
                      step={1}
                      value={width}
                      onChange={(value) => setWidth(value)}
                      className='mt-2'
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-white">Height: {height}px</Label>
                    <Slider
                      id="height"
                      min={50}
                      max={400}
                      step={1}
                      value={height}
                      onChange={(value) => setHeight(value)}
                      className='mt-2'
                    />
                  </div>
                  <div>
                    <Label htmlFor="backgroundColor" className="text-white">Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-12 p-1 bg-gray-600 border-gray-500 mt-2"
                      />
                      <Input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-grow bg-gray-600 text-white border-gray-500 mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="border" className="space-y-4">
                  <div>
                    <Label htmlFor="borderWidth" className="text-white">Border Width: {borderWidth}px</Label>
                    <Slider
                      id="borderWidth"
                      min={0}
                      max={20}
                      step={1}
                      value={borderWidth}
                      onChange={(value) => setBorderWidth(value)}
                      className='mt-2'
                    />
                  </div>
                  <div>
                    <Label htmlFor="borderColor" className="text-white">Border Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="borderColor"
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-12 h-12 p-1 bg-gray-600 border-gray-500 mt-2"
                      />
                      <Input
                        type="text"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="flex-grow bg-gray-600 text-white border-gray-500 mt-2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="borderStyle" className="text-white">Border Style</Label>
                    <Select value={borderStyle} onValueChange={(value: string) => setBorderStyle(value)}>
                      <SelectTrigger id="borderStyle" className="w-full mt-2 bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select border style" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        {borderStyles.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() +style.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <pre className="text-white whitespace-pre-wrap break-all text-sm">
                {css}
              </pre>
            </div>
            <div className="mt-4 flex flex-wrap justify-between items-center">
              
              <div className="space-x-2">
                <Button onClick={handleReset} variant="destructive" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy CSS
                </Button>
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download CSS
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-3/4 h-3/4 max-h-screen p-4">
            <Button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
            {renderPreview()}
          </div>
        </div>
      )}

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is the Border Radius Generator?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The Border Radius Generator is a powerful and intuitive tool designed for web developers and designers to create visually appealing and modern UI elements. It allows you to easily customize the corner radii and border properties of boxes, providing a wide range of options to suit your design needs.
          </p>
          <p className="text-gray-300 mb-4">
            Whether you're a professional web developer looking to add visual interest to your sites, a designer seeking inspiration, or a hobbyist experimenting with CSS, our Enhanced Border Radius Generator offers a user-friendly interface and advanced features to bring your ideas to life.
          </p>

          <div className="my-8">
            <NextImage 
              src="/Images/BoxRadiusPreview.png?height=400&width=600" 
              alt="Screenshot of the Enhanced Border Radius Generator interface showing preview and customization options" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use the Border Radius Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Use the "Corners" tab to adjust individual corner radii or link them for simultaneous changes.</li>
            <li>Switch between different units (px, %, em, rem) for precise control.</li>
            <li>Customize the box dimensions and background color in the "Box" tab.</li>
            <li>Adjust border properties like width, color, and style in the "Border" tab.</li>
            <li>Preview your changes in real-time with the interactive preview.</li>
            <li>Use the fullscreen mode for a detailed view of your design.</li>
            <li>Copy the generated CSS or download it as a file for use in your projects.</li>
            <li>Utilize the undo/redo functionality to experiment with different designs.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Individual control for each corner's border radius</li>
            <li>Support for multiple units: px, %, em, and rem</li>
            <li>Customizable box dimensions and background color</li>
            <li>Advanced border customization (width, color, style)</li>
            <li>Real-time preview with fullscreen mode</li>
            <li>Undo and redo functionality for easy experimentation</li>
            <li>Generated CSS code with syntax highlighting</li>
            <li>Copy to clipboard and download as file options</li>
            <li>Responsive design for use on various devices</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Web Design:</strong> Create unique button styles, cards, and containers for websites.</li>
            <li><strong>UI/UX Design:</strong> Prototype and fine-tune interface elements for web and mobile apps.</li>
            <li><strong>CSS Learning:</strong> Experiment with CSS properties to understand their effects visually.</li>
            <li><strong>Responsive Design:</strong> Test how different border radii and styles look on various screen sizes.</li>
            <li><strong>Brand Identity:</strong> Maintain consistent styling across web properties by defining standard border styles.</li>
            <li><strong>Accessibility:</strong> Ensure that border radii contribute to, rather than detract from, the usability of your designs.</li>
            <li><strong>Print Design:</strong> While primarily for web, these styles can inspire rounded elements in print materials.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The Border Radius Generator empowers you to create unique, efficient, and visually appealing UI elements for a wide range of projects. By leveraging the power of CSS, you can generate lightweight, scalable designs that enhance your web presence without relying on heavy image files. Whether you're a seasoned developer or just starting out in web design, this tool offers both simplicity and depth to meet your creative needs. Start experimenting with border radii and styles today and elevate your web designs to the next level!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}