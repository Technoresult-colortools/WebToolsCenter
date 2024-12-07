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

export default function CMYKtoRGBConverter() {
  const [cmyk, setCMYK] = useState({ c: 0, m: 0, y: 0, k: 0 })
  const [rgb, setRGB] = useState({ r: 255, g: 255, b: 255 })
  const [error, setError] = useState<string>('')

  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
    const r = Math.round(255 * (1 - c / 100) * (1 - k / 100))
    const g = Math.round(255 * (1 - m / 100) * (1 - k / 100))
    const b = Math.round(255 * (1 - y / 100) * (1 - k / 100))
    return { r, g, b }
  }

  const handleCMYKChange = (color: keyof typeof cmyk, value: number) => {
    setCMYK(prev => ({ ...prev, [color]: value }))
  }

  const handleReset = () => {
    setCMYK({ c: 0, m: 0, y: 0, k: 0 })
    setRGB({ r: 255, g: 255, b: 255 })
    setError('')
    toast.success('Values reset successfully')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  useEffect(() => {
    const { c, m, y, k } = cmyk
    if ([c, m, y, k].some(v => v < 0 || v > 100)) {
      setError('Please enter valid CMYK values (0-100).')
    } else {
      setError('')
      const { r, g, b } = cmykToRgb(c, m, y, k)
      setRGB({ r, g, b })
    }
  }, [cmyk])

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  const hexString = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`
  const cmykString = `${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`

  return (
    <ToolLayout
      title="CMYK to RGB Converter"
      description="Convert CMYK Color Codes to RGB with Real-time Preview"
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
                style={{ backgroundColor: rgbString }}
              ></div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">CMYK</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{cmykString}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(cmykString)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">RGB</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{rgbString}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(rgbString)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:order-1">
          <Card className="bg-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">CMYK Input</CardTitle>
            </CardHeader>
            <CardContent>
              {['c', 'm', 'y', 'k'].map((color) => (
                <div key={color} className="mb-4">
                  <label htmlFor={`${color}-input`} className="block text-sm font-medium text-gray-300 mb-2">
                    {color.toUpperCase()} (0-100)
                  </label>
                  <div className="flex items-center space-x-4">
                    <Input
                      id={`${color}-input`}
                      type="number"
                      min="0"
                      max="100"
                      value={cmyk[color as keyof typeof cmyk]}
                      onChange={(e) => handleCMYKChange(color as keyof typeof cmyk, Number(e.target.value))}
                      className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={cmyk[color as keyof typeof cmyk]}
                      onChange={(value) => handleCMYKChange(color as keyof typeof cmyk, value)}
                      className="flex-grow"
                    />
                  </div>
                </div>
              ))}
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
          What is the CMYK to RGB Converter?
        </h2>
        <p className="text-gray-300 mb-4">
          The CMYK to RGB Converter is a sophisticated tool designed for graphic designers, print professionals, and digital artists. It allows you to accurately convert colors from the CMYK color model (used in print) to the RGB color model (used in digital displays). Whether you're preparing artwork for both print and digital media or simply exploring color spaces, our tool provides precise and easy-to-use color conversion.
        </p>
        <p className="text-gray-300 mb-4">
          With features like real-time conversion, interactive sliders, and support for multiple color formats (CMYK, RGB, HEX), the CMYK to RGB Converter is an invaluable resource for anyone working across print and digital mediums. It's perfect for ensuring color consistency between different projects, adapting print designs for digital use, or simply understanding the relationship between CMYK and RGB color spaces.
        </p>

        <div className="my-8">
          <Image
            src="/Images/CMYKtoRGBPreview.png?height=400&width=600"
            alt="Screenshot of the CMYK to RGB Converter interface showing CMYK input sliders, RGB output, and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the CMYK to RGB Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Adjust the CMYK values using the sliders or input fields (range: 0-100 for each component).</li>
          <li>Observe the real-time color preview updating as you modify the values.</li>
          <li>View the converted RGB values and HEX code in the Color Preview section.</li>
          <li>Use the copy buttons to quickly copy CMYK, RGB, or HEX values to your clipboard.</li>
          <li>Experiment with different CMYK combinations to see how they translate to RGB.</li>
          <li>Use the Reset button to quickly return to default values and start a new conversion.</li>
          <li>Refer to the color preview to visually confirm the converted color.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Real-time CMYK to RGB conversion</li>
          <li>Interactive sliders and input fields for precise CMYK value adjustments</li>
          <li>Support for multiple color formats: CMYK, RGB, and HEX</li>
          <li>Live color preview for immediate visual feedback</li>
          <li>One-click copying of color values to clipboard</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Reset functionality for quick new color explorations</li>
          <li>User-friendly interface with clear, easy-to-read color information</li>
          <li>Accurate conversion algorithms ensuring color fidelity</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Print to Digital Conversion:</strong> Easily adapt print designs for digital use by converting CMYK colors to RGB.</li>
          <li><strong>Graphic Design:</strong> Ensure color consistency when working on projects that span both print and digital mediums.</li>
          <li><strong>Web Design:</strong> Convert print color references to web-safe RGB colors for accurate online representation.</li>
          <li><strong>Digital Photography:</strong> Convert CMYK color profiles to RGB for optimal display on digital screens.</li>
          <li><strong>Brand Identity:</strong> Maintain color consistency across various brand materials in both print and digital formats.</li>
          <li><strong>Education:</strong> Learn about color theory and the relationship between CMYK and RGB color spaces.</li>
          <li><strong>Print Preparation:</strong> Preview how CMYK colors might appear on RGB displays before printing.</li>
          <li><strong>Color Exploration:</strong> Experiment with color combinations and see how they translate between color models.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to bridge the gap between print and digital color spaces? Start using our CMYK to RGB Converter now and experience the power of precise color conversion and analysis. Whether you're a professional designer working on cross-media projects or a curious artist exploring color relationships, our tool provides the accuracy and functionality you need. Try it out today and see how it can streamline your workflow and enhance your understanding of color spaces!
        </p>
      </div>
    </ToolLayout>
  )
}

