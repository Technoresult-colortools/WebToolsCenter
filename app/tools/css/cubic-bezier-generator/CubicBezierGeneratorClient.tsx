'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select } from '@/components/ui/select1';
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { PlayCircle, PauseCircle, Info, BookOpen, Lightbulb, Copy, RefreshCw, Upload } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/Card"
import NextImage from 'next/image'

const presets = {
  'linear': [0, 0, 1, 1],
  'ease': [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  'drop': [0.215, 0.61, 0.355, 1],
  'down': [0.175, 0.885, 0.32, 1.275],
}

export default function CSSCubicBezierGenerator() {
  const [points, setPoints] = useState([0.25, 0.1, 0.25, 1])
  const [duration, setDuration] = useState(1)
  const [presetName, setPresetName] = useState('custom')
  const [isPlaying, setIsPlaying] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [showControlLines, setShowControlLines] = useState(true)
  const [animationKey, setAnimationKey] = useState(0)
  const [animeImage, setAnimeImage] = useState('/Images/victini.png?height=48&width=48')
  const animatedElementRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    drawCurve()
  }, [points, showGrid, showControlLines])

  const drawCurve = () => {
    const canvas = canvasRef.current
    if (!canvas) return
  
    const ctx = canvas.getContext('2d')
    if (!ctx) return
  
    const width = canvas.width
    const height = canvas.height
  
    ctx.clearRect(0, 0, width, height)
  
    if (showGrid) {
      // Draw grid
      ctx.strokeStyle = '#e0e0f0'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 10; i++) {
        ctx.beginPath()
        ctx.moveTo(i * width / 10, 0)
        ctx.lineTo(i * width / 10, height)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i * height / 10)
        ctx.lineTo(width, i * height / 10)
        ctx.stroke()
      }
    }
  
    // Add labels for Time and Progress
    ctx.fillStyle = '#fff'
    ctx.font = "14px Arial"
    ctx.textAlign = 'center'
    ctx.fillText("Time", width / 2, height - 10)
    ctx.save()
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Progress", -height / 2, 20)
    ctx.restore()
  
    // Draw curve
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, height)
    for (let t = 0; t <= 1; t += 0.01) {
      const x = cubicBezier(t, 0, points[0], points[2], 1) * width
      const y = (1 - cubicBezier(t, 0, points[1], points[3], 1)) * height
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  
    if (showControlLines) {
      // Draw control lines
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, height)
      ctx.lineTo(points[0] * width, (1 - points[1]) * height)
      ctx.stroke()
  
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(width, 0)
      ctx.lineTo(points[2] * width, (1 - points[3]) * height)
      ctx.stroke()
    }
  
    // Draw control points
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.arc(points[0] * width, (1 - points[1]) * height, 5, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(points[2] * width, (1 - points[3]) * height, 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  // Handle animation end
  useEffect(() => {
    const element = animatedElementRef.current;
    if (!element) return;

    const handleAnimationEnd = () => {
      setIsPlaying(false);
    };

    element.addEventListener('animationend', handleAnimationEnd);
    return () => {
      element.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  const handlePlayClick = () => {
    if (!isPlaying) {
      setAnimationKey(prev => prev + 1); // Force animation restart
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const cubicBezier = (t: number, p0: number, p1: number, p2: number, p3: number) => {
    const u = 1 - t
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  }

  const handlePointChange = (index: number, value: number) => {
    const newPoints = [...points]
    newPoints[index] = Math.max(-1, Math.min(2, value))
    setPoints(newPoints)
    setPresetName('custom')
  }

  const handlePresetChange = (value: string) => {
    setPresetName(value)
    if (value in presets) {
      setPoints(presets[value as keyof typeof presets])
    }
  }

  const copyCSS = () => {
    const css = `animation-timing-function: cubic-bezier(${points.join(', ')});\nanimation-duration: ${duration}s;`
    navigator.clipboard.writeText(css)
    toast.success("The CSS has been copied to your clipboard.");
  }

  const resetCurve = () => {
    setPoints([0.25, 0.1, 0.25, 1])
    setPresetName('custom')
    setDuration(1)
    toast.success("The curve has been reset to default values.");
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAnimeImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <ToolLayout
      title="CSS Cubic Bezier Generator"
      description="Create smooth, custom easing functions for your CSS animations with precision and ease"
    >
      <Toaster position="top-right" />
          
      <Card className="bg-gray-800 shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Canvas Section */}
            <div>
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-64 bg-gray-700 rounded-lg mb-4"
              />
              <div className="text-white text-center">
                ({points.map(p => p.toFixed(2)).join(', ')})
              </div>
              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center">
                  <Switch
                    id="show-grid"
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                  <Label htmlFor="show-grid" className="ml-2 text-white">Show Grid</Label>
                </div>
                <div className="flex items-center">
                  <Switch
                    id="show-control-lines"
                    checked={showControlLines}
                    onCheckedChange={setShowControlLines}
                  />
                  <Label htmlFor="show-control-lines" className="ml-2 text-white">Show Control Lines</Label>
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div className="space-y-6">
              {/* Presets */}
              <div>
                <Label htmlFor="preset" className="text-white mb-2 block">Predefined Easing Functions</Label>
                <Select
                  label="Select Easing Function"
                  selectedKey={presetName}
                  onSelectionChange={handlePresetChange}
                  placeholder="Select a preset"
                  className="w-full"
                  options={[
                    { value: 'custom', label: 'Custom' },
                    ...Object.keys(presets).map(preset => ({
                      value: preset,
                      label: preset
                    }))
                  ]}
                />
              </div>

              {/* Duration */}
              <div>
                <Label htmlFor="duration" className="text-white mb-2 block">Animation Duration: {duration}s</Label>
                <Slider
                  id="duration"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={duration}
                  onChange={(value) => setDuration(value)}
                />
              </div>

              {/* Control Points */}
              <div className="space-y-4">
                {['X1', 'Y1', 'X2', 'Y2'].map((label, index) => (
                  <div key={label}>
                    <Label htmlFor={`P${index + 1}`} className="text-white mb-1 block">
                      {label} ({index % 2 === 0 ? 'Green' : 'Red'} Point)
                    </Label>
                    <Slider
                      id={`P${index + 1}`}
                      min={index % 2 === 0 ? 0 : -1}
                      max={index % 2 === 0 ? 1 : 2}
                      step={0.01}
                      value={points[index]}
                      onChange={(value) => handlePointChange(index, value)}
                    />
                    <Input
                      type="number"
                      value={points[index].toFixed(2)}
                      onChange={(e) => handlePointChange(index, parseFloat(e.target.value))}
                      className="mt-2 bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animation Preview */}
          <div className="mt-6">
            <Label className="text-white mb-2 block">Animation Preview</Label>
            <div className="flex items-center justify-between">
              <div className="h-16 bg-gray-700 rounded-lg flex items-center justify-start p-4 relative flex-grow mr-4">
                <div
                  ref={animatedElementRef}
                  key={animationKey}
                  className="w-12 h-12 absolute left-[4%]"
                  style={{
                    animation: isPlaying 
                      ? `${duration}s cubic-bezier(${points.join(', ')}) forwards moveBall` 
                      : 'none',
                    transform: 'translateZ(0)' // Force GPU acceleration
                  }}
                >
                  <NextImage 
                    src={animeImage} 
                    alt="Animated element" 
                    width={48} 
                    height={48}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handlePlayClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isPlaying ? (
                    <PauseCircle className="w-6 h-6" />
                  ) : (
                    <PlayCircle className="w-6 h-6" />
                  )}
                </Button>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center w-10 h-10">
                    <Upload className="w-6 h-6" />
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
          <style jsx global>{`
            @keyframes moveBall {
              from {
                left: 4%;
              }
              to {
                left: calc(100% - 48px - 4%);
              }
            }
          `}</style>
          <div className="mt-6">
            <Label className="text-white mb-2 block">CSS</Label>
            <div className="bg-gray-700 rounded-lg p-4 text-white font-mono text-sm">
              <pre className='overflow-x-auto'>{`animation-timing-function: cubic-bezier(${points.join(', ')});
animation-duration: ${duration}s;`}</pre>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={resetCurve} variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">
              <RefreshCw className="w-5 h-5 mr-2" />
              Reset
            </Button>
            <Button onClick={copyCSS} className="bg-blue-500 hover:bg-blue-600 text-white">
              <Copy className="w-5 h-5 mr-2" />
              Copy CSS
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is CSS Cubic Bezier Generator?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The CSS Cubic Bezier Generator is a powerful and intuitive tool designed for web developers and designers to create custom easing functions for CSS animations. By manipulating control points on a bezier curve, you can fine-tune the acceleration and deceleration of your animations, resulting in more natural and appealing motion.
          </p>
          <p className="text-gray-300 mb-4">
            This tool goes beyond basic presets, allowing you to visualize, customize, and preview complex easing functions. Whether you're a seasoned developer looking to perfect your animations or a beginner exploring the world of CSS transitions, our Enhanced CSS Cubic Bezier Generator provides the flexibility and precision you need to bring your ideas to life.
          </p>

          <div className="my-8">
            <NextImage 
              src="/Images/CubicBezierPreview.png?height=400&width=600" 
              alt="Screenshot of the Enhanced CSS Cubic Bezier Generator interface showing the curve editor and animation preview" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use CSS Cubic Bezier Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Start by selecting a preset easing function or create a custom curve from scratch.</li>
            <li>Adjust the control points using the sliders or input precise values for fine-tuning.</li>
            <li>Modify the animation duration to see how it affects the overall motion.</li>
            <li>Toggle the grid and control lines for better visualization of the curve.</li>
            <li>Use the animation preview to see your easing function in action.</li>
            <li>Upload a custom image to replace the default animated element for a more personalized preview.</li>
            <li>Copy the generated CSS code for use in your projects.</li>
            <li>Experiment with different curves and settings to achieve the perfect animation.</li>
            <li>Use the Reset button to start over with default settings if needed.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Interactive bezier curve editor with real-time visual feedback.</li>
            <li>Comprehensive set of predefined easing function presets.</li>
            <li>Precise control over curve shape with adjustable control points.</li>
            <li>Visual representation of the easing function on a customizable graph.</li>
            <li>Flexible animation duration settings.</li>
            <li>Toggleable grid and control lines for enhanced curve visualization.</li>
            <li>Live animation preview with play/pause functionality.</li>
            <li>Custom image upload feature for personalized animation previews.</li>
            <li>Generated CSS code with one-click copy to clipboard.</li>
            <li>Reset option for quick return to default settings.</li>
            <li>Responsive design for seamless use across various devices and screen sizes.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Web Animations:</strong> Create smooth, natural-looking transitions for elements on your website.</li>
            <li><strong>User Interface Design:</strong> Enhance the feel of interactive elements like buttons, menus, and modals.</li>
            <li><strong>Game Development:</strong> Design custom easing functions for game object movements and transitions.</li>
            <li><strong>Data Visualization:</strong> Add engaging animations to charts, graphs, and other data representations.</li>
            <li><strong>Mobile App Development:</strong> Improve the user experience in hybrid mobile apps with custom CSS animations.</li>
            <li><strong>E-learning Platforms:</strong> Create attention-grabbing animations for educational content and interactive lessons.</li>
            <li><strong>Portfolio Websites:</strong> Showcase your design skills with unique, eye-catching animations.</li>
            <li><strong>Marketing and Advertising:</strong> Develop engaging animated banners and promotional content.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The CSS Cubic Bezier Generator empowers you to create sophisticated, custom easing functions that can dramatically improve the visual appeal and user experience of your web projects. By providing an intuitive interface for manipulating bezier curves, along with real-time previews and easy CSS generation, this tool bridges the gap between complex mathematical concepts and practical, beautiful web animations. Whether you're aiming for subtle, natural movements or bold, eye-catching effects, the Enhanced CSS Cubic Bezier Generator gives you the control and flexibility you need to bring your creative vision to life.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}