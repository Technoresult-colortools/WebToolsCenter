'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeftRight, Copy, Check, RefreshCw, ChevronDown } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
    units: ['Kilograms', 'Grams', 'Milligrams', 'Pounds', 'Ounces'],
    convert: (value, from, to) => {
      const gramValues: { [key: string]: number } = {
        Kilograms: 1000,
        Grams: 1,
        Milligrams: 0.001,
        Pounds: 453.592,
        Ounces: 28.3495,
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
    setTimeout(() => setCopied(false), 2000)
  }

  const clearHistory = () => {
    setConversionHistory([])
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Advanced Unit Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                id="category"
                value={category.name}
                onChange={(e) => {
                  const newCategory = categories.find((c) => c.name === e.target.value)
                  if (newCategory) {
                    setCategory(newCategory)
                    setFromUnit(newCategory.units[0])
                    setToUnit(newCategory.units[1])
                  }
                }}
                className="block w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-300 mb-2">
                From
              </label>
              <div className="relative">
                <select
                  id="fromUnit"
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="block w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {category.units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <input
                type="number"
                value={fromValue}
                onChange={handleFromValueChange}
                className="mt-2 block w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value"
              />
            </div>
            <div>
              <label htmlFor="toUnit" className="block text-sm font-medium text-gray-300 mb-2">
                To
              </label>
              <div className="relative">
                <select
                  id="toUnit"
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="block w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {category.units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <input
                type="text"
                value={toValue}
                readOnly
                className="mt-2 block w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-md"
                placeholder="Result"
              />
            </div>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={swapUnits}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 flex items-center"
            >
              <ArrowLeftRight className="mr-2" size={20} />
              Swap
            </button>
            <button
              onClick={copyToClipboard}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center"
            >
              {copied ? <Check className="mr-2" size={20} /> : <Copy className="mr-2" size={20} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
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
            <button
              onClick={clearHistory}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center"
            >
              <RefreshCw className="mr-2" size={20} />
              Clear History
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Advanced Unit Converter</h2>
          <p className="text-gray-300 mb-4">
            This advanced unit converter allows you to quickly and easily convert between various units of measurement.
            It supports multiple categories including length, weight, and temperature.
          </p>
          <h3 className="text-xl font-semibold text-white mb-2">Features:</h3>
          <ul className="list-disc list-inside text-gray-300">
            <li>Multiple conversion categories</li>
            <li>Real-time conversion as you type</li>
            <li>Swap units with one click</li>
            <li>Copy conversion results to clipboard</li>
            <li>Conversion history with the ability to clear</li>
            <li>Responsive design for all devices</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default UnitConverter