'use client'

import React, { useState, useRef } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, Upload, Download, RefreshCw, Minimize, Maximize, Info, BookOpen, Lightbulb } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'

const JsonValidator = () => {
  const [jsonInput, setJsonInput] = useState('')
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error?: string }>({ isValid: true })
  const [formattedJson, setFormattedJson] = useState('')
  const [indentSize, setIndentSize] = useState(2)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('validation')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateJson = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post('https://jsonlint.com/api/validate', { json: jsonInput })
      const { error } = response.data
      
      if (error) {
        setValidationResult({ isValid: false, error })
      } else {
        const parsedJson = JSON.parse(jsonInput)
        setValidationResult({ isValid: true })
        setFormattedJson(JSON.stringify(parsedJson, null, indentSize))
      }
    } catch (error) {
      setValidationResult({ isValid: false, error: 'An error occurred while validating JSON.' })
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
      setFormattedJson(JSON.stringify(parsedJson))
      setActiveTab('formatted')
      toast.success('JSON minified successfully!')
    } catch (error) {
      toast.error('Invalid JSON. Please fix errors before minifying.')
    }
  }

  const beautifyJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput)
      setFormattedJson(JSON.stringify(parsedJson, null, indentSize))
      setActiveTab('formatted')
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
          <Select value={indentSize.toString()} onValueChange={(value) => setIndentSize(Number(value))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select indent size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
              <SelectItem value="8">8 spaces</SelectItem>
            </SelectContent>
          </Select>
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
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-gray-800 shadow-lg rounded-lg p-4 sm:p-8 max-w-4xl mx-auto mt-8">
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About JSON Validator and Formatter
            </h2>
            <p className="text-white">
              The JSON Validator and Formatter is a powerful tool designed to help developers validate, format, and manipulate JSON data. Whether you're working on API integrations, configuration files, or data exchange, this tool simplifies the process of ensuring your JSON is correct and well-formatted.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use JSON Validator and Formatter?
            </h2>
            <ol className="list-decimal list-inside text-white space-y-2">
              <li>Paste your JSON into the input area or upload a JSON file.</li>
              <li>Click 'Validate JSON' to check if your JSON is valid.</li>
              <li>Use 'Minify' to compress your JSON or 'Beautify' to format it with proper indentation.</li>
              <li>Adjust the indent size for beautification as needed.</li>
              <li>Copy the formatted JSON or download it as a file.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-2 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-white space-y-2">
              <li>JSON validation with detailed error messages</li>
              <li>Minification and beautification of JSON data</li>
              <li>Customizable indentation for formatted JSON</li>
              <li>File upload and download capabilities</li>
              <li>Copy-to-clipboard functionality for quick use</li>
              <li>Clear and intuitive user interface</li>
            </ul>
          </section>
        </div>
      </div>
    </ToolLayout>
  )
}

export default JsonValidator