'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, Upload, Download } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const JsonValidator = () => {
  const [jsonInput, setJsonInput] = useState('')
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; error?: string }>({ isValid: true })
  const [formattedJson, setFormattedJson] = useState('')
  const [jsonSchema, setJsonSchema] = useState('')
  const [jsonPath, setJsonPath] = useState('')
  const [jsonPathResult] = useState('')
  const [indentSize, setIndentSize] = useState(2)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput)
      setValidationResult({ isValid: true })
      setFormattedJson(JSON.stringify(parsedJson, null, indentSize))
    } catch (error) {
      setValidationResult({ isValid: false, error: (error as Error).message })
      setFormattedJson('')
    }
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

  const validateJsonSchema = () => {
    // This is a placeholder for JSON schema validation
    // In a real implementation, you would use a library like Ajv
    toast.error('JSON Schema validation is not implemented in this demo')
  }

  const executeJsonPath = () => {
    // This is a placeholder for JSON Path query
    // In a real implementation, you would use a library like jsonpath
    toast.error('JSON Path query is not implemented in this demo')
  }

  const minifyJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput)
      setFormattedJson(JSON.stringify(parsedJson))
    } catch (error) {
      toast.error('Invalid JSON. Please fix errors before minifying.')
    }
  }

  const beautifyJson = () => {
    try {
      const parsedJson = JSON.parse(jsonInput)
      setFormattedJson(JSON.stringify(parsedJson, null, indentSize))
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
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">JSON Validator</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">JSON Input</h2>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-64 mb-4 bg-gray-700 text-white"
          />
          <div className="flex flex-wrap gap-2 mb-4">
            <Button onClick={validateJson}>Validate JSON</Button>
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
            <Button onClick={minifyJson}>Minify</Button>
            <Button onClick={beautifyJson}>Beautify</Button>
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

          <Tabs defaultValue="validation" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="schema">Schema Validation</TabsTrigger>
              <TabsTrigger value="jsonpath">JSON Path</TabsTrigger>
            </TabsList>
            <TabsContent value="validation">
              <div className={`p-4 rounded-md ${validationResult.isValid ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
                {validationResult.isValid ? 'Valid JSON' : `Invalid JSON: ${validationResult.error}`}
              </div>
              {formattedJson && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2">Formatted JSON</h3>
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
            <TabsContent value="schema">
              <Textarea
                value={jsonSchema}
                onChange={(e) => setJsonSchema(e.target.value)}
                placeholder="Paste your JSON Schema here..."
                className="w-full h-64 mb-4 bg-gray-700 text-white"
              />
              <Button onClick={validateJsonSchema}>Validate against Schema</Button>
            </TabsContent>
            <TabsContent value="jsonpath">
              <Input
                value={jsonPath}
                onChange={(e) => setJsonPath(e.target.value)}
                placeholder="Enter JSON Path query..."
                className="w-full mb-4 bg-gray-700 text-white"
              />
              <Button onClick={executeJsonPath}>Execute JSON Path</Button>
              {jsonPathResult && (
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2">JSON Path Result</h3>
                  <Textarea
                    value={jsonPathResult}
                    readOnly
                    className="w-full h-32 bg-gray-700 text-white"
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="bg-gray-800 text-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-4">About JSON Validator</h2>
          <p className="mb-4">
            Our JSON Validator is a powerful tool designed to help developers validate, format, and analyze JSON data. 
            Whether you're working on API development, data processing, or debugging, this tool provides a comprehensive 
            set of features to streamline your JSON-related tasks.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">How to Use:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Paste your JSON into the input area or use the "Upload JSON" button to load a file.</li>
            <li>Click "Validate JSON" to check if your JSON is valid.</li>
            <li>Use the "Minify" or "Beautify" buttons to format your JSON.</li>
            <li>Adjust the indent size for beautified JSON using the dropdown menu.</li>
            <li>Copy the formatted JSON to your clipboard or download it as a file.</li>
            <li>Use the "Schema Validation" tab to validate your JSON against a schema (feature not fully implemented in this demo).</li>
            <li>Use the "JSON Path" tab to query your JSON using JSONPath syntax (feature not fully implemented in this demo).</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-2">Key Features:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>JSON validation with detailed error messages</li>
            <li>JSON formatting (beautify and minify)</li>
            <li>Customizable indentation for formatted JSON</li>
            <li>File upload support for JSON files</li>
            <li>Copy to clipboard functionality</li>
            <li>Download formatted JSON</li>
            <li>Dark mode interface for comfortable viewing</li>
            <li>JSON Schema validation (placeholder for future implementation)</li>
            <li>JSON Path querying (placeholder for future implementation)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-2">Tips and Tricks:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Use the "Beautify" feature to make your JSON more readable before editing or debugging.</li>
            <li>The "Minify" option is great for reducing file size when storing or transmitting JSON data.</li>
            <li>When working with large JSON files, use the file upload feature instead of pasting to avoid browser performance issues.</li>
            <li>If you're unsure about your JSON structure, start by validating it to catch any syntax errors.</li>
            <li>Use JSON Schema validation to ensure your JSON adheres to a specific structure or format.</li>
            <li>JSON Path queries can be useful for extracting specific data from complex JSON structures.</li>
            <li>Remember that JSON keys and string values must be enclosed in double quotes.</li>
            <li>When copying formatted JSON, make sure to select all the text to include any hidden characters.</li>
            <li>If you're working with sensitive data, be cautious when using online JSON validators. This tool processes everything locally in your browser for enhanced security.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default JsonValidator