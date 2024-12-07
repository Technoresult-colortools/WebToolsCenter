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

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4))
  ];
}

export default function HslToRgb() {
  const [hsl, setHSL] = useState({ h: 0, s: 0, l: 0 })
  const [rgbValue, setRGBValue] = useState<string>('rgb(0, 0, 0)')
  const [error, setError] = useState<string>('')

  const handleHSLChange = (color: keyof typeof hsl, value: number) => {
    setHSL(prev => ({ ...prev, [color]: value }))
  }

  const handleReset = () => {
    setHSL({ h: 0, s: 0, l: 0 })
    setRGBValue('rgb(0, 0, 0)')
    setError('')
    toast.success('Values reset successfully')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  useEffect(() => {
    const { h, s, l } = hsl
    const [r, g, b] = hslToRgb(h, s, l)
    setRGBValue(`rgb(${r}, ${g}, ${b})`)
  }, [hsl])

  return (
    <ToolLayout
      title="HSL to RGB Converter"
      description="Convert HSL Color Codes to RGB with Real-time Preview"
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
                style={{ backgroundColor: rgbValue }}
              ></div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">HSL</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">RGB</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{rgbValue}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(rgbValue)}
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
              <CardTitle className="text-xl font-semibold text-white">HSL Input</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label htmlFor="hue-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Hue (0-359)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="hue-input"
                    type="number"
                    min="0"
                    max="359"
                    value={hsl.h}
                    onChange={(e) => handleHSLChange('h', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={359}
                    step={1}
                    value={hsl.h}
                    onChange={(value) => handleHSLChange('h', value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="saturation-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Saturation (0-100)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="saturation-input"
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => handleHSLChange('s', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={hsl.s}
                    onChange={(value) => handleHSLChange('s', value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="lightness-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Lightness (0-100)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="lightness-input"
                    type="number"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => handleHSLChange('l', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={hsl.l}
                    onChange={(value) => handleHSLChange('l', value)}
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
          About HSL to RGB Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The HSL to RGB Converter is an advanced tool designed for web developers, designers, and digital artists. It allows you to easily convert HSL (Hue, Saturation, Lightness) color values to their RGB (Red, Green, Blue) equivalents. This tool is particularly useful when working with web design, digital imaging, or any project that requires precise color management and conversion between different color models.
        </p>
        <p className="text-gray-300 mb-4">
          With features like real-time conversion, interactive sliders, and support for both HSL and RGB formats, the HSL to RGB Converter streamlines your workflow and ensures accurate color representation across different formats. It's perfect for creating consistent color schemes, adjusting color properties, or simply exploring the relationship between HSL and RGB color representations.
        </p>

        <div className="my-8">
          <Image
            src="/Images/HSLToRGBPreview.png?height=400&width=600"
            alt="Screenshot of the HSL to RGB Converter interface showing HSL sliders and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the HSL to RGB Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Adjust the Hue slider (0-359) to set the base color.</li>
          <li>Use the Saturation slider (0-100) to adjust the color intensity.</li>
          <li>Set the Lightness slider (0-100) to control the brightness of the color.</li>
          <li>Observe the real-time color preview updating as you modify the values.</li>
          <li>View the converted RGB value in the Color Preview section.</li>
          <li>Use the copy buttons to quickly copy HSL or RGB values to your clipboard.</li>
          <li>Experiment with different HSL combinations to see how they translate to RGB values.</li>
          <li>Use the Reset button to quickly return to default values and start a new conversion.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Real-time HSL to RGB conversion</li>
          <li>Interactive sliders for intuitive HSL value adjustments</li>
          <li>Support for both HSL and RGB color formats</li>
          <li>Live color preview for immediate visual feedback</li>
          <li>One-click copying of HSL and RGB values to clipboard</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Reset functionality for quick new color explorations</li>
          <li>User-friendly interface with clear, easy-to-read color information</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Easily convert HSL colors to RGB for use in CSS and HTML.</li>
          <li><strong>Graphic Design:</strong> Translate HSL values to RGB codes for software that primarily uses RGB color representation.</li>
          <li><strong>UI/UX Design:</strong> Create consistent color schemes by converting between HSL and RGB formats.</li>
          <li><strong>Digital Art:</strong> Experiment with color properties using HSL and obtain RGB values for use in various digital art software.</li>
          <li><strong>Brand Identity:</strong> Maintain color consistency across various digital platforms by converting between color models.</li>
          <li><strong>Education:</strong> Learn about color theory and the relationship between different color representations.</li>
          <li><strong>Accessibility Testing:</strong> Adjust color properties to ensure proper contrast and readability in web designs.</li>
          <li><strong>Color Exploration:</strong> Experiment with HSL color combinations and see their RGB equivalents for creative inspiration.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to simplify your color workflow? Start using our HSL to RGB Converter now and experience the ease of precise color conversion with intuitive controls. Whether you're a professional web developer working on complex projects or a hobbyist exploring color theory, our tool provides the accuracy and functionality you need. Try it out today and see how it can streamline your design process and enhance your understanding of color spaces!
        </p>
      </div>
    </ToolLayout>
  )
}

