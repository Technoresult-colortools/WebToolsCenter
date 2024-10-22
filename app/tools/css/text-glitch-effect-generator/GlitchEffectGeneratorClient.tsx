'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Info, BookOpen, Lightbulb } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'


type GlitchEffect = 'rgb-split' | 'color' | 'noise' | 'transformation' | 'custom' | 'glitch-clip' | 'distortion'

const patternStyles: Record<GlitchEffect, (text: string, color1: string, color2: string, intensity: number, speed: number) => string> = {
  'rgb-split': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
  animation: glitch-skew ${speed * 2}s infinite linear alternate-reverse;
}
.glitch::before,
.glitch::after {
  content: '${text}';
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  opacity: 0.8;
}
.glitch::before {
  color: ${color1};
  animation: glitch-effect ${speed}s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
}
.glitch::after {
  color: ${color2};
  animation: glitch-effect ${speed * 1.1}s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
}
@keyframes glitch-effect {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-${intensity * 0.5}px, ${intensity * 0.5}px);
  }
  40% {
    transform: translate(-${intensity}px, -${intensity * 0.5}px);
  }
  60% {
    transform: translate(${intensity * 0.5}px, ${intensity}px);
  }
  80% {
    transform: translate(${intensity}px, -${intensity * 0.5}px);
  }
  100% {
    transform: translate(0);
  }
}
@keyframes glitch-skew {
  0% {
    transform: skew(0deg);
  }
  20% {
    transform: skew(${intensity * 0.2}deg);
  }
  40% {
    transform: skew(-${intensity * 0.1}deg);
  }
  60% {
    transform: skew(${intensity * 0.3}deg);
  }
  80% {
    transform: skew(-${intensity * 0.2}deg);
  }
  100% {
    transform: skew(0deg);
  }
}
  `,
  'color': (text, color1, color2, intensity, speed) => `
.glitch {
  animation: glitch-color ${speed}s infinite linear alternate-reverse;
}
@keyframes glitch-color {
  0% { text-shadow: ${intensity * 0.2}px ${intensity * 0.2}px ${color1}, -${intensity * 0.2}px -${intensity * 0.2}px ${color2}; }
  25% { text-shadow: -${intensity * 0.2}px ${intensity * 0.2}px ${color2}, ${intensity * 0.2}px -${intensity * 0.2}px ${color1}; }
  50% { text-shadow: ${intensity * 0.2}px -${intensity * 0.2}px ${color1}, -${intensity * 0.2}px ${intensity * 0.2}px ${color2}; }
  75% { text-shadow: -${intensity * 0.2}px -${intensity * 0.2}px ${color2}, ${intensity * 0.2}px ${intensity * 0.2}px ${color1}; }
  100% { text-shadow: ${intensity * 0.2}px ${intensity * 0.2}px ${color1}, -${intensity * 0.2}px -${intensity * 0.2}px ${color2}; }
}
  `,
  'noise': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
}
.glitch::before {
  content: '${text}';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABN0lEQVRoQ+2Y0Q6DIAxF6f//tBONMWZsA7pxN+ni8oC9pz1tYQr5Jn/lJjwsImWlvYjA7IjIIgJzAKa3iIAJwNRFpNZ6vgBwBmMuFb0bMzNaa8Xzr4GIyLGUcnwCxxhzqbV+9RBHEZELgKOUcuz7ftRa39cLEJHDGHOWUr4rpRwRsYvIEhFr7dlaey6lvMKfMeZsrX2dxVNrfRtjfDzfIgITXERABGAKIgIiAFMQERABmIKIgAjAFEQERABXcPgcubPWvkII9+0Td9OtR3rnXI/ILiKcc9Zae1prz2gfHZHRgqPnvXNuFBH9JGOMuYwx5+jZnUVGN/eej0YEZrCIwATX7+4wDZiCiIAIwBREBEQApiAiIAIwBREBEYApiAiIAExBREAEYAoiAiIAUxAREAGYwg9EvUE3nEfJPwAAAABJRU5ErkJggg==');
  opacity: ${intensity * 0.05};
  animation: glitch-noise ${speed}s infinite;
}
@keyframes glitch-noise {
  0% { transform: translate(0); }
  20% { transform: translate(-${intensity}px, ${intensity}px); }
  40% { transform: translate(-${intensity}px, -${intensity}px); }
  60% { transform: translate(${intensity}px, ${intensity}px); }
  80% { transform: translate(${intensity}px, -${intensity}px); }
  100% { transform: translate(0); }
}
  `,
  'transformation': (text, color1, color2, intensity, speed) => `
.glitch {
  animation: glitch-transform ${speed}s infinite;
}
@keyframes glitch-transform {
  0% { transform: translate(0); }
  20% { transform: translate(-${intensity}px, ${intensity}px); }
  40% { transform: skew(${intensity}deg); }
  60% { transform: scale(1.${intensity}); }
  80% { transform: rotate(${intensity}deg); }
  100% { transform: translate(0); }
}
  `,
  'glitch-clip': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: '${text}';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip: rect(0, 0, 0, 0);
}
.glitch::before {
  left: ${intensity * 0.2}px;
  text-shadow: -1px 0 ${color1};
  animation: glitch-clip-1 ${speed}s infinite linear alternate-reverse;
}
.glitch::after {
  left: -${intensity * 0.2}px;
  text-shadow: 1px 0 ${color2};
  animation: glitch-clip-2 ${speed * 1.5}s infinite linear alternate-reverse;
}
@keyframes glitch-clip-1 {
  0% { clip: rect(${intensity * 5}px, 9999px, ${intensity * 10}px, 0); }
  20% { clip: rect(${intensity * 15}px, 9999px, ${intensity * 20}px, 0); }
  40% { clip: rect(${intensity * 25}px, 9999px, ${intensity * 30}px, 0); }
  60% { clip: rect(${intensity * 35}px, 9999px, ${intensity * 40}px, 0); }
  80% { clip: rect(${intensity * 45}px, 9999px, ${intensity * 50}px, 0); }
  100% { clip: rect(${intensity * 55}px, 9999px, ${intensity * 60}px, 0); }
}
@keyframes glitch-clip-2 {
  0% { clip: rect(${intensity * 10}px, 9999px, ${intensity * 15}px, 0); }
  20% { clip: rect(${intensity * 20}px, 9999px, ${intensity * 25}px, 0); }
  40% { clip: rect(${intensity * 30}px, 9999px, ${intensity * 35}px, 0); }
  60% { clip: rect(${intensity * 40}px, 9999px, ${intensity * 45}px, 0); }
  80% { clip: rect(${intensity * 50}px, 9999px, ${intensity * 55}px, 0); }
  100% { clip: rect(${intensity * 60}px, 9999px, ${intensity * 65}px, 0); }
}
  `,
  'distortion': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
  animation: glitch-distort ${speed * 2}s infinite;
}
.glitch::before,
.glitch::after {
  content: '${text}';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
.glitch::before {
  color: ${color1};
  animation: glitch-distort ${speed}s infinite;
  clip-path: polygon(0 ${intensity * 2}%, 100% 0%, 100% ${100 - intensity * 2}%, 0% 100%);
}
.glitch::after {
  color: ${color2};
  animation: glitch-distort ${speed * 1.5}s infinite reverse;
  clip-path: polygon(0 ${intensity}%, 100% ${intensity * 2}%, 100% ${100 - intensity}%, 0% ${100 - intensity * 2}%);
}
@keyframes glitch-distort {
  0% {
    transform: translate(0);
  }
  25% {
    transform: translate(${intensity * 0.5}px, -${intensity * 0.5}px) skew(${intensity * 0.2}deg);
  }
  50% {
    transform: translate(-${intensity * 0.5}px, ${intensity * 0.5}px) skew(-${intensity * 0.2}deg);
  }
  75% {
    transform: translate(${intensity * 0.5}px, ${intensity * 0.5}px) skew(${intensity * 0.2}deg);
  }
  100% {
    transform: translate(0);
  }
}
  `,
  'custom': () => '',
}

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
  font-weight: bold;
  color: ${textColor};
  letter-spacing: 3px;
  z-index: 1;
}

${patternStyles[glitchEffect](text, glitchColor1, glitchColor2, glitchIntensity, animationSpeed)}
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
  }, [text, fontSize, backgroundColor, textColor, glitchColor1, glitchColor2, glitchEffect, glitchIntensity, animationSpeed, showScanLines, customCSS])

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
    toast.success('Settings reset to default!')
  }

  return (
    <ToolLayout
      title="CSS Text Glitch Effect Generator"
      description="Create eye-catching, glitchy text effects using CSS"
    >

    <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Glitch Effect Preview</h2>
              <div 
                className="relative bg-gray-900 rounded-lg overflow-hidden"
                style={{ width: '100%', height: '300px' }}
              >
                <div className="glitch-wrapper" style={{ backgroundColor }}>
                  <div 
                    className="glitch"
                    data-text={text}
                    style={{ 
                      fontSize: `${fontSize}px`,
                      color: textColor,
                    }}
                  >
                    {text}
                  </div>
                  {showScanLines && <div className="scan-lines"></div>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Text Settings</h2>
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
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Glitch Settings</h2>
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
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated HTML & CSS</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <code className="text-white whitespace-pre-wrap break-all">
                  {`<div class="glitch-wrapper">
    <div class="glitch" data-text="${text}">${text}</div>
    ${showScanLines ? '<div class="scan-lines"></div>' : ''}
  </div>

  <style>
  ${generatedCSS}
  </style>`}
                </code>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button onClick={handleReset} variant="destructive" className="text-white border-white hover:bg-gray-700">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy HTML & CSS
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the CSS Text Glitch Effect Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The CSS Text Glitch Effect Generator is a powerful tool for creating eye-catching, glitchy text effects using CSS. It offers customizable options for various glitch styles, colors, intensities, and animation speeds, making it easy to design modern, dynamic text effects. The tool provides real-time previews and generates HTML and CSS code that you can copy with a single click.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the CSS Text Glitch Effect Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter the text you want to apply the glitch effect to.</li>
              <li>Choose a glitch effect type from the dropdown menu (RGB Split, Color, Noise, Transformation, Glitch Clip, Distortion, or Custom).</li>
              <li>Adjust the font size, text color, and background color to your liking.</li>
              <li>Customize the glitch colors using the color pickers or by entering hex values.</li>
              <li>Use the sliders to adjust the glitch intensity and animation speed.</li>
              <li>Toggle the "Show Scan Lines" option to add or remove the scan line effect.</li>
              <li>For advanced users, select the "Custom" glitch effect to enter your own CSS.</li>
              <li>Preview your glitch effect in real-time in the preview area.</li>
              <li>Copy the generated HTML and CSS code to use in your project.</li>
              <li>Use the "Reset" button to return to default settings if needed.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Multiple pre-defined glitch effects (RGB Split, Color, Noise, Transformation, Glitch Clip, Distortion)</li>
              <li>Custom text input with real-time preview</li>
              <li>Adjustable font size, text color, and background color</li>
              <li>Customizable glitch colors with color pickers and hex input</li>
              <li>Glitch intensity and animation speed controls</li>
              <li>Optional scan lines effect</li>
              <li>Custom CSS input for advanced users</li>
              <li>Real-time preview of the glitch effect</li>
              <li>Generated HTML and CSS code with one-click copy functionality</li>
              <li>Reset option to quickly return to default settings</li>
              <li>Responsive design for use on various devices</li>
            </ul>
          </div>
  </ToolLayout>
  )
}