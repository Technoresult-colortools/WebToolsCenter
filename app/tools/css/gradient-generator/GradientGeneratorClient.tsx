'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Slider from "@/components/ui/Slider"
import { Copy, Shuffle, Plus, Minus, Info, BookOpen, Lightbulb } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools';

type ColorStop = {
  color: string
  position: number
}

type GradientType = 'linear' | 'radial'

export default function CSSGradientGenerator() {
  const [gradientType, setGradientType] = useState<GradientType>('linear')
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: '#3b82f6', position: 0 },
    { color: '#8b5cf6', position: 100 }
  ])
  const [angle, setAngle] = useState(90)
  const [centerX, setCenterX] = useState(50)
  const [centerY, setCenterY] = useState(50)

  const generateGradientCSS = () => {
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)
    const stopsCSS = sortedStops.map(stop => `${stop.color} ${stop.position}%`).join(', ')
    
    if (gradientType === 'linear') {
      return `linear-gradient(${angle}deg, ${stopsCSS})`
    } else {
      return `radial-gradient(circle at ${centerX}% ${centerY}%, ${stopsCSS})`
    }
  }

  const [gradientCSS, setGradientCSS] = useState(generateGradientCSS())

  useEffect(() => {
    setGradientCSS(generateGradientCSS())
  }, [gradientType, colorStops, angle, centerX, centerY])

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                CSS Gradient Generator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Create beautiful, customizable gradients using CSS.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="w-full md:w-1/2 order-1 md:order-1 mb-8 md:mb-0">
                <h2 className="text-2xl font-semibold text-white mb-4">Preview</h2>
                <div
                  className="w-full h-64 rounded-lg shadow-lg"
                  style={{ background: gradientCSS }}
                ></div>
              </div>

              <div className="w-full md:w-1/2 order-2 md:order-2">
                <h2 className="text-2xl font-semibold text-white mb-4">Gradient Settings</h2>
                
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
                    </RadioGroup>
                  </div>

                  {gradientType === 'linear' && (
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

                  {gradientType === 'radial' && (
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
                </div>

                <div className="mt-6 space-x-4">
                  <Button onClick={generateRandomGradient} className="bg-purple-600 hover:bg-purple-700">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Random Gradient
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg relative">
              <Button 
              onClick={copyCSS}
                    className="absolute top-2 right-2 opacity 40 hover:opacity-100 transition-opacity duration-300 ease-in-out p-2 rounded-md"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <pre className="text-sm text-white overflow-x-auto mt-8">
                {`background: ${gradientCSS};`}
              </pre>
            </div>
          </div>




          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the CSS Gradient Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The CSS Gradient Generator is a powerful tool for creating beautiful, customizable gradients using CSS. It offers options for both linear and radial gradients, allowing you to design eye-catching backgrounds, buttons, and other UI elements. With real-time previews and easy-to-use controls, you can quickly create and fine-tune gradients for your web projects.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the CSS Gradient Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Choose between linear and radial gradient types.</li>
              <li>For linear gradients, adjust the angle using the slider.</li>
              <li>For radial gradients, set the center point using the X and Y sliders.</li>
              <li>Add, remove, or modify color stops using the color pickers and position inputs.</li>
              <li>Use the "Random Gradient" button for inspiration or quick results.</li>
              <li>Preview your gradient in real-time in the preview area.</li>
              <li>Copy the generated CSS code to use in your project.</li>
              <li>Experiment with different combinations to achieve your desired effect.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Support for both linear and radial gradients</li>
              <li>Up to 5 color stops for complex gradients</li>
              <li>Real-time preview of the gradient</li>
              <li>Angle control for linear gradients</li>
              <li>Center point control for radial gradients</li>
              <li>Color picker and hex input for precise color selection</li>
              <li>Random gradient generation for inspiration</li>
              <li>One-click copy of generated CSS code</li>
              <li>Responsive design for use on various devices</li>
              <li>User-friendly interface with intuitive controls</li>
            </ul>
          </div>
        </main>
       </div> 
      <Footer />
    </div>
  )
}