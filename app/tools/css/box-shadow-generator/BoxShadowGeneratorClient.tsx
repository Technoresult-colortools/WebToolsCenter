'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import Slider from "@/components/ui/Slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Download, Plus, Trash2, Info, BookOpen, Lightbulb, ArrowUpDown } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle,  } from "@/components/ui/Card"
import NextImage from 'next/image'

type Shadow = {
  inset: boolean
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
}

type BoxShadowUnit = 'px' | 'em' | 'rem'

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { inset: false, offsetX: 5, offsetY: 5, blur: 10, spread: 0, color: '#00000040' }
  ])
  const [boxColor, setBoxColor] = useState('#ffffff')
  const [boxWidth, setBoxWidth] = useState(200)
  const [boxHeight, setBoxHeight] = useState(200)
  const [borderRadius, setBorderRadius] = useState(0)
  const [css, setCSS] = useState('')
  const [unit, setUnit] = useState<BoxShadowUnit>('px')
  const [showPreview,] = useState(true)
  const [presetName, setPresetName] = useState('')
  const [presets, setPresets] = useState<{ name: string; shadows: Shadow[] }[]>([])

  useEffect(() => {
    generateCSS()
  }, [shadows, boxColor, boxWidth, boxHeight, borderRadius, unit])

  const generateCSS = () => {
    const shadowString = shadows.map(shadow => 
      `${shadow.inset ? 'inset ' : ''}${shadow.offsetX}${unit} ${shadow.offsetY}${unit} ${shadow.blur}${unit} ${shadow.spread}${unit} ${shadow.color}`
    ).join(', ')

    const generatedCSS = `
.box-shadow-example {
  width: ${boxWidth}${unit};
  height: ${boxHeight}${unit};
  background-color: ${boxColor};
  border-radius: ${borderRadius}${unit};
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
    setUnit('px')
  }

  const handleSavePreset = () => {
    if (presetName) {
      setPresets([...presets, { name: presetName, shadows }])
      setPresetName('')
      toast.success('Preset saved!')
    } else {
      toast.error('Please enter a preset name')
    }
  }

  const handleLoadPreset = (preset: { name: string; shadows: Shadow[] }) => {
    setShadows(preset.shadows)
    toast.success(`Preset "${preset.name}" loaded!`)
  }

  const handleMoveShadow = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < shadows.length - 1)) {
      const newShadows = [...shadows]
      const temp = newShadows[index]
      newShadows[index] = newShadows[index + (direction === 'up' ? -1 : 1)]
      newShadows[index + (direction === 'up' ? -1 : 1)] = temp
      setShadows(newShadows)
    }
  }

  const renderPreview = () => (
    <div
      className="box-shadow-example"
      style={{
        width: `${boxWidth}${unit}`,
        height: `${boxHeight}${unit}`,
        backgroundColor: boxColor,
        borderRadius: `${borderRadius}${unit}`,
        boxShadow: shadows.map(shadow => 
          `${shadow.inset ? 'inset ' : ''}${shadow.offsetX}${unit} ${shadow.offsetY}${unit} ${shadow.blur}${unit} ${shadow.spread}${unit} ${shadow.color}`
        ).join(', ')
      }}
    ></div>
  )

  return (
    <ToolLayout
      title="CSS Box Shadow Generator"
      description="Create and customize complex CSS box shadows with precision and ease"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 shadow-lg p-6 md:p-8 max-w-4xl mx-auto mb-8">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Preview</h2>
              <div className="bg-gray-200 p-4 rounded-lg flex items-center justify-center relative" style={{ minHeight: '300px', margin: 'auto' }}>
                {showPreview && renderPreview()}
            
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              <Tabs defaultValue="shadows" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="shadows">Shadows</TabsTrigger>
                  <TabsTrigger value="box">Box</TabsTrigger>
                  <TabsTrigger value="presets">Presets</TabsTrigger>
                </TabsList>
                <TabsContent value="shadows" className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="unit" className="text-white mr-4">Unit:</Label>
                    <Select value={unit} onValueChange={(value: BoxShadowUnit) => setUnit(value)}>
                      <SelectTrigger id="unit" className="w-24 bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="px">px</SelectItem>
                        <SelectItem value="em">em</SelectItem>
                        <SelectItem value="rem">rem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {shadows.map((shadow, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold">Shadow {index + 1}</h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveShadow(index, 'up')}
                            disabled={index === 0}
                            className="text-gray-400 hover:text-white"
                          >
                            <ArrowUpDown className="h-4 w-4 rotate-180" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveShadow(index, 'down')}
                            disabled={index === shadows.length - 1}
                            className="text-gray-400 hover:text-white"
                          >
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveShadow(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
                        <Label htmlFor={`offsetX-${index}`} className="text-white">Offset X: {shadow.offsetX}{unit}</Label>
                        <Slider
                          id={`offsetX-${index}`}
                          min={-50}
                          max={50}
                          step={1}
                          value={shadow.offsetX}
                          onChange={(value) => handleShadowChange(index, 'offsetX', value)}
                          className='mt-2'
                        />
                      </div>
                      <div>
                        <Label htmlFor={`offsetY-${index}`} className="text-white">Offset Y: {shadow.offsetY}{unit}</Label>
                        <Slider
                          id={`offsetY-${index}`}
                          min={-50}
                          max={50}
                          step={1}
                          value={shadow.offsetY}
                          onChange={(value) => handleShadowChange(index, 'offsetY', value)}
                          className='mt-2'
                        />
                      </div>
                      <div>
                        <Label htmlFor={`blur-${index}`} className="text-white">Blur: {shadow.blur}{unit}</Label>
                        <Slider
                          id={`blur-${index}`}
                          min={0}
                          max={100}
                          step={1}
                          value={shadow.blur}
                          onChange={(value) => handleShadowChange(index, 'blur', value)}
                          className='mt-2'
                        />
                      </div>
                      <div>
                        <Label htmlFor={`spread-${index}`} className="text-white">Spread: {shadow.spread}{unit}</Label>
                        <Slider
                          id={`spread-${index}`}
                          min={-50}
                          max={50}
                          step={1}
                          value={shadow.spread}
                          onChange={(value) => handleShadowChange(index, 'spread', value)}
                          className='mt-2'
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
                            className="w-12 h-12 p-1 mt-2 bg-gray-600 border-gray-500"
                          />
                          <Input
                            type="text"
                            value={shadow.color}
                            onChange={(e) => handleShadowChange(index, 'color', e.target.value)}
                            className="flex-grow mt-2 bg-gray-600 text-white border-gray-500"
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
                        className="w-12 h-12 p-1 mt-2 bg-gray-600 border-gray-500"
                      />
                      <Input
                        type="text"
                        value={boxColor}
                        onChange={(e) => setBoxColor(e.target.value)}
                        className="flex-grow mt-2 bg-gray-600 text-white border-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="boxWidth" className="text-white">Width: {boxWidth}{unit}</Label>
                    <Slider
                      id="boxWidth"
                      min={50}
                      max={300}
                      step={1}
                      value={boxWidth}
                      onChange={(value) => setBoxWidth(value)}
                      className='mt-2'
                    />
                  </div>
                  <div>
                    <Label htmlFor="boxHeight" className="text-white">Height: {boxHeight}{unit}</Label>
                    <Slider
                      id="boxHeight"
                      min={50}
                      max={300}
                      step={1}
                      value={boxHeight}
                      onChange={(value) => setBoxHeight(value)}
                      className='mt-2'
                    />
                  </div>
                  <div>
                    <Label htmlFor="borderRadius" className="text-white">Border Radius: {borderRadius}{unit}</Label>
                    <Slider
                      id="borderRadius"
                      min={0}
                      max={150}
                      step={1}
                      value={borderRadius}
                      onChange={(value) => setBorderRadius(value)}
                      className='mt-2'
                    />
                  </div>
                </TabsContent>
                <TabsContent value="presets" className="space-y-4">
                  <div>
                    <Label htmlFor="presetName" className="text-white">Preset Name</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="presetName"
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        className="flex-grow bg-gray-600 mt-2 text-white border-gray-500"
                        placeholder="Enter preset name"
                      />
                      <Button onClick={handleSavePreset} className="bg-blue-600 mt-2 hover:bg-blue-700 text-white">
                        Save Preset
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Saved Presets</Label>
                    {presets.map((preset, index) => (
                      <Button
                        key={index}
                        onClick={() => handleLoadPreset(preset)}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white justify-start"
                      >
                        {preset.name}
                      </Button>
                    ))}
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
            <div className="mt-4 flex flex-wrap justify-between items-center">
              <div className="space-x-2">
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
        </CardContent>
      </Card>

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is CSS Box Shadow Generator?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The CSS Box Shadow Generator is a powerful and intuitive tool designed for web developers and designers to create complex and visually appealing CSS box shadows. It allows you to easily customize multiple shadow layers, adjust box properties, and generate precise CSS code for your projects.
          </p>
          <p className="text-gray-300 mb-4">
            Whether you're a professional web developer looking to add depth and dimension to your designs, a UI/UX designer seeking to create engaging interfaces, or a hobbyist experimenting with CSS effects, our Enhanced Box Shadow Generator offers a user-friendly interface and advanced features to bring your ideas to life.
          </p>

          <div className="my-8">
            <NextImage 
              src="/Images/BoxShadowPreview.png?height=400&width=600" 
              alt="Screenshot of the Enhanced Box Shadow Generator interface showing preview and customization options" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use CSS Box Shadow Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Use the "Shadows" tab to add, remove, and customize multiple box shadow layers.</li>
            <li>Adjust offset, blur, spread, and color for each shadow layer.</li>
            <li>Toggle the "Inset" switch to create inner shadows.</li>
            <li>Reorder shadow layers using the up and down arrows.</li>
            <li>Switch between different units (px, em, rem) for precise control.</li>
            <li>Use the "Box" tab to customize the preview box's color, size, and border radius.</li>
            <li>Create and load presets in the "Presets" tab for quick access to your favorite shadow combinations.</li>
            <li>Preview your box shadow in real-time, with options for fullscreen view.</li>
            <li>Copy the generated CSS or download it as a file for use in your projects.</li>
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
            <li>Support for multiple units: px, em, and rem</li>
            <li>Shadow layer reordering</li>
            <li>Adjustable preview box color, size, and border radius</li>
            <li>Preset saving and loading functionality</li>
            <li>Real-time preview with fullscreen mode</li>
            <li>Generated CSS code with syntax highlighting</li>
            <li>Copy to clipboard and download as file options</li>
            <li>Reset option to quickly return to default settings</li>
            <li>Responsive design for use on various devices</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Web Design:</strong> Create depth and dimension for elements like cards, buttons, and modals.</li>
            <li><strong>UI/UX Design:</strong> Enhance user interfaces with subtle shadows for improved visual hierarchy.</li>
            <li><strong>CSS Learning:</strong> Experiment with complex shadow effects to understand CSS properties visually.</li>
            <li><strong>Responsive Design:</strong> Test how different shadow styles look on various screen sizes.</li>
            <li><strong>Brand Identity:</strong> Develop consistent shadow styles across web properties for cohesive design.</li>
            <li><strong>Accessibility:</strong> Create shadows that enhance visibility without compromising readability.</li>
            <li><strong>Prototyping:</strong> Quickly generate and test different shadow styles for design mockups.</li>
            <li><strong>CSS Art:</strong> Use complex shadow combinations to create artistic effects and illustrations.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The CSS Box Shadow Generator empowers you to create sophisticated, layered shadow effects that can dramatically improve the visual appeal of your web projects. Whether you're aiming for subtle depth or bold, eye-catching designs, this tool provides the flexibility and precision you need. Start experimenting with box shadows today and elevate your web designs to new heights of professionalism and creativity!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}