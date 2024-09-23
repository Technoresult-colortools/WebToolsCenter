'use client'

import React, { useState, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import Slider from "@/components/ui/Slider"
import { Upload, Copy, RefreshCw, FileText, Download, Zap } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
      reader.onerror = (e) => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">HTML Minifier</h1>

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
              <Button onClick={() => minifyHTML()} className="bg-green-600 hover:bg-green-700">
                <Zap className="w-4 h-4 mr-2" />
                Minify HTML
              </Button>
              <Button onClick={() => copyToClipboard(outputHTML)} className="bg-blue-600 hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Minified
              </Button>
              <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handlePasteFromClipboard} className="bg-purple-600 hover:bg-purple-700">
                <FileText className="w-4 h-4 mr-2" />
                Paste from Clipboard
              </Button>
              <Button onClick={handleDownload} className="bg-yellow-600 hover:bg-yellow-700">
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
              <div className="flex items-center space-x-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-gray-700 hover:bg-gray-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                {fileName && (
                  <span className="text-white">{fileName}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter or paste your HTML code into the Input HTML area.</li>
            <li>Adjust the minification options according to your needs.</li>
            <li>Click the "Minify HTML" button to process your code.</li>
            <li>The minified HTML will appear in the Minified HTML area.</li>
            <li>Use the Copy button to copy the minified HTML to your clipboard.</li>
            <li>To minify HTML from a file:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Click the "Upload File" button.</li>
              <li>Select an HTML file from your device.</li>
              <li>The file contents will be loaded into the input area.</li>
            </ul>
            <li>Use the Reset button to clear all inputs and outputs.</li>
            <li>Use the Paste from Clipboard button to quickly input HTML.</li>
            <li>Adjust the Minification Aggressiveness slider to control the intensity of minification.</li>
            <li>Use the Download button to save the minified HTML as a file.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-white mb-4 mt-8">Tips</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Removing comments and whitespace can significantly reduce file size.</li>
            <li>Be cautious when removing optional tags, as it may affect some older browsers.</li>
            <li>Minifying JavaScript and CSS within HTML can further reduce file size.</li>
            <li>Higher aggressiveness may result in smaller file sizes but could potentially break some layouts.</li>
            <li>Always test your minified HTML to ensure it still functions correctly.</li>
            <li>Large files may take longer to process.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}