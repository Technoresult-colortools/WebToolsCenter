'use client'

import React, { useState, useRef } from 'react'
import { FileMinus, Copy, RefreshCw, Upload, Download } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input  from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast, { Toaster } from 'react-hot-toast'

export default function CSSMinifier() {
  const [inputCSS, setInputCSS] = useState('')
  const [outputCSS, setOutputCSS] = useState('')
  const [fileName, setFileName] = useState('')
  const [minificationStats, setMinificationStats] = useState<{ original: number; minified: number; savings: number } | null>(null)
  const [isMinifying, setIsMinifying] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const minifyCSS = async (css: string) => {
    setIsMinifying(true)
    try {
      const response = await fetch('https://www.toptal.com/developers/cssminifier/api/raw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `input=${encodeURIComponent(css)}`,
      })

      if (!response.ok) {
        throw new Error('Minification failed')
      }

      const minifiedCSS = await response.text()
      return minifiedCSS
    } catch (error) {
      console.error('Minification error:', error)
      throw error
    } finally {
      setIsMinifying(false)
    }
  }

  const handleMinify = async () => {
    if (!inputCSS.trim()) {
      toast.error('Please enter some CSS to minify.')
      return
    }
    try {
      const minified = await minifyCSS(inputCSS)
      setOutputCSS(minified)
      const originalSize = inputCSS.length
      const minifiedSize = minified.length
      const savings = originalSize - minifiedSize
      const savingsPercentage = ((savings / originalSize) * 100).toFixed(2)
      setMinificationStats({ original: originalSize, minified: minifiedSize, savings })
      toast.success(`CSS minified successfully! Reduced by ${savingsPercentage}%`)
    } catch (error) {
      toast.error('Error minifying CSS. Please try again.')
    }
  }

  const copyToClipboard = (text: string) => {
    if (!text.trim()) {
      toast.error('No minified CSS to copy.')
      return
    }
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleReset = () => {
    setInputCSS('')
    setOutputCSS('')
    setFileName('')
    setMinificationStats(null)
    toast.success('Reset successful!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'text/css') {
        toast.error('Please upload a CSS file.')
        return
      }
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputCSS(content)
        toast.success('File uploaded successfully!')
      }
      reader.readAsText(file)
    }
  }

  const handleDownload = () => {
    if (!outputCSS.trim()) {
      toast.error('No minified CSS to download.')
      return
    }
    const blob = new Blob([outputCSS], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'minified.css'
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
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">CSS Minifier</h1>
        
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
          <div className="space-y-6">
            <Tabs defaultValue="minify" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-4">
                <TabsTrigger value="minify">
                  <FileMinus className="w-4 h-4 mr-2" />
                  Minify CSS
                </TabsTrigger>
              </TabsList>
              <TabsContent value="minify">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-css" className="text-white mb-2 block">CSS to Minify</Label>
                    <Textarea
                      id="input-css"
                      placeholder="Enter CSS to minify..."
                      value={inputCSS}
                      onChange={(e) => setInputCSS(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="output-css" className="text-white mb-2 block">Minified CSS</Label>
                    <Textarea
                      id="output-css"
                      value={outputCSS}
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
              <Button onClick={() => copyToClipboard(outputCSS)} className="flex-1 bg-green-600 hover:bg-green-700">
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
              <h3 className="text-lg font-semibold text-white">Upload CSS File</h3>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".css"
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
            <li>Enter your CSS code in the input area or upload a CSS file.</li>
            <li>Click the "Minify" button to process your code using the Toptal CSS Minifier API.</li>
            <li>The minified CSS will appear in the output area.</li>
            <li>View the minification results to see how much space you've saved.</li>
            <li>Use the Copy button to copy the minified CSS to your clipboard.</li>
            <li>Use the Download button to save the minified CSS as a file.</li>
            <li>To minify a CSS file:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Click the "Upload" button or use the file input.</li>
              <li>Select a CSS file from your device.</li>
              <li>The file content will be loaded into the input area.</li>
              <li>Click "Minify" to process the uploaded file.</li>
            </ul>
            <li>Use the Reset button to clear all inputs and outputs.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8">Tips</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>This minifier uses the Toptal CSS Minifier API for robust minification.</li>
            <li>Minification removes comments and unnecessary whitespace to reduce file size.</li>
            <li>Always keep a backup of your original CSS files.</li>
            <li>Test your minified CSS thoroughly to ensure it works as expected.</li>
            <li>Large CSS files may take longer to process due to API limitations.</li>
            <li>Consider using a CSS preprocessor for more advanced optimizations.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  )
}