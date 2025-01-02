'use client'

import React, { useState, useEffect} from 'react'
import { Button } from "@/components/ui/Button"
import Image from 'next/image'
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select } from '@/components/ui/select1';
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Download, Info, Lightbulb, BookOpen, Maximize2, X, Palette, PaletteIcon as Shuffle } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import shapesData from './shapes.json'
import * as ShapeIcons from '@/components/ShapeIcons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Color palette suggestions
const COLOR_PALETTES = [
  { name: 'Ocean Breeze', colors: ['#47d3ff', '#474bff', '#5d6bff', '#8c93ff'] },
  { name: 'Sunset', colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#a29bfe'] },
  { name: 'Forest', colors: ['#2ecc71', '#27ae60', '#3498db', '#2980b9'] },
  { name: 'Pastel', colors: ['#f3a683', '#f7d794', '#778beb', '#e056fd'] },
  { name: 'Monochrome', colors: ['#34495e', '#2c3e50', '#7f8c8d', '#95a5a6'] },
  { name: 'Neon', colors: ['#ff00ff', '#00ff00', '#00ffff', '#ff00aa'] },
  { name: 'Earthy', colors: ['#d35400', '#e67e22', '#f39c12', '#f1c40f'] },
  { name: 'Cool Blues', colors: ['#0077be', '#4682b4', '#5f9ea0', '#87ceeb'] },
  { name: 'Berry Delight', colors: ['#8e44ad', '#9b59b6', '#c0392b', '#e74c3c'] },
  { name: 'Autumn Glow', colors: ['#ff5733', '#c70039', '#900c3f', '#ffc300'] },
  { name: 'Vintage', colors: ['#c3a995', '#bfb8a5', '#a4b494', '#709772'] },
  { name: 'Floral', colors: ['#ff9a9e', '#fad0c4', '#fbc2eb', '#a18cd1'] },
  { name: 'Metallic', colors: ['#bdc3c7', '#95a5a6', '#7f8c8d', '#2c3e50'] },
  { name: 'Candy', colors: ['#ff7eb9', '#ff65a3', '#7afcff', '#feff9c'] },
  { name: 'Desert', colors: ['#edc9af', '#e6a57e', '#b5651d', '#a0522d'] },
  { name: 'Ice Cream', colors: ['#ffeaa7', '#fab1a0', '#74b9ff', '#81ecec'] },
  { name: 'Galaxy', colors: ['#2c3e50', '#34495e', '#8e44ad', '#9b59b6'] },
  { name: 'Tropical', colors: ['#1abc9c', '#16a085', '#f39c12', '#d35400'] },
  { name: 'Vibrant', colors: ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71'] },
  { name: 'Minimalist', colors: ['#ecf0f1', '#bdc3c7', '#95a5a6', '#7f8c8d'] }
];


type PatternType = keyof typeof shapesData

export default function BackgroundPatternGenerator() {
  const [patternType, setPatternType] = useState<PatternType>('checks')
  const [color1, setColor1] = useState('#47d3ff')
  const [color2, setColor2] = useState('#474bff')
  const [color3, setColor3] = useState('#5d6bff')
  const [color4, setColor4] = useState('#8c93ff')
  const [size, setSize] = useState(24)
  const [opacity, setOpacity] = useState(1)
  const [css, setCSS] = useState('')
  const [animate, setAnimate] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(5)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showColorPalettes, setShowColorPalettes] = useState(false)
  const [rotationAngle, setRotationAngle] = useState(0)
  const [blendMode, setBlendMode] = useState('normal')
  const [layers, setLayers] = useState(1)

  useEffect(() => {
    generateCSS()
  }, [patternType, color1, color2, color3, color4, size, opacity, animate, animationSpeed, rotationAngle, blendMode, layers])

  const generateCSS = () => {
    let generatedCSS = '';
    for (let i = 0; i < layers; i++) {
      // Safely access the pattern type's CSS
      const patternCSS = shapesData[patternType]?.css || '';
  
      let layerCSS = patternCSS
        .replace(/#47d3ff/g, i % 2 === 0 ? color1 : color3)
        .replace(/#474bff/g, i % 2 === 0 ? color2 : color4)
        .replace(/32px/g, `${size}px`)
        .replace(/64px/g, `${size * 2}px`)
        .replace(/3em/g, `${size}px`);
  
      // Add additional properties
      layerCSS += `
        opacity: ${opacity};
        transform: rotate(${rotationAngle + i * 45}deg);
        mix-blend-mode: ${blendMode};
      `;
  
      // Add animation if needed
      if (animate) {
        layerCSS += `
          animation: moveBackground${i} ${animationSpeed}s linear infinite;
        `;
      }
  
      // Append the generated layer CSS to the result
      generatedCSS += `
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: ${i};
          ${layerCSS}
        }
      `;
    }
  
    // Set the generated CSS
    setCSS(generatedCSS);
  };
  
  const handleCopy = () => {
    const fullCSS = `.background-pattern {
  position: relative;
  overflow: hidden;
  ${css}
}

${Array.from({ length: layers }, (_, i) => `
@keyframes moveBackground${i} {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}
`).join('\n')}
`
    navigator.clipboard.writeText(fullCSS)
    toast.success('CSS copied to clipboard!')
  }

  const handleDownload = () => {
    const fullCSS = `.background-pattern {
  position: relative;
  overflow: hidden;
  ${css}
}

${Array.from({ length: layers }, (_, i) => `
@keyframes moveBackground${i} {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}
`).join('\n')}
`
    const blob = new Blob([fullCSS], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'background-pattern.css'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('CSS Downloaded successfully!')
  }

  const handlePaletteSelect = (palette: { colors: string[] }) => {
    setColor1(palette.colors[0])
    setColor2(palette.colors[1])
    setColor3(palette.colors[2])
    setColor4(palette.colors[3])
    setShowColorPalettes(false)
  }

  const handleReset = () => {
    setPatternType('checks')
    setColor1('#47d3ff')
    setColor2('#474bff')
    setColor3('#5d6bff')
    setColor4('#8c93ff')
    setSize(32)
    setOpacity(1)
    setAnimate(false)
    setAnimationSpeed(5)
    setRotationAngle(0)
    setBlendMode('normal')
    setLayers(1)
  }

  const handleRandomize = () => {
    const randomPattern = Object.keys(shapesData)[Math.floor(Math.random() * Object.keys(shapesData).length)] as PatternType
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)]
    setPatternType(randomPattern)
    setColor1(randomPalette.colors[0])
    setColor2(randomPalette.colors[1])
    setColor3(randomPalette.colors[2])
    setColor4(randomPalette.colors[3])
    setSize(Math.floor(Math.random() * 91) + 10)
    setOpacity(Math.random() * 0.5 + 0.5)
    setAnimate(Math.random() > 0.5)
    setAnimationSpeed(Math.random() * 9 + 1)
    setRotationAngle(Math.floor(Math.random() * 360))
    setBlendMode(['normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference', 'exclusion'][Math.floor(Math.random() * 12)])
    setLayers(Math.floor(Math.random() * 3) + 1)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const renderCodePreview = () => (
    <div
      className="w-full h-full rounded-lg transition-all duration-300 absolute inset-0"
      style={{ 
        ...cssToObject(css),
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transform: 'scale(1.01)' 
      }}
    ></div>
  )

  return (
    <ToolLayout
      title="CSS Background Pattern Generator"
      description="Create customizable CSS background patterns quickly and efficiently"
    >
      <TooltipProvider>
        <Toaster position="top-right" />

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <Tabs defaultValue="pattern" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pattern">Pattern</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="pattern">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pattern Preview */}
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Pattern Preview</h2>
                  <div 
                    className="w-full h-48 md:h-64 rounded-lg relative overflow-hidden"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    {renderCodePreview()}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={toggleFullscreen}
                          className="absolute bottom-2 right-2 bg-gray-700 hover:bg-gray-600"
                          aria-label="Fullscreen"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        View Fullscreen
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Pattern Settings */}
                <div className="space-y-4">
                  <h2 className="text-xl md:text-2xl font-bold text-white">Settings</h2>
                  <div className="space-y-4">
                    {/* Pattern Type */}
                    <div>
                      <Label htmlFor="patternType" className="text-white mb-2 block">Pattern Type</Label>
                      <Select
                        label="Select Pattern"
                        selectedKey={patternType}
                        onSelectionChange={(value: PatternType) => setPatternType(value)}
                        placeholder="Select pattern type"
                        className="w-full"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        options={Object.entries(shapesData).map(([value, data]: [string, any]) => ({
                          value,
                          label: (
                            <div className="flex items-center gap-2">
                              {React.createElement(ShapeIcons[data.icon as keyof typeof ShapeIcons])}
                              <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
                            </div>
                          )
                        }))}
                      />

                    </div>

                    {/* Size Slider */}
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

                    {/* Opacity Slider */}
                    <div>
                      <Label htmlFor="opacity" className="text-white mb-2 block">Opacity: {opacity.toFixed(2)}</Label>
                      <Slider
                        id="opacity"
                        min={0}
                        max={1}
                        step={0.01}
                        value={opacity}
                        onChange={(value) => setOpacity(value)}
                      />
                    </div>

                    {/* Rotation Angle */}
                    <div>
                      <Label htmlFor="rotationAngle" className="text-white mb-2 block">Rotation Angle: {rotationAngle}°</Label>
                      <Slider
                        id="rotationAngle"
                        min={0}
                        max={360}
                        step={1}
                        value={rotationAngle}
                        onChange={(value) => setRotationAngle(value)}
                      />
                    </div>

                    {/* Layers */}
                    <div>
                      <Label htmlFor="layers" className="text-white mb-2 block">Layers: {layers}</Label>
                      <Slider
                        id="layers"
                        min={1}
                        max={3}
                        step={1}
                        value={layers}
                        onChange={(value) => setLayers(value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors">
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-white">Color Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Color 1 */}
                <div>
                  <Label htmlFor="color1" className="text-white mb-2 block">
                    Color 1
                  </Label>
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
                {/* Color 2 */}
                <div>
                  <Label htmlFor="color2" className="text-white mb-2 block">
                    Color 2
                  </Label>
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
                {/* Color 3 */}
                <div>
                  <Label htmlFor="color3" className="text-white mb-2 block">
                    Color 3
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="color3"
                      type="color"
                      value={color3}
                      onChange={(e) => setColor3(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={color3}
                      onChange={(e) => setColor3(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
                {/* Color 4 */}
                <div>
                  <Label htmlFor="color4" className="text-white mb-2 block">
                    Color 4
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="color4"
                      type="color"
                      value={color4}
                      onChange={(e) => setColor4(e.target.value)}
                      className="w-12 h-12 p-1 bg-gray-700 border-gray-600"
                    />
                    <Input
                      type="text"
                      value={color4}
                      onChange={(e) => setColor4(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
              </div>


                {/* Color Palette Selector */}
                <div className="relative">
                  <Label htmlFor="colorPalette" className="text-white mb-2 block">Color Palette</Label>
                  <Button 
                    onClick={() => setShowColorPalettes(!showColorPalettes)}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Palette className="h-5 w-5 mr-2" />
                    Select Color Palette
                  </Button>
                  {showColorPalettes && (
                    <div className="absolute z-10 mt-2 w-full bg-gray-700 rounded-lg shadow-lg p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {COLOR_PALETTES.map((palette) => (
                        <div 
                          key={palette.name} 
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-600 p-2 rounded"
                          onClick={() => handlePaletteSelect(palette)}
                        >
                          <div className="flex">
                            {palette.colors.map((color) => (
                              <div 
                                key={color} 
                                className="w-6 h-6 rounded-full mr-1"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <span className="text-white text-sm">{palette.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced">
              <div className="space-y-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Advanced Settings</h2>
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
                    <Label htmlFor="animationSpeed" className="text-white mb-2 block">
                      Animation Speed: {animationSpeed}s
                    </Label>
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

                <div>
                  <Label htmlFor="blendMode" className="text-white mb-2 block">Blend Mode</Label>
                  <Select
                    label="Select Blend Mode"
                    selectedKey={blendMode}
                    onSelectionChange={setBlendMode}
                    placeholder="Select blend mode"
                    className="w-full"
                    options={[
                      'normal',
                      'multiply',
                      'screen',
                      'overlay',
                      'darken',
                      'lighten',
                      'color-dodge',
                      'color-burn',
                      'hard-light',
                      'soft-light',
                      'difference',
                      'exclusion'
                    ].map(mode => ({
                      value: mode,
                      label: mode.charAt(0).toUpperCase() + mode.slice(1)
                    }))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Generated CSS Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
            <div className="bg-gray-700 p-4 rounded-lg overflow-x-auto max-h-60 overflow-y-auto">
              <pre className="text-white whitespace-pre-wrap break-all text-xs md:text-sm">
                {`.background-pattern {
  position: relative;
  overflow: hidden;
  ${css}
}

${Array.from({ length: layers }, (_, i) => `
@keyframes moveBackground${i} {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: ${size}px ${size}px;
  }
}
`).join('\n')}
`}
              </pre>
            </div>
            <div className="mt-4 flex flex-wrap justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                onClick={handleCopy} 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="h-5 w-5 mr-2" />
                Copy CSS
              </Button>
              <Button 
                onClick={handleDownload} 
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-5 w-5 mr-2" />
                Download CSS
              </Button>
              <Button 
                onClick={handleRandomize} 
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Shuffle className="h-5 w-5 mr-2" />
                Randomize
              </Button>
              <Button 
                onClick={handleReset} 
                variant="destructive" 
                className="w-full sm:w-auto text-white border-white hover:bg-gray-700"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

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
                {renderCodePreview()}
              </div>
            </div>
          </div>
        )}
      </TooltipProvider>
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
        <Info className="w-6 h-6 mr-2" />
        What is the CSS Background Pattern Generator?
      </h2>
      <p className="text-gray-300 mb-4">
        The CSS Background Pattern Generator is a powerful and intuitive tool designed to create stunning, customizable background patterns for your web projects. It allows you to generate complex CSS patterns with ease, providing a wide range of options to suit your design needs.
      </p>
      <p className="text-gray-300 mb-4">
        Whether you're a professional web developer looking to add visual interest to your sites, a designer seeking inspiration, or a hobbyist experimenting with CSS, our Background Pattern Generator offers a user-friendly interface and advanced features to bring your ideas to life.
      </p>

      <div className="my-8">
        <Image 
          src="/Images/BackgroundPatternPreview.png?height=400&width=600" 
          alt="Screenshot of the CSS Background Pattern Generator interface showing pattern preview and customization options" 
          width={600} 
          height={400} 
          className="rounded-lg shadow-lg"
        />
      </div>

      <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <BookOpen className="w-6 h-6 mr-2" />
        How to Use the CSS Background Pattern Generator?
      </h2>
      <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li>Choose a pattern type from the dropdown menu.</li>
        <li>Adjust the pattern size, opacity, and rotation using the sliders.</li>
        <li>Select colors for your pattern using the color pickers or choose from predefined palettes.</li>
        <li>Experiment with advanced options like animation, blend modes, and multiple layers.</li>
        <li>Preview your pattern in real-time as you make adjustments.</li>
        <li>Copy the generated CSS or download it as a file for use in your projects.</li>
        <li>Use the randomize feature for quick inspiration or the reset button to start over.</li>
      </ol>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <Lightbulb className="w-6 h-6 mr-2" />
        Key Features
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li>Wide variety of pattern types to choose from</li>
        <li>Real-time preview of your custom pattern</li>
        <li>Adjustable pattern size, opacity, and rotation</li>
        <li>Custom color selection with predefined color palettes</li>
        <li>Advanced options including animation and blend modes</li>
        <li>Multi-layer support for complex patterns</li>
        <li>One-click copying of generated CSS</li>
        <li>CSS file download option</li>
        <li>Randomize feature for quick pattern generation</li>
        <li>Fullscreen preview mode</li>
        <li>Responsive design for use on various devices</li>
      </ul>

      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
        <Info className="w-6 h-6 mr-2" />
        Applications and Use Cases
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
        <li><strong>Web Design:</strong> Create unique backgrounds for websites and landing pages.</li>
        <li><strong>UI/UX Design:</strong> Generate patterns for app interfaces and design mockups.</li>
        <li><strong>Digital Art:</strong> Use as a base for digital illustrations or as standalone art pieces.</li>
        <li><strong>Branding:</strong> Develop consistent background patterns for brand materials.</li>
        <li><strong>Presentations:</strong> Add visual interest to slides and digital presentations.</li>
        <li><strong>Print Design:</strong> Generate patterns for use in print materials like posters or packaging.</li>
        <li><strong>Game Development:</strong> Create background textures for 2D games.</li>
        <li><strong>Education:</strong> Teach CSS concepts and demonstrate the power of CSS for creating complex visuals.</li>
      </ul>

      <p className="text-gray-300 mt-4">
        Ready to create eye-catching background patterns for your projects? Start using our CSS Background Pattern Generator now and unlock endless possibilities for your designs. Whether you're working on a professional website, a personal project, or just exploring the creative potential of CSS, our tool provides the flexibility and power you need to bring your vision to life. Try it out and see how it can transform your web designs with stunning, customizable patterns!
      </p>
    </div>
    </ToolLayout>
  )
}

function cssToObject(cssString: string): Record<string, string> {
  const obj: Record<string, string> = {};
  cssString.split(';').forEach((rule: string) => {
    const [property, value] = rule.split(':').map((str: string) => str.trim());
    if (property && value) {
      obj[property] = value;
    }
  });
  return obj;
}