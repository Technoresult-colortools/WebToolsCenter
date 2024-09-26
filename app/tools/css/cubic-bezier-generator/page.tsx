'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast, { Toaster } from 'react-hot-toast'
import { PlayCircle, PauseCircle } from 'lucide-react'
import styled from 'styled-components'

const presets = {
  'linear': [0, 0, 1, 1],
  'ease': [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  'drop': [0.215, 0.61, 0.355, 1],
  'down': [0.175, 0.885, 0.32, 1.275],
}

const AnimatedBox = styled.div<{ duration: number; bezier: string; isPlaying: boolean }>`
  width: 3rem;
  height: 3rem;
  background-color: #3b82f6;
  border-radius: 9999px;
  position: absolute;
  left: 0;
  animation: move ${props => props.duration}s cubic-bezier(${props => props.bezier}) infinite alternate;
  animation-play-state: ${props => props.isPlaying ? 'running' : 'paused'};

  @keyframes move {
    from {
      left: 0;
    }
    to {
      left: calc(100% - 3rem);
    }
  }
`

export default function CSSCubicBezierGenerator() {
  const [points, setPoints] = useState([0.25, 0.1, 0.25, 1])
  const [duration, setDuration] = useState(1)
  const [presetName, setPresetName] = useState('custom')
  const [isPlaying, setIsPlaying] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    drawCurve()
  }, [points])

  const drawCurve = () => {
    const canvas = canvasRef.current
    if (!canvas) return
  
    const ctx = canvas.getContext('2d')
    if (!ctx) return
  
    const width = canvas.width
    const height = canvas.height
  
    ctx.clearRect(0, 0, width, height)
  
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
  
    // Add labels for Time and Progress
    ctx.fillStyle = '#fff' // Changed to black for better visibility
    ctx.font = "14px Arial"
    ctx.textAlign = 'center'
    ctx.fillText("Time", width / 2, height - 10) // X-axis label, moved to bottom center
    ctx.save()
    ctx.rotate(-Math.PI / 2)
    ctx.fillText("Progress", -height / 2, 20) // Y-axis label
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
  
    // Draw control points
    // Green point: Line connecting to (0,0) on X-axis
    ctx.strokeStyle = '#22c55e'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, height) // (0,0) on canvas
    ctx.lineTo(points[0] * width, (1 - points[1]) * height)
    ctx.stroke()
  
    // Red point: Line connecting to (1,1) on Y-axis
    ctx.strokeStyle = '#ef4444'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(width, 0) // (1,1) on canvas
    ctx.lineTo(points[2] * width, (1 - points[3]) * height)
    ctx.stroke()
  
    // Draw control points
    ctx.fillStyle = '#22c55e' // Green point
    ctx.beginPath()
    ctx.arc(points[0] * width, (1 - points[1]) * height, 5, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.fillStyle = '#ef4444' // Red point
    ctx.beginPath()
    ctx.arc(points[2] * width, (1 - points[3]) * height, 5, 0, 2 * Math.PI)
    ctx.fill()
  }

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
    toast.success('CSS copied to clipboard!')
  }

  const resetCurve = () => {
    setPoints([0.25, 0.1, 0.25, 1])
    setPresetName('custom')
    setDuration(1)
    toast.success('Curve reset to default')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">CSS Cubic Bezier Generator</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
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
            </div>
            <div>
              <div className="mb-4">
                <Label htmlFor="preset" className="text-white mb-2 block">Predefined Easing Functions</Label>
                <Select value={presetName} onValueChange={handlePresetChange}>
                  <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select a preset" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectItem value="custom">Custom</SelectItem>
                    {Object.keys(presets).map((preset) => (
                      <SelectItem key={preset} value={preset}>{preset}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <Label htmlFor="duration" className="text-white mb-2 block">Animation Duration: {duration}s</Label>
                <Slider
                  id="duration"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={duration}
                  onChange={(value) => setDuration(value)}
                  className="w-full"
                />
              </div>
              {['P1', 'P2'].map((point, i) => (
                <div key={point} className="mb-4">
                  <Label className="text-white mb-2 block">Coordinates of {point} ({i === 0 ? 'Green' : 'Red'} Dot)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`${point}X`} className="text-white mb-1 block">X{i + 1}</Label>
                      <Slider
                        id={`${point}X`}
                        min={0}
                        max={1}
                        step={0.01}
                        value={points[i * 2]}
                        onChange={(value) => handlePointChange(i * 2, value)}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${point}Y`} className="text-white mb-1 block">Y{i + 1}</Label>
                      <Slider
                        id={`${point}Y`}
                        min={-1}
                        max={2}
                        step={0.01}
                        value={points[i * 2 + 1]}
                        onChange={(value) => handlePointChange(i * 2 + 1, value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-white mb-2 block">Animation Preview</Label>
            <div className="h-16 bg-gray-700 rounded-lg flex items-center justify-start p-4 relative">
              <AnimatedBox
                duration={duration}
                bezier={points.join(', ')}
                isPlaying={isPlaying}
              />
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="ml-auto bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isPlaying ? <PauseCircle className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-white mb-2 block">CSS</Label>
            <div className="bg-gray-700 rounded-lg p-4 text-white font-mono text-sm">
              <pre>{`animation-timing-function: cubic-bezier(${points.join(', ')});
animation-duration: ${duration}s;`}</pre>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button onClick={resetCurve} className="bg-red-500 hover:bg-red-600 text-white">
              Reset
            </Button>
            <Button onClick={copyCSS} className="bg-blue-500 hover:bg-blue-600 text-white">
              Copy CSS
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}