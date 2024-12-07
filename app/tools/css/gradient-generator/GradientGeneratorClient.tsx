'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, Toaster } from 'react-hot-toast'
import { Copy, Shuffle, Plus, Minus, Info, BookOpen, Lightbulb, Download, Eye, EyeOff, Maximize2, X, Sliders, Code } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import NextImage from 'next/image'

type ColorStop = {
  color: string
  position: number
}

type GradientType = 'linear' | 'radial' | 'conic'
type GradientShape = 'circle' | 'ellipse'
type GradientSize = 'closest-side' | 'closest-corner' | 'farthest-side' | 'farthest-corner'

export default function CSSGradientGenerator() {
  const [gradientType, setGradientType] = useState<GradientType>('linear')
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#4158D0', position: 0 },
    { color: '#C850C0', position: 46 },
    { color: '#FFCC70', position: 100 }
  ])
  const [angle, setAngle] = useState(43)
  const [centerX, setCenterX] = useState(50)
  const [centerY, setCenterY] = useState(50)
  const [repeating, setRepeating] = useState(false)
  const [gradientShape, setGradientShape] = useState<GradientShape>('circle')
  const [gradientSize, setGradientSize] = useState<GradientSize>('farthest-corner')
  const [showTransparency, setShowTransparency] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const generateGradientCSS = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)
    const stopsCSS = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ')
    
    let gradientCSS = ''
    if (gradientType === 'linear') {
      gradientCSS = `${repeating ? 'repeating-' : ''}linear-gradient(${angle}deg, ${stopsCSS})`
    } else if (gradientType === 'radial') {
      gradientCSS = `${repeating ? 'repeating-' : ''}radial-gradient(${gradientShape} ${gradientSize} at ${centerX}% ${centerY}%, ${stopsCSS})`
    } else if (gradientType === 'conic') {
      gradientCSS = `${repeating ? 'repeating-' : ''}conic-gradient(from ${angle}deg at ${centerX}% ${centerY}%, ${stopsCSS})`
    }
    
    return gradientCSS
  }

  const [gradientCSS, setGradientCSS] = useState(generateGradientCSS())

  useEffect(() => {
    setGradientCSS(generateGradientCSS())
  }, [gradientType, colorStops, angle, centerX, centerY, repeating, gradientShape, gradientSize])

  const handleColorStopChange = (index: number, field: 'color' | 'position', value: string | number) => {
    const newColorStops = [...colorStops]
    newColorStops[index] = { ...newColorStops[index], [field]: value }
    setColorStops(newColorStops)
  }

  const addColorStop = () => {
    if (colorStops.length < 5) {
      const newPosition = Math.round((colorStops[colorStops.length - 1].position + colorStops[0].position) / 2)
      setColorStops([...colorStops, { color: '#ffffff', position: newPosition }])
    }
  }

  const removeColorStop = (index: number) => {
    if (colorStops.length > 2) {
      const newColorStops = colorStops.filter((_, i) => i !== index)
      setColorStops(newColorStops)
    }
  }

  const generateRandomGradient = () => {
    const randomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`
    const newColorStops = [
      { color: randomColor(), position: 0 },
      { color: randomColor(), position: 100 }
    ]
    setColorStops(newColorStops)
    setAngle(Math.floor(Math.random() * 360))
    setCenterX(Math.floor(Math.random() * 100))
    setCenterY(Math.floor(Math.random() * 100))
  }

  const copyCSS = () => {
    navigator.clipboard.writeText(`background: ${gradientCSS};`)
    toast.success('CSS copied to clipboard!')
  }

  const downloadCSS = () => {
    const element = document.createElement('a')
    const file = new Blob([`background: ${gradientCSS};`], {type: 'text/css'})
    element.href = URL.createObjectURL(file)
    element.download = 'gradient.css'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('CSS file downloaded!')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const renderGradientPreview = () => (
    <div
      className="w-full h-full rounded-lg shadow-lg"
      style={{
        background: gradientCSS,
        ...(showTransparency ? { backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")` } : {})
      }}
    ></div>
  )

  return (
    <ToolLayout
      title="CSS Gradient Generator"
      description="Create beautiful, customizable gradients using CSS with advanced options and features"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardContent>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
              <div className="relative">
                <div className="w-full h-64">
                  {renderGradientPreview()}
                </div>
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowTransparency(!showTransparency)}
                  >
                    {showTransparency ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={toggleFullscreen}
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="settings">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="settings">
                  <Sliders className="h-4 w-4 mr-2" />
                  Gradient Settings
                </TabsTrigger>
                <TabsTrigger value="code">
                  <Code className="h-4 w-4 mr-2" />
                  Generated CSS
                </TabsTrigger>
              </TabsList>
              <TabsContent value="settings">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="gradientType" className="text-white">Gradient Type</Label>
                    <RadioGroup
                      id="gradientType"
                      value={gradientType}
                      onValueChange={(value) => setGradientType(value as GradientType)}
                      className="flex mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="linear" id="linear" />
                        <Label htmlFor="linear" className="text-white">Linear</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="radial" id="radial" />
                        <Label htmlFor="radial" className="text-white">Radial</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="conic" id="conic" />
                        <Label htmlFor="conic" className="text-white">Conic</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {(gradientType === 'linear' || gradientType === 'conic') && (
                    <div>
                      <Label htmlFor="angle" className="text-white">Angle: {angle}°</Label>
                      <Slider
                        id="angle"
                        min={0}
                        max={360}
                        step={1}
                        value={angle}
                        onChange={(value) => setAngle(value)}
                        className="mt-2"
                      />
                    </div>
                  )}

                  {(gradientType === 'radial' || gradientType === 'conic') && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="centerX" className="text-white">Center X: {centerX}%</Label>
                        <Slider
                          id="centerX"
                          min={0}
                          max={100}
                          step={1}
                          value={centerX}
                          onChange={(value) => setCenterX(value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="centerY" className="text-white">Center Y: {centerY}%</Label>
                        <Slider
                          id="centerY"
                          min={0}
                          max={100}
                          step={1}
                          value={centerY}
                          onChange={(value) => setCenterY(value)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}

                  {gradientType === 'radial' && (
                    <>
                      <div>
                        <Label htmlFor="gradientShape" className="text-white">Shape</Label>
                        <Select value={gradientShape} onValueChange={(value: GradientShape) => setGradientShape(value)}>
                          <SelectTrigger id="gradientShape" className="bg-gray-700 text-white border-gray-600">
                            <SelectValue placeholder="Select shape" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 text-white border-gray-600">
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="ellipse">Ellipse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="gradientSize" className="text-white">Size</Label>
                        <Select value={gradientSize} onValueChange={(value: GradientSize) => setGradientSize(value)}>
                          <SelectTrigger id="gradientSize" className="bg-gray-700 text-white border-gray-600">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 text-white border-gray-600">
                            <SelectItem value="closest-side">Closest Side</SelectItem>
                            <SelectItem value="closest-corner">Closest Corner</SelectItem>
                            <SelectItem value="farthest-side">Farthest Side</SelectItem>
                            <SelectItem value="farthest-corner">Farthest Corner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div>
                    <Label className="text-white mb-2 block">Color Stops</Label>
                    {colorStops.map((stop, index) => (
                      <div key={index} className="flex items-center space-x-2 mb-2">
                        <Input
                          type="color"
                          value={stop.color}
                          onChange={(e) => handleColorStopChange(index, 'color', e.target.value)}
                          className="w-12 h-8"
                        />
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={stop.position}
                          onChange={(e) => handleColorStopChange(index, 'position', parseInt(e.target.value))}
                          className="w-16 bg-gray-700 text-white"
                        />
                        <Label className="text-white">%</Label>
                        {colorStops.length > 2 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColorStop(index)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {colorStops.length < 5 && (
                      <Button variant="outline" size="sm" onClick={addColorStop} className="mt-2 bg-slate-400">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Color Stop
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="repeating"
                      checked={repeating}
                      onCheckedChange={setRepeating}
                    />
                    <Label htmlFor="repeating" className="text-white">Repeating Gradient</Label>
                  </div>
                </div>

                <div className="mt-6 space-x-4">
                  <Button onClick={generateRandomGradient} className="bg-purple-600 hover:bg-purple-700">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Random Gradient
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="code">
                <div className="bg-gray-700 p-4 rounded-lg relative">
                  <Button 
                    onClick={copyCSS}
                    className="absolute top-2 right-2 opacity-40 hover:opacity-100 transition-opacity duration-300 ease-in-out p-2 rounded-md"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <pre className="text-sm text-white overflow-x-auto mt-8">
                    {`background: ${gradientCSS};`}
                  </pre>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button onClick={copyCSS} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Copy className="h-5 w-5 mr-2" />
                    Copy CSS
                  </Button>
                  <Button onClick={downloadCSS} className="bg-green-600 hover:bg-green-700 text-white">
                    <Download className="h-5 w-5 mr-2" />
                    Download CSS
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-3/4 h-3/4 max-h-screen p-4">
            <Button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 bg-gray-700 hover:bg-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="w-full h-full overflow-hidden rounded-lg">
              {renderGradientPreview()}
            </div>
          </div>
        </div>
      )}

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is CSS Gradient Generator?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The CSS Gradient Generator is a powerful and intuitive tool designed for web developers and designers to create stunning, customizable gradients using CSS. It offers support for linear, radial, and conic gradients, along with a wide range of customization options, allowing you to craft eye-catching backgrounds, buttons, and other UI elements with ease.
          </p>
          <p className="text-gray-300 mb-4">
            Whether you're a seasoned designer looking to streamline your workflow or a beginner exploring the world of CSS gradients, this tool provides an interactive and user-friendly approach to creating complex gradient effects. It bridges the gap between concept and implementation, making it easier to experiment with different configurations and visualize the results in real-time.
          </p>

          <div className="my-8">
            <NextImage 
              src="/Images/CSSGradientPreview.png?height=400&width=600" 
              alt="Screenshot of the Enhanced CSS Gradient Generator interface showing the preview and customization options" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use the CSS Gradient Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Choose between linear, radial, or conic gradient types.</li>
            <li>For linear and conic gradients, adjust the angle using the slider.</li>
            <li>For radial and conic gradients, set the center point using the X and Y sliders.</li>
            <li>Customize radial gradients further by selecting the shape and size.</li>
            <li>Add, remove, or modify color stops using the color pickers and position inputs.</li>
            <li>Toggle the "Repeating Gradient" option for creating repeating patterns.</li>
            <li>Use the "Random Gradient" button for inspiration or quick results.</li>
            <li>Toggle transparency visibility in the preview area.</li>
            <li>Use the fullscreen preview button to view your gradient in a larger format.</li>
            <li>Switch between the "Gradient Settings" and "Generated CSS" tabs to adjust settings or view the code.</li>
            <li>Copy the generated CSS code or download it as a file for use in your project.</li>
            <li>Experiment with different combinations to achieve your desired effect.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Support for linear, radial, and conic gradients</li>
            <li>Up to 5 color stops for complex gradients</li>
            <li>Real-time preview of the gradient with fullscreen option</li>
            <li>Angle control for linear and conic gradients</li>
            <li>Center point control for radial and conic gradients</li>
            <li>Shape and size options for radial gradients</li>
            <li>Repeating gradient option for all gradient types</li>
            <li>Color picker and hex input for precise color selection</li>
            <li>Transparency toggle in the preview area</li>
            <li>Random gradient generation for inspiration</li>
            <li>One-click copy and download of generated CSS code</li>
            <li>Tabbed interface for easy switching between settings and code</li>
            <li>Responsive design for use on various devices</li>
            <li>User-friendly interface with intuitive controls</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Web Design:</strong> Create visually appealing backgrounds for websites and landing pages.</li>
            <li><strong>UI Components:</strong> Design gradient-based buttons, cards, and other interface elements.</li>
            <li><strong>Data Visualization:</strong> Use gradients to represent data in charts, graphs, and infographics.</li>
            <li><strong>Logo Design:</strong> Incorporate gradients into logos and branding materials.</li>
            <li><strong>Social Media Graphics:</strong> Create eye-catching images for social media posts and profiles.</li>
            <li><strong>Digital Art:</strong> Use as a starting point for digital illustrations and artwork.</li>
            <li><strong>Email Marketing:</strong> Design gradient-based headers and call-to-action buttons for email campaigns.</li>
            <li><strong>App Design:</strong> Implement gradients in mobile app interfaces for a modern look.</li>
            <li><strong>Print Design:</strong> Generate gradients for use in print materials like posters or brochures.</li>
            <li><strong>Education:</strong> Teach and learn about CSS gradients and color theory in a practical, hands-on way.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The CSS Gradient Generator empowers you to create sophisticated, modern UI elements and backgrounds that can dramatically improve the visual appeal of your web projects. By providing an intuitive interface for customizing complex gradient effects, along with real-time previews and easy CSS generation, this tool bridges the gap between advanced design concepts and practical implementation. Whether you're aiming for subtle, elegant touches or bold, eye-catching elements, the Enhanced CSS Gradient Generator gives you the control and flexibility you need to bring your creative vision to life.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}