'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { RefreshCw, Copy, Info, BookOpen, Lightbulb, Download, } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import NextImage from 'next/image'

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
  const [boxShadow, setBoxShadow] = useState('0 8px 32px 0 rgba(31, 38, 135, 0.37)')
  const [showGuides, setShowGuides] = useState(true)
  const [customShape, setCustomShape] = useState('')

  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    shuffleImage()
  }, [])

  const generateCSS = () => {
    let css = `.glassmorphism {
  background: rgba(${hexToRgb(glassColor)}, ${transparency});
  backdrop-filter: blur(${blurIntensity}px);
  -webkit-backdrop-filter: blur(${blurIntensity}px);
  border: ${borderWidth}px solid rgba(${hexToRgb(borderColor)}, 0.18);
  box-shadow: ${boxShadow};
`

    if (shape === 'circle') {
      css += '  border-radius: 50%;\n'
    } else if (shape === 'rectangle') {
      css += `  border-radius: ${borderRadius}px;\n`
    } else if (shape === 'custom') {
      css += `  clip-path: ${customShape};\n`
    }

    css += '}'

    return css.trim()
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

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([generateCSS()], {type: 'text/css'})
    element.href = URL.createObjectURL(file)
    element.download = 'glassmorphism.css'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('CSS file downloaded!')
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
    setBoxShadow('0 8px 32px 0 rgba(31, 38, 135, 0.37)')
    setShowGuides(true)
    setCustomShape('')
    shuffleImage()
    toast.success('Settings reset to default!')
  }

  const shuffleImage = () => {
    const randomId = Math.floor(Math.random() * 1000)
    setImageUrl(`https://picsum.photos/seed/${randomId}/600/400`)
  }

  return (
    <ToolLayout
      title="CSS Glassmorphism Generator"
      description="Create stunning glass-like UI elements with advanced customization options"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Glassmorphism Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
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
                    border: `${borderWidth}px solid rgba(${hexToRgb(borderColor)}, 0.18)`,
                    boxShadow,
                    ...(shape === 'circle' ? { borderRadius: '50%' } : 
                       shape === 'rectangle' ? { borderRadius: `${borderRadius}px` } : 
                       shape === 'custom' ? { clipPath: customShape } : {}),
                  }}
                >
                  {showContent && (
                    <div className="p-4 text-white">
                      <h3 className="text-xl font-bold mb-2">Glassmorphism</h3>
                      <p>This is how your glassmorphism effect will look.</p>
                    </div>
                  )}
                </div>
                {showGuides && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-white opacity-50"></div>
                    <div className="absolute top-1/2 left-0 w-full border-t-2 border-dashed border-white opacity-50"></div>
                    <div className="absolute top-0 left-1/2 h-full border-l-2 border-dashed border-white opacity-50"></div>
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-2">
                <Button onClick={handleShuffleImage} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Shuffle Background
                </Button>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-guides" className="text-white">Show Guides</Label>
                  <Switch
                    id="show-guides"
                    checked={showGuides}
                    onCheckedChange={setShowGuides}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="shape" className="text-white mb-2 block">Shape</Label>
                  <Select value={shape} onValueChange={(value: GlassShape) => setShape(value)}>
                    <SelectTrigger id="shape" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {shape === 'custom' && (
                  <div>
                    <Label htmlFor="customShape" className="text-white mb-2 block">Custom Shape (clip-path)</Label>
                    <Input
                      id="customShape"
                      value={customShape}
                      onChange={(e) => setCustomShape(e.target.value)}
                      placeholder="e.g., polygon(50% 0%, 0% 100%, 100% 100%)"
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                )}

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

                {shape !== 'circle' && shape !== 'custom' && (
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

                <div>
                  <Label htmlFor="boxShadow" className="text-white mb-2 block">Box Shadow</Label>
                  <Input
                    id="boxShadow"
                    value={boxShadow}
                    onChange={(e) => setBoxShadow(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>

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
            
            {/* Code Container */}
            <div className="bg-gray-700 p-4 rounded-lg overflow-auto">
              <code className="text-white whitespace-pre-wrap break-all">
                {generateCSS()}
              </code>
            </div>
            
            {/* Buttons Container */}
            <div className="mt-4 flex flex-col space-y-2 md:flex-row md:justify-end md:space-y-0 md:space-x-2">
              <Button
                onClick={handleReset}
                variant="destructive"
                className="text-white border-white hover:bg-gray-700"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset
              </Button>
              <Button
                onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy CSS
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-5 w-5 mr-2" />
                Download CSS
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is CSS Glassmorphism Generator?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The CSS Glassmorphism Generator is a powerful and intuitive tool designed for web developers and designers to create stunning glass-like UI elements using the glassmorphism effect. It offers a wide range of customization options, allowing you to fine-tune every aspect of the glassmorphism effect to achieve the perfect look for your designs.
          </p>
          <p className="text-gray-300 mb-4">
            Whether you're a seasoned designer looking to streamline your workflow or a beginner exploring the world of modern UI design, this tool provides an interactive and user-friendly approach to creating glassmorphism effects. It bridges the gap between concept and implementation, making it easier to experiment with different configurations and visualize the results in real-time.
          </p>

          <div className="my-8">
            <NextImage 
              src="/Images/GlassMorphismPreview.png?height=400&width=600" 
              alt="Screenshot of the Enhanced Glassmorphism Generator interface showing the preview and customization options" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use the CSS Glassmorphism Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Choose a shape for your glass element (Rectangle, Circle, or Custom).</li>
            <li>Adjust the glass color using the color picker or by entering a hex value.</li>
            <li>Use the sliders to fine-tune blur intensity, transparency, border width, and border radius.</li>
            <li>Customize the border color and box shadow effect.</li>
            <li>For custom shapes, enter a CSS clip-path value to create unique forms.</li>
            <li>Toggle the content visibility to see how text appears on your glass element.</li>
            <li>Use the "Show Guides" option to help with alignment and positioning.</li>
            <li>Click "Shuffle Background" to visualize your glass effect on different images.</li>
            <li>Upload a custom background image for more specific design contexts.</li>
            <li>Copy the generated CSS code or download it as a file for use in your projects.</li>
            <li>Use the Reset button to quickly return to default settings if needed.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>
              Create multiple glass shapes, including rectangles, circles, and custom designs using CSS clip-path. Explore our 
              <a href="https://webtoolscenter.com/tools/css/clip-path-generator" target="_blank" rel="noopener noreferrer">
                <span className='text-blue-500'> Clip Path Generator </span>
              </a> 
              to generate various shapes with ease.
            </li>
            <li>Advanced color customization with color picker and hex input for glass and border colors.</li>
            <li>Precise control over blur intensity, transparency, and border width.</li>
            <li>Customizable box shadow effect for added depth.</li>
            <li>Border radius adjustment for rectangular shapes.</li>
            <li>Option to show/hide sample content within the glass element.</li>
            <li>Toggleable guide lines for precise positioning and alignment.</li>
            <li>Background image shuffling for quick visualization with different images.</li>
            <li>Custom background image upload for personalized designs.</li>
            <li>Real-time preview of the glassmorphism effect.</li>
            <li>Generated CSS code with syntax highlighting.</li>
            <li>One-click copy and download functionality for the CSS code.</li>
            <li>Reset option to quickly return to default settings.</li>
            <li>Responsive design for use on various devices and screen sizes.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Modern UI Design:</strong> Create sleek, contemporary user interfaces for websites and applications.</li>
            <li><strong>Card Components:</strong> Design eye-catching card elements for displaying content or data.</li>
            <li><strong>Modal Windows:</strong> Develop attractive and non-intrusive modal overlays for important information or actions.</li>
            <li><strong>Navigation Menus:</strong> Craft unique and visually appealing navigation bars and menus.</li>
            <li><strong>Form Elements:</strong> Enhance input fields, buttons, and other form components with a modern glass effect.</li>
            <li><strong>Image Overlays:</strong> Create subtle text overlays on images for captions or descriptions.</li>
            <li><strong>Dashboard Widgets:</strong> Design elegant widgets for data visualization in admin panels or dashboards.</li>
            <li><strong>Hero Sections:</strong> Develop striking hero sections for landing pages with glass-effect text or image containers.</li>
            <li><strong>Pricing Tables:</strong> Make your pricing information stand out with glassmorphic design elements.</li>
            <li><strong>Portfolio Showcases:</strong> Present your work in a modern, sophisticated manner using glass-effect galleries or project cards.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The Glassmorphism Generator empowers you to create sophisticated, modern UI elements that can dramatically improve the visual appeal of your web projects. By providing an intuitive interface for customizing glassmorphism effects, along with real-time previews and easy CSS generation, this tool bridges the gap between complex design concepts and practical implementation. Whether you're aiming for subtle, elegant touches or bold, eye-catching elements, the Enhanced Glassmorphism Generator gives you the control and flexibility you need to bring your creative vision to life.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

export default GlassmorphismGenerator