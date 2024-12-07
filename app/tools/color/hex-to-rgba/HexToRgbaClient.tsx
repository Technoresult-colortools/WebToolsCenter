'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, BookOpen, Info, Lightbulb, RefreshCw, Copy } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Slider from "@/components/ui/Slider"
import ToolLayout from '@/components/ToolLayout'
import { Toaster, toast } from 'react-hot-toast'
import Image from 'next/image'

export default function HexToRgba() {
  const [hex, setHex] = useState<string>('#000000')
  const [alpha, setAlpha] = useState<number>(1)
  const [rgba, setRGBA] = useState<{ r: number; g: number; b: number; a: number }>({ r: 0, g: 0, b: 0, a: 1 })
  const [error, setError] = useState<string>('')

  const hexToRgba = (hex: string, alpha: number) => {
    hex = hex.replace(/^#/, '')
    
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }
    
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    
    return { r, g, b, a: alpha }
  }

  const handleHexChange = (value: string) => {
    setHex(value)
  }

  const handleAlphaChange = (value: number) => {
    setAlpha(value)
  }

  const handleReset = () => {
    setHex('#000000')
    setAlpha(1)
    setError('')
    toast.success('Values reset successfully')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  useEffect(() => {
    const isValidHex = /^#?([0-9A-F]{3}){1,2}$/i.test(hex)
    if (!isValidHex) {
      setError('Please enter a valid Hex color code.')
    } else {
      setError('')
      const rgbaValues = hexToRgba(hex, alpha)
      setRGBA(rgbaValues)
    }
  }, [hex, alpha])

  const rgbaString = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`
  const hexString = hex.startsWith('#') ? hex : `#${hex}`

  return (
    <ToolLayout
      title="Hex to RGBA Converter"
      description="Convert Hex Color Codes to RGBA with Real-time Preview"
    >
      <Toaster position="top-right" />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:order-2">
          <Card className="bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Color Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="w-full h-40 rounded-lg shadow-inner mb-4"
                style={{ backgroundColor: rgbaString }}
              ></div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Hex</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{hexString}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(hexString)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">RGBA</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{rgbaString}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(rgbaString)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:order-1">
          <Card className="bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Hex Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="hex-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Hex Color Code
                </label>
                <Input
                  id="hex-input"
                  type="text"
                  value={hex}
                  onChange={(e) => handleHexChange(e.target.value)}
                  className="w-full bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#000000"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="alpha-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Alpha (0-1)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="alpha-input"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={alpha}
                    onChange={(e) => handleAlphaChange(Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={alpha}
                    onChange={(value) => handleAlphaChange(value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <Button
                onClick={handleReset}
                className="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Hex to RGBA Converter?
        </h2>
        <p className="text-gray-300 mb-4">
          The Hex to RGBA Converter is a powerful tool designed for web developers, designers, and digital artists. It allows you to easily convert hexadecimal color codes to their RGBA (Red, Green, Blue, Alpha) equivalents. This tool is particularly useful when working with web design, CSS styling, or any project that requires precise color management with transparency.
        </p>
        <p className="text-gray-300 mb-4">
          With features like real-time conversion, interactive alpha slider, and support for both 3-digit and 6-digit hex codes, the Hex to RGBA Converter streamlines your workflow and ensures accurate color representation across different formats. It's perfect for creating consistent color schemes, adjusting transparency levels, or simply exploring the relationship between hex and RGBA color representations.
        </p>

        <div className="my-8">
          <Image
            src="/Images/HexToRGBAPreview.png?height=400&width=600"
            alt="Screenshot of the Hex to RGBA Converter interface showing hex input, alpha slider, and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Hex to RGBA Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter a valid hex color code in the input field (with or without the # symbol).</li>
          <li>Adjust the alpha value using the slider or input field (range: 0 to 1).</li>
          <li>Observe the real-time color preview updating as you modify the values.</li>
          <li>View the converted RGBA values in the Color Preview section.</li>
          <li>Use the copy buttons to quickly copy Hex or RGBA values to your clipboard.</li>
          <li>Experiment with different hex codes and alpha values to see how they affect the final color.</li>
          <li>Use the Reset button to quickly return to default values and start a new conversion.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Real-time Hex to RGBA conversion</li>
          <li>Support for both 3-digit and 6-digit hex color codes</li>
          <li>Interactive alpha value slider for precise transparency adjustments</li>
          <li>Live color preview for immediate visual feedback</li>
          <li>One-click copying of Hex and RGBA values to clipboard</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Reset functionality for quick new color explorations</li>
          <li>User-friendly interface with clear, easy-to-read color information</li>
          <li>Error handling for invalid hex codes</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Easily convert hex colors to RGBA for use in CSS, especially when working with transparency.</li>
          <li><strong>Graphic Design:</strong> Translate hex codes to RGBA values for software that supports alpha channels.</li>
          <li><strong>UI/UX Design:</strong> Create consistent color schemes with varying levels of opacity for interface elements.</li>
          <li><strong>Digital Art:</strong> Experiment with color transparency in digital painting or illustration software.</li>
          <li><strong>Brand Identity:</strong> Maintain color consistency across various digital platforms while incorporating transparency.</li>
          <li><strong>Education:</strong> Learn about color theory and the relationship between different color representations.</li>
          <li><strong>Accessibility Testing:</strong> Adjust color opacity to ensure proper contrast and readability in web designs.</li>
          <li><strong>Color Exploration:</strong> Experiment with color combinations and see how transparency affects color perception.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to simplify your color workflow? Start using our Hex to RGBA Converter now and experience the ease of precise color conversion with transparency control. Whether you're a professional web developer working on complex projects or a hobbyist exploring color theory, our tool provides the accuracy and functionality you need. Try it out today and see how it can streamline your design process and enhance your understanding of color spaces!
        </p>
      </div>
    </ToolLayout>
  )
}

