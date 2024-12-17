'use client'

import React, { useState, useRef, useEffect } from 'react'
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
import { FileMinus, Copy, RefreshCw, Download, Upload, Info, BookOpen, Lightbulb, Zap, Eye, EyeOff } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent } from "@/components/ui/Card"
import Slider from "@/components/ui/Slider"
import NextImage from 'next/image'

interface FormatterOptions {
  useTabs: boolean
  singleQuotes: boolean
  indentSize: number
  wrapLineLength: number
  preserveNewlines: boolean
  removeComments: boolean
}

const MAX_FILE_SIZE_MB = 5 // 5MB limit

export default function HTMLFormatter() {
  const [inputHTML, setInputHTML] = useState('')
  const [outputHTML, setOutputHTML] = useState('')
  const [isFormatting, setIsFormatting] = useState(false)
  const [options, setOptions] = useState<FormatterOptions>({
    useTabs: false,
    singleQuotes: false,
    indentSize: 2,
    wrapLineLength: 80,
    preserveNewlines: true,
    removeComments: false,
  })
  const [fileName, setFileName] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [characterCount, setCharacterCount] = useState({ input: 0, output: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCharacterCount({
      input: inputHTML.length,
      output: outputHTML.length,
    })
  }, [inputHTML, outputHTML])

  const formatHTML = async () => {
    if (!inputHTML.trim()) {
      toast.error('Please enter some HTML to format.')
      return
    }

    setIsFormatting(true)
    try {
      const formattedCode = await prettier.format(inputHTML, {
        parser: 'html',
        plugins: [prettierPluginHtml],
        useTabs: options.useTabs,
        singleQuote: options.singleQuotes,
        tabWidth: options.indentSize,
        printWidth: options.wrapLineLength,
        htmlWhitespaceSensitivity: 'ignore',
        preserveNewlines: options.preserveNewlines,
        removeComments: options.removeComments,
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
    if (!outputHTML.trim()) {
      toast.error('No formatted HTML to copy.')
      return
    }
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
      wrapLineLength: 80,
      preserveNewlines: true,
      removeComments: false,
    })
    setShowPreview(false)
    toast.success('Reset done successfully')
  }

  const handleDownload = () => {
    if (!outputHTML.trim()) {
      toast.error('No formatted HTML to download.')
      return
    }
    const blob = new Blob([outputHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || 'formatted.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Download started!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`)
        return
      }
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputHTML(content)
        toast.success('File uploaded successfully!')
      }
      reader.onerror = () => {
        toast.error('Error reading file. Please try again.')
      }
      reader.readAsText(file)
    }
  }

  const handleOptionChange = (option: keyof FormatterOptions, value: boolean | number) => {
    setOptions((prev) => ({ ...prev, [option]: value }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const input = fileInputRef.current
      if (input) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        const event = { target: input } as React.ChangeEvent<HTMLInputElement>
        handleFileUpload(event)
      }
    }
  }

  return (
    <ToolLayout
      title="HTML Formatter"
      description="Clean up, standardize, and optimize your HTML code with advanced formatting options"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <CardContent className="space-y-6">
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
                  <div 
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-600 rounded-md p-4"
                  >
                    <Textarea
                      id="input-html"
                      placeholder="Enter HTML to format or drag and drop an HTML file here..."
                      value={inputHTML}
                      onChange={(e) => setInputHTML(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Character count: {characterCount.input}</p>
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
                  <p className="text-sm text-gray-400 mt-1">Character count: {characterCount.output}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="useTabs" className="text-white">Use Tabs</Label>
                <Switch
                  id="useTabs"
                  checked={options.useTabs}
                  onCheckedChange={(checked) => handleOptionChange('useTabs', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="singleQuotes" className="text-white">Use Single Quotes</Label>
                <Switch
                  id="singleQuotes"
                  checked={options.singleQuotes}
                  onCheckedChange={(checked) => handleOptionChange('singleQuotes', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="preserveNewlines" className="text-white">Preserve Newlines</Label>
                <Switch
                  id="preserveNewlines"
                  checked={options.preserveNewlines}
                  onCheckedChange={(checked) => handleOptionChange('preserveNewlines', checked)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="removeComments" className="text-white">Remove Comments</Label>
                <Switch
                  id="removeComments"
                  checked={options.removeComments}
                  onCheckedChange={(checked) => handleOptionChange('removeComments', checked)}
                />
              </div>
              <div>
                <Label htmlFor="indentSize" className="text-white">Indent Size: {options.indentSize}</Label>
                <Slider
                  id="indentSize"
                  min={1}
                  max={8}
                  step={1}
                  value={options.indentSize}
                  onChange={(value) => handleOptionChange('indentSize', value)}
                  className="w-full mt-2"
                />
              </div>
              <div>
                <Label htmlFor="wrapLineLength" className="text-white">Wrap Line Length: {options.wrapLineLength}</Label>
                <Slider
                  id="wrapLineLength"
                  min={40}
                  max={120}
                  step={1}
                  value={options.wrapLineLength}
                  onChange={(value) => handleOptionChange('wrapLineLength', value)}
                  className="w-full mt-2"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4">
            <Button onClick={formatHTML} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isFormatting}>
              <FileMinus className="w-4 h-4 mr-2" />
              {isFormatting ? 'Formatting...' : 'Format'}
            </Button>
            <Button onClick={copyToClipboard} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!outputHTML}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleReset} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleDownload} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!outputHTML}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setShowPreview(!showPreview)} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          </div>

          {showPreview && (
            <div className="mt-4 p-4 bg-white rounded-md">
              <div dangerouslySetInnerHTML={{ __html: outputHTML }} />
            </div>
          )}

          <div className="space-y-4">
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
              <Button onClick={() => fileInputRef.current?.click()} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
            {fileName && (
              <p className="text-sm text-gray-300">Uploaded: {fileName}</p>
            )}
            <p className="text-sm text-gray-400 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Max file size: {MAX_FILE_SIZE_MB}MB. Allowed types: HTML, HTM
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About HTML Formatter
        </h2>
        <p className="text-gray-300 mb-4">
          Our HTML Formatter is a powerful tool designed to clean up, standardize, and optimize your HTML code. It uses Prettier, a popular code formatting engine, to ensure consistent and readable HTML output. Whether you're a web developer, designer, or content creator working with HTML, this tool can help you maintain clean, organized, and optimized code. With advanced formatting options and features like syntax highlighting, file upload support, and live preview, our Enhanced HTML Formatter streamlines your workflow and improves code quality.
        </p>  
        <div className="my-8">
          <NextImage 
            src="/Images/HTMLFormatterPreview.png?height=400&width=600" 
            alt="Screenshot of the Enhanced HTML Formatter interface showing input area, formatting options, and output" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use HTML Formatter?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter your HTML code in the input area or upload an HTML file (max 5MB).</li>
          <li>Adjust formatting options to your preferences:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Use Tabs: Toggle between tabs and spaces for indentation.</li>
              <li>Use Single Quotes: Choose between single or double quotes for attributes.</li>
              <li>Indent Size: Set the number of spaces or tab size for indentation.</li>
              <li>Wrap Line Length: Adjust the maximum line length before wrapping.</li>
              <li>Preserve Newlines: Maintain original line breaks in the formatted output.</li>
              <li>Remove Comments: Option to strip HTML comments from the output.</li>
            </ul>
          </li>
          <li>Click the "Format" button to process your HTML code.</li>
          <li>Review the formatted HTML in the syntax-highlighted output area.</li>
          <li>Use the "Show Preview" button to see how the formatted HTML renders in the browser.</li>
          <li>Copy the formatted HTML to your clipboard using the "Copy" button.</li>
          <li>Download the formatted HTML as a file using the "Download" button.</li>
          <li>Use the "Reset" button to clear all inputs and start over.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Prettier-powered formatting for consistent and industry-standard results</li>
          <li>Customizable indentation (spaces or tabs) and indent size</li>
          <li>Option to use single or double quotes for attributes</li>
          <li>Adjustable line wrapping length for improved readability</li>
          <li>Preserve newlines option to maintain original document structure</li>
          <li>Comment removal feature for cleaning up production code</li>
          <li>Syntax highlighting for easy code reading and error detection</li>
          <li>File upload support with drag-and-drop functionality</li>
          <li>Live preview to see how formatted HTML renders in the browser</li>
          <li>Character count for both input and output</li>
          <li>One-click copy and download of formatted code</li>
          <li>Responsive design for use on various devices and screen sizes</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Best Practices and Tips
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Always keep a backup of your original HTML files before formatting.</li>
          <li>Use consistent formatting options across your project for code uniformity.</li>
          <li>Leverage the "Preserve Newlines" option to maintain the logical structure of your HTML.</li>
          <li>Utilize the live preview feature to ensure your formatted HTML renders correctly.</li>
          <li>Adjust the wrap line length based on your team's coding standards or personal preference.</li>
          <li>Consider removing comments in production code to reduce file size, but keep them in development versions.</li>
          <li>Use the character count feature to monitor the impact of formatting on your HTML size.</li>
          <li>Regularly format your HTML to maintain code quality throughout your project's lifecycle.</li>
          <li>Combine HTML formatting with CSS and JavaScript formatting for a fully optimized codebase.</li>
          <li>Use version control systems to track changes in your HTML files before and after formatting.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Zap className="w-6 h-6 mr-2" />
          Advanced Usage
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Integrate this formatter into your development workflow or CI/CD pipeline for consistent code style across your team.</li>
          <li>Use the formatted output as part of a larger asset pipeline, combining it with CSS and JavaScript minification for optimized web assets.</li>
          <li>Experiment with different formatting options to find the best balance between readability and file size for your specific project needs.</li>
          <li>Utilize the formatter in combination with HTML validation tools to ensure both well-formatted and structurally correct HTML.</li>
          <li>Consider creating project-specific presets for formatting options to maintain consistency across different projects or clients.</li>
          <li>Use the formatter as a learning tool to understand and adopt HTML best practices and modern coding conventions.</li>
        </ul>
      </div>
    </ToolLayout>
  )
}