'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Download, Plus, Trash2, Info, BookOpen, Lightbulb } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'

type Shadow = {
  inset: boolean
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
}

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { inset: false, offsetX: 5, offsetY: 5, blur: 10, spread: 0, color: '#00000040' }
  ])
  const [boxColor, setBoxColor] = useState('#ffffff')
  const [boxWidth, setBoxWidth] = useState(200)
  const [boxHeight, setBoxHeight] = useState(200)
  const [borderRadius, setBorderRadius] = useState(0)
  const [css, setCSS] = useState('')

  useEffect(() => {
    generateCSS()
  }, [shadows, boxColor, boxWidth, boxHeight, borderRadius])

  const generateCSS = () => {
    const shadowString = shadows.map(shadow => 
      `${shadow.inset ? 'inset ' : ''}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`
    ).join(', ')

    const generatedCSS = `
.box-shadow-example {
  width: ${boxWidth}px;
  height: ${boxHeight}px;
  background-color: ${boxColor};
  border-radius: ${borderRadius}px;
  box-shadow: ${shadowString};
}`
    setCSS(generatedCSS)
  }

  const handleAddShadow = () => {
    setShadows([...shadows, { inset: false, offsetX: 0, offsetY: 0, blur: 0, spread: 0, color: '#00000040' }])
  }

  const handleRemoveShadow = (index: number) => {
    setShadows(shadows.filter((_, i) => i !== index))
  }

  const handleShadowChange = (index: number, key: keyof Shadow, value: number | boolean | string) => {
    const newShadows = [...shadows]
    newShadows[index] = { ...newShadows[index], [key]: value }
    setShadows(newShadows)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(css)
    toast.success('CSS copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'box-shadow.css'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('CSS file downloaded!')
  }

  const handleReset = () => {
    setShadows([{ inset: false, offsetX: 5, offsetY: 5, blur: 10, spread: 0, color: '#00000040' }])
    setBoxColor('#ffffff')
    setBoxWidth(200)
    setBoxHeight(200)
    setBorderRadius(0)
  }

  return (
    <ToolLayout
      title="CSS Box Shadow Generator"
      description="Create and customize CSS box shadows with precision"
    >

    <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
                <div className="bg-slate-100 p-4 rounded-lg flex items-center justify-center" style={{ minHeight: '300px' }}>
                  <div
                    className="box-shadow-example"
                    style={{
                      width: `${boxWidth}px`,
                      height: `${boxHeight}px`,
                      backgroundColor: boxColor,
                      borderRadius: `${borderRadius}px`,
                      boxShadow: shadows.map(shadow => 
                        `${shadow.inset ? 'inset ' : ''}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`
                      ).join(', ')
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
                <Tabs defaultValue="shadows" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="shadows">Shadows</TabsTrigger>
                    <TabsTrigger value="box">Box</TabsTrigger>
                  </TabsList>
                  <TabsContent value="shadows" className="space-y-4">
                    {shadows.map((shadow, index) => (
                      <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-white font-semibold">Shadow {index + 1}</h3>
                          <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveShadow(index)}
                              className="text-red-500 hover:text-red-700"
                              >
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`inset-${index}`}
                            checked={shadow.inset}
                            onCheckedChange={(checked) => handleShadowChange(index, 'inset', checked)}
                          />
                          <Label htmlFor={`inset-${index}`} className="text-white">Inset</Label>
                        </div>
                        <div>
                          <Label htmlFor={`offsetX-${index}`} className="text-white">Offset X: {shadow.offsetX}px</Label>
                          <Slider
                            id={`offsetX-${index}`}
                            min={-50}
                            max={50}
                            step={1}
                            value={shadow.offsetX}
                            onChange={(value) => handleShadowChange(index, 'offsetX', value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`offsetY-${index}`} className="text-white">Offset Y: {shadow.offsetY}px</Label>
                          <Slider
                            id={`offsetY-${index}`}
                            min={-50}
                            max={50}
                            step={1}
                            value={shadow.offsetY}
                            onChange={(value) => handleShadowChange(index, 'offsetY', value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`blur-${index}`} className="text-white">Blur: {shadow.blur}px</Label>
                          <Slider
                            id={`blur-${index}`}
                            min={0}
                            max={100}
                            step={1}
                            value={shadow.blur}
                            onChange={(value) => handleShadowChange(index, 'blur', value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`spread-${index}`} className="text-white">Spread: {shadow.spread}px</Label>
                          <Slider
                            id={`spread-${index}`}
                            min={-50}
                            max={50}
                            step={1}
                            value={shadow.spread}
                            onChange={(value) => handleShadowChange(index, 'spread', value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`color-${index}`} className="text-white">Color</Label>
                          <div className="flex space-x-2">
                            <Input
                              id={`color-${index}`}
                              type="color"
                              value={shadow.color}
                              onChange={(e) => handleShadowChange(index, 'color', e.target.value)}
                              className="w-12 h-12 p-1 bg-gray-600 border-gray-500"
                            />
                            <Input
                              type="text"
                              value={shadow.color}
                              onChange={(e) => handleShadowChange(index, 'color', e.target.value)}
                              className="flex-grow bg-gray-600 text-white border-gray-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={handleAddShadow} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="h-5 w-5 mr-2" />
                      Add Shadow
                    </Button>
                  </TabsContent>
                  <TabsContent value="box" className="space-y-4">
                    <div>
                      <Label htmlFor="boxColor" className="text-white">Box Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="boxColor"
                          type="color"
                          value={boxColor}
                          onChange={(e) => setBoxColor(e.target.value)}
                          className="w-12 h-12 p-1 bg-gray-600 border-gray-500"
                        />
                        <Input
                          type="text"
                          value={boxColor}
                          onChange={(e) => setBoxColor(e.target.value)}
                          className="flex-grow bg-gray-600 text-white border-gray-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="boxWidth" className="text-white">Width: {boxWidth}px</Label>
                      <Slider
                        id="boxWidth"
                        min={50}
                        max={300}
                        step={1}
                        value={boxWidth}
                        onChange={(value) => setBoxWidth(value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="boxHeight" className="text-white">Height: {boxHeight}px</Label>
                      <Slider
                        id="boxHeight"
                        min={50}
                        max={300}
                        step={1}
                        value={boxHeight}
                        onChange={(value) => setBoxHeight(value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="borderRadius" className="text-white">Border Radius: {borderRadius}px</Label>
                      <Slider
                        id="borderRadius"
                        min={0}
                        max={150}
                        step={1}
                        value={borderRadius}
                        onChange={(value) => setBorderRadius(value)}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <pre className="text-white whitespace-pre-wrap break-all text-sm">
                  {css}
                </pre>
              </div>
              <div className="mt-4 flex flex-wrap justify-end space-x-2 space-y-2 sm:space-y-0">
                <Button onClick={handleReset} variant="destructive" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy CSS
                </Button>
                <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Download className="h-5 w-5 mr-2" />
                  Download CSS
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the Box Shadow Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The Box Shadow Generator is an easy-to-use tool that allows you to create and customize CSS box shadows with precision. Whether you're looking to add simple or complex shadows to your web elements, this tool provides real-time previews and multiple customization options for a professional touch.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Box Shadow Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use the "Shadows" tab to add, remove, and customize multiple box shadows.</li>
              <li>Adjust offset, blur, spread, and color for each shadow layer.</li>
              <li>Toggle the "Inset" switch to create inner shadows.</li>
              <li>Use the "Box" tab to customize the preview box's color, size, and border radius.</li>
              <li>Preview your box shadow in real-time.</li>
              <li>Copy the generated CSS or download it as a file.</li>
              <li>Use the Reset button to start over with default settings.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Multiple shadow layers with individual controls</li>
              <li>Inset shadow option for inner shadows</li>
              <li>Customizable offset, blur, spread, and color for each shadow</li>
              <li>Adjustable preview box color, size, and border radius</li>
              <li>Real-time preview of the box shadow effect</li>
              <li>Generated CSS code with syntax highlighting</li>
              <li>Copy to clipboard functionality</li>
              <li>Download CSS as a file</li>
              <li>Reset option to quickly return to default settings</li>
              <li>Responsive design for use on various devices</li>
            </ul>
          </div>

  </ToolLayout>
  )
}