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

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return [h, s, l];
}

export default function RgbToHsl() {
  const [rgb, setRGB] = useState({ r: 0, g: 0, b: 0 })
  const [hslValue, setHSLValue] = useState<string>('hsl(0, 0%, 0%)')
  const [error, setError] = useState<string>('')

  const handleRGBChange = (color: keyof typeof rgb, value: number) => {
    setRGB(prev => ({ ...prev, [color]: value }))
  }

  const handleReset = () => {
    setRGB({ r: 0, g: 0, b: 0 })
    setHSLValue('hsl(0, 0%, 0%)')
    setError('')
    toast.success('Values reset successfully')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  useEffect(() => {
    const { r, g, b } = rgb
    const [h, s, l] = rgbToHsl(r, g, b)
    setHSLValue(`hsl(${h}, ${s}%, ${l}%)`)
  }, [rgb])

  return (
    <ToolLayout
      title="RGB to HSL Converter"
      description="Convert RGB Color Codes to HSL with Real-time Preview"
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
                style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` }}
              ></div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">RGB</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">HSL</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{hslValue}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(hslValue)}
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
              <CardTitle className="text-xl font-semibold text-white">RGB Input</CardTitle>
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
                    value={rgb.r}
                    onChange={(e) => handleRGBChange('r', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={255}
                    step={1}
                    value={rgb.r}
                    onChange={(value) => handleRGBChange('r', value)}
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
                    value={rgb.g}
                    onChange={(e) => handleRGBChange('g', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={255}
                    step={1}
                    value={rgb.g}
                    onChange={(value) => handleRGBChange('g', value)}
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
                    value={rgb.b}
                    onChange={(e) => handleRGBChange('b', Number(e.target.value))}
                    className="w-20 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Slider
                    min={0}
                    max={255}
                    step={1}
                    value={rgb.b}
                    onChange={(value) => handleRGBChange('b', value)}
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
          About RGB to HSL Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The RGB to HSL Converter is an advanced tool designed for web developers, designers, and digital artists. It allows you to easily convert RGB (Red, Green, Blue) color values to their HSL (Hue, Saturation, Lightness) equivalents. This tool is particularly useful when working with web design, CSS styling, or any project that requires precise color management and conversion between different color models.
        </p>
        <p className="text-gray-300 mb-4">
          With features like real-time conversion, interactive sliders, and support for both RGB and HSL formats, the RGB to HSL Converter streamlines your workflow and ensures accurate color representation across different formats. It's perfect for creating consistent color schemes, adjusting color properties, or simply exploring the relationship between RGB and HSL color representations.
        </p>

        <div className="my-8">
          <Image
            src="/Images/RGBToHslPreview.png?height=400&width=600"
            alt="Screenshot of the RGB to HSL Converter interface showing RGB sliders and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the RGB to HSL Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Adjust the Red slider (0-255) to set the red component of the color.</li>
          <li>Use the Green slider (0-255) to adjust the green component of the color.</li>
          <li>Set the Blue slider (0-255) to control the blue component of the color.</li>
          <li>Observe the real-time color preview updating as you modify the values.</li>
          <li>View the converted HSL value in the Color Preview section.</li>
          <li>Use the copy buttons to quickly copy RGB or HSL values to your clipboard.</li>
          <li>Experiment with different RGB combinations to see how they translate to HSL values.</li>
          <li>Use the Reset button to quickly return to default values and start a new conversion.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Real-time RGB to HSL conversion</li>
          <li>Interactive sliders for intuitive RGB value adjustments</li>
          <li>Support for both RGB and HSL color formats</li>
          <li>Live color preview for immediate visual feedback</li>
          <li>One-click copying of RGB and HSL values to clipboard</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Reset functionality for quick new color explorations</li>
          <li>User-friendly interface with clear, easy-to-read color information</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Easily convert RGB colors to HSL for use in CSS and HTML.</li>
          <li><strong>Graphic Design:</strong> Translate RGB values to HSL for software that utilizes HSL color representation.</li>
          <li><strong>UI/UX Design:</strong> Create consistent color schemes by converting between RGB and HSL formats.</li>
          <li><strong>Digital Art:</strong> Experiment with color properties using RGB and obtain HSL values for use in various digital art software.</li>
          <li><strong>Brand Identity:</strong> Maintain color consistency across various digital platforms by converting between color models.</li>
          <li><strong>Education:</strong> Learn about color theory and the relationship between different color representations.</li>
          <li><strong>Accessibility Testing:</strong> Adjust color properties to ensure proper contrast and readability in web designs.</li>
          <li><strong>Color Exploration:</strong> Experiment with RGB color combinations and see their HSL equivalents for creative inspiration.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to simplify your color workflow? Start using our RGB to HSL Converter now and experience the ease of precise color conversion with intuitive controls. Whether you're a professional web developer working on complex projects or a hobbyist exploring color theory, our tool provides the accuracy and functionality you need. Try it out today and see how it can streamline your design process and enhance your understanding of color spaces!
        </p>
      </div>
    </ToolLayout>
  )
}

