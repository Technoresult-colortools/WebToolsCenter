'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input  from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Download, Info, BookOpen, Lightbulb, } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Direction = 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left'

const TriangleGenerator = () => {
  const [direction, setDirection] = useState<Direction>('top')
  const [color, setColor] = useState('#3498db')
  const [width, setWidth] = useState(100)
  const [height, setHeight] = useState(100)
  const [borderRadius, setBorderRadius] = useState(0)
  const [opacity, setOpacity] = useState(100)
  const [rotate, setRotate] = useState(0)
  const [generatedCSS, setGeneratedCSS] = useState('')
  const [previewScale, setPreviewScale] = useState(1)
  const previewRef = useRef<HTMLDivElement>(null)

  const generateCSS = () => {
    let css = `
.triangle {
  width: 0;
  height: 0;
  opacity: ${opacity / 100};
  transform: rotate(${rotate}deg);
`

    switch (direction) {
      case 'top':
        css += `
  border-left: ${width / 2}px solid transparent;
  border-right: ${width / 2}px solid transparent;
  border-bottom: ${height}px solid ${color};
`
        break
      case 'top-right':
        css += `
  border-left: ${height}px solid transparent;
  border-bottom: ${width}px solid ${color};
`
        break
      case 'right':
        css += `
  border-top: ${height / 2}px solid transparent;
  border-bottom: ${height / 2}px solid transparent;
  border-left: ${width}px solid ${color};
`
        break
      case 'bottom-right':
        css += `
  border-left: ${height}px solid transparent;
  border-top: ${width}px solid ${color};
`
        break
      case 'bottom':
        css += `
  border-left: ${width / 2}px solid transparent;
  border-right: ${width / 2}px solid transparent;
  border-top: ${height}px solid ${color};
`
        break
      case 'bottom-left':
        css += `
  border-right: ${height}px solid transparent;
  border-top: ${width}px solid ${color};
`
        break
      case 'left':
        css += `
  border-top: ${height / 2}px solid transparent;
  border-bottom: ${height / 2}px solid transparent;
  border-right: ${width}px solid ${color};
`
        break
      case 'top-left':
        css += `
  border-right: ${height}px solid transparent;
  border-bottom: ${width}px solid ${color};
`
        break
    }

    if (borderRadius > 0) {
      css += `  border-radius: ${borderRadius}%;\n`
    }

    css += '}'

    setGeneratedCSS(css)
  }

  useEffect(() => {
    generateCSS()
  }, [direction, color, width, height, borderRadius, opacity, rotate])

  useEffect(() => {
    if (previewRef.current) {
      const previewSize = 300
      const maxDimension = Math.max(width, height)
      if (maxDimension > previewSize) {
        setPreviewScale(previewSize / maxDimension)
      } else {
        setPreviewScale(1)
      }
    }
  }, [width, height])

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCSS)
    toast.success('CSS copied to clipboard!')
  }

  const handleReset = () => {
    setDirection('top')
    setColor('#3498db')
    setWidth(100)
    setHeight(100)
    setBorderRadius(0)
    setOpacity(100)
    setRotate(0)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedCSS], {type: 'text/css'})
    element.href = URL.createObjectURL(file)
    element.download = 'triangle.css'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleWidthChange = (value: number) => {
    setWidth(Math.max(0, Math.min(500, value)))
  }

  const handleHeightChange = (value: number) => {
    setHeight(Math.max(0, Math.min(500, value)))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CSS Triangle Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Triangle Preview</h2>
              <div 
                ref={previewRef}
                className="relative bg-gray-700 rounded-lg overflow-hidden"
                style={{ width: '360px', height: '300px' }}
              >
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: 0,
                    height: 0,
                    opacity: opacity / 100,
                    transform: `rotate(${rotate}deg) scale(${previewScale})`,
                    ...(() => {
                      switch (direction) {
                        case 'top':
                          return {
                            borderLeft: `${width / 2}px solid transparent`,
                            borderRight: `${width / 2}px solid transparent`,
                            borderBottom: `${height}px solid ${color}`,
                          }
                        case 'top-right':
                          return {
                            borderLeft: `${height}px solid transparent`,
                            borderBottom: `${width}px solid ${color}`,
                          }
                        case 'right':
                          return {
                            borderTop: `${height / 2}px solid transparent`,
                            borderBottom: `${height / 2}px solid transparent`,
                            borderLeft: `${width}px solid ${color}`,
                          }
                        case 'bottom-right':
                          return {
                            borderLeft: `${height}px solid transparent`,
                            borderTop: `${width}px solid ${color}`,
                          }
                        case 'bottom':
                          return {
                            borderLeft: `${width / 2}px solid transparent`,
                            borderRight: `${width / 2}px solid transparent`,
                            borderTop: `${height}px solid ${color}`,
                          }
                        case 'bottom-left':
                          return {
                            borderRight: `${height}px solid transparent`,
                            borderTop: `${width}px solid ${color}`,
                          }
                        case 'left':
                          return {
                            borderTop: `${height / 2}px solid transparent`,
                            borderBottom: `${height / 2}px solid transparent`,
                            borderRight: `${width}px solid ${color}`,
                          }
                        case 'top-left':
                          return {
                            borderRight: `${height}px solid transparent`,
                            borderBottom: `${width}px solid ${color}`,
                          }
                        default:
                          return {}
                      }
                    })(),
                    borderRadius: `${borderRadius}%`,
                  }}
                />
              </div>
              {Math.max(width, height) > 300 && (
                <div className="mt-4">
                  <Label htmlFor="previewScale" className="text-white mb-2 block">Preview Scale</Label>
                  <Slider
                    id="previewScale"
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={previewScale}
                    onChange={(value) => setPreviewScale(value)}
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Triangle Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="direction" className="text-white mb-2 block">Direction</Label>
                  <Select value={direction} onValueChange={(value: Direction) => setDirection(value)}>
                    <SelectTrigger id="direction" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color" className="text-white mb-2 block">Triangle Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 p-1 bg-transparent"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
                <div className='flex-1'>
                  <div className="flex space-x-4">
                    {/* Width Section */}
                    <div className="flex-1">
                      <Label htmlFor="width" className="text-white mb-2 block">Width (px)</Label>
                      <div className="flex items-center space-x-1">
                        <Input
                          type="number"
                          id="width"
                          value={width}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value))}
                          className="w-28 bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                    </div>

                    {/* Height Section */}
                    <div className="flex-1">
                      <Label htmlFor="height" className="text-white mb-2 block">Height (px)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          id="height"
                          value={height}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value))}
                          className="w-28 bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>


                

                <div>
                  <Label htmlFor="borderRadius" className="text-white mb-2 block">Border Radius: {borderRadius}%</Label>
                  <Slider
                    id="borderRadius"
                    min={0}
                    max={50}
                    step={1}
                    value={borderRadius}
                    onChange={(value) => setBorderRadius(value)}
                  />
                </div>

                <div>
                  <Label htmlFor="opacity" className="text-white mb-2 block">Opacity: {opacity}%</Label>
                  <Slider
                    id="opacity"
                    min={0}
                    max={100}
                    step={1}
                    value={opacity}
                    onChange={(value) => setOpacity(value)}
                  />
                </div>

                <div>
                  <Label htmlFor="rotate" className="text-white mb-2 block">Rotate: {rotate}°</Label>
                  <Slider
                    id="rotate"
                    min={0}
                    max={360}
                    step={1}
                    value={rotate}
                    onChange={(value) => setRotate(value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <code className="text-white whitespace-pre-wrap break-all">
                {generatedCSS}
              </code>
            </div>
            <div className="mt-4 flex flex-wrap justify-end space-x-2 space-y-2 sm:space-y-0">
              <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset
              </Button>
              <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Copy className="h-5 w-5 mr-2" />
                Copy CSS
              </Button>
              <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-5 w-5 mr-2" />
                Download CSS
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is the CSS Triangle Generator?
          </h2>
          <p className="text-gray-300 mb-4">
            The CSS Triangle Generator is a powerful tool for creating customizable CSS triangles without using images. It offers a range of options to adjust the triangle's appearance, including direction, size, color, opacity, and rotation. This tool is perfect for web designers and developers looking to add decorative elements or create unique layouts using pure CSS.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use the CSS Triangle Generator
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Choose a triangle direction from the dropdown menu.</li>
            <li>Set the triangle's color using the color picker or by entering a hex value.</li>
            <li>Adjust the width and height using the number inputs or increment/decrement buttons.</li>
            <li>Use the border radius slider to round the corners of your triangle (if desired).</li>
            <li>Adjust the opacity of the triangle using the opacity slider.</li>
            <li>Rotate the triangle using the rotation slider.</li>
            <li>For large triangles, use the preview scale slider to fit the triangle in the preview window.</li>
            <li>Preview your triangle in real-time in the preview area.</li>
            <li>Copy the generated CSS code or download it as a CSS file.</li>
            <li>Use the Reset button to return to default settings if needed.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Eight different triangle directions for versatile design options</li>
            <li>Custom color selection with color picker and hex input</li>
            <li>Precise width and height control with number inputs and increment/decrement buttons</li>
            <li>Border radius option for creating rounded triangles</li>
            <li>Opacity control for transparent triangles</li>
            <li>Rotation feature for angled triangles</li>
            <li>Preview scaling for large triangles</li>
            <li>Real-time preview of the triangle as you adjust settings</li>
            <li>Generated CSS code with one-click copy functionality</li>
            <li>Option to download the CSS as a file</li>
            <li>Reset feature to quickly return to default settings</li>
            <li>Responsive design for use on various devices, including mobile</li>
            <li>User-friendly interface with intuitive controls</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default TriangleGenerator