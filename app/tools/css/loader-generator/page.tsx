'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type LoaderType = 'spinner' | 'dots' | 'pulse' | 'wave' | 'bar' | 'circleBounce' | 'cubeGrid' | 'ring' | 'fadingCircle';

const loaderStyles: Record<LoaderType, string> = {
  spinner: `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .loader {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
  `,
  dots: `
    @keyframes dots {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1.0); }
    }
    .loader {
      display: flex;
      justify-content: space-between;
      width: 60px;
    }
    .loader > div {
      width: 12px;
      height: 12px;
      background-color: #3498db;
      border-radius: 100%;
      animation: dots 1.4s infinite ease-in-out both;
    }
    .loader > div:nth-child(1) { animation-delay: -0.32s; }
    .loader > div:nth-child(2) { animation-delay: -0.16s; }
  `,
  pulse: `
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }
    .loader {
      width: 40px;
      height: 40px;
      background-color: #3498db;
      border-radius: 100%;
      animation: pulse 1s infinite ease-in-out alternate;
    }
  `,
  wave: `
    @keyframes wave {
      0%, 100% { transform: scaleY(0.4); }
      50% { transform: scaleY(1.0); }
    }
    .loader {
      display: flex;
      justify-content: space-between;
      width: 60px;
      height: 40px;
    }
    .loader > div {
      background-color: #3498db;
      height: 100%;
      width: 6px;
      animation: wave 1.2s infinite ease-in-out;
    }
    .loader > div:nth-child(2) { animation-delay: -1.1s; }
    .loader > div:nth-child(3) { animation-delay: -1.0s; }
    .loader > div:nth-child(4) { animation-delay: -0.9s; }
    .loader > div:nth-child(5) { animation-delay: -0.8s; }
  `,
  bar: `
    @keyframes bar {
      0% { width: 0%; }
      100% { width: 100%; }
    }
    .loader {
      width: 200px;
      height: 20px;
      background-color: #f3f3f3;
      border-radius: 10px;
      overflow: hidden;
    }
    .loader > div {
      width: 0%;
      height: 100%;
      background-color: #3498db;
      animation: bar 2s linear infinite;
    }
  `,
   // New loader: Circle Bounce
   circleBounce: `
   @keyframes circleBounce {
     0%, 100% { transform: scale(0); }
     50% { transform: scale(1); }
   }
   .loader {
     display: flex;
     justify-content: space-around;
     width: 80px;
   }
   .loader > div {
     width: 20px;
     height: 20px;
     background-color: #3498db;
     border-radius: 50%;
     animation: circleBounce 1.5s infinite ease-in-out;
   }
   .loader > div:nth-child(2) { animation-delay: -0.5s; }
 `,

 // New loader: Cube Grid
 cubeGrid: `
   @keyframes cubeGrid {
     0%, 100% { transform: scale(1); }
     50% { transform: scale(1.5); }
   }
   .loader {
     display: grid;
     grid-template-columns: repeat(3, 20px);
     grid-gap: 5px;
     width: 80px;
     height: 80px;
   }
   .loader > div {
     width: 20px;
     height: 20px;
     background-color: #3498db;
     animation: cubeGrid 1.2s infinite ease-in-out;
   }
   .loader > div:nth-child(1), .loader > div:nth-child(5), .loader > div:nth-child(9) { animation-delay: 0.2s; }
   .loader > div:nth-child(3), .loader > div:nth-child(7) { animation-delay: 0.4s; }
 `,

 // New loader: Ring
 ring: `
   @keyframes ring {
     0% { transform: rotate(0deg); }
     100% { transform: rotate(360deg); }
   }
   .loader {
     display: inline-block;
     width: 64px;
     height: 64px;
   }
   .loader:after {
     content: " ";
     display: block;
     width: 46px;
     height: 46px;
     margin: 8px;
     border-radius: 50%;
     border: 6px solid #3498db;
     border-color: #3498db transparent #3498db transparent;
     animation: ring 1.2s linear infinite;
   }
 `,

 // New loader: Fading Circle
 fadingCircle: `
   @keyframes fadingCircle {
     0%, 39%, 100% { opacity: 0; }
     40% { opacity: 1; }
   }
   .loader {
     position: relative;
     width: 64px;
     height: 64px;
   }
   .loader > div {
     position: absolute;
     top: 50%;
     left: 50%;
     width: 6px;
     height: 6px;
     background-color: #3498db;
     border-radius: 50%;
     margin: -6px;
     animation: fadingCircle 1.2s infinite ease-in-out both;
   }
   .loader > div:nth-child(1) { transform: rotate(0deg); animation-delay: -1.1s; }
   .loader > div:nth-child(2) { transform: rotate(30deg); animation-delay: -1s; }
   .loader > div:nth-child(3) { transform: rotate(60deg); animation-delay: -0.9s; }
   .loader > div:nth-child(4) { transform: rotate(90deg); animation-delay: -0.8s; }
   .loader > div:nth-child(5) { transform: rotate(120deg); animation-delay: -0.7s; }
   .loader > div:nth-child(6) { transform: rotate(150deg); animation-delay: -0.6s; }
   .loader > div:nth-child(7) { transform: rotate(180deg); animation-delay: -0.5s; }
   .loader > div:nth-child(8) { transform: rotate(210deg); animation-delay: -0.4s; }
 `,
}

export default function LoaderGenerator() {
  const [loaderType, setLoaderType] = useState<LoaderType>('spinner')
  const [size, setSize] = useState(40)
  const [color, setColor] = useState('#3498db')
  const [speed, setSpeed] = useState(1)
  const [css, setCSS] = useState('')

  useEffect(() => {
    generateCSS()
  }, [loaderType, size, color, speed])

  const generateCSS = () => {
    let generatedCSS = loaderStyles[loaderType]
    generatedCSS = generatedCSS.replace(/40px/g, `${size}px`)
    generatedCSS = generatedCSS.replace(/#3498db/g, color)
    generatedCSS = generatedCSS.replace(/1s|1.4s|1.2s|2s/g, `${speed}s`)
    setCSS(generatedCSS)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard!')
  }

  const handleReset = () => {
    setLoaderType('spinner')
    setSize(40)
    setColor('#3498db')
    setSpeed(1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CSS Loader Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Loader Preview</h2>
              <div className="bg-white rounded-lg p-8 flex items-center justify-center" style={{ height: '200px' }}>
                <div className="loader" dangerouslySetInnerHTML={{ __html: loaderType === 'dots' || loaderType === 'wave' ? '<div></div><div></div><div></div><div></div><div></div>' : '<div></div>' }} />
              </div>
              <style>{css}</style>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="loaderType" className="text-white mb-2 block">Loader Type</Label>
                  <Select value={loaderType} onValueChange={(value: LoaderType) => setLoaderType(value)}>
                    <SelectTrigger id="loaderType" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select loader type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="spinner">Spinner</SelectItem>
                        <SelectItem value="dots">Dots</SelectItem>
                        <SelectItem value="pulse">Pulse</SelectItem>
                        <SelectItem value="wave">Wave</SelectItem>
                        <SelectItem value="bar">Bar</SelectItem>
                        <SelectItem value="circleBounce">Circle Bounce</SelectItem>
                        <SelectItem value="cubeGrid">Cube Grid</SelectItem>
                        <SelectItem value="ring">Ring</SelectItem>
                        <SelectItem value="fadingCircle">Fading Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size" className="text-white mb-2 block">Size: {size}px</Label>
                  <Slider
                    id="size"
                    min={20}
                    max={100}
                    step={1}
                    value={size}
                    onChange={(value) => setSize(value)}
                  />
                </div>

                <div>
                  <Label htmlFor="color" className="text-white mb-2 block">Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="speed" className="text-white mb-2 block">Animation Speed: {speed}s</Label>
                  <Slider
                    id="speed"
                    min={0.1}
                    max={3}
                    step={0.1}
                    value={speed}
                    onChange={(value) => setSpeed(value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <pre className="text-white whitespace-pre-wrap break-all text-sm">
                {css}
              </pre>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset
              </Button>
              <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Copy className="h-5 w-5 mr-2" />
                Copy CSS
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Select a loader type from the dropdown menu.</li>
            <li>Adjust the size using the slider.</li>
            <li>Choose a color using the color picker or enter a hex value.</li>
            <li>Set the animation speed using the slider.</li>
            <li>Preview the loader in real-time.</li>
            <li>Copy the generated CSS and use it in your project.</li>
            <li>Click the Reset button to start over with default settings.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Five different loader types: Spinner, Dots, Pulse, Wave, and Bar</li>
            <li>Customizable size for all loader types</li>
            <li>Color picker for easy color selection</li>
            <li>Adjustable animation speed</li>
            <li>Real-time preview of the loader</li>
            <li>Generated CSS code with one-click copy functionality</li>
            <li>Reset option to quickly return to default settings</li>
            <li>Responsive design for use on various devices</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}