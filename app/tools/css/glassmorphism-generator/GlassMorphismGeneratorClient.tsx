'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { RefreshCw, Copy, Info, BookOpen, Lightbulb} from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'

type GlassShape = 'rectangle' | 'circle' | 'custom'

const GlassmorphismGenerator = () => {
  const [glassColor, setGlassColor] = useState('#ffffff')
  const [blurIntensity, setBlurIntensity] = useState(10)
  const [transparency, setTransparency] = useState(0.25)
  const [borderWidth, setBorderWidth] = useState(1)
  const [borderColor, setBorderColor] = useState('#ffffff')
  const [borderRadius, setBorderRadius] = useState(10)
  const [shape, setShape] = useState<GlassShape>('rectangle')
  const [showContent, setShowContent] = useState(true)
  const [useCustomBackground, setUseCustomBackground] = useState(false)
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('/placeholder.svg?height=400&width=600')

  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    shuffleImage()
  }, [])

  const generateCSS = () => {
    return `
.glassmorphism {
  background: rgba(${hexToRgb(glassColor)}, ${transparency});
  backdrop-filter: blur(${blurIntensity}px);
  -webkit-backdrop-filter: blur(${blurIntensity}px);
  border-radius: ${shape === 'circle' ? '50%' : `${borderRadius}px`};
  border: ${borderWidth}px solid rgba(${hexToRgb(borderColor)}, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}`.trim()
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 255, 255'
  }

  const handleShuffleImage = () => {
    const randomId = Math.floor(Math.random() * 1000)
    setImageUrl(`https://picsum.photos/seed/${randomId}/600/400`)
  }

  const handleCustomBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCustomBackgroundUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCSS())
    toast.success('CSS copied to clipboard!')
  }

  const handleReset = () => {
    setGlassColor('#ffffff')
    setBlurIntensity(10)
    setTransparency(0.25)
    setBorderWidth(1)
    setBorderColor('#ffffff')
    setBorderRadius(10)
    setShape('rectangle')
    setShowContent(true)
    setUseCustomBackground(false)
    setCustomBackgroundUrl('')
    shuffleImage()
  }

  const shuffleImage = () => {
    const randomId = Math.floor(Math.random() * 1000)
    setImageUrl(`https://picsum.photos/seed/${randomId}/600/400`)
  }

  return (
    <ToolLayout
      title="CSS Glassmorphism Generator"
      description="Create glass-like UI elements using the glassmorphism effect"
    >

    <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Glassmorphism Preview</h2>
                <div 
                  ref={previewRef}
                  className="relative bg-white rounded-lg overflow-hidden"
                  style={{ width: '100%', paddingBottom: '66.67%' }}
                >
                  <img 
                    src={useCustomBackground && customBackgroundUrl ? customBackgroundUrl : imageUrl} 
                    alt="Background"
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 glassmorphism"
                    style={{
                      background: `rgba(${hexToRgb(glassColor)}, ${transparency})`,
                      backdropFilter: `blur(${blurIntensity}px)`,
                      WebkitBackdropFilter: `blur(${blurIntensity}px)`,
                      borderRadius: shape === 'circle' ? '50%' : `${borderRadius}px`,
                      border: `${borderWidth}px solid rgba(${hexToRgb(borderColor)}, 0.18)`,
                    }}
                  >
                    {showContent && (
                      <div className="p-4 text-white">
                        <h3 className="text-xl font-bold mb-2">Glassmorphism</h3>
                        <p>This is how your glassmorphism effect will look.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Button onClick={handleShuffleImage} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <RefreshCw className="h-5 w-5 mr-2" />
                    Shuffle Background
                  </Button>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
                <div className="space-y-4">

                  <div>
                    <Label htmlFor="glassColor" className="text-white mb-2 block">Glass Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        id="glassColor"
                        value={glassColor}
                        onChange={(e) => setGlassColor(e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={glassColor}
                        onChange={(e) => setGlassColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="blurIntensity" className="text-white mb-2 block">Blur Intensity: {blurIntensity}px</Label>
                    <Slider
                      id="blurIntensity"
                      min={0}
                      max={20}
                      step={1}
                      value={blurIntensity}
                      onChange={(value) => setBlurIntensity(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="transparency" className="text-white mb-2 block">Transparency: {transparency.toFixed(2)}</Label>
                    <Slider
                      id="transparency"
                      min={0}
                      max={1}
                      step={0.01}
                      value={transparency}
                      onChange={(value) => setTransparency(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="borderWidth" className="text-white mb-2 block">Border Width: {borderWidth}px</Label>
                    <Slider
                      id="borderWidth"
                      min={0}
                      max={10}
                      step={1}
                      value={borderWidth}
                      onChange={(value) => setBorderWidth(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="borderColor" className="text-white mb-2 block">Border Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        id="borderColor"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  {shape !== 'circle' && (
                    <div>
                      <Label htmlFor="borderRadius" className="text-white mb-2 block">Border Radius: {borderRadius}px</Label>
                      <Slider
                        id="borderRadius"
                        min={0}
                        max={50}
                        step={1}
                        value={borderRadius}
                        onChange={(value) => setBorderRadius(value)}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-content" className="text-white">Show Content</Label>
                    <Switch
                      id="show-content"
                      checked={showContent}
                      onCheckedChange={setShowContent}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-custom-background" className="text-white">Use Custom Background</Label>
                    <Switch
                      id="use-custom-background"
                      checked={useCustomBackground}
                      onCheckedChange={setUseCustomBackground}
                    />
                  </div>

                  {useCustomBackground && (
                    <div>
                      <Label htmlFor="custom-background" className="text-white mb-2 block">Custom Background Image</Label>
                      <Input
                        id="custom-background"
                        type="file"
                        accept="image/*"
                        onChange={handleCustomBackgroundUpload}
                        className="bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <code className="text-white whitespace-pre-wrap break-all">
                  {generateCSS()}
                </code>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                  Reset
                </Button>
                <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy CSS
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is Glassmorphism Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The Glassmorphism Generator is a powerful tool for creating glass-like UI elements using the glassmorphism effect. It offers customizable options for shapes, colors, blur intensity, transparency, and more, making it easy to design modern, sleek glass-like components. The tool also provides real-time previews and generates CSS code that you can copy with a single click.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Glassmorphism Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Select a glass shape from the dropdown menu (Rectangle, Circle, or Custom).</li>
              <li>Adjust the glass color using the color picker or by entering a hex value.</li>
              <li>Use the sliders to adjust blur intensity, transparency, border width, and border radius.</li>
              <li>Customize the border color using the color picker or by entering a hex value.</li>
              <li>Toggle "Show Content" to display or hide sample content in the glass element.</li>
              <li>Use "Hide Guides" to remove the guide lines from the preview.</li>
              <li>Click "Shuffle Background" to change the preview background image.</li>
              <li>Enable "Use Custom Background" to upload your own background image.</li>
              <li>Copy the generated CSS or reset to default settings using the buttons at the bottom.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Multiple glass shapes: Rectangle, Circle, Custom.</li>
              <li>Customizable glass color with color picker and hex input.</li>
              <li>Adjustable blur intensity for the glassmorphism effect.</li>
              <li>Transparency control for the glass element.</li>
              <li>Customizable border width and color.</li>
              <li>Border radius adjustment for non-circular shapes.</li>
              <li>Option to show/hide sample content within the glass element.</li>
              <li>Toggleable guide lines for precise positioning.</li>
              <li>Background image shuffling for quick visualization with different images.</li>
              <li>Custom background image upload for personalized designs.</li>
              <li>Real-time preview of the glassmorphism effect.</li>
              <li>Generated CSS code with one-click copy functionality.</li>
              <li>Reset option to quickly return to default settings.</li>
              <li>Responsive design for use on various devices.</li>
            </ul>
          </div>

  </ToolLayout>
  )
}

export default GlassmorphismGenerator