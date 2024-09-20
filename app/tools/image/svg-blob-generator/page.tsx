'use client'

import React, { useState, useEffect, useRef } from 'react'
import {  Download, Copy, Play, Pause, RefreshCw, Upload,} from 'lucide-react'
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
  blendMode: string
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

const blendModes = [
  'normal', 'multiply', 'screen', 'overlay', 'darken', 'lighten',
  'color-dodge', 'color-burn', 'hard-light', 'soft-light', 'difference',
  'exclusion', 'hue', 'saturation', 'color', 'luminosity'
]

export default function SVGBlobGenerator() {
  const [layers, setLayers] = useState<Layer[]>([{ id: '1', params: defaultParams, path: '', blendMode: 'normal' }])
  const [selectedLayer, setSelectedLayer] = useState<string>('1')
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [canvasSize, ] = useState({ width: 400, height: 400 })
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (isAnimating) {
      const animate = () => {
        generateBlobs(); 
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate); 
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current); 
      }
    };
  }, [isAnimating]);

  const animate = () => {
    generateBlobs();
    animationRef.current = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 1000 / (animationSpeed / 10)) as unknown as number;
  };

  const generateBlobs = () => {
    setLayers(prevLayers => 
      prevLayers.map(layer => ({
        ...layer,
        path: generateBlobPath(layer.params),
        params: { ...layer.params, seed: layer.params.seed + 0.01 }
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

  const handleBlendModeChange = (blendMode: string) => {
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
        ctx!.drawImage(img, 0, 0)
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
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2">
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
                        <g key={layer.id} style={{ mixBlendMode: layer.blendMode as any }}>
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
              <div className="flex justify-between">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
                >
                  {isAnimating ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                  {isAnimating ? 'Pause' : 'Animate'}
                </button>
                <button
                  onClick={generateBlobs}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
                >
                  <RefreshCw className="mr-2" />
                  Regenerate
                </button>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Animation Speed
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Background Image</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <label className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded cursor-pointer hover:bg-purple-600 transition duration-300">
                    <Upload className="mr-2" />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBackgroundImageUpload}
                      className="hidden"
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Or enter image URL"
                    onChange={handleBackgroundImageURL}
                    className="flex-grow px-3 py-2 bg-gray-700 text-white rounded"
                  />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold text-white mb-4">Layers</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {layers.map(layer => (
                    <button
                      key={layer.id}
                      onClick={() => setSelectedLayer(layer.id)}
                      className={`px-3 py-1 rounded ${
                        selectedLayer === layer.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                      }`}
                    >
                      Layer {layer.id}
                    </button>
                  ))}
                  <button
                    onClick={addLayer}
                    className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                  >
                    + Add Layer
                  </button>
                </div>
                {layers.find(layer => layer.id === selectedLayer) && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Layer Settings</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Edge Count
                        </label>
                        <input
                          type="range"
                          min="3"
                          max="20"
                          value={layers.find(layer => layer.id === selectedLayer)!.params.edgeCount}
                          onChange={(e) => handleParamChange('edgeCount', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Contrast
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={layers.find(layer => layer.id === selectedLayer)!.params.contrast}
                          onChange={(e) => handleParamChange('contrast', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Smoothness
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={layers.find(layer => layer.id === selectedLayer)!.params.smoothness}
                          onChange={(e) => handleParamChange('smoothness', parseFloat(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Fill Color
                        </label>
                        <input
                          type="color"
                          value={layers.find(layer => layer.id === selectedLayer)!.params.fill}
                          onChange={(e) => handleParamChange('fill', e.target.value)}
                          className="w-full h-8 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Stroke Color
                        </label>
                        <input
                          type="color"
                          value={layers.find(layer => layer.id === selectedLayer)!.params.stroke}
                          onChange={(e) => handleParamChange('stroke', e.target.value)}
                          className="w-full h-8 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Stroke Width
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={layers.find(layer => layer.id === selectedLayer)!.params.strokeWidth}
                          onChange={(e) => handleParamChange('strokeWidth', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Blend Mode
                        </label>
                        <select
                          value={layers.find(layer => layer.id === selectedLayer)!.blendMode}
                          onChange={(e) => handleBlendModeChange(e.target.value)}
                          className="w-full bg-gray-600 text-white rounded px-2 py-1"
                        >
                          {blendModes.map(mode => (
                            <option key={mode} value={mode}>
                              {mode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      onClick={() => removeLayer(selectedLayer)}
                      className="mt-4 px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                    >
                      Remove Layer
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={exportSVG}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition duration-300 flex items-center"
            >
              <Download className="mr-2" />
              Export SVG
            </button>
            <button
              onClick={exportPNG}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300 flex items-center"
            >
              <Download className="mr-2" />
              Export PNG
            </button>
            <button
              onClick={copySVGCode}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300 flex items-center"
            >
              <Copy className="mr-2" />
              Copy SVG Code
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <div className="mt-8">
            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">About SVG Blob Generator</h2>
              <p className="text-white">
                This SVG Blob Generator allows you to create unique, customizable blob shapes for your design projects. 
                You can adjust various parameters, add multiple layers with different blend modes, animate your blobs, and even add background images. 
                Export your creations as SVG or PNG files, or copy the SVG code directly.
              </p>          
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">How to Use It?</h2>
              <p className="text-white">
                1. Adjust the parameters (edge count, contrast, smoothness) to change the blob shape.<br />
                2. Customize the fill color, stroke color, and stroke width.<br />
                3. Add multiple layers and experiment with different blend modes.<br />
                4. Use the animation feature to see how your blob changes over time.<br />
                5. Adjust the animation speed to control how quickly the blob morphs.<br />
                6. Add a background image by uploading a file or entering a URL.<br />
                7. Export your blob as an SVG or PNG file, or copy the SVG code.<br />
                8. Regenerate the blob or individual layers to create new variations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="list-disc list-inside text-white">
                <li>Interactive blob shape generation</li>
                <li>Edge count control for complexity adjustment</li>
                <li>Multiple customizable parameters</li>
                <li>Multi-layer support with blend modes</li>
                <li>Animation option with speed control</li>
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

