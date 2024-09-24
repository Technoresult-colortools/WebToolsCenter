'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import prettier from 'prettier/standalone'
import * as prettierPluginHtml from 'prettier/plugins/html'
import { FileMinus, Copy, RefreshCw, Download, Upload } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface FormatterOptions {
  useTabs: boolean
  singleQuotes: boolean
  indentSize: number
}

export default function HTMLFormatter() {
  const [inputHTML, setInputHTML] = useState('')
  const [outputHTML, setOutputHTML] = useState('')
  const [isFormatting, setIsFormatting] = useState(false)
  const [options, setOptions] = useState<FormatterOptions>({
    useTabs: false,
    singleQuotes: false,
    indentSize: 2,
  })
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatHTML = async () => {
    setIsFormatting(true)
    try {
      const formattedCode = await prettier.format(inputHTML, {
        parser: 'html',
        plugins: [prettierPluginHtml],
        useTabs: options.useTabs,
        singleQuote: options.singleQuotes,
        tabWidth: options.indentSize,
      })
      setOutputHTML(formattedCode)
      toast.success('HTML formatted successfully!')
    } catch (error) {
      console.error('Formatting error:', error)
      toast.error('Error formatting HTML. Please check your input.')
    } finally {
      setIsFormatting(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputHTML)
    toast.success('Formatted HTML copied to clipboard!')
  }

  const handleReset = () => {
    setInputHTML('')
    setOutputHTML('')
    setFileName('')
    setOptions({
      useTabs: false,
      singleQuotes: false,
      indentSize: 2,
    })
  }

  const handleDownload = () => {
    const blob = new Blob([outputHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || 'formatted.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputHTML(content)
      }
      reader.readAsText(file)
    }
  }

  const handleOptionChange = (option: keyof FormatterOptions, value: boolean | number) => {
    setOptions((prev) => ({ ...prev, [option]: value }))
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">HTML Formatter</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <Tabs defaultValue="format" className="w-full">
            <TabsList className="grid w-full grid-cols-1 mb-4">
              <TabsTrigger value="format">
                <FileMinus className="w-4 h-4 mr-2" />
                Format HTML
              </TabsTrigger>
            </TabsList>
            <TabsContent value="format">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-html" className="text-white mb-2 block">HTML to Format</Label>
                  <Textarea
                    id="input-html"
                    placeholder="Enter HTML to format..."
                    value={inputHTML}
                    onChange={(e) => setInputHTML(e.target.value)}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  />
                </div>
                <div>
                  <Label htmlFor="output-html" className="text-white mb-2 block">Formatted HTML</Label>
                  <SyntaxHighlighter
                    language="html"
                    style={atomDark}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  >
                    {outputHTML}
                  </SyntaxHighlighter>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="useTabs"
                checked={options.useTabs}
                onCheckedChange={(checked) => handleOptionChange('useTabs', checked)}
              />
              <Label htmlFor="useTabs" className="text-white">Use Tabs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="singleQuotes"
                checked={options.singleQuotes}
                onCheckedChange={(checked) => handleOptionChange('singleQuotes', checked)}
              />
              <Label htmlFor="singleQuotes" className="text-white">Use Single Quotes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="indentSize" className="text-white">Indent Size:</Label>
              <Input
                id="indentSize"
                type="number"
                min="1"
                max="8"
                value={options.indentSize}
                onChange={(e) => handleOptionChange('indentSize', parseInt(e.target.value, 10))}
                className="w-16 bg-gray-700 text-white border-gray-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4 mt-4">
            <Button onClick={formatHTML} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isFormatting}>
              <FileMinus className="w-4 h-4 mr-2" />
              {isFormatting ? 'Formatting...' : 'Format'}
            </Button>
            <Button onClick={copyToClipboard} className="flex-1 bg-green-600 hover:bg-green-700" disabled={!outputHTML}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleReset} className="flex-1 bg-red-600 hover:bg-red-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleDownload} className="flex-1 bg-purple-600 hover:bg-purple-700" disabled={!outputHTML}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold text-white">Upload HTML File</h3>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <Input
                id="file-upload"
                type="file"
                accept=".html,.htm"
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

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter your HTML code in the input area or upload an HTML file.</li>
            <li>Click the "Format" button to process your code using Prettier.</li>
            <li>The formatted HTML will appear in the output area with syntax highlighting.</li>
            <li>Use the Copy button to copy the formatted HTML to your clipboard.</li>
            <li>Use the Download button to save the formatted HTML as a file.</li>
            <li>To format an HTML file:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Click the "Upload" button or use the file input.</li>
              <li>Select an HTML file from your device.</li>
              <li>The file content will be loaded into the input area.</li>
              <li>Click "Format" to process the uploaded file.</li>
            </ul>
            <li>Use the Reset button to clear all inputs and outputs.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8">Tips</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>This formatter uses Prettier for consistent and opinionated HTML formatting.</li>
            <li>You can choose to use tabs instead of spaces for indentation.</li>
            <li>You can choose to use single quotes instead of double quotes for attributes.</li>
            <li>Always keep a backup of your original HTML files.</li>
            <li>Test your formatted HTML thoroughly to ensure it renders correctly.</li>
            <li>Large HTML files may take longer to process.</li>
            <li>Consider using an HTML linter in addition to formatting for best practices.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}