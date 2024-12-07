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

function hsvToRgb(h: number, s: number, v: number) {
  s /= 100;
  v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let [r, g, b] = [0, 0, 0];

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else if (h >= 300 && h < 360) {
    [r, g, b] = [c, 0, x];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

export default function HsvToRgb() {
  const [hsv, setHSV] = useState({ h: 0, s: 0, v: 0 })
  const [rgbValue, setRGBValue] = useState<string>('rgb(0, 0, 0)')
  const [error, setError] = useState<string>('')

  const handleHSVChange = (color: keyof typeof hsv, value: number) => {
    setHSV(prev => ({ ...prev, [color]: value }))
  }

  const handleReset = () => {
    setHSV({ h: 0, s: 0, v: 0 })
    setRGBValue('rgb(0, 0, 0)')
    setError('')
    toast.success('Values reset successfully')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  useEffect(() => {
    const { h, s, v } = hsv
    const [r, g, b] = hsvToRgb(h, s, v)
    setRGBValue(`rgb(${r}, ${g}, ${b})`)
  }, [hsv])

  return (
    <ToolLayout
      title="HSV to RGB Converter"
      description="Convert HSV Color Codes to RGB with Real-time Preview"
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
                  <h3 className="text-sm font-medium text-gray-300 mb-2">HSV</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`)}
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
              <CardTitle className="text-xl font-semibold text-white">HSV Input</CardTitle>
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
                    value={hsv.h}
                    onChange={(e) => handleHSVChange('h', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={359}
                    step={1}
                    value={hsv.h}
                    onChange={(value) => handleHSVChange('h', value)}
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
                    value={hsv.s}
                    onChange={(e) => handleHSVChange('s', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={hsv.s}
                    onChange={(value) => handleHSVChange('s', value)}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="value-input" className="block text-sm font-medium text-gray-300 mb-2">
                  Value (0-100)
                </label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="value-input"
                    type="number"
                    min="0"
                    max="100"
                    value={hsv.v}
                    onChange={(e) => handleHSVChange('v', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={hsv.v}
                    onChange={(value) => handleHSVChange('v', value)}
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
          About HSV to RGB Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The HSV to RGB Converter is an advanced tool designed for web developers, designers, and digital artists. It allows you to easily convert HSV (Hue, Saturation, Value) color values to their RGB (Red, Green, Blue) equivalents. This tool is particularly useful when working with web design, digital imaging, or any project that requires precise color management and conversion between different color models.
        </p>
        <p className="text-gray-300 mb-4">
          With features like real-time conversion, interactive sliders, and support for both HSV and RGB formats, the HSV to RGB Converter streamlines your workflow and ensures accurate color representation across different formats. It's perfect for creating consistent color schemes, adjusting color properties, or simply exploring the relationship between HSV and RGB color representations.
        </p>

        <div className="my-8">
          <Image
            src="/Images/HSVToRgbPreview.png?height=400&width=600"
            alt="Screenshot of the HSV to RGB Converter interface showing HSV sliders and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the HSV to RGB Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Adjust the Hue slider (0-359) to set the base color.</li>
          <li>Use the Saturation slider (0-100) to adjust the color intensity.</li>
          <li>Set the Value slider (0-100) to control the brightness of the color.</li>
          <li>Observe the real-time color preview updating as you modify the values.</li>
          <li>View the converted RGB value in the Color Preview section.</li>
          <li>Use the copy buttons to quickly copy HSV or RGB values to your clipboard.</li>
          <li>Experiment with different HSV combinations to see how they translate to RGB values.</li>
          <li>Use the Reset button to quickly return to default values and start a new conversion.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Real-time HSV to RGB conversion</li>
          <li>Interactive sliders for intuitive HSV value adjustments</li>
          <li>Support for both HSV and RGB color formats</li>
          <li>Live color preview for immediate visual feedback</li>
          <li>One-click copying of HSV and RGB values to clipboard</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Reset functionality for quick new color explorations</li>
          <li>User-friendly interface with clear, easy-to-read color information</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Easily convert HSV colors to RGB for use in CSS and HTML.</li>
          <li><strong>Graphic Design:</strong> Translate HSV values to RGB codes for software that primarily uses RGB color representation.</li>
          <li><strong>UI/UX Design:</strong> Create consistent color schemes by converting between HSV and RGB formats.</li>
          <li><strong>Digital Art:</strong> Experiment with color properties using HSV and obtain RGB values for use in various digital art software.</li>
          <li><strong>Brand Identity:</strong> Maintain color consistency across various digital platforms by converting between color models.</li>
          <li><strong>Education:</strong> Learn about color theory and the relationship between different color representations.</li>
          <li><strong>Accessibility Testing:</strong> Adjust color properties to ensure proper contrast and readability in web designs.</li>
          <li><strong>Color Exploration:</strong> Experiment with HSV color combinations and see their RGB equivalents for creative inspiration.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to simplify your color workflow? Start using our HSV to RGB Converter now and experience the ease of precise color conversion with intuitive controls. Whether you're a professional web developer working on complex projects or a hobbyist exploring color theory, our tool provides the accuracy and functionality you need. Try it out today and see how it can streamline your design process and enhance your understanding of color spaces!
        </p>
      </div>
    </ToolLayout>
  )
}

