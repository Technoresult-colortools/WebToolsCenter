'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Plus, Minus, Info, BookOpen, Lightbulb } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Sidebar from '@/components/sidebarTools';

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse'
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
type AlignSelf = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'

interface FlexItem {
  flexGrow: number
  flexShrink: number
  flexBasis: string
  alignSelf: AlignSelf
  color: string
}

interface TooltipWrapperProps {
  content: string;
  children: ReactNode;
}

const FlexboxGenerator = () => {
  const [flexDirection, setFlexDirection] = useState<FlexDirection>('column-reverse')
  const [justifyContent, setJustifyContent] = useState<JustifyContent>('flex-start')
  const [alignItems, setAlignItems] = useState<AlignItems>('stretch')
  const [flexWrap, setFlexWrap] = useState<FlexWrap>('nowrap')
  const [containerColor, setContainerColor] = useState('#f0f0f0')
  const [items, setItems] = useState<FlexItem[]>([
    { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', color: '#3498db' },
    { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', color: '#e74c3c' },
    { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', color: '#2ecc71' },
  ])

  const [generatedCSS, setGeneratedCSS] = useState('')

  useEffect(() => {
    generateCSS()
  }, [flexDirection, justifyContent, alignItems, flexWrap, containerColor, items])

  const generateCSS = () => {
    let css = `.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  background-color: ${containerColor};
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
  background-color: ${item.color};
}

`
    })

    setGeneratedCSS(css.trim())
  }

  const tooltips: Record<string, string> = {
    flexDirection: "Defines the direction of the main axis along which flex items are placed.",
    justifyContent: "Aligns flex items along the main axis of the flex container.",
    alignItems: "Aligns flex items along the cross axis of the flex container.",
    flexWrap: "Controls whether flex items are forced onto a single line or can wrap onto multiple lines.",
    flexGrow: "Specifies how much a flex item can grow relative to other items.",
    flexShrink: "Specifies how much a flex item can shrink relative to other items.",
    flexBasis: "Specifies the initial main size of a flex item.",
    alignSelf: "Allows the default alignment to be overridden for individual flex items."
  }

  const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ content, children }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const addItem = () => {
    setItems([...items, { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', color: '#9b59b6' }])
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
    setContainerColor('#f0f0f0')
    setItems([
      { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', color: '#3498db' },
      { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', color: '#e74c3c' },
      { flexGrow: 0, flexShrink: 1, flexBasis: 'auto', alignSelf: 'auto', color: '#2ecc71' },
    ])
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                CSS Flexbox Generator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Create and visualize flexible layouts using CSS Flexbox Generator.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Flexbox Preview</h2>
                <div 
                  className="bg-gray-700 rounded-lg overflow-hidden p-4"
                  style={{ minHeight: '400px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection,
                      justifyContent,
                      alignItems,
                      flexWrap,
                      backgroundColor: containerColor,
                      minHeight: '100%',
                      padding: '20px',
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
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Container Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <TooltipWrapper content={tooltips.flexDirection}>
                    <Label htmlFor="flexDirection" className="text-white mb-2 block">Flex Direction</Label>
                  </TooltipWrapper>  
                    <Select value={flexDirection} onValueChange={(value: FlexDirection) => setFlexDirection(value)}>
                      <SelectTrigger id="flexDirection" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select flex direction" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="row">Row</SelectItem>
                        <SelectItem value="row-reverse">Row Reverse</SelectItem>
                        <SelectItem value="column">Column</SelectItem>
                        <SelectItem value="column-reverse">Column Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                  <TooltipWrapper content={tooltips.flexDirection}>
                    <Label htmlFor="justifyContent" className="text-white mb-2 block">Justify Content</Label>
                  </TooltipWrapper> 
                    <Select value={justifyContent} onValueChange={(value: JustifyContent) => setJustifyContent(value)}>
                      <SelectTrigger id="justifyContent" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select justify content" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="flex-start">Flex Start</SelectItem>
                        <SelectItem value="flex-end">Flex End</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="space-between">Space Between</SelectItem>
                        <SelectItem value="space-around">Space Around</SelectItem>
                        <SelectItem value="space-evenly">Space Evenly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                  <TooltipWrapper content={tooltips.flexDirection}>
                    <Label htmlFor="alignItems" className="text-white mb-2 block">Align Items</Label>
                  </TooltipWrapper> 
                    <Select value={alignItems} onValueChange={(value: AlignItems) => setAlignItems(value)}>
                      <SelectTrigger id="alignItems" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select align items" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="flex-start">Flex Start</SelectItem>
                        <SelectItem value="flex-end">Flex End</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="stretch">Stretch</SelectItem>
                        <SelectItem value="baseline">Baseline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                  <TooltipWrapper content={tooltips.flexDirection}>
                    <Label htmlFor="flexWrap" className="text-white mb-2 block">Flex Wrap</Label>
                  </TooltipWrapper> 
                    <Select value={flexWrap} onValueChange={(value: FlexWrap) => setFlexWrap(value)}>
                      <SelectTrigger id="flexWrap" className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select flex wrap" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 text-white border-gray-600">
                        <SelectItem value="nowrap">No Wrap</SelectItem>
                        <SelectItem value="wrap">Wrap</SelectItem>
                        <SelectItem value="wrap-reverse">Wrap Reverse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

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
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Item Settings</h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
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
                          <Select value={item.alignSelf} onValueChange={(value: AlignSelf) => updateItem(index, 'alignSelf', value)}>
                            <SelectTrigger id={`alignSelf-${index}`} className="bg-gray-600 text-white border-gray-500">
                              <SelectValue placeholder="Select align self" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-600 text-white border-gray-500">
                              <SelectItem value="auto">Auto</SelectItem>
                              <SelectItem value="flex-start">Flex Start</SelectItem>
                              <SelectItem value="flex-end">Flex End</SelectItem>
                              <SelectItem value="center">Center</SelectItem>
                              <SelectItem value="baseline">Baseline</SelectItem>
                              <SelectItem value="stretch">Stretch</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="mt-2">
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

            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">Generated CSS</h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <code className="text-white whitespace-pre-wrap break-all">
                  {generatedCSS}
                </code>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button onClick={handleReset} variant="outline" className="text-white border-white hover:bg-gray-700">
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Copy className="h-5 w-5 mr-2" />
                  Copy CSS
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the CSS Flexbox Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The CSS Flexbox Generator is a powerful tool designed to help you create and visualize flexible layouts using CSS Flexbox. It provides an interactive interface to adjust various Flexbox properties for both the container and individual items, allowing you to see the results in real-time. This tool is perfect for web developers and designers who want to quickly prototype and experiment with Flexbox layouts without writing code from scratch.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the CSS Flexbox Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Adjust the container settings to modify the overall Flexbox layout.</li>
              <li>Add or remove flex items using the provided buttons.</li>
              <li>Customize individual item properties such as flex-grow, flex-shrink, and flex-basis.</li>
              <li>Change colors for both the container and individual items.</li>
              <li>Observe the real-time preview of your Flexbox layout.</li>
              <li>Copy the generated CSS code for use in your projects.</li>
              <li>Use the Reset button to return to default settings if needed.</li>
              <li>Experiment with different combinations to achieve your desired layout.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Interactive and real-time preview of Flexbox layouts</li>
              <li>Customizable container properties (flex-direction, justify-content, align-items, flex-wrap)</li>
              <li>Adjustable item properties (flex-grow, flex-shrink, flex-basis, align-self)</li>
              <li>Dynamic addition and removal of flex items</li>
              <li>Color customization for container and individual items</li>
              <li>Generated CSS output with one-click copy functionality</li>
              <li>Reset option for quick return to default settings</li>
              <li>Responsive design for use on various devices</li>
              <li>Intuitive user interface with clear labeling and tooltips</li>
              <li>Support for both basic and advanced Flexbox concepts</li>
            </ul>
          </div>
        </main>
       </div> 
    <Footer />
    </div>
  )
}
export default FlexboxGenerator