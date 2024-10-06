'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Download, Info, Lightbulb, BookOpen } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

type PatternType = 'stripes' | 'checks' | 'dots' | 'zigzag' | 'triangles' | 'hexagons'

const patternStyles: Record<PatternType, (color1: string, color2: string, size: number) => string> = {
  stripes: (color1, color2, size) => `
    background-color: ${color1};
    background-image: linear-gradient(
      45deg,
      ${color2} 25%,
      transparent 25%,
      transparent 50%,
      ${color2} 50%,
      ${color2} 75%,
      transparent 75%,
      transparent 100%
    );
    background-size: ${size}px ${size}px;
  `,
  checks: (color1, color2, size) => `
    background-color: ${color1};
    background-image: 
      linear-gradient(45deg, ${color2} 25%, transparent 25%), 
      linear-gradient(-45deg, ${color2} 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, ${color2} 75%),
      linear-gradient(-45deg, transparent 75%, ${color2} 75%);
    background-size: ${size}px ${size}px;
    background-position: 0 0, 0 ${size / 2}px, ${size / 2}px -${size / 2}px, -${size / 2}px 0px;
  `,
  dots: (color1, color2, size) => `
    background-color: ${color1};
    background-image: radial-gradient(${color2} ${size / 4}px, transparent ${size / 4}px);
    background-size: ${size}px ${size}px;
  `,
  zigzag: (color1, color2, size) => `
    background-color: ${color1};
    background-image: 
      linear-gradient(135deg, ${color2} 25%, transparent 25%) -${size / 2}px 0,
      linear-gradient(225deg, ${color2} 25%, transparent 25%) -${size / 2}px 0,
      linear-gradient(315deg, ${color2} 25%, transparent 25%),
      linear-gradient(45deg, ${color2} 25%, transparent 25%);
    background-size: ${size}px ${size}px;
  `,
  triangles: (color1, color2, size) => `
    background-color: ${color1};
    background-image: 
      linear-gradient(60deg, ${color2} 25%, transparent 25.5%, transparent 75%, ${color2} 75.5%, ${color2}),
      linear-gradient(120deg, ${color2} 25%, transparent 25.5%, transparent 75%, ${color2} 75.5%, ${color2});
    background-size: ${size}px ${size * Math.sqrt(3)}px;
  `,
  hexagons: (color1, color2, size) => `
    background-color: ${color1};
    background-image: 
      radial-gradient(circle farthest-side at 0% 50%, ${color1} 23.5%, ${color2} 24%, ${color2} 46.5%, ${color1} 47%),
      radial-gradient(circle farthest-side at 0% 50%, ${color1} 23.5%, ${color2} 24%, ${color2} 46.5%, ${color1} 47%),
      radial-gradient(circle farthest-side at 100% 50%, ${color1} 23.5%, ${color2} 24%, ${color2} 46.5%, ${color1} 47%),
      radial-gradient(circle farthest-side at 100% 50%, ${color1} 23.5%, ${color2} 24%, ${color2} 46.5%, ${color1} 47%);
    background-size: ${size * 1.1}px ${size}px;
    background-position: 0 0, 0 ${size / 2}px, ${size * 0.55}px 0, ${size * 0.55}px ${size / 2}px;
  `,
}

export default function BackgroundPatternGenerator() {
  const [patternType, setPatternType] = useState<PatternType>('stripes')
  const [color1, setColor1] = useState('#ffffff')
  const [color2, setColor2] = useState('#000000')
  const [size, setSize] = useState(20)
  const [css, setCSS] = useState('')
  const [animate, setAnimate] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(5)

  useEffect(() => {
    generateCSS()
  }, [patternType, color1, color2, size, animate, animationSpeed])

  const generateCSS = () => {
    let generatedCSS = patternStyles[patternType](color1, color2, size)
    if (animate) {
      generatedCSS += `
    animation: moveBackground ${animationSpeed}s linear infinite;
  `
    }
    setCSS(generatedCSS)
  }

  const handleCopy = () => {
    const fullCSS = `.background-pattern {
  ${css}
}

@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}`
    navigator.clipboard.writeText(fullCSS)
    toast.success('CSS copied to clipboard!')
  }

  const handleDownload = () => {
    const fullCSS = `.background-pattern {
  ${css}
}

@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}`
    const blob = new Blob([fullCSS], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'background-pattern.css'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('CSS file downloaded!')
  }

  const handleReset = () => {
    setPatternType('stripes')
    setColor1('#ffffff')
    setColor2('#000000')
    setSize(20)
    setAnimate(false)
    setAnimationSpeed(5)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CSS Background Pattern Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Pattern Preview</h2>
              <div 
                className="w-full h-64 rounded-lg"
                style={{ ...{ transition: 'all 0.3s ease' } }}
              >
                <div
                  className="w-full h-full"
                  style={{ ...{ transition: 'all 0.3s ease' }, ...cssToObject(css) }}
                ></div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="patternType" className="text-white mb-2 block">Pattern Type</Label>
                  <Select value={patternType} onValueChange={(value: PatternType) => setPatternType(value)}>
                    <SelectTrigger id="patternType" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select pattern type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="stripes">Stripes</SelectItem>
                      <SelectItem value="checks">Checks</SelectItem>
                      <SelectItem value="dots">Dots</SelectItem>
                      <SelectItem value="zigzag">Zigzag</SelectItem>
                      <SelectItem value="triangles">Triangles</SelectItem>
                      <SelectItem value="hexagons">Hexagons</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color1" className="text-white mb-2 block">Color 1</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="color1"
                      type="color"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="color2" className="text-white mb-2 block">Color 2</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="color2"
                      type="color"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="size" className="text-white mb-2 block">Pattern Size: {size}px</Label>
                  <Slider
                    id="size"
                    min={10}
                    max={100}
                    step={1}
                    value={size}
                    onChange={(value) => setSize(value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="animate" className="text-white">Animate Pattern</Label>
                  <Switch
                    id="animate"
                    checked={animate}
                    onCheckedChange={setAnimate}
                  />
                </div>

                {animate && (
                  <div>
                    <Label htmlFor="animationSpeed" className="text-white mb-2 block">Animation Speed: {animationSpeed}s</Label>
                    <Slider
                      id="animationSpeed"
                      min={1}
                      max={10}
                      step={0.1}
                      value={animationSpeed}
                      onChange={(value) => setAnimationSpeed(value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg">
              <pre className="text-white whitespace-pre-wrap break-all text-sm">
                {`.background-pattern {
  ${css}
}

@keyframes moveBackground {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}`}
              </pre>
            </div>
            <div className="mt-4 flex flex-wrap justify-end space-x-2 space-y-2 sm:space-y-0">
              <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset
              </Button>
              <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Copy className="h-5 w-5 mr-2" />
                Copy CSS
              </Button>
              <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-5 w-5 mr-2" />
                Download CSS
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is CSS Background Pattern Generator?
          </h2>
          <p className="text-gray-300 mb-4">
            The CSS Background Pattern Generator is a powerful tool that allows developers and designers to create customizable background patterns quickly and efficiently. With a wide variety of pattern options and real-time previews, you can design unique, dynamic backgrounds with ease.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use CSS Background Pattern Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Select a pattern type from the dropdown menu.</li>
            <li>Choose colors for your pattern using the color pickers.</li>
            <li>Adjust the pattern size using the slider.</li>
            <li>Toggle the animation switch to add movement to your pattern.</li>
            <li>If animation is enabled, adjust the animation speed.</li>
            <li>Preview the pattern in real-time as you make adjustments.</li>
            <li>Copy the generated CSS or download it as a file.</li>
            <li>Use the <strong>Reset</strong> button to start over with default settings.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Six different pattern types: Stripes, Checks, Dots, Zigzag, Triangles, and Hexagons.</li>
            <li>Customizable colors with color picker and hex input for precision.</li>
            <li>Adjustable pattern size to fit your design needs.</li>
            <li>Optional pattern animation with customizable speed settings.</li>
            <li>Real-time preview of the background pattern as you make changes.</li>
            <li>Generated CSS code with syntax highlighting for easy integration.</li>
            <li>One-click copy to clipboard functionality for the CSS code.</li>
            <li>Option to download the generated CSS as a file for later use.</li>
            <li>Reset option to quickly return to default settings.</li>
            <li>Responsive design for use across various devices, including mobile and desktop.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips & Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Experiment with different color combinations to make your pattern stand out.</li>
            <li>Use the animation feature to add dynamic effects to background patterns, perfect for interactive or playful designs.</li>
            <li>Adjust the pattern size carefully to avoid overcrowding or too much empty space in your design.</li>
            <li>Test the background pattern on various screen sizes to ensure responsiveness across devices.</li>
            <li>Use the Reset option frequently if you want to try out completely new pattern ideas without interference from previous settings.</li>
          </ul>
        </div>

      </main>
      <Footer />
    </div>
  )
}

function cssToObject(cssString: string): Record<string, string> {
  const styleObject: Record<string, string> = {}
  const styles = cssString.split(';')
  styles.forEach(style => {
    const [property, value] = style.split(':')
    if (property && value) {
      styleObject[property.trim()] = value.trim()
    }
  })
  return styleObject
}