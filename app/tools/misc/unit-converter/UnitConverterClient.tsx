'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeftRight, Copy, Check, RefreshCw, Info, BookOpen, Lightbulb, Share2 } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'
import { Button } from "@/components/ui/Button"
import  Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select } from '@/components/ui/select1';
import ToolLayout from '@/components/ToolLayout'
import { categories } from './unitCategories'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Image from 'next/image'

const UnitConverter = () => {
  const [category, setCategory] = useState(categories[0])
  const [fromUnit, setFromUnit] = useState(category.units[0])
  const [toUnit, setToUnit] = useState(category.units[1])
  const [fromValue, setFromValue] = useState('1')
  const [toValue, setToValue] = useState('')
  const [conversionHistory, setConversionHistory] = useState<string[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    convertValue(fromValue)
  }, [category, fromUnit, toUnit])

  const convertValue = (value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      const result = category.convert(numValue, fromUnit, toUnit)
      setToValue(result.toFixed(6))
      addToHistory(`${numValue} ${fromUnit} = ${result.toFixed(6)} ${toUnit}`)
    } else {
      setToValue('')
    }
  }

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value)
    convertValue(e.target.value)
  }

  const swapUnits = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setFromValue(toValue)
    convertValue(toValue)
  }

  const addToHistory = (conversion: string) => {
    setConversionHistory((prev) => [conversion, ...prev.slice(0, 19)])
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${fromValue} ${fromUnit} = ${toValue} ${toUnit}`)
    setCopied(true)
    toast.success('Conversion copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const clearHistory = () => {
    setConversionHistory([])
    toast.success('Conversion history cleared!')
  }

  return (
    <ToolLayout
      title="Advanced Unit Converter"
      description="Quickly and accurately convert between various units of measurement"
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <div className="mb-6">
          <Label htmlFor="category">
            <h2 className="text-xl font-semibold text-white mb-2">Category</h2>
          </Label>
          <Select
            label="Select category"
            options={categories.map((cat) => ({ value: cat.name, label: cat.name }))}
            selectedKey={category.name}
            onSelectionChange={(key) => {
              const newCategory = categories.find((c) => c.name === key)
              if (newCategory) {
                setCategory(newCategory)
                setFromUnit(newCategory.units[0])
                setToUnit(newCategory.units[1])
              }
            }}
            placeholder="Select category"
           
          />

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="fromUnit" className="text-gray-300 mb-2">
              From
            </Label>
            <Select
              label="From Unit"
              options={category.units.map((unit) => ({ value: unit, label: unit }))}
              selectedKey={fromUnit}
              onSelectionChange={(key) => setFromUnit(key)}
              placeholder="Select unit"
           
            />
            <Input
              type="number"
              value={fromValue}
              onChange={handleFromValueChange}
              className="mt-2"
              placeholder="Enter value"
            />
          </div>
          <div>
            <Label htmlFor="toUnit" className="text-gray-300 mb-2">
              To
            </Label>
            <Select
              label="To Unit"
              options={category.units.map((unit) => ({ value: unit, label: unit }))}
              selectedKey={toUnit}
              onSelectionChange={(key) => setToUnit(key)}
              placeholder="Select unit"
             
            />

            <Input
              type="text"
              value={toValue}
              readOnly
              className="mt-2 bg-gray-700 border-gray-600 text-white"
              placeholder="Result"
            />
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <Button onClick={swapUnits} className="bg-blue-500 hover:bg-blue-600">
            <ArrowLeftRight className="mr-2" size={20} />
            Swap
          </Button>
          <Button onClick={copyToClipboard} className="bg-green-500 hover:bg-green-600">
            {copied ? <Check className="mr-2" size={20} /> : <Copy className="mr-2" size={20} />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">Conversion History</h2>
          <ul className="bg-gray-700 rounded-md p-4 max-h-40 overflow-y-auto">
            {conversionHistory.map((conversion, index) => (
              <li key={index} className="text-gray-300 mb-1">
                {conversion}
              </li>
            ))}
          </ul>
          <Button onClick={clearHistory} className="mt-2 bg-red-500 hover:bg-red-600">
            <RefreshCw className="mr-2" size={20} />
            Clear History
          </Button>
        </div>
      </div>
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About Advanced Unit Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300">
        <p className="mb-4">
          The Advanced Unit Converter is a powerful and versatile tool designed to simplify the process of converting between various units of measurement. With its intuitive interface and comprehensive unit categories, it's perfect for students, professionals, and anyone needing quick and accurate conversions.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/UnitConverterPreview.png?height=400&width=600" 
            alt="Screenshot of the Advanced Unit Converter interface showing conversion options and results" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          How to Use Advanced Unit Converter?
        </h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Select the category of units you want to convert (e.g., Length, Weight, Temperature).</li>
          <li>Choose the unit you're converting from in the "From" dropdown.</li>
          <li>Enter the value you want to convert in the input field.</li>
          <li>Select the unit you're converting to in the "To" dropdown.</li>
          <li>The converted value will appear automatically in the result field.</li>
          <li>Use the "Swap" button to quickly reverse the conversion.</li>
          <li>Click "Copy" to copy the conversion result to your clipboard.</li>
          <li>Switch to the "History" tab to view your recent conversions.</li>
        </ol>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Wide range of unit categories: Length, Weight, Temperature, Volume, Area, Time, Speed, Data, Energy, and Pressure.</li>
          <li>Extensive list of units within each category for precise conversions.</li>
          <li>Real-time conversion as you type.</li>
          <li>Swap function to quickly reverse conversion direction.</li>
          <li>Copy to clipboard functionality for easy sharing.</li>
          <li>Conversion history to keep track of recent conversions.</li>
          <li>Clean and intuitive tabbed interface.</li>
          <li>Responsive design for use on desktop and mobile devices.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Share2 className="w-5 h-5 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Education: For math, science, and engineering calculations.</li>
          <li>Engineering: Convert between different units for design and calculations.</li>
          <li>Cooking: Convert between volume and weight measurements for recipes.</li>
          <li>Fitness and Health: Convert between units for weight, length, and energy.</li>
          <li>Travel: Convert units when visiting countries with different measurement systems.</li>
          <li>Construction: Convert units of length, area, and volume for building projects.</li>
          <li>Science: Perform conversions for various scientific calculations and experiments.</li>
          <li>International Trade: Convert units for shipping and logistics.</li>
          <li>IT and Networking: Use data conversions for storage and bandwidth calculations.</li>
          <li>Energy Management: Convert between energy units for power consumption analysis.</li>
        </ul>

        <h2 className="text-xl font-semibold text-white mt-6 mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the tab key to quickly navigate between input fields and dropdowns.</li>
          <li>Utilize the swap function to quickly check reverse conversions.</li>
          <li>Check the conversion history tab to review and re-use recent conversions.</li>
          <li>For complex calculations, use the copy function to easily transfer results to other applications.</li>
          <li>When working with temperature, remember that the relationships between units are not linear.</li>
          <li>For precise scientific calculations, always verify the number of decimal places in the result.</li>
          <li>Use the pressure conversion feature for weather-related calculations or engineering applications.</li>
          <li>Leverage the energy conversion for calculations related to power consumption or nutritional information.</li>
          <li>When working with digital data, remember the difference between bits (b) and bytes (B) - there are 8 bits in a byte.</li>
          <li>For astronomical distances, consider using the length converter with larger units like light-years or astronomical units.</li>
        </ul>

        <p className="mt-6">
          The Advanced Unit Converter is an essential tool for anyone who regularly works with different units of measurement. Its combination of a wide range of unit categories, user-friendly interface, and helpful features like conversion history make it a versatile solution for both simple and complex conversion tasks. Whether you're a student, professional, or just someone who needs to convert units in daily life, this tool is designed to make the process quick, easy, and accurate.
        </p>
      </CardContent>
    </Card>
    </ToolLayout>
  )
}

export default UnitConverter

