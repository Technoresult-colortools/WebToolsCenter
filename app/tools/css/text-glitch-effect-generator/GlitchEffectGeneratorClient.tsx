'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, Toaster } from 'react-hot-toast'
import { Copy, RefreshCw, Info, BookOpen, Lightbulb, Download, Palette, Eye, EyeOff, Maximize2, X, Sliders, } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Image from 'next/image'
import { glitchEffects, GlitchEffect } from './glitcheffects';



export default function TextGlitchEffectGenerator() {
  const [text, setText] = useState('WebTools')
  const [fontSize, setFontSize] = useState(94)
  const [backgroundColor, setBackgroundColor] = useState('#222222')
  const [textColor, setTextColor] = useState('#ffffff')
  const [glitchColor1, setGlitchColor1] = useState('#00ffff')
  const [glitchColor2, setGlitchColor2] = useState('#ff00ff')
  const [glitchEffect, setGlitchEffect] = useState<GlitchEffect>('rgb-split')
  const [glitchIntensity, setGlitchIntensity] = useState(5)
  const [animationSpeed, setAnimationSpeed] = useState(0.5)
  const [showScanLines, setShowScanLines] = useState(true)
  const [customCSS, setCustomCSS] = useState('')
  const [generatedCSS, setGeneratedCSS] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontWeight, setFontWeight] = useState(700)
  const [letterSpacing, setLetterSpacing] = useState(3)

  const generateCSS = () => {
    let css = `
.glitch-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: ${backgroundColor};
}

.glitch {
  position: relative;
  font-size: ${fontSize}px;
  font-weight: ${fontWeight};
  color: ${textColor};
  letter-spacing: ${letterSpacing}px;
  z-index: 1;
}

${glitchEffects[glitchEffect](text, glitchColor1, glitchColor2, glitchIntensity, animationSpeed)}
`

    if (showScanLines) {
      css += `
.scan-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.05) 0px,
    rgba(0, 0, 0, 0.05) 1px,
    rgba(0, 0, 0, 0) 1px,
    rgba(0, 0, 0, 0) 2px
  );
  pointer-events: none;
}
`
    }

    if (glitchEffect === 'custom') {
      css += customCSS
    }

    return css.trim()
  }

  useEffect(() => {
    const css = generateCSS()
    setGeneratedCSS(css)

    const styleTag = document.createElement('style')
    styleTag.innerHTML = css
    document.head.appendChild(styleTag)

    return () => {
      document.head.removeChild(styleTag)
    }
  }, [text, fontSize, backgroundColor, textColor, glitchColor1, glitchColor2, glitchEffect, glitchIntensity, animationSpeed, showScanLines, customCSS, fontWeight, letterSpacing])

  const handleCopy = () => {
    const html = `
<div class="glitch-wrapper">
  <div class="glitch" data-text="${text}">${text}</div>
  ${showScanLines ? '<div class="scan-lines"></div>' : ''}
</div>
`.trim()

    const fullCode = `${html}\n\n<style>\n${generatedCSS}\n</style>`
    navigator.clipboard.writeText(fullCode)
    toast.success('HTML & CSS copied to clipboard!')
  }

  const handleDownload = () => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Glitch Text Effect</title>
  <style>
${generatedCSS}
  </style>
</head>
<body>
  <div class="glitch-wrapper">
    <div class="glitch" data-text="${text}">${text}</div>
    ${showScanLines ? '<div class="scan-lines"></div>' : ''}
  </div>
</body>
</html>
`.trim()

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'glitch-text-effect.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('HTML file downloaded!')
  }

  const handleReset = () => {
    setText('WebTools')
    setFontSize(94)
    setBackgroundColor('#222222')
    setTextColor('#ffffff')
    setGlitchColor1('#00ffff')
    setGlitchColor2('#ff00ff')
    setGlitchEffect('rgb-split')
    setGlitchIntensity(5)
    setAnimationSpeed(0.5)
    setShowScanLines(true)
    setCustomCSS('')
    setFontWeight(700)
    setLetterSpacing(3)
    toast.success('Settings reset to default!')
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const renderGlitchPreview = () => (
    <div
      className="glitch-wrapper"
      style={{
        backgroundColor,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div 
        className="glitch"
        data-text={text}
        style={{ 
          fontSize: `${fontSize}px`,
          fontWeight: fontWeight,
          color: textColor,
          letterSpacing: `${letterSpacing}px`,
        }}
      >
        {text}
      </div>
      {showScanLines && <div className="scan-lines"></div>}
    </div>
  )

  return (
    <ToolLayout
      title="CSS Text Glitch Effect Generator"
      description="Create eye-catching, customizable glitchy text effects using CSS with advanced options and features"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardContent>
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
              <div className="relative">
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  {renderGlitchPreview()}
                </div>
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setShowScanLines(!showScanLines)}
                  >
                    {showScanLines ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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

            <Tabs defaultValue="text">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">
                  <Sliders className="h-4 w-4 mr-2" />
                  Text Settings
                </TabsTrigger>
                <TabsTrigger value="glitch">
                  <Palette className="h-4 w-4 mr-2" />
                  Glitch Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="text">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text" className="text-white mb-2 block">Text</Label>
                    <Input
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fontSize" className="text-white mb-2 block">Font Size: {fontSize}px</Label>
                    <Slider
                      id="fontSize"
                      min={10}
                      max={200}
                      step={1}
                      value={fontSize}
                      onChange={(value) => setFontSize(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="fontWeight" className="text-white mb-2 block">Font Weight: {fontWeight}</Label>
                    <Slider
                      id="fontWeight"
                      min={100}
                      max={900}
                      step={100}
                      value={fontWeight}
                      onChange={(value) => setFontWeight(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="letterSpacing" className="text-white mb-2 block">Letter Spacing: {letterSpacing}px</Label>
                    <Slider
                      id="letterSpacing"
                      min={0}
                      max={10}
                      step={0.5}
                      value={letterSpacing}
                      onChange={(value) => setLetterSpacing(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="textColor" className="text-white mb-2 block">Text Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        id="textColor"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="backgroundColor" className="text-white mb-2 block">Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        id="backgroundColor"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="glitch">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="glitchEffect" className="text-white mb-2 block">Glitch Effect</Label>
                    <Select value={glitchEffect} onValueChange={(value: GlitchEffect) => setGlitchEffect(value)}>
                      <SelectTrigger id="glitchEffect" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select glitch effect" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="rgb-split">RGB Split</SelectItem>
                        <SelectItem value="color">Color</SelectItem>
                        <SelectItem value="noise">Noise</SelectItem>
                        <SelectItem value="transformation">Transformation</SelectItem>
                        <SelectItem value="glitch-clip">Glitch Clip</SelectItem>
                        <SelectItem value="distortion">Distortion</SelectItem>
                        <SelectItem value="pixelate">Pixelate</SelectItem>
                        <SelectItem value="wave">Wave</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="glitchColor1" className="text-white mb-2 block">Glitch Color #1</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        id="glitchColor1"
                        value={glitchColor1}
                        onChange={(e) => setGlitchColor1(e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={glitchColor1}
                        onChange={(e) => setGlitchColor1(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="glitchColor2" className="text-white mb-2 block">Glitch Color #2</Label>
                    <div className="flex space-x-2">
                      <Input
                        type="color"
                        id="glitchColor2"
                        value={glitchColor2}
                        onChange={(e) => setGlitchColor2(e.target.value)}
                        className="w-10 h-10 p-1 bg-transparent"
                      />
                      <Input
                        type="text"
                        value={glitchColor2}
                        onChange={(e) => setGlitchColor2(e.target.value)}
                        className="flex-grow bg-gray-700 text-white border-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="glitchIntensity" className="text-white mb-2 block">Glitch Intensity: {glitchIntensity}</Label>
                    <Slider
                      id="glitchIntensity"
                      min={1}
                      max={20}
                      step={1}
                      value={glitchIntensity}
                      onChange={(value) => setGlitchIntensity(value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="animationSpeed" className="text-white mb-2 block">Animation Speed: {animationSpeed.toFixed(2)}s</Label>
                    <Slider
                      id="animationSpeed"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={animationSpeed}
                      onChange={(value) => setAnimationSpeed(value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showScanLines" className="text-white">Show Scan Lines</Label>
                    <Switch
                      id="showScanLines"
                      checked={showScanLines}
                      onCheckedChange={setShowScanLines}
                    />
                  </div>

                  {glitchEffect === 'custom' && (
                    <div>
                      <Label htmlFor="customCSS" className="text-white mb-2 block">Custom CSS</Label>
                      <textarea
                        id="customCSS"
                        value={customCSS}
                        onChange={(e) => setCustomCSS(e.target.value)}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                        placeholder="Enter your custom CSS here..."
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated HTML & CSS</h2>
              
              {/* Code Container */}
              <div className="bg-gray-700 p-4 rounded-lg max-h-60 overflow-auto">
                <code className="text-white whitespace-pre-wrap break-all">
                  {`
                  <div class="glitch-wrapper">
                    <div class="glitch" data-text="${text}">${text}</div>
                    ${showScanLines ? '<div class="scan-lines"></div>' : ''}
                  </div>

                  <style>
                  ${generatedCSS}
                  </style>`}
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
                  Copy HTML & CSS
                </Button>
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download HTML
                </Button>
              </div>
            </div>
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
              {renderGlitchPreview()}
            </div>
          </div>
        </div>
      )}

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is CSS Text Glitch Effect Generator?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The CSS Text Glitch Effect Generator is a powerful tool for creating eye-catching, glitchy text effects using CSS. It offers a wide range of customizable options for various glitch styles, colors, intensities, and animation speeds, making it easy to design modern, dynamic text effects for web projects, digital art, or any creative endeavor requiring a unique visual impact.
          </p>
          <p className="text-gray-300 mb-4">
            This tool provides real-time previews and generates HTML and CSS code that you can easily copy or download for use in your projects. Whether you're a web developer, designer, or digital artist, this generator offers an intuitive interface to experiment with different glitch effects and fine-tune them to your exact specifications.
          </p>

          <div className="my-8">
              <Image 
                src="/Images/CSSTextGlitchPreview.png?height=400&width=600" 
                alt="Screenshot of the CSS Text Glitch Effect Generator is a powerful tool for creating eye-catching, glitchy text effects using CSS." 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use CSS Text Glitch Effect Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter the text you want to apply the glitch effect to in the "Text" input field.</li>
            <li>Adjust the font size, weight, and letter spacing using the respective sliders.</li>
            <li>Choose text and background colors using the color pickers or by entering hex values.</li>
            <li>Select a glitch effect type from the dropdown menu (RGB Split, Color, Noise, Transformation, Glitch Clip, Distortion, Pixelate, Wave, or Custom).</li>
            <li>Customize the glitch colors using the color pickers for Glitch Color #1 and #2.</li>
            <li>Use the sliders to adjust the glitch intensity and animation speed.</li>
            <li>Toggle the "Show Scan Lines" option to add or remove the scan line effect.</li>
            <li>For advanced users, select the "Custom" glitch effect to enter your own CSS.</li>
            <li>Preview your glitch effect in real-time in the preview area.</li>
            <li>Use the fullscreen button to view your effect in a larger format.</li>
            <li>Copy the generated HTML and CSS code or download the complete HTML file for use in your project.</li>
            <li>Use the "Reset" button to return to default settings if needed.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Multiple pre-defined glitch effects (RGB Split, Color, Noise, Transformation, Glitch Clip, Distortion, Pixelate, Wave)</li>
            <li>Custom text input with real-time preview</li>
            <li>Adjustable font size, weight, and letter spacing</li>
            <li>Customizable text color, background color, and glitch colors</li>
            <li>Glitch intensity and animation speed controls</li>
            <li>Optional scan lines effect</li>
            <li>Custom CSS input for advanced users</li>
            <li>Real-time preview of the glitch effect with fullscreen option</li>
            <li>Generated HTML and CSS code with one-click copy functionality</li>
            <li>Option to download a complete HTML file with the glitch effect</li>
            <li>Reset option to quickly return to default settings</li>
            <li>Responsive design for use on various devices</li>
            <li>Tabbed interface for easy navigation between text and glitch settings</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Web Design:</strong> Create attention-grabbing headers, titles, or call-to-action text for websites.</li>
            <li><strong>Digital Art:</strong> Incorporate glitch effects into digital illustrations or artwork.</li>
            <li><strong>Video Games:</strong> Design title screens, menu text, or in-game UI elements with a glitchy aesthetic.</li>
            <li><strong>Motion Graphics:</strong> Use as a starting point for animated text in video productions.</li>
            <li><strong>Social Media:</strong> Create eye-catching graphics for social media posts or profile images.</li>
            <li><strong>Advertising:</strong> Design unique and memorable text effects for digital advertisements.</li>
            <li><strong>Cyberpunk or Sci-Fi Themed Projects:</strong> Perfect for projects requiring a futuristic or dystopian look.</li>
            <li><strong>Music Industry:</strong> Design album covers, concert posters, or music video graphics.</li>
            <li><strong>Error Pages:</strong> Create visually interesting 404 or error pages for websites.</li>
            <li><strong>Educational Tools:</strong> Teach concepts of CSS animations and effects in a hands-on, interactive way.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The CSS Text Glitch Effect Generator empowers creators to produce sophisticated, modern text effects that can dramatically improve the visual appeal of various digital projects. By providing an intuitive interface for customizing complex glitch effects, along with real-time previews and easy code generation, this tool bridges the gap between advanced design concepts and practical implementation. Whether you're aiming for subtle, elegant touches or bold, eye-catching elements, the Enhanced CSS Text Glitch Effect Generator gives you the control and flexibility you need to bring your creative vision to life.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}