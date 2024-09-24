'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Input from "@/components/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FileMinus, Copy, RefreshCw, Download, Upload } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function JavaScriptFormatter() {
  const [inputJS, setInputJS] = useState('')
  const [outputJS, setOutputJS] = useState('')
  const [isFormatting, setIsFormatting] = useState(false)
  const [useTabs, setUseTabs] = useState(false)
  const [singleQuotes, setSingleQuotes] = useState(false)
  const [semicolons, setSemicolons] = useState(true)
  const [indentSize, setIndentSize] = useState('2')
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatJS = () => {
    setIsFormatting(true)
    try {
      let formatted = inputJS.trim()

      // Remove extra newlines
      formatted = formatted.replace(/(\r\n|\n|\r){2,}/gm, '\n')

      // Add newlines after semicolons (except in for loops)
      formatted = formatted.replace(/;(?!\s*(?:\s*for\s*\())/g, ';\n')

      // Add newlines after opening braces
      formatted = formatted.replace(/{(?!})/g, '{\n')

      // Add newlines before closing braces
      formatted = formatted.replace(/(?<!{)}/g, '\n}')

      // Add newlines after commas (except in for loops)
      formatted = formatted.replace(/,(?!\s*(?:\s*for\s*\())/g, ',\n')

      // Indent the code
      const lines = formatted.split('\n')
      let indentLevel = 0
      formatted = lines.map(line => {
        line = line.trim()
        if (line.endsWith('}') || line.endsWith(']')) indentLevel--
        const indent = useTabs ? '\t'.repeat(indentLevel) : ' '.repeat(indentLevel * parseInt(indentSize))
        if (line.endsWith('{') || line.endsWith('[')) indentLevel++
        return indent + line
      }).join('\n')

      // Handle quotes
      if (singleQuotes) {
        formatted = formatted.replace(/"/g, "'")
      } else {
        formatted = formatted.replace(/'/g, '"')
      }

      // Handle semicolons
      if (semicolons) {
        formatted = formatted.replace(/(?<!;|\{)\s*$/gm, ';')
      } else {
        formatted = formatted.replace(/;(?=\s*$)/gm, '')
      }

      setOutputJS(formatted)
      toast.success('JavaScript formatted successfully!')
    } catch (error) {
      console.error('Formatting error:', error)
      toast.error('Error formatting JavaScript. Please check your input.')
    } finally {
      setIsFormatting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Formatted JavaScript copied to clipboard!')
  }

  const handleReset = () => {
    setInputJS('')
    setOutputJS('')
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDownload = () => {
    const blob = new Blob([outputJS], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Formatted JavaScript downloaded!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputJS(content)
      }
      reader.readAsText(file)
      toast.success('File uploaded successfully!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">JavaScript Formatter</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <div className="space-y-6">
            <Tabs defaultValue="format" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="format">
                  <FileMinus className="w-4 h-4 mr-2" />
                  Format JavaScript
                </TabsTrigger>
              </TabsList>
              <TabsContent value="format">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-js" className="text-white mb-2 block">JavaScript to Format</Label>
                    <Textarea
                      id="input-js"
                      placeholder="Enter JavaScript to format..."
                      value={inputJS}
                      onChange={(e) => setInputJS(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="output-js" className="text-white mb-2 block">Formatted JavaScript</Label>
                    <SyntaxHighlighter
                      language="javascript"
                      style={atomDark}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    >
                      {outputJS}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="useTabs"
                  checked={useTabs}
                  onCheckedChange={setUseTabs}
                />
                <Label htmlFor="useTabs" className="text-white">Use Tabs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="singleQuotes"
                  checked={singleQuotes}
                  onCheckedChange={setSingleQuotes}
                />
                <Label htmlFor="singleQuotes" className="text-white">Use Single Quotes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="semicolons"
                  checked={semicolons}
                  onCheckedChange={setSemicolons}
                />
                <Label htmlFor="semicolons" className="text-white">Add Semicolons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="indentSize" className="text-white">Indent Size:</Label>
                <Select value={indentSize} onValueChange={setIndentSize}>
                  <SelectTrigger className="w-[180px] bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select indent size" />
                  </SelectTrigger>
                  <SelectContent className="w-[180px] bg-gray-700 text-white border-gray-600">
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="8">8 spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-4">
              <Button onClick={formatJS} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isFormatting}>
                <FileMinus className="w-4 h-4 mr-2" />
                {isFormatting ? 'Formatting...' : 'Format'}
              </Button>
              <Button onClick={() => copyToClipboard(outputJS)} className="flex-1 bg-green-600 hover:bg-green-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleReset} className="flex-1 bg-red-600 hover:bg-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleDownload} className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Upload JavaScript File</h3>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".js,.jsx,.ts,.tsx"
                  onChange={handleFileUpload}
                  className="bg-gray-700 text-white border-gray-600 w-full md:w-auto"
                  ref={fileInputRef}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="w-full md:w-auto bg-yellow-600 hover:bg-yellow-700 px-3 py-1 text-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              {fileName && (
                <p className="text-sm text-gray-300">Uploaded: {fileName}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter your JavaScript code in the input area or upload a JavaScript file.</li>
            <li>Configure the formatting options according to your preferences.</li>
            <li>Click the "Format" button to process your code.</li>
            <li>The formatted JavaScript will appear in the output area with syntax highlighting.</li>
            <li>Use the Copy button to copy the formatted JavaScript to your clipboard.</li>
            <li>Use the Download button to save the formatted JavaScript as a file.</li>
            <li>To format a JavaScript file:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Click the "Upload" button or use the file input.</li>
              <li>Select a JavaScript file from your device.</li>
              <li>The file content will be loaded into the input area.</li>
              <li>Click "Format" to process the uploaded file.</li>
            </ul>
            <li>Use the Reset button to clear all inputs and outputs.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8">Features</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Use Tabs: Toggle between spaces and tabs for indentation.</li>
            <li>Use Single Quotes: Choose between single and double quotes for strings.</li>
            <li>Add Semicolons: Decide whether to add semicolons at the end of statements.</li>
            <li>Indent Size: Select the number of spaces for indentation (2, 4, or 8).</li>
            <li>Syntax Highlighting: View formatted JavaScript with color-coded syntax.</li>
            <li>File Upload: Easily upload and format existing JavaScript files.</li>
            <li>Download: Save your formatted JavaScript directly to your device.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8">Tips</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>This formatter uses a custom implementation and may not cover all edge cases.</li>
            <li>For complex projects, consider using more robust tools like Prettier or ESLint.</li>
            <li>Always keep a backup of your original JavaScript files.</li>
            <li>Test your formatted JavaScript thoroughly to ensure it still functions correctly.</li>
            <li>This formatter is best suited for quick, basic formatting needs.</li>
            <li>For consistent formatting across a team, consider establishing coding standards.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}