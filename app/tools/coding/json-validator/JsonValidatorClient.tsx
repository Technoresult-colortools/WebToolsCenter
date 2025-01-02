'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Select } from '@/components/ui/select1';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, Upload, Download, RefreshCw, Minimize, Maximize, Info, BookOpen, Lightbulb, Check, X } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Image from 'next/image'

interface MinificationDetails {
  originalSize: number;
  minifiedSize: number;
  savings: number;
  savingsPercentage: number;
}

const JsonValidator = () => {
  const [jsonInput, setJsonInput] = useState('')
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error?: string }>({ isValid: true })
  const [formattedJson, setFormattedJson] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('validation')
  const [sortKeys, setSortKeys] = useState(false)
  const [minificationDetails, setMinificationDetails] = useState<MinificationDetails | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateJson = () => {
    setIsLoading(true)
    try {
      JSON.parse(jsonInput)
      setValidationResult({ isValid: true })
      toast.success('JSON is valid!')
    } catch (error) {
      setValidationResult({ isValid: false, error: (error as Error).message })
      toast.error('Invalid JSON. Please check for errors.')
    }
    setIsLoading(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setJsonInput(content)
      }
      reader.readAsText(file)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!')
    })
  }

  const minifyJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput)
      const minified = JSON.stringify(parsedJson)
      setFormattedJson(minified)
      setActiveTab('formatted')

      const originalSize = jsonInput.length
      const minifiedSize = minified.length
      const savings = originalSize - minifiedSize
      const savingsPercentage = (savings / originalSize) * 100

      setMinificationDetails({
        originalSize,
        minifiedSize,
        savings,
        savingsPercentage
      })

      toast.success('JSON minified successfully!')
    } catch (error) {
      toast.error('Invalid JSON. Please fix errors before minifying.')
    }
  }

  const beautifyJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput)
      const formatted = JSON.stringify(parsedJson, sortKeys ? Object.keys(parsedJson).sort() : null, indentSize)
      setFormattedJson(formatted)
      setActiveTab('formatted')
      setMinificationDetails(null)
      toast.success('JSON beautified successfully!')
    } catch (error) {
      toast.error('Invalid JSON. Please fix errors before beautifying.')
    }
  }

  const downloadJson = () => {
    const blob = new Blob([formattedJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'formatted.json'
    link.click()
    URL.revokeObjectURL(url)
    toast.success('JSON file downloaded!')
  }

  const clearJson = () => {
    setJsonInput('')
    setFormattedJson('')
    setValidationResult({ isValid: true })
    setMinificationDetails(null)
    toast.success('JSON input cleared!')
  }

  return (
    <ToolLayout
      title="JSON Validator and Formatter"
      description="Validate, format, and manipulate JSON with ease"
    >
      <Toaster position="top-right" />
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-4 text-white">JSON Input</h2>
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste your JSON here..."
          className="w-full h-64 mb-4 bg-gray-700 text-white"
        />
        <div className="flex flex-wrap gap-2 mb-4">
          <Button onClick={validateJson} disabled={isLoading}>
            {isLoading ? 'Validating...' : 'Validate JSON'}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Upload JSON
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <Button onClick={minifyJson}>
            <Minimize className="h-4 w-4 mr-2" />
            Minify
          </Button>
          <Button onClick={beautifyJson}>
            <Maximize className="h-4 w-4 mr-2" />
            Beautify
          </Button>
          <Button onClick={clearJson} variant="destructive">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Select
            label="Indent Size"
            options={[2, 4, 8].map((size) => ({
              value: size.toString(),
              label: `${size} spaces`,
            }))}
            selectedKey={indentSize.toString()}
            onSelectionChange={(value) => setIndentSize(Number(value))}
            placeholder="Select indent size"
          />

          <Button onClick={() => setSortKeys(!sortKeys)}>
            {sortKeys ? <Check className="h-4 w-4 mr-2" /> : <X className="h-4 w-4 mr-2" />}
            Sort Keys
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="formatted">Formatted JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="validation">
            <div className={`p-4 rounded-md ${validationResult.isValid ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
              {validationResult.isValid ? 'Valid JSON' : `Invalid JSON: ${validationResult.error}`}
            </div>
          </TabsContent>
          <TabsContent value="formatted">
            {formattedJson && (
              <div className="mt-4">
                <div className="relative">
                  <Textarea
                    value={formattedJson}
                    readOnly
                    className="w-full h-64 bg-gray-700 text-white"
                  />
                  <Button
                    onClick={() => copyToClipboard(formattedJson)}
                    className="absolute top-2 right-2"
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <Button onClick={downloadJson} className="mt-2">
                  <Download className="h-4 w-4 mr-2" />
                  Download JSON
                </Button>
                {minificationDetails && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Minification Details</h3>
                    <p>Original Size: {minificationDetails.originalSize} bytes</p>
                    <p>Minified Size: {minificationDetails.minifiedSize} bytes</p>
                    <p>Savings: {minificationDetails.savings} bytes</p>
                    <p>Savings Percentage: {minificationDetails.savingsPercentage.toFixed(2)}%</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is JSON Validator and Formatter?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The JSON Validator and Formatter is a powerful and intuitive tool designed for developers, data analysts, and anyone working with JSON data. It provides a comprehensive set of features to validate, format, and manipulate JSON, ensuring that your data is correct, well-structured, and easy to read.
          </p>
          <p className="text-gray-300 mb-4">
            Whether you're debugging API responses, cleaning up configuration files, or preparing data for transmission, our JSON Validator and Formatter streamlines your workflow and helps catch errors before they become problems.
          </p>

          <div className="my-8">
            <Image 
              src="/Images/JSONValidatorPreview.png?height=400&width=600"  
              alt="Screenshot of the JSON Validator and Formatter interface" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use JSON Validator and Formatter?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Paste your JSON into the input area or upload a JSON file.</li>
            <li>Click 'Validate JSON' to check if your JSON is valid.</li>
            <li>Use 'Minify' to compress your JSON or 'Beautify' to format it with proper indentation.</li>
            <li>Adjust the indent size for beautification as needed (2, 4, or 8 spaces).</li>
            <li>Toggle 'Sort Keys' to alphabetically sort object keys when beautifying.</li>
            <li>View the formatted JSON in the 'Formatted JSON' tab.</li>
            <li>Check minification details after minifying your JSON.</li>
            <li>Copy the formatted JSON to clipboard or download it as a file.</li>
            <li>Use the 'Clear' button to reset the input and start over.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>JSON validation with detailed error messages</li>
            <li>Minification for compact JSON representation</li>
            <li>Beautification with customizable indentation</li>
            <li>Option to sort object keys alphabetically</li>
            <li>Detailed minification statistics</li>
            <li>File upload and download capabilities</li>
            <li>Copy-to-clipboard functionality for quick use</li>
            <li>Clear and intuitive user interface</li>
            <li>Real-time feedback and notifications</li>
            <li>Support for large JSON files</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>API Development:</strong> Validate and format JSON responses for testing and documentation.</li>
            <li><strong>Data Analysis:</strong> Clean and structure JSON data for easier processing and visualization.</li>
            <li><strong>Configuration Management:</strong> Ensure configuration files are correctly formatted and valid.</li>
            <li><strong>Debugging:</strong> Quickly identify issues in JSON data structures.</li>
            <li><strong>Data Exchange:</strong> Prepare JSON data for transmission between systems.</li>
            <li><strong>Documentation:</strong> Create well-formatted JSON examples for technical documentation.</li>
            <li><strong>Learning Tool:</strong> Help beginners understand proper JSON structure and formatting.</li>
            <li><strong>Performance Optimization:</strong> Use minification details to optimize JSON payload sizes.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The JSON Validator and Formatter is an essential tool for anyone working with JSON data. By providing a user-friendly interface with powerful features, it simplifies the process of working with JSON, helping you catch errors early and ensure your data is always in the best possible format. With the added minification details, you can now easily track the efficiency of your JSON compression, making it invaluable for optimizing data transfer in your applications.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

export default JsonValidator

