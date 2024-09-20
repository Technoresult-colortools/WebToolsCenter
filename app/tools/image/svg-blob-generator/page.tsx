'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Download, Copy, RefreshCw, Upload } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import  Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface BlobParams {
  edgeCount: number
  contrast: number
  smoothness: number
  seed: number
  fill: string
  stroke: string
  strokeWidth: number
}

interface Layer {
  id: string
  params: BlobParams
  path: string
  blendMode: React.CSSProperties['mixBlendMode']
}

const defaultParams: BlobParams = {
  edgeCount: 5,
  contrast: 0.5,
  smoothness: 0.5,
  seed: Math.random(),
  fill: '#3b82f6',
  stroke: '#1d4ed8',
  strokeWidth: 0
}

const blendModes: React.CSSProperties['mixBlendMode'][] = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
  'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
  'exclusion', 'hue', 'saturation', 'color', 'luminosity'
]

export default function SVGBlobGenerator() {
  const [layers, setLayers] = useState<Layer[]>([{ id: '1', params: defaultParams, path: '', blendMode: 'normal' }])
  const [selectedLayer, setSelectedLayer] = useState<string>('1')
  const [canvasSize] = useState({ width: 400, height: 400 })
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    generateBlobs()
  }, [])

  const generateBlobs = () => {
    setLayers(prevLayers => 
      prevLayers.map(layer => ({
        ...layer,
        path: generateBlobPath(layer.params),
        params: { ...layer.params, seed: Math.random() }
      }))
    )
  }

  const generateBlobPath = (params: BlobParams): string => {
    const { edgeCount, contrast, smoothness, seed } = params
    const size = Math.min(canvasSize.width, canvasSize.height) * 0.8
    const points: [number, number][] = []
    const angleStep = (Math.PI * 2) / edgeCount
    
    for (let i = 0; i < edgeCount; i++) {
      const angle = i * angleStep
      const radius = size / 2 * (0.7 + (Math.sin(seed + i * smoothness) * contrast * 0.25))
      points.push([
        Math.cos(angle) * radius + canvasSize.width / 2,
        Math.sin(angle) * radius + canvasSize.height / 2
      ])
    }
    
    return `M ${points[0][0]},${points[0][1]} ` + 
           points.map((point, index) => {
             const nextPoint = points[(index + 1) % points.length]
             const midX = (point[0] + nextPoint[0]) / 2
             const midY = (point[1] + nextPoint[1]) / 2
             return `Q ${point[0]},${point[1]} ${midX},${midY}`
           }).join(' ') +
           ' Z'
  }

  const handleParamChange = (param: keyof BlobParams, value: number | string) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === selectedLayer
          ? { ...layer, params: { ...layer.params, [param]: value } }
          : layer
      )
    )
    generateBlobs()
  }

  const handleBlendModeChange = (blendMode: React.CSSProperties['mixBlendMode']) => {
    setLayers(prevLayers => 
      prevLayers.map(layer => 
        layer.id === selectedLayer
          ? { ...layer, blendMode }
          : layer
      )
    )
  }

  const addLayer = () => {
    const newLayer: Layer = {
      id: (layers.length + 1).toString(),
      params: { ...defaultParams, seed: Math.random() },
      path: '',
      blendMode: 'normal'
    }
    setLayers([...layers, newLayer])
    setSelectedLayer(newLayer.id)
    generateBlobs()
  }

  const removeLayer = (id: string) => {
    if (layers.length > 1) {
      setLayers(layers.filter(layer => layer.id !== id))
      setSelectedLayer(layers[0].id)
      generateBlobs()
    }
  }

  const exportSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)
      const downloadLink = document.createElement('a')
      downloadLink.href = svgUrl
      downloadLink.download = 'blob.svg'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    }
  }

  const exportPNG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const canvas = document.createElement('canvas')
      canvas.width = canvasSize.width
      canvas.height = canvasSize.height
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
        const pngUrl = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = 'blob.png'
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  const copySVGCode = () => {
    if (svgRef.current) {
      const svgCode = svgRef.current.outerHTML
      navigator.clipboard.writeText(svgCode).then(() => {
        alert('SVG code copied to clipboard!')
      })
    }
  }

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setBackgroundImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundImageURL = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundImage(event.target.value)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">SVG Blob Generator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <svg
              ref={svgRef}
              width={canvasSize.width}
              height={canvasSize.height}
              viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {layers.map(layer => (
                  <clipPath key={`clip-${layer.id}`} id={`clip-path-${layer.id}`}>
                    <path d={layer.path} />
                  </clipPath>
                ))}
              </defs>
              {layers.map(layer => (
                <g key={layer.id} style={{ mixBlendMode: layer.blendMode }}>
                  {backgroundImage && (
                    <image
                      href={backgroundImage}
                      width={canvasSize.width}
                      height={canvasSize.height}
                      preserveAspectRatio="xMidYMid slice"
                      clipPath={`url(#clip-path-${layer.id})`}
                    />
                  )}
                  <path
                    d={layer.path}
                    fill={backgroundImage ? 'none' : layer.params.fill}
                    stroke={layer.params.stroke}
                    strokeWidth={layer.params.strokeWidth}
                  />
                </g>
              ))}
            </svg>
          </div>
          <div className="flex justify-center space-x-4 mb-8">
            <Button onClick={generateBlobs} variant="secondary">
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
            <Button onClick={exportSVG} variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Export SVG
            </Button>
            <Button onClick={exportPNG} variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Export PNG
            </Button>
            <Button onClick={copySVGCode} variant="secondary">
              <Copy className="mr-2 h-4 w-4" />
              Copy SVG Code
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Layers</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {layers.map(layer => (
                  <Button
                    key={layer.id}
                    onClick={() => setSelectedLayer(layer.id)}
                    variant={selectedLayer === layer.id ? "default" : "outline"}
                  >
                    Layer {layer.id}
                  </Button>
                ))}
                <Button onClick={addLayer} variant="secondary">
                  + Add Layer
                </Button>
              </div>
            </div>
            {layers.find(layer => layer.id === selectedLayer) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Layer Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edgeCount">Edge Count: {layers.find(layer => layer.id === selectedLayer)!.params.edgeCount}</Label>
                    <Slider
                      id="edgeCount"
                      min={3}
                      max={20}
                      step={1}
                      value={layers.find(layer => layer.id === selectedLayer)!.params.edgeCount}
                      onChange={(value) => handleParamChange('edgeCount', value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contrast">Contrast: {layers.find(layer => layer.id === selectedLayer)!.params.contrast.toFixed(2)}</Label>
                    <Slider
                      id="contrast"
                      min={0}
                      max={1}
                      step={0.01}
                      value={layers.find(layer => layer.id === selectedLayer)!.params.contrast}
                      onChange={(value) => handleParamChange('contrast', value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smoothness">Smoothness: {layers.find(layer => layer.id === selectedLayer)!.params.smoothness.toFixed(2)}</Label>
                    <Slider
                      id="smoothness"
                      min={0}
                      max={1}
                      step={0.01}
                      value={layers.find(layer => layer.id === selectedLayer)!.params.smoothness}
                      onChange={(value) => handleParamChange('smoothness', value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fill">Fill Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="fill"
                        type="color"
                        value={layers.find(layer => layer.id === selectedLayer)!.params.fill}
                        onChange={(e) => handleParamChange('fill', e.target.value)}
                        className="w-12 h-12 p-1 rounded"
                      />
                      <Input
                        type="text"
                        value={layers.find(layer => layer.id === selectedLayer)!.params.fill}
                        onChange={(e) => handleParamChange('fill', e.target.value)}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stroke">Stroke Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="stroke"
                        type="color"
                        value={layers.find(layer => layer.id === selectedLayer)!.params.stroke}
                        onChange={(e) => handleParamChange('stroke', e.target.value)}
                        className="w-12 h-12 p-1 rounded"
                      />
                      <Input
                        type="text"
                        value={layers.find(layer => layer.id === selectedLayer)!.params.stroke}
                        onChange={(e) => handleParamChange('stroke', e.target.value)}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strokeWidth">Stroke Width: {layers.find(layer => layer.id === selectedLayer)!.params.strokeWidth}</Label>
                    <Slider
                      id="strokeWidth"
                      min={0}
                      max={10}
                      step={1}
                      value={layers.find(layer => layer.id === selectedLayer)!.params.strokeWidth}
                      onChange={(value) => handleParamChange('strokeWidth', value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blendMode">Blend Mode</Label>
                    <Select
                      value={layers.find(layer => layer.id === selectedLayer)!.blendMode}
                      onValueChange={(value) => handleBlendModeChange(value as React.CSSProperties['mixBlendMode'])}
                    >
                      <SelectTrigger id="blendMode">
                        <SelectValue placeholder="Select blend mode" />
                      </SelectTrigger>
                      <SelectContent>
                        {blendModes.map(mode => (
                          <SelectItem key={mode} value={mode as string}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  onClick={() => removeLayer(selectedLayer)}
                  variant="destructive"
                  className="mt-4"
                >
                  Remove Layer
                </Button>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Background Image</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="bgImageUpload" className="cursor-pointer">
                  <Button variant="secondary" className="mr-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                </Label>
                <Input
                  id="bgImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="hidden"
                />
                <Input
                  type="text"
                  placeholder="Or enter image URL"
                  onChange={handleBackgroundImageURL}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About SVG Blob Generator</h2>
              <p className="text-white">
                This SVG Blob Generator allows you to create unique, customizable blob shapes for your design projects. 
                You can adjust various parameters, add multiple layers with different blend modes, and even add background images. 
                Export your creations as SVG or PNG files, or copy the SVG code directly.
              </p>          
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
              <p className="text-white">
                1. Adjust the parameters (edge count, contrast, smoothness) to change the blob shape.<br />
                2. Customize the fill color, stroke color, and stroke width.<br />
                3. Add multiple layers and experiment with different blend modes.<br />
                4. Add a background image by uploading a file or entering a URL.<br />
                5. Export your blob as an SVG or PNG file, or copy the SVG code.<br />
                6. Regenerate the blob or individual layers to create new variations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="list-disc list-inside text-white">
                <li>Interactive blob shape generation</li>
                <li>Edge count control for complexity adjustment</li>
                <li>Multiple customizable parameters</li>
                <li>Multi-layer support with blend modes</li>
                <li>Background image support (upload or URL)</li>
                <li>SVG and PNG export</li>
                <li>Copy SVG code functionality</li>
                <li>Responsive design</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}