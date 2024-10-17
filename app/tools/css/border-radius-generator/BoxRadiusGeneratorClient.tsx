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
import { Copy, RefreshCw, Download, Undo, Redo, Info, BookOpen, Lightbulb } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools';

type BorderRadius = {
  topLeft: number
  topRight: number
  bottomRight: number
  bottomLeft: number
}

type BorderRadiusUnit = 'px' | '%'

type HistoryEntry = {
  borderRadius: BorderRadius
  width: number
  height: number
  backgroundColor: string
}

export default function BorderRadiusGenerator() {
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
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  useEffect(() => {
    generateCSS()
    addToHistory()
  }, [borderRadius, width, height, backgroundColor, unit])

  const generateCSS = () => {
    const { topLeft, topRight, bottomRight, bottomLeft } = borderRadius
    const borderRadiusCSS = `${topLeft}${unit} ${topRight}${unit} ${bottomRight}${unit} ${bottomLeft}${unit}`
    const generatedCSS = `
.border-radius-example {
  width: ${width}px;
  height: ${height}px;
  background-color: ${backgroundColor};
  border-radius: ${borderRadiusCSS};
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
  }

  const addToHistory = () => {
    const newEntry: HistoryEntry = {
      borderRadius: { ...borderRadius },
      width,
      height,
      backgroundColor
    }
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newEntry])
    setHistoryIndex(prev => prev + 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1)
      const prevEntry = history[historyIndex - 1]
      setBorderRadius(prevEntry.borderRadius)
      setWidth(prevEntry.width)
      setHeight(prevEntry.height)
      setBackgroundColor(prevEntry.backgroundColor)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1)
      const nextEntry = history[historyIndex + 1]
      setBorderRadius(nextEntry.borderRadius)
      setWidth(nextEntry.width)
      setHeight(nextEntry.height)
      setBackgroundColor(nextEntry.backgroundColor)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
        <Header />
      <Toaster position="top-right" />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
         <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                CSS Border Radius Generator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Create visually appealing and modern UI elements by customizing the corner radii of boxes
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
                <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-center" style={{ minHeight: '300px' }}>
                  <div
                    className="border-radius-example"
                    style={{
                      width: `${width}px`,
                      height: `${height}px`,
                      backgroundColor: backgroundColor,
                      borderRadius: `${borderRadius.topLeft}${unit} ${borderRadius.topRight}${unit} ${borderRadius.bottomRight}${unit} ${borderRadius.bottomLeft}${unit}`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
                <Tabs defaultValue="corners" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="corners">Corners</TabsTrigger>
                    <TabsTrigger value="box">Box</TabsTrigger>
                  </TabsList>
                  <TabsContent value="corners" className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="unit" className="text-white mr-4">Unit:</Label>
                      <Select value={unit} onValueChange={(value: BorderRadiusUnit) => setUnit(value)}>
                        <SelectTrigger id="unit" className="w-24 bg-gray-700 text-white border-gray-600">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent className=" bg-gray-700 text-white border-gray-600">
                          <SelectItem value="px">px</SelectItem>
                          <SelectItem value="%">%</SelectItem>
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
                        <Slider className='mt-2'
                          id={corner}
                          min={0}
                          max={unit === 'px' ? 100 : 50}
                          step={1}
                          value={borderRadius[corner]}
                          onChange={(value) => handleRadiusChange(corner, value)}
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
                          className="w-12 h-12 p-1 bg-gray-600 border-gray-500"
                        />
                        <Input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-grow bg-gray-600 text-white border-gray-500"
                        />
                      </div>
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
                <div className="space-x-2 mb-2 sm:mb-0">
                  <Button onClick={handleUndo} variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={historyIndex <= 0}>
                    <Undo className="h-5 w-5 mr-2" />
                    Undo
                  </Button>
                  <Button onClick={handleRedo} variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={historyIndex >= history.length - 1}>
                    <Redo className="h-5 w-5 mr-2" />
                    Redo
                  </Button>
                </div>
                <div className="space-x-2">
                  <Button onClick={handleReset} variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white">
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
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the Border Radius Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The Border Radius Generator is a versatile tool designed to help you create visually appealing and modern UI elements by customizing the corner radii of boxes. With easy-to-use controls, you can adjust each corner individually or link them for simultaneous changes. This tool supports both pixel and percentage units, allowing you to achieve precise designs effortlessly. Enjoy real-time previews of your adjustments and easily copy the generated CSS for use in your web projects.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Border Radius Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use the "Corners" tab to adjust individual corner radii.</li>
              <li>Toggle "Link Corners" to adjust all corners simultaneously.</li>
              <li>Switch between pixel (px) and percentage (%) units.</li>
              <li>Use the "Box" tab to customize the preview box's dimensions and color.</li>
              <li>Preview your border radius in real-time.</li>
              <li>Use Undo and Redo buttons to navigate through your changes.</li>
              <li>Copy the generated CSS or download it as a file.</li>
              <li>Use the Reset button to start over with default settings.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Individual control for each corner's border radius</li>
              <li>Option to link all corners for simultaneous adjustment</li>
              <li>Support for both pixel (px) and percentage (%) units</li>
              <li>Customizable preview box dimensions and background color</li>
              <li>Real-time preview of the border radius effect</li>
              <li>Undo and Redo functionality for easy experimentation</li>
              <li>Generated CSS code with syntax highlighting</li>
              <li>Copy to clipboard functionality</li>
              <li>Download CSS as a file</li>
              <li>Reset option to quickly return to default settings</li>
              <li>Responsive design for use on various devices</li>
            </ul>
          </div>

        </main>
       </div> 
      <Footer />
    </div>
  )
}