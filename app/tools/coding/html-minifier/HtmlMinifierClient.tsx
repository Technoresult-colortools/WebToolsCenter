'use client'

import React, { useState, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import Slider from "@/components/ui/Slider"
import { Upload, Copy, RefreshCw, FileText, Download, Zap, Info, Settings, BookOpen, Lightbulb } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'

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
  const [aggressiveness, setAggressiveness] = useState(50)
  const [minificationStats, setMinificationStats] = useState({ originalSize: 0, minifiedSize: 0, percentReduction: 0 })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE_MB = 5 // 5MB limit

  const minifyHTML = () => {
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
    toast.success('All fields have been reset.')
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputHTML(text)
      toast.success('HTML pasted from clipboard!')
    } catch (error) {
      toast.error('Failed to paste from clipboard. Please try again.')
    }
  }

  const handleDownload = () => {
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

  return (
    <ToolLayout
      title="HTML Minifier"
      description="Compress your HTML code by removing unnecessary characters like spaces, line breaks, and comments"
    >

    <Toaster position="top-right" />

            <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
              <div className="space-y-8">
                <div>
                  <Label htmlFor="input-html" className="text-white mb-2 block">Input HTML</Label>
                  <Textarea
                    id="input-html"
                    placeholder="Enter HTML to minify..."
                    value={inputHTML}
                    onChange={(e) => setInputHTML(e.target.value)}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  />
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

                <div className="flex flex-wrap gap-4">
                  <Button onClick={() => minifyHTML()} className="bg-blue-600 hover:bg-blue-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Minify HTML
                  </Button>
                  <Button onClick={() => copyToClipboard(outputHTML)} className="bg-blue-600 hover:bg-blue-700">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Minified
                  </Button>
                  <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button onClick={handlePasteFromClipboard} className="bg-blue-600 hover:bg-blue-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Paste from Clipboard
                  </Button>
                  <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Minified HTML
                  </Button>
                </div>

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
                    Max file size: {MAX_FILE_SIZE_MB}MB. Allowed types: HTML, TXT
                  </p>
                </div>

              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2" />
                About HTML Minifier
              </h2>
              <p className="text-gray-300 mb-4">
                The HTML Minifier is a powerful tool designed to compress your HTML code by removing unnecessary characters like spaces, line breaks, and comments. This tool helps reduce file size and improve page load times, making your website faster and more efficient. Whether you are a developer or a website owner, this tool ensures optimized HTML without affecting the structure or functionality of your web pages.
              </p>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Settings className="w-6 h-6 mr-2" />
                Key Features of HTML Minifier
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Minifies HTML by removing comments, spaces, and unnecessary characters.</li>
                <li>Adjustable minification options for customized results.</li>
                <li>File upload support for easy processing of large HTML files.</li>
                <li>Aggressiveness slider to control the intensity of the minification process.</li>
                <li>Copy to clipboard functionality for quick use of minified HTML.</li>
                <li>Download option to save the minified HTML as a file.</li>
                <li>Responsive design for use on any device.</li>
                <li>Reset button to clear all input and output fields.</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                How to Use HTML Minifier?
              </h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Enter or paste your HTML code into the input area.</li>
                <li>Adjust the minification options according to your preferences.</li>
                <li>Click the "Minify HTML" button to generate the minified code.</li>
                <li>The minified HTML will appear in the output area.</li>
                <li>To minify from a file, click the "Upload File" button and select an HTML file from your device.</li>
                <li>Use the "Reset" button to clear all inputs and outputs.</li>
                <li>Adjust the "Minification Aggressiveness" slider to control how intense the minification should be.</li>
                <li>Click "Download" to save the minified HTML as a file, or use the "Copy" button to copy the result to your clipboard.</li>
              </ol>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Tips and Tricks
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Removing comments and whitespace significantly reduces file size and improves performance.</li>
                <li>Be cautious when removing optional tags, as some older browsers may still require them.</li>
                <li>Minifying inline JavaScript and CSS within the HTML can further reduce the overall file size.</li>
                <li>Use higher aggressiveness for smaller file sizes, but always test to ensure the HTML structure remains intact.</li>
                <li>Test the minified HTML in different browsers to ensure compatibility, especially when using aggressive minification.</li>
                <li>For large files, consider using the file upload feature for faster processing.</li>
              </ul>
            </div>


  </ToolLayout>
  )
}