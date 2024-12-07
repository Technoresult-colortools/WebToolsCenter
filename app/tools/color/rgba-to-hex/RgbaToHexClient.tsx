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

function rgbaToHex(r: number, g: number, b: number, a: number) {
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const colorHex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
  return { colorHex, alphaHex };
}

export default function RgbaToHex() {
  const [rgba, setRGBA] = useState({ r: 0, g: 0, b: 0, a: 1 })
  const [hexValue, setHexValue] = useState<string>('#000000')
  const [hexAlpha, setHexAlpha] = useState<string>('ff')
  const [error, setError] = useState<string>('')

  const handleRGBAChange = (color: keyof typeof rgba, value: number) => {
    setRGBA(prev => ({ ...prev, [color]: value }))
  }

  const handleReset = () => {
    setRGBA({ r: 0, g: 0, b: 0, a: 1 })
    setError('')
    toast.success('Values reset successfully')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  useEffect(() => {
    const { r, g, b, a } = rgba
    const { colorHex, alphaHex } = rgbaToHex(r, g, b, a)
    setHexValue(colorHex)
    setHexAlpha(alphaHex)
  }, [rgba])

  return (
    <ToolLayout
      title="RGBA to Hex Converter"
      description="Convert RGBA Color Codes to Hex with Real-time Preview"
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
                style={{ backgroundColor: `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})` }}
              ></div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">RGBA</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(`rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Hex</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{hexValue + hexAlpha}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(hexValue + hexAlpha)}
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
              <CardTitle className="text-xl font-semibold text-white">RGBA Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="red-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Red (0-255)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="red-input"
                    type="number"
                    min="0"
                    max="255"
                    value={rgba.r}
                    onChange={(e) => handleRGBAChange('r', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={255}
                    step={1}
                    value={rgba.r}
                    onChange={(value) => handleRGBAChange('r', value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="green-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Green (0-255)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="green-input"
                    type="number"
                    min="0"
                    max="255"
                    value={rgba.g}
                    onChange={(e) => handleRGBAChange('g', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={255}
                    step={1}
                    value={rgba.g}
                    onChange={(value) => handleRGBAChange('g', value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="blue-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Blue (0-255)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="blue-input"
                    type="number"
                    min="0"
                    max="255"
                    value={rgba.b}
                    onChange={(e) => handleRGBAChange('b', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={255}
                    step={1}
                    value={rgba.b}
                    onChange={(value) => handleRGBAChange('b', value)}
                    className="flex-grow"
                  />
                </div>
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
                    value={rgba.a.toFixed(2)}
                    onChange={(e) => handleRGBAChange('a', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={rgba.a}
                    onChange={(value) => handleRGBAChange('a', value)}
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
          About RGBA to Hex Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The RGBA to Hex Converter is an advanced tool designed for web developers, designers, and digital artists. It allows you to easily convert RGBA (Red, Green, Blue, Alpha) color values to their Hexadecimal equivalents. This tool is particularly useful when working with web design, CSS styling, or any project that requires precise color management and conversion between different color representations.
        </p>
        <p className="text-gray-300 mb-4">
          With features like real-time conversion, interactive sliders, and support for both RGBA and Hex formats, the RGBA to Hex Converter streamlines your workflow and ensures accurate color representation across different formats. It's perfect for creating consistent color schemes, adjusting color properties, or simply exploring the relationship between RGBA and Hex color representations.
        </p>

        <div className="my-8">
          <Image
            src="/Images/RGBAToHexPreview.png?height=400&width=600"
            alt="Screenshot of the RGBA to Hex Converter interface showing RGBA sliders and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the RGBA to Hex Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Adjust the Red slider (0-255) to set the red component of the color.</li>
          <li>Use the Green slider (0-255) to adjust the green component of the color.</li>
          <li>Set the Blue slider (0-255) to control the blue component of the color.</li>
          <li>Adjust the Alpha slider (0-1) to set the transparency of the color.</li>
          <li>Observe the real-time color preview updating as you modify the values.</li>
          <li>View the converted Hex value (including alpha) in the Color Preview section.</li>
          <li>Use the copy buttons to quickly copy RGBA or Hex values to your clipboard.</li>
          <li>Experiment with different RGBA combinations to see how they translate to Hex values.</li>
          <li>Use the Reset button to quickly return to default values and start a new conversion.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Real-time RGBA to Hex conversion</li>
          <li>Interactive sliders for intuitive RGBA value adjustments</li>
          <li>Support for both RGBA and Hex color formats</li>
          <li>Live color preview for immediate visual feedback</li>
          <li>One-click copying of RGBA and Hex values to clipboard</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Reset functionality for quick new color explorations</li>
          <li>User-friendly interface with clear, easy-to-read color information</li>
          <li>Alpha channel support for transparent colors</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Easily convert RGBA colors to Hex for use in CSS and HTML, including support for transparency.</li>
          <li><strong>Graphic Design:</strong> Translate RGBA values to Hex codes for software that requires hexadecimal color inputs.</li>
          <li><strong>UI/UX Design:</strong> Create consistent color schemes with transparency by converting between RGBA and Hex formats.</li>
          <li><strong>Digital Art:</strong> Experiment with color properties and opacity using RGBA and obtain Hex values for use in various digital art software.</li>
          <li><strong>Brand Identity:</strong> Maintain color consistency across various digital platforms by converting between color models, including transparency.</li>
          <li><strong>Game Development:</strong> Convert RGBA colors to Hex for use in game engines and asset creation, ensuring consistent color representation across different platforms and rendering engines.</li>
          <li><strong>Print Design:</strong> While print typically uses CMYK, converting RGBA to Hex can be useful for designing digital proofs or creating web versions of print materials.</li>
          <li><strong>Color Theory Education:</strong> Use the converter as a teaching tool to demonstrate the relationship between RGBA values and their hexadecimal representations.</li>
          <li><strong>Accessibility Testing:</strong> Convert colors with varying opacity levels to ensure proper contrast and readability in web designs, especially for users with visual impairments.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to simplify your color workflow? Start using our RGBA to Hex Converter now and experience the ease of precise color conversion with intuitive controls. Whether you're a professional web developer working on complex projects or a designer exploring new color palettes with transparency, our tool provides the accuracy and functionality you need. Try it out today and see how it can streamline your color management process and expand your understanding of color spaces and opacity!
        </p>
      </div>
    </ToolLayout>
  )
}

