'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select } from '@/components/ui/select1';
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Plus, Minus, Info, BookOpen, Lightbulb, } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import NextImage from 'next/image'

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
type AlignContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch'
type AlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'

interface FlexItem {
  flexGrow: number
  flexShrink: number
  flexBasis: string
  alignSelf: AlignSelf
  order: number
  color: string
}

const tooltips: Record<string, string> = {
  flexDirection: "Defines the direction of the main axis along which flex items are placed.",
  justifyContent: "Aligns flex items along the main axis of the flex container.",
  alignItems: "Aligns flex items along the cross axis of the flex container.",
  flexWrap: "Controls whether flex items are forced onto a single line or can wrap onto multiple lines.",
  alignContent: "Aligns a flex container's lines within when there is extra space in the cross-axis.",
  flexGrow: "Specifies how much a flex item can grow relative to other items.",
  flexShrink: "Specifies how much a flex item can shrink relative to other items.",
  flexBasis: "Specifies the initial main size of a flex item.",
  alignSelf: "Allows the default alignment to be overridden for individual flex items.",
  order: "Controls the order in which flex items appear in the flex container."
}

export default function FlexboxGenerator() {
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('row')
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start')
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch')
  const [flexWrap, setFlexWrap] = useState<FlexWrap>('nowrap')
  const [alignContent, setAlignContent] = useState<AlignContent>('stretch')
  const [containerColor, setContainerColor] = useState('#f0f0f0')
  const [containerWidth, setContainerWidth] = useState(100)
  const [containerHeight, setContainerHeight] = useState(300)
  const [items, setItems] = useState<FlexItem[]>([
    { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0, color: '#3498db' },
    { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0, color: '#e74c3c' },
    { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0, color: '#2ecc71' },
  ])
  const [generatedCSS, setGeneratedCSS] = useState('')

  useEffect(() => {
    generateCSS()
  }, [flexDirection, justifyContent, alignItems, flexWrap, alignContent, containerColor, containerWidth, containerHeight, items])

  const generateCSS = () => {
    let css = `.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  align-content: ${alignContent};
  background-color: ${containerColor};
  width: ${containerWidth}%;
  height: ${containerHeight}px;
  padding: 20px;
}

.flex-item {
  padding: 20px;
  margin: 10px;
  color: white;
  font-weight: bold;
  font-size: 2em;
  text-align: center;
  border-radius: 5px;
}

`

    items.forEach((item, index) => {
      css += `.flex-item:nth-child(${index + 1}) {
  flex-grow: ${item.flexGrow};
  flex-shrink: ${item.flexShrink};
  flex-basis: ${item.flexBasis};
  align-self: ${item.alignSelf};
  order: ${item.order};
  background-color: ${item.color};
}

`
    })

    setGeneratedCSS(css.trim())
  }

  const addItem = () => {
    setItems([...items, { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0, color: '#9b59b6' }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, key: keyof FlexItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [key]: value }
    setItems(newItems)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCSS)
    toast.success('CSS copied to clipboard!')
  }

  const handleReset = () => {
    setFlexDirection('row')
    setJustifyContent('flex-start')
    setAlignItems('stretch')
    setFlexWrap('nowrap')
    setAlignContent('stretch')
    setContainerColor('#f0f0f0')
    setContainerWidth(100)
    setContainerHeight(300)
    setItems([
      { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0, color: '#3498db' },
      { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0, color: '#e74c3c' },
      { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', order: 0, color: '#2ecc71' },
    ])
    toast.success('Settings reset to default!')
  }

  return (
    <ToolLayout
      title="CSS Flexbox Generator"
      description="Create, visualize, and customize flexible layouts using CSS Flexbox with precision and ease"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 shadow-lg p-6 max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">Flexbox Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Generated CSS</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              <div className="bg-gray-700 rounded-lg overflow-hidden p-4" style={{ height: '400px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection,
                    justifyContent,
                    alignItems,
                    flexWrap,
                    alignContent,
                    backgroundColor: containerColor,
                    width: `${containerWidth}%`,
                    height: `${containerHeight}px`,
                    padding: '20px',
                    overflow: 'auto',
                  }}
                >
                  {items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        flexGrow: item.flexGrow,
                        flexShrink: item.flexShrink,
                        flexBasis: item.flexBasis,
                        alignSelf: item.alignSelf,
                        order: item.order,
                        backgroundColor: item.color,
                        padding: '20px',
                        margin: '10px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '2em',
                        textAlign: 'center',
                        borderRadius: '5px',
                        minWidth: '60px',
                        minHeight: '60px',
                      }}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="code">
              <div className="bg-gray-700 p-4 rounded-lg max-h-[400px] overflow-auto">
                <code className="text-white whitespace-pre-wrap break-all">
                  {generatedCSS}
                </code>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Container Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Flex Direction', value: flexDirection, setter: setFlexDirection, options: ['row', 'row-reverse', 'column', 'column-reverse'] },
                { label: 'Justify Content', value: justifyContent, setter: setJustifyContent, options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] },
                { label: 'Align Items', value: alignItems, setter: setAlignItems, options: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'] },
                { label: 'Flex Wrap', value: flexWrap, setter: setFlexWrap, options: ['nowrap', 'wrap', 'wrap-reverse'] },
                { label: 'Align Content', value: alignContent, setter: setAlignContent, options: ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'stretch'] },
              ].map((setting) => (
                <div key={setting.label}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label htmlFor={setting.label} className="text-white mb-2 block">{setting.label}</Label>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltips[setting.label.toLowerCase().replace(' ', '')]}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Select
                    options={setting.options.map(option => ({ value: option, label: option }))}
                    selectedKey={setting.value}
                    onSelectionChange={(key) => setting.setter(key as any)}
                    label={`Select ${setting.label.toLowerCase()}`}
                    placeholder={`Select ${setting.label.toLowerCase()}`}
                  />



                  </div>
                ))}
                <div>
                  <Label htmlFor="containerColor" className="text-white mb-2 block">Container Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      id="containerColor"
                      value={containerColor}
                      onChange={(e) => setContainerColor(e.target.value)}
                      className="w-10 h-10 p-1 bg-transparent"
                    />
                    <Input
                      type="text"
                      value={containerColor}
                      onChange={(e) => setContainerColor(e.target.value)}
                      className="flex-grow bg-gray-700 text-white border-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="containerWidth" className="text-white mb-2 block">Container Width: {containerWidth}%</Label>
                  <Slider
                    id="containerWidth"
                    min={10}
                    max={100}
                    step={1}
                    value={containerWidth}
                    onChange={(value) => setContainerWidth(value)}
                  />
                </div>
                <div>
                  <Label htmlFor="containerHeight" className="text-white mb-2 block">Container Height: {containerHeight}px</Label>
                  <Slider
                    id="containerHeight"
                    min={100}
                    max={1000}
                    step={10}
                    value={containerHeight}
                    onChange={(value) => setContainerHeight(value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Item Settings</h2>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-2">Item {index + 1}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`flexGrow-${index}`} className="text-white mb-2 block">Flex Grow</Label>
                        <Input
                          type="number"
                          id={`flexGrow-${index}`}
                          value={item.flexGrow}
                          onChange={(e) => updateItem(index, 'flexGrow', parseInt(e.target.value))}
                          className="w-full bg-gray-600 text-white border-gray-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`flexShrink-${index}`} className="text-white mb-2 block">Flex Shrink</Label>
                        <Input
                          type="number"
                          id={`flexShrink-${index}`}
                          value={item.flexShrink}
                          onChange={(e) => updateItem(index, 'flexShrink', parseInt(e.target.value))}
                          className="w-full bg-gray-600 text-white border-gray-500"
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`flexBasis-${index}`} className="text-white mb-2 block">Flex Basis</Label>
                        <Input
                          type="text"
                          id={`flexBasis-${index}`}
                          value={item.flexBasis}
                          onChange={(e) => updateItem(index, 'flexBasis', e.target.value)}
                          className="w-full bg-gray-600 text-white border-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`alignSelf-${index}`} className="text-white mb-2 block">Align Self</Label>
                        <Select
                          id={`alignSelf-${index}`}
                          options={[
                            { value: 'auto', label: 'Auto' },
                            { value: 'flex-start', label: 'Flex Start' },
                            { value: 'flex-end', label: 'Flex End' },
                            { value: 'center', label: 'Center' },
                            { value: 'baseline', label: 'Baseline' },
                            { value: 'stretch', label: 'Stretch' },
                          ]}
                          selectedKey={item.alignSelf}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onSelectionChange={(key) => updateItem(index, 'alignSelf', key as AlignSelf)}
                          label="Select align self"
                          placeholder="Select align self"
                          className="w-full"
                        />

                      </div>
                      <div>
                        <Label htmlFor={`order-${index}`} className="text-white mb-2 block">Order</Label>
                        <Input
                          type="number"
                          id={`order-${index}`}
                          value={item.order}
                          onChange={(e) => updateItem(index, 'order', parseInt(e.target.value))}
                          className="w-full bg-gray-600 text-white border-gray-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`itemColor-${index}`} className="text-white mb-2 block">Item Color</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="color"
                            id={`itemColor-${index}`}
                            value={item.color}
                            onChange={(e) => updateItem(index, 'color', e.target.value)}
                            className="w-10 h-10 p-1 bg-transparent"
                          />
                          <Input
                            type="text"
                            value={item.color}
                            onChange={(e) => updateItem(index, 'color', e.target.value)}
                            className="flex-grow bg-gray-600 text-white border-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => removeItem(index)} className="mt-2 bg-red-500 hover:bg-red-600 text-white">
                      <Minus className="w-4 h-4 mr-2" />
                      Remove Item
                    </Button>
                  </div>
                ))}
                <Button onClick={addItem} className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button onClick={handleReset} variant="destructive" className="text-white border-white hover:bg-gray-700">
              <RefreshCw className="h-5 w-5 mr-2" />
              Reset
            </Button>
            <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Copy className="h-5 w-5 mr-2" />
              Copy CSS
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is CSS Flexbox Generator?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The CSS Flexbox Generator is a powerful and intuitive tool designed for web developers and designers to create, visualize, and customize flexible layouts using CSS Flexbox. It provides an interactive interface to adjust various Flexbox properties for both the container and individual items, allowing you to see the results in real-time and generate the corresponding CSS code.
          </p>
          <p className="text-gray-300 mb-4">
            Whether you're a seasoned developer looking to streamline your workflow or a beginner learning the intricacies of Flexbox, this tool offers a user-friendly approach to mastering flexible layouts. It bridges the gap between concept and implementation, making it easier to experiment with different Flexbox configurations and understand their effects visually.
          </p>

          <div className="my-8">
            <NextImage 
              src="/Images/FlexBoxGeneratorPreview.png?height=400&width=600" 
              alt="Screenshot of the Enhanced CSS Flexbox Generator interface showing the layout preview and customization options" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use the CSS Flexbox Generator?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Start by adjusting the container settings to modify the overall Flexbox layout.</li>
            <li>Customize the container's dimensions and background color to suit your needs.</li>
            <li>Add or remove flex items using the provided buttons.</li>
            <li>Fine-tune individual item properties such as flex-grow, flex-shrink, flex-basis, align-self, and order.</li>
            <li>Experiment with item colors to visualize the layout more effectively.</li>
            <li>Use the real-time preview to see how your changes affect the layout.</li>
            <li>Switch between the preview and generated CSS tabs to see the code updates.</li>
            <li>Copy the generated CSS code for use in your projects.</li>
            <li>Use the Reset button to return to default settings if needed.</li>
            <li>Hover over property labels to view tooltips explaining each Flexbox concept.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Interactive and real-time preview of Flexbox layouts</li>
            <li>Comprehensive container property controls (flex-direction, justify-content, align-items, flex-wrap, align-content)</li>
            <li>Adjustable container dimensions for more realistic layout testing</li>
            <li>Detailed item property controls (flex-grow, flex-shrink, flex-basis, align-self, order)</li>
            <li>Dynamic addition and removal of flex items</li>
            <li>Color customization for both container and individual items</li>
            <li>Generated CSS output with syntax highlighting</li>
            <li>One-click copy functionality for easy code transfer</li>
            <li>Reset option for quick return to default settings</li>
            <li>Responsive design for use on various devices</li>
            <li>Intuitive user interface with clear labeling and informative tooltips</li>
            <li>Support for both basic and advanced Flexbox concepts</li>
            <li>Tabbed interface for easy switching between preview and code views</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Rapid Prototyping:</strong> Quickly create and test different layout ideas without writing code from scratch.</li>
            <li><strong>Educational Tool:</strong> Learn and teach Flexbox concepts through hands-on experimentation and visual feedback.</li>
            <li><strong>Responsive Design:</strong> Test how Flexbox layouts behave at different container sizes to ensure responsiveness.</li>
            <li><strong>Cross-browser Testing:</strong> Generate consistent Flexbox code that works across different browsers.</li>
            <li><strong>Design Collaboration:</strong> Easily share and iterate on layout ideas with designers and other developers.</li>
            <li><strong>CSS Debugging:</strong> Troubleshoot Flexbox layout issues by isolating and testing specific properties.</li>
            <li><strong>Component Library Development:</strong> Create flexible and reusable layout components for design systems.</li>
            <li><strong>Performance Optimization:</strong> Experiment with different Flexbox configurations to find the most efficient layout solutions.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The CSS Flexbox Generator empowers you to harness the full potential of Flexbox, enabling the creation of sophisticated, responsive layouts with ease. By providing a visual, interactive approach to Flexbox, it simplifies the learning curve and accelerates the development process. Whether you're building complex web applications, responsive websites, or simply exploring the possibilities of modern CSS layouts, this tool offers the flexibility and precision you need to bring your design visions to life.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}