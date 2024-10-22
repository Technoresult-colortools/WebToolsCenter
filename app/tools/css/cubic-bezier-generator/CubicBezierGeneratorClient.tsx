'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { PlayCircle, PauseCircle, Info, BookOpen, Lightbulb, Copy, RefreshCw } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'

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
  const ballRef = useRef<HTMLDivElement>(null)
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
    const ball = ballRef.current;
    if (!ball) return;

    const handleAnimationEnd = () => {
      setIsPlaying(false);
    };

    ball.addEventListener('animationend', handleAnimationEnd);
    return () => {
      ball.removeEventListener('animationend', handleAnimationEnd);
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

  return (
    <ToolLayout
      title="CSS Cubic Bezier Generator"
      description="Create smooth, custom easing functions for your CSS animations with precision and ease"
    >

    <Toaster position="top-right" />
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
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
                  <Select value={presetName} onValueChange={handlePresetChange}>
                    <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="custom">Custom</SelectItem>
                      {Object.keys(presets).map((preset) => (
                        <SelectItem key={preset} value={preset}>{preset}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                {/* Control Points - Restructured for better mobile layout */}
                <div className="space-y-4">
                  {/* X1 */}
                  <div>
                    <Label htmlFor="P1X" className="text-white mb-1 block">X1 (Green Point)</Label>
                    <Slider
                      id="P1X"
                      min={0}
                      max={1}
                      step={0.01}
                      value={points[0]}
                      onChange={(value) => handlePointChange(0, value)}
                    />
                    <Input
                      type="number"
                      value={points[0].toFixed(2)}
                      onChange={(e) => handlePointChange(0, parseFloat(e.target.value))}
                      className="mt-2 bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  {/* Y1 */}
                  <div>
                    <Label htmlFor="P1Y" className="text-white mb-1 block">Y1 (Green Point)</Label>
                    <Slider
                      id="P1Y"
                      min={-1}
                      max={2}
                      step={0.01}
                      value={points[1]}
                      onChange={(value) => handlePointChange(1, value)}
                    />
                    <Input
                      type="number"
                      value={points[1].toFixed(2)}
                      onChange={(e) => handlePointChange(1, parseFloat(e.target.value))}
                      className="mt-2 bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  {/* X2 */}
                  <div>
                    <Label htmlFor="P2X" className="text-white mb-1 block">X2 (Red Point)</Label>
                    <Slider
                      id="P2X"
                      min={0}
                      max={1}
                      step={0.01}
                      value={points[2]}
                      onChange={(value) => handlePointChange(2, value)}
                    />
                    <Input
                      type="number"
                      value={points[2].toFixed(2)}
                      onChange={(e) => handlePointChange(2, parseFloat(e.target.value))}
                      className="mt-2 bg-gray-700 text-white border-gray-600"
                    />
                  </div>

                  {/* Y2 */}
                  <div>
                    <Label htmlFor="P2Y" className="text-white mb-1 block">Y2 (Red Point)</Label>
                    <Slider
                      id="P2Y"
                      min={-1}
                      max={2}
                      step={0.01}
                      value={points[3]}
                      onChange={(value) => handlePointChange(3, value)}
                    />
                    <Input
                      type="number"
                      value={points[3].toFixed(2)}
                      onChange={(e) => handlePointChange(3, parseFloat(e.target.value))}
                      className="mt-2 bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Animation Preview */}
            <div className="mt-6">
              <Label className="text-white mb-2 block">Animation Preview</Label>
              <div className="flex items-center justify-between">
                <div className="h-16 bg-gray-700 rounded-lg flex items-center justify-start p-4 relative flex-grow mr-4">
                  <div
                    ref={ballRef}
                    key={animationKey}
                    className="w-12 h-12 bg-blue-500 rounded-full absolute left-[4%]"
                    style={{
                      animation: isPlaying 
                        ? `${duration}s cubic-bezier(${points.join(', ')}) forwards moveBall` 
                        : 'none',
                      transform: 'translateZ(0)' // Force GPU acceleration
                    }}
                  />
                </div>
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
                <pre className='overflow-x-auto'>{`animation-timing-function: cubic-bezier(${points.join(', ')});animation-duration: ${duration}s;`}</pre>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button onClick={resetCurve} className="bg-red-500 hover:bg-red-600 text-white">
                <RefreshCw className="w-5 h-5 mr-2" />
                Reset
              </Button>
              <Button onClick={copyCSS} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Copy className="w-5 h-5 mr-2" />
                Copy CSS
              </Button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4  md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the CSS Cubic Bezier Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The CSS Cubic Bezier Generator is a powerful tool that allows developers and designers to create custom easing functions for CSS animations. By manipulating control points on a bezier curve, you can fine-tune the acceleration and deceleration of your animations, resulting in more natural and appealing motion.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the CSS Cubic Bezier Generator
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Choose a preset easing function or start with a custom curve.</li>
              <li>Adjust the control points using the sliders or input precise values.</li>
              <li>Set the animation duration to see how it affects the motion.</li>
              <li>Use the toggles to show/hide the grid and control lines for better visualization.</li>
              <li>Preview the animation using the play/pause button.</li>
              <li>Copy the generated CSS code for use in your projects.</li>
              <li>Use the Reset button to start over with default settings.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Interactive bezier curve editor with real-time preview.</li>
              <li>Predefined easing function presets for quick selection.</li>
              <li>Precise control over curve shape with adjustable control points.</li>
              <li>Visual representation of the easing function on a graph.</li>
              <li>Customizable animation duration.</li>
              <li>Toggle grid and control lines for better visualization.</li>
              <li>Animation preview with play/pause functionality.</li>
              <li>Generated CSS code with one-click copy to clipboard.</li>
              <li>Reset option to quickly return to default settings.</li>
              <li>Responsive design for use on various devices, including mobile.</li>
            </ul>
          </div>
  </ToolLayout>
  )
}