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

function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  const k = Math.min(c, m, y);

  c = (c - k) / (1 - k) || 0;
  m = (m - k) / (1 - k) || 0;
  y = (y - k) / (1 - k) || 0;

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

export default function RgbToCmyk() {
  const [rgb, setRGB] = useState({ r: 0, g: 0, b: 0 })
  const [cmykValue, setCMYKValue] = useState<string>('C: 0%, M: 0%, Y: 0%, K: 100%')
  const [error, setError] = useState<string>('')

  const handleRGBChange = (color: keyof typeof rgb, value: number) => {
    setRGB(prev => ({ ...prev, [color]: value }))
  }

  const handleReset = () => {
    setRGB({ r: 0, g: 0, b: 0 })
    setCMYKValue('C: 0%, M: 0%, Y: 0%, K: 100%')
    setError('')
    toast.success('Values reset successfully')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  useEffect(() => {
    const { r, g, b } = rgb
    const { c, m, y, k } = rgbToCmyk(r, g, b)
    setCMYKValue(`C: ${c}%, M: ${m}%, Y: ${y}%, K: ${k}%`)
  }, [rgb])

  return (
    <ToolLayout
      title="RGB to CMYK Converter"
      description="Convert RGB Color Codes to CMYK with Real-time Preview"
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
                  <h3 className="text-sm font-medium text-gray-300 mb-2">CMYK</h3>
                  <div className="flex items-center">
                    <p className="text-white flex-grow">{cmykValue}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(cmykValue)}
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
          About RGB to CMYK Converter
        </h2>
        <p className="text-gray-300 mb-4">
          The RGB to CMYK Converter is an advanced tool designed for graphic designers, print professionals, and digital artists. It allows you to easily convert RGB (Red, Green, Blue) color values to their CMYK (Cyan, Magenta, Yellow, Key/Black) equivalents. This tool is particularly useful when preparing digital designs for print, as most printing processes use the CMYK color model.
        </p>
        <p className="text-gray-300 mb-4">
          With features like real-time conversion, interactive sliders, and support for both RGB and CMYK formats, the RGB to CMYK Converter streamlines your workflow and ensures accurate color representation across different mediums. It's perfect for creating consistent color schemes, adjusting color properties for print, or simply exploring the relationship between RGB and CMYK color representations.
        </p>

        <div className="my-8">
          <Image
            src="/Images/RGBToCMYKPreview.png?height=400&width=600"
            alt="Screenshot of the RGB to CMYK Converter interface showing RGB sliders and color preview"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the RGB to CMYK Converter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Adjust the Red slider (0-255) to set the red component of the color.</li>
          <li>Use the Green slider (0-255) to adjust the green component of the color.</li>
          <li>Set the Blue slider (0-255) to control the blue component of the color.</li>
          <li>Observe the real-time color preview updating as you modify the values.</li>
          <li>View the converted CMYK value in the Color Preview section.</li>
          <li>Use the copy buttons to quickly copy RGB or CMYK values to your clipboard.</li>
          <li>Experiment with different RGB combinations to see how they translate to CMYK values.</li>
          <li>Use the Reset button to quickly return to default values and start a new conversion.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Real-time RGB to CMYK conversion</li>
          <li>Interactive sliders for intuitive RGB value adjustments</li>
          <li>Support for both RGB and CMYK color formats</li>
          <li>Live color preview for immediate visual feedback</li>
          <li>One-click copying of RGB and CMYK values to clipboard</li>
          <li>Responsive design for seamless use on desktop and mobile devices</li>
          <li>Reset functionality for quick new color explorations</li>
          <li>User-friendly interface with clear, easy-to-read color information</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Print Design:</strong> Convert digital RGB colors to CMYK for accurate print reproduction.</li>
          <li><strong>Graphic Design:</strong> Translate RGB values to CMYK for projects that involve both digital and print media.</li>
          <li><strong>Brand Identity:</strong> Ensure color consistency across various digital and print platforms.</li>
          <li><strong>Digital Art:</strong> Prepare digital artworks for print by converting RGB colors to CMYK.</li>
          <li><strong>Photography:</strong> Convert RGB photos to CMYK for professional printing.</li>
          <li><strong>Education:</strong> Learn about color theory and the relationship between different color models.</li>
          <li><strong>Pre-press:</strong> Prepare digital files for commercial printing processes.</li>
          <li><strong>Color Matching:</strong> Match colors between digital displays and printed materials.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to streamline your color conversion workflow? Start using our RGB to CMYK Converter now and experience the ease of precise color conversion with intuitive controls. Whether you're a professional designer preparing files for print or a digital artist exploring color theory, our tool provides the accuracy and functionality you need. Try it out today and see how it can enhance your design process and ensure color consistency across different mediums!
        </p>
      </div>
    </ToolLayout>
  )
}

