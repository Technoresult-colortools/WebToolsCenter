'use client'

import React, { useState, useRef } from 'react'
import { FileMinus, Copy, RefreshCw, Upload, Download, Settings } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast, { Toaster } from 'react-hot-toast'

export default function JavaScriptMinifier() {
  const [inputJS, setInputJS] = useState('')
  const [outputJS, setOutputJS] = useState('')
  const [fileName, setFileName] = useState('')
  const [minificationStats, setMinificationStats] = useState<{ original: number; minified: number; savings: number } | null>(null)
  const [isMinifying, setIsMinifying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const minifyJavaScript = async (code: string) => {
    setIsMinifying(true)
    try {
      const response = await fetch('https://www.toptal.com/developers/javascript-minifier/api/raw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `input=${encodeURIComponent(code)}`,
      })

      if (!response.ok) {
        throw new Error('Minification failed')
      }

      const minifiedCode = await response.text()
      return minifiedCode
    } catch (error) {
      console.error('Minification error:', error)
      throw error
    } finally {
      setIsMinifying(false)
    }
  }

  const handleMinify = async () => {
    if (!inputJS.trim()) {
      toast.error('Please enter some JavaScript to minify.')
      return
    }
    try {
      const minified = await minifyJavaScript(inputJS)
      setOutputJS(minified)
      const originalSize = inputJS.length
      const minifiedSize = minified.length
      const savings = originalSize - minifiedSize
      const savingsPercentage = ((savings / originalSize) * 100).toFixed(2)
      setMinificationStats({ original: originalSize, minified: minifiedSize, savings })
      toast.success(`JavaScript minified successfully! Reduced by ${savingsPercentage}%`)
    } catch (error) {
      toast.error('Error minifying JavaScript. Please try again.')
    }
  }

  const copyToClipboard = (text: string) => {
    if (!text.trim()) {
      toast.error('No minified JavaScript to copy.')
      return
    }
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleReset = () => {
    setInputJS('')
    setOutputJS('')
    setFileName('')
    setMinificationStats(null)
    toast.success('Reset successful!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.js')) {
        toast.error('Please upload a JavaScript file.')
        return
      }
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputJS(content)
        toast.success('File uploaded successfully!')
      }
      reader.readAsText(file)
    }
  }

  const handleDownload = () => {
    if (!outputJS.trim()) {
      toast.error('No minified JavaScript to download.')
      return
    }
    const blob = new Blob([outputJS], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'minified.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Download started!')
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">JavaScript Minifier</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <div className="space-y-6">
            <Tabs defaultValue="minify" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="minify">
                  <FileMinus className="w-4 h-4 mr-2" />
                  Minify JavaScript
                </TabsTrigger>
              </TabsList>
              <TabsContent value="minify">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-js" className="text-white mb-2 block">JavaScript to Minify</Label>
                    <Textarea
                      id="input-js"
                      placeholder="Enter JavaScript to minify..."
                      value={inputJS}
                      onChange={(e) => setInputJS(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="output-js" className="text-white mb-2 block">Minified JavaScript</Label>
                    <Textarea
                      id="output-js"
                      value={outputJS}
                      readOnly
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-wrap gap-2 md:gap-4">
              <Button onClick={handleMinify} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isMinifying}>
                <FileMinus className="w-4 h-4 mr-2" />
                {isMinifying ? 'Minifying...' : 'Minify'}
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

            {minificationStats && (
              <div className="bg-gray-700 p-4 rounded-md text-white text-sm">
                <h3 className="font-semibold mb-2">Minification Results:</h3>
                <p>Original size: {minificationStats.original} bytes</p>
                <p>Minified size: {minificationStats.minified} bytes</p>
                <p>Saved: {minificationStats.savings} bytes ({((minificationStats.savings / minificationStats.original) * 100).toFixed(2)}%)</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Upload JavaScript File</h3>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".js"
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
            <li>Click the "Minify" button to process your code using the Toptal JavaScript Minifier API.</li>
            <li>The minified JavaScript will appear in the output area.</li>
            <li>View the minification results to see how much space you've saved.</li>
            <li>Use the Copy button to copy the minified JavaScript to your clipboard.</li>
            <li>Use the Download button to save the minified JavaScript as a file.</li>
            <li>To minify a JavaScript file:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Click the "Upload" button or use the file input.</li>
              <li>Select a JavaScript file from your device.</li>
              <li>The file content will be loaded into the input area.</li>
              <li>Click "Minify" to process the uploaded file.</li>
            </ul>
            <li>Use the Reset button to clear all inputs and outputs.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8">Tips</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>This minifier uses the Toptal JavaScript Minifier API for robust minification.</li>
            <li>Minification reduces file size by removing unnecessary characters without changing functionality.</li>
            <li>Always keep a backup of your original JavaScript files.</li>
            <li>Test your minified JavaScript thoroughly to ensure it works as expected.</li>
            <li>Large JavaScript files may take longer to process.</li>
            <li>Consider using source maps for debugging minified code in production.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}