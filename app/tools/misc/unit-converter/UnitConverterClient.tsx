'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeftRight, Copy, Check, RefreshCw, Info, Lightbulb, BookOpen } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/sidebarTools';

type UnitCategory = {
  name: string
  units: string[]
  convert: (value: number, from: string, to: string) => number
}

const categories: UnitCategory[] = [
  {
    name: 'Length',
    units: ['Meters', 'Kilometers', 'Centimeters', 'Millimeters', 'Miles', 'Yards', 'Feet', 'Inches'],
    convert: (value, from, to) => {
      const meterValues: { [key: string]: number } = {
        Meters: 1,
        Kilometers: 1000,
        Centimeters: 0.01,
        Millimeters: 0.001,
        Miles: 1609.34,
        Yards: 0.9144,
        Feet: 0.3048,
        Inches: 0.0254,
      }
      const meters = value * meterValues[from]
      return meters / meterValues[to]
    },
  },
  {
    name: 'Weight',
    units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces', 'Tons'],
    convert: (value, from, to) => {
      const gramValues: { [key: string]: number } = {
        Kilograms: 1000,
        Grams: 1,
        Milligrams: 0.001,
        Pounds: 453.592,
        Ounces: 28.3495,
        Tons: 1000000,
      }
      const grams = value * gramValues[from]
      return grams / gramValues[to]
    },
  },
  {
    name: 'Temperature',
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    convert: (value, from, to) => {
      if (from === 'Celsius' && to === 'Fahrenheit') {
        return (value * 9) / 5 + 32
      } else if (from === 'Fahrenheit' && to === 'Celsius') {
        return ((value - 32) * 5) / 9
      } else if (from === 'Celsius' && to === 'Kelvin') {
        return value + 273.15
      } else if (from === 'Kelvin' && to === 'Celsius') {
        return value - 273.15
      } else if (from === 'Fahrenheit' && to === 'Kelvin') {
        return ((value - 32) * 5) / 9 + 273.15
      } else if (from === 'Kelvin' && to === 'Fahrenheit') {
        return ((value - 273.15) * 9) / 5 + 32
      }
      return value
    },
  },
  {
    name: 'Volume',
    units: ['Liters', 'Milliliters', 'Cubic Meters', 'Gallons', 'Quarts', 'Pints', 'Cups'],
    convert: (value, from, to) => {
      const literValues: { [key: string]: number } = {
        Liters: 1,
        Milliliters: 0.001,
        'Cubic Meters': 1000,
        Gallons: 3.78541,
        Quarts: 0.946353,
        Pints: 0.473176,
        Cups: 0.236588,
      }
      const liters = value * literValues[from]
      return liters / literValues[to]
    },
  },
  {
    name: 'Area',
    units: ['Square Meters', 'Square Kilometers', 'Square Feet', 'Square Yards', 'Acres', 'Hectares'],
    convert: (value, from, to) => {
      const squareMeterValues: { [key: string]: number } = {
        'Square Meters': 1,
        'Square Kilometers': 1000000,
        'Square Feet': 0.092903,
        'Square Yards': 0.836127,
        Acres: 4046.86,
        Hectares: 10000,
      }
      const squareMeters = value * squareMeterValues[from]
      return squareMeters / squareMeterValues[to]
    },
  },
]

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
    setConversionHistory((prev) => [conversion, ...prev.slice(0, 9)])
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
              Advanced Unit Converter
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Quickly and accurately convert between various units of measurement.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-6">
              <Label htmlFor="category" className="text-gray-300 mb-2">
                Category
              </Label>
              <Select
                value={category.name}
                onValueChange={(value) => {
                  const newCategory = categories.find((c) => c.name === value)
                  if (newCategory) {
                    setCategory(newCategory)
                    setFromUnit(newCategory.units[0])
                    setToUnit(newCategory.units[1])
                  }
                }}
              >
                <SelectTrigger id="category" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="fromUnit" className="text-gray-300 mb-2">
                  From
                </Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger id="fromUnit" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {category.units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={fromValue}
                  onChange={handleFromValueChange}
                  className="mt-2 bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter value"
                />
              </div>
              <div>
                <Label htmlFor="toUnit" className="text-gray-300 mb-2">
                  To
                </Label>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger id="toUnit" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {category.units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Unit Converter
            </h2>
            <p className="text-gray-300 mb-4">
              Our Advanced Unit Converter is a powerful tool designed to help you quickly and accurately convert between various units of measurement. Whether you're working on a scientific project, cooking, or just need to convert units for everyday tasks, this tool has you covered.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>🔄 Multiple Categories: Convert units across length, weight, temperature, volume, and area.</li>
              <li>⚡ Real-time Conversion: See results instantly as you type.</li>
              <li>🔀 Unit Swapping: Easily switch between 'from' and 'to' units with one click.</li>
              <li>📋 Copy to Clipboard: Quickly copy conversion results for use elsewhere.</li>
              <li>📜 Conversion History: Keep track of your recent conversions.</li>
              <li>🖥️ Responsive Design: Use on any device, from desktop to mobile.</li>
              <li>🎨 User-friendly Interface: Clean and intuitive design for easy navigation.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Select the category of units you want to convert (e.g., Length, Weight).</li>
              <li>Choose the unit you're converting from in the "From" dropdown.</li>
              <li>Enter the value you want to convert in the input field.</li>
              <li>Select the unit you're converting to in the "To" dropdown.</li>
              <li>The converted value will appear automatically in the result field.</li>
              <li>Use the "Swap" button to quickly reverse the conversion.</li>
              <li>Click "Copy" to copy the conversion result to your clipboard.</li>
              <li>View your conversion history below the main converter.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips & Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use the tab key to quickly navigate between input fields and dropdowns.</li>
              <li>For temperature conversions, remember that the relationships between units are not linear.</li>
              <li>When converting between metric and imperial units, use the length converter for accurate results.</li>
              <li>For precise scientific calculations, always verify the number of decimal places in the result.</li>
              <li>Use the conversion history to keep track of multiple conversions without the need for manual note-taking.</li>
              <li>When working with very large or very small numbers, consider using scientific notation for input.</li>
              <li>Remember that for weight conversions, "ton" refers to the metric ton (1000 kg) in this converter.</li>
              <li>For area conversions, be mindful of the difference between square units (e.g., square meters) and non-square units (e.g., acres).</li>
            </ul>
          </div>

        </main>
       </div> 
      <Footer />
    </div>
  )
}

export default UnitConverter