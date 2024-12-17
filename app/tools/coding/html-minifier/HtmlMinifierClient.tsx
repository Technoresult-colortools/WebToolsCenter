'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import  Slider from "@/components/ui/Slider"
import { Card, CardContent } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Copy, RefreshCw, FileText, Download, Zap, Info, Settings, BookOpen, Lightbulb, Eye, EyeOff } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import NextImage from 'next/image'

export default function HTMLMinifier() {
  const [inputHTML, setInputHTML] = useState("")
  const [outputHTML, setOutputHTML] = useState("")
  const [fileName, setFileName] = useState("")
  const [removeComments, setRemoveComments] = useState(true)
  const [removeWhitespace, setRemoveWhitespace] = useState(true)
  const [removeEmptyAttributes, setRemoveEmptyAttributes] = useState(true)
  const [shortenBooleanAttributes, setShortenBooleanAttributes] = useState(true)
  const [removeOptionalTags, setRemoveOptionalTags] = useState(false)
  const [collapseWhitespace, setCollapseWhitespace] = useState(true)
  const [minifyJS, setMinifyJS] = useState(true)
  const [minifyCSS, setMinifyCSS] = useState(true)
  const [removeDataAttributes, setRemoveDataAttributes] = useState(false)
  const [removeScriptTypeAttributes, setRemoveScriptTypeAttributes] = useState(true)
  const [removeStyleLinkTypeAttributes, setRemoveStyleLinkTypeAttributes] = useState(true)
  const [aggressiveness, setAggressiveness] = useState(50)
  const [minificationStats, setMinificationStats] = useState({ originalSize: 0, minifiedSize: 0, percentReduction: 0 })
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE_MB = 10 // 10MB limit

  useEffect(() => {
    const savedHTML = localStorage.getItem('inputHTML')
    if (savedHTML) {
      setInputHTML(savedHTML)
    }
  }, [])

  const minifyHTML = () => {
    if (!inputHTML.trim()) {
      toast.error('Please enter some HTML to minify.')
      return
    }

    try {
      let minified = inputHTML
      const originalSize = new Blob([inputHTML]).size

      if (removeComments) {
        minified = minified.replace(/<!--[\s\S]*?-->/g, '')
      }

      if (removeWhitespace) {
        minified = minified.replace(/\s+/g, ' ')
      }

      if (removeEmptyAttributes) {
        minified = minified.replace(/(\s+\w+=")\s*"/g, '')
      }

      if (shortenBooleanAttributes) {
        minified = minified.replace(/(\w+)=["']true["']/g, '$1')
        minified = minified.replace(/(\w+)=["']false["']/g, '')
      }

      if (removeOptionalTags) {
        minified = minified.replace(/<\/?(html|head|body|option)[^>]*>/gi, '')
      }

      if (collapseWhitespace) {
        minified = minified.replace(/>\s+</g, '><')
      }

      if (minifyJS) {
        minified = minified.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, (match, p1) => {
          return `<script>${p1.replace(/\/\/.*?(\r?\n|$)/g, '').replace(/\s+/g, ' ').trim()}</script>`
        })
      }

      if (minifyCSS) {
        minified = minified.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, p1) => {
          return `<style>${p1.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/:\s+/g, ':').replace(/;\s+/g, ';').trim()}</style>`
        })
      }

      if (removeDataAttributes) {
        minified = minified.replace(/ data-[^=]+="[^"]*"/g, '')
      }

      if (removeScriptTypeAttributes) {
        minified = minified.replace(/<script(?:\s+(?!type=)[\w-]+=(?:"[^"]*"|'[^']*'))*\s+type=["']text\/javascript["'](?:\s+(?!type=)[\w-]+=(?:"[^"]*"|'[^']*'))*>/gi, '<script>')
      }

      if (removeStyleLinkTypeAttributes) {
        minified = minified.replace(/<(style|link)(?:\s+(?!type=)[\w-]+=(?:"[^"]*"|'[^']*'))*\s+type=["']text\/css["'](?:\s+(?!type=)[\w-]+=(?:"[^"]*"|'[^']*'))*>/gi, '<$1>')
      }

      // Apply aggressiveness (simplified example)
      if (aggressiveness > 0) {
        const extraMinification = Math.floor(aggressiveness / 10)
        for (let i = 0; i < extraMinification; i++) {
          minified = minified.replace(/(\S)\s+(\S)/g, '$1 $2')
        }
      }

      const minifiedSize = new Blob([minified]).size
      const percentReduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2)

      setOutputHTML(minified)
      setMinificationStats({ originalSize, minifiedSize, percentReduction: parseFloat(percentReduction) })
      toast.success('HTML minified successfully!')
    } catch (error) {
      console.error('Minification error:', error)
      toast.error('Error minifying HTML. Please check your input.')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`)
        return
      }

      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          setInputHTML(result)
          toast.success('File uploaded successfully!')
        }
      }
      reader.onerror = () => {
        toast.error('Error reading file. Please try again.')
      }
      reader.readAsText(file)
    }
  }

  const copyToClipboard = (text: string) => {
    if (!text.trim()) {
      toast.error('No minified HTML to copy.')
      return
    }
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleReset = () => {
    setInputHTML("")
    setOutputHTML("")
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    localStorage.removeItem('inputHTML')
    toast.success('All fields have been reset.')
  }


  const handleDownload = () => {
    if (!outputHTML.trim()) {
      toast.error('No minified HTML to download.')
      return
    }
    const blob = new Blob([outputHTML], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'minified.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Minified HTML downloaded!')
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputHTML(newValue)
    localStorage.setItem('inputHTML', newValue)
  }

  return (
    <ToolLayout
      title="HTML Minifier"
      description="Compress and optimize your HTML code with advanced minification options"
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <CardContent className="space-y-6">
          <Tabs defaultValue="minify" className="w-full">
            <TabsList className="grid w-full grid-cols-1 mb-4">
              <TabsTrigger value="minify">
                <Zap className="w-4 h-4 mr-2" />
                Minify HTML
              </TabsTrigger>
            </TabsList>
            <TabsContent value="minify">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-html" className="text-white mb-2 block">Input HTML</Label>
                  <div 
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-600 rounded-md p-4"
                  >
                    <Textarea
                      id="input-html"
                      placeholder="Enter HTML to minify or drag and drop an HTML file here..."
                      value={inputHTML}
                      onChange={handleInputChange}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="output-html" className="text-white mb-2 block">Minified HTML</Label>
                  <Textarea
                    id="output-html"
                    value={outputHTML}
                    readOnly
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-2 md:gap-4">
            <Button onClick={minifyHTML} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Zap className="w-4 h-4 mr-2" />
              Minify HTML
            </Button>
            <Button onClick={() => copyToClipboard(outputHTML)} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Copy className="w-4 h-4 mr-2" />
              Copy Minified
            </Button>
            <Button onClick={handleReset} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleDownload} className="flex-1 bg-blue-600 hover:bg-blue-700">
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

          {/* Minification Stats */}
          {minificationStats.originalSize > 0 && (
            <div className="bg-gray-700 rounded-lg p-4 mt-4">
              <h3 className="text-lg font-semibold text-white mb-2">Minification Results:</h3>
              <p className="text-gray-300">Original size: {minificationStats.originalSize} bytes</p>
              <p className="text-gray-300">Minified size: {minificationStats.minifiedSize} bytes</p>
              <p className="text-gray-300">Reduction: {minificationStats.percentReduction}%</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Minification Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-comments"
                  checked={removeComments}
                  onCheckedChange={setRemoveComments}
                />
                <Label htmlFor="remove-comments" className="text-white">Remove Comments</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-whitespace"
                  checked={removeWhitespace}
                  onCheckedChange={setRemoveWhitespace}
                />
                <Label htmlFor="remove-whitespace" className="text-white">Remove Whitespace</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-empty-attributes"
                  checked={removeEmptyAttributes}
                  onCheckedChange={setRemoveEmptyAttributes}
                />
                <Label htmlFor="remove-empty-attributes" className="text-white">Remove Empty Attributes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="shorten-boolean-attributes"
                  checked={shortenBooleanAttributes}
                  onCheckedChange={setShortenBooleanAttributes}
                />
                <Label htmlFor="shorten-boolean-attributes" className="text-white">Shorten Boolean Attributes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-optional-tags"
                  checked={removeOptionalTags}
                  onCheckedChange={setRemoveOptionalTags}
                />
                <Label htmlFor="remove-optional-tags" className="text-white">Remove Optional Tags</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="collapse-whitespace"
                  checked={collapseWhitespace}
                  onCheckedChange={setCollapseWhitespace}
                />
                <Label htmlFor="collapse-whitespace" className="text-white">Collapse Whitespace</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="minify-js"
                  checked={minifyJS}
                  onCheckedChange={setMinifyJS}
                />
                <Label htmlFor="minify-js" className="text-white">Minify JavaScript</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="minify-css"
                  checked={minifyCSS}
                  onCheckedChange={setMinifyCSS}
                />
                <Label htmlFor="minify-css" className="text-white">Minify CSS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-data-attributes"
                  checked={removeDataAttributes}
                  onCheckedChange={setRemoveDataAttributes}
                />
                <Label htmlFor="remove-data-attributes" className="text-white">Remove Data Attributes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-script-type-attributes"
                  checked={removeScriptTypeAttributes}
                  onCheckedChange={setRemoveScriptTypeAttributes}
                />
                <Label htmlFor="remove-script-type-attributes" className="text-white">Remove Script Type Attributes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="remove-style-link-type-attributes"
                  checked={removeStyleLinkTypeAttributes}
                  onCheckedChange={setRemoveStyleLinkTypeAttributes}
                />
                <Label htmlFor="remove-style-link-type-attributes" className="text-white">Remove Style/Link Type Attributes</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="aggressiveness" className="text-white block">Minification Aggressiveness</Label>
            <Slider
              id="aggressiveness"
              min={0}
              max={100}
              step={1}
              value={aggressiveness}
              onChange={(value) => setAggressiveness(value)}
              className="w-full"
            />
            <p className="text-gray-400 text-sm">Current: {aggressiveness}%</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Upload HTML File</h3>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm"
                onChange={handleFileUpload}
                className="bg-gray-700 hover:bg-gray-600 w-full sm:w-auto"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </Button>
              {fileName && (
                <span className="text-white sm:w-auto w-full text-center">{fileName}</span>
              )}
            </div>
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
          About HTML Minifier
        </h2>
        <p className="text-gray-300 mb-4">
          The HTML Minifier is a powerful tool designed to compress and optimize your HTML code by removing unnecessary characters, whitespace, and optional elements. This advanced tool helps reduce file size, improve page load times, and enhance overall website performance. Whether you're a developer, designer, or website owner, this tool ensures your HTML is lean and efficient without compromising functionality.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/HTMLMinifierPreview.png?height=400&width=600" 
            alt="Screenshot of the Enhanced HTML Minifier interface showing input area, minification options, and output" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use HTML Minifier?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter or paste your HTML code into the input area.</li>
          <li>Alternatively, upload an HTML file using the file upload feature (max {MAX_FILE_SIZE_MB}MB).</li>
          <li>Adjust the minification options according to your preferences:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Remove comments, whitespace, empty attributes</li>
              <li>Shorten boolean attributes</li>
              <li>Remove optional tags</li>
              <li>Collapse whitespace</li>
              <li>Minify inline JavaScript and CSS</li>
              <li>Remove data attributes and type attributes for script and style tags</li>
            </ul>
          </li>
          <li>Set the minification aggressiveness using the slider.</li>
          <li>Click the "Minify HTML" button to process your code.</li>
          <li>Review the minified HTML in the output area and check the minification stats.</li>
          <li>Use the "Show Preview" button to see how the minified HTML renders in the browser.</li>
          <li>Copy the minified HTML to your clipboard or download it as a file.</li>
          <li>Use the "Reset" button to clear all inputs and start over.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Advanced HTML minification with multiple optimization options</li>
          <li>Customizable minification aggressiveness</li>
          <li>File upload support with drag and drop functionality</li>
          <li>Clipboard operations (paste and copy)</li>
          <li>Download minified HTML as a file</li>
          <li>Live preview of minified HTML</li>
          <li>Detailed minification statistics</li>
          <li>Responsive design for use on various devices</li>
          <li>Local storage to save input HTML between sessions</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Best Practices
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Always keep a backup of your original HTML files before minification.</li>
          <li>Start with lower aggressiveness and gradually increase if needed.</li>
          <li>Use the preview feature to ensure the minified HTML renders correctly.</li>
          <li>Be cautious when removing optional tags, as it may affect older browsers.</li>
          <li>Consider the balance between file size reduction and code readability.</li>
          <li>Test minified HTML across different browsers and devices.</li>
          <li>Use minification as part of your overall web performance optimization strategy.</li>
          <li>Combine HTML minification with server-side compression for best results.</li>
          <li>Regularly minify your HTML, especially after making significant changes to your website.</li>
          <li>For large projects, consider integrating HTML minification into your build process.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Zap className="w-6 h-6 mr-2" />
          Advanced Usage
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Integrate this minifier into your CI/CD pipeline for automated HTML optimization.</li>
          <li>Use the minified output as part of a larger asset pipeline, combining it with CSS and JavaScript minification.</li>
          <li>Experiment with different minification settings to find the optimal balance between file size and browser compatibility for your specific project.</li>
          <li>Combine HTML minification with other performance techniques like lazy loading and code splitting for maximum optimization.</li>
          <li>Use the minifier in conjunction with HTML validation tools to ensure both optimized and valid HTML.</li>
          <li>Consider creating project-specific presets for minification options to maintain consistency across your team or different projects.</li>
        </ul>
      </div>
    </ToolLayout>
  )
}