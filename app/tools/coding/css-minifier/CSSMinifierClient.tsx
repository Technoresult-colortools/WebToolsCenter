'use client'

import React, { useState, useRef } from 'react'
import { FileMinus, Copy, RefreshCw, Upload, Download, Info } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/Card"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { toast, Toaster } from 'react-hot-toast'

const MAX_FILE_SIZE_MB = 2 // 2MB limit

const minifyCSS = (css: string): string => {
  return css
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/;\}/g, '}')
    .replace(/[^{}]+\{\}/g, '')
    .replace(/;;+/g, ';');
}

const beautifyCSS = (css: string): string => {
  let depth = 0;
  const beautified = css.replace(/([{}:;])/g, (match) => {
    if (match === '{') {
      depth++;
      return ' {\n' + '  '.repeat(depth);
    }
    if (match === '}') {
      depth--;
      return '\n' + '  '.repeat(depth) + '}\n' + '  '.repeat(depth);
    }
    if (match === ':') return ': ';
    if (match === ';') return ';\n' + '  '.repeat(depth);
    return match;
  });
  return beautified.trim();
}

export default function CSSMinifierBeautifier() {
  const [inputCSS, setInputCSS] = useState('')
  const [outputCSS, setOutputCSS] = useState('')
  const [fileName, setFileName] = useState('')
  const [processStats, setProcessStats] = useState<{ original: number; processed: number; savings: number } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [mode, setMode] = useState<'minify' | 'beautify'>('minify')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processCSS = async () => {
    if (!inputCSS.trim()) {
      toast.error('Please enter some CSS to process.')
      return
    }

    setIsProcessing(true)
    try {
      const processed = mode === 'minify' ? minifyCSS(inputCSS) : beautifyCSS(inputCSS)
      setOutputCSS(processed)
      
      const originalSize = inputCSS.length
      const processedSize = processed.length
      const savings = originalSize - processedSize
      const savingsPercentage = ((savings / originalSize) * 100).toFixed(2)
      
      setProcessStats({ 
        original: originalSize, 
        processed: processedSize, 
        savings 
      })
      
      toast.success(`CSS ${mode === 'minify' ? 'minified' : 'beautified'} successfully! ${mode === 'minify' ? `Reduced by ${savingsPercentage}%` : 'Formatted for readability'}`)
    } catch (error) {
      console.error(`Error ${mode}ing CSS:`, error)
      toast.error(`Error ${mode === 'minify' ? 'minifying' : 'beautifying'} CSS. Please check your input and try again.`)
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string) => {
    if (!text.trim()) {
      toast.error(`No ${mode === 'minify' ? 'minified' : 'beautified'} CSS to copy.`)
      return
    }
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleReset = () => {
    setInputCSS('')
    setOutputCSS('')
    setFileName('')
    setProcessStats(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Reset successful!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.css') && file.type !== 'text/css') {
        toast.error('Please upload a CSS file.')
        return
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`)
        return
      }
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputCSS(content)
        toast.success('File uploaded successfully!')
      }
      reader.onerror = () => {
        toast.error('Error reading file. Please try again.')
      }
      reader.readAsText(file)
    }
  }

  const handleDownload = () => {
    if (!outputCSS.trim()) {
      toast.error(`No ${mode === 'minify' ? 'minified' : 'beautified'} CSS to download.`)
      return
    }
    const blob = new Blob([outputCSS], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mode === 'minify' ? 'minified' : 'beautified'}.css`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Download started!')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        // Correct type for the event
        const event = { target: input } as React.ChangeEvent<HTMLInputElement>;
        handleFileUpload(event);
      }
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CSS {mode === 'minify' ? 'Minifier' : 'Beautifier'}</h1>
        
        <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <CardContent className="space-y-6">
            <Tabs value={mode} onValueChange={(value: string) => setMode(value as 'minify' | 'beautify')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="minify">
                  <FileMinus className="w-4 h-4 mr-2" />
                  Minify CSS
                </TabsTrigger>
                <TabsTrigger value="beautify">
                  <Info className="w-4 h-4 mr-2" />
                  Beautify CSS
                </TabsTrigger>
              </TabsList>
              <TabsContent value="minify">
                <div className="space-y-4">
                  <Label htmlFor="input-css" className="text-white mb-2 block">CSS to Minify</Label>
                  <div 
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-600 rounded-md p-4"
                  >
                    <Textarea
                      id="input-css"
                      placeholder="Enter CSS to minify..."
                      value={inputCSS}
                      onChange={(e) => setInputCSS(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="beautify">
                <div className="space-y-4">
                  <Label htmlFor="input-css" className="text-white mb-2 block">CSS to Beautify</Label>
                  <div 
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="border-2 border-dashed border-gray-600 rounded-md p-4"
                  >
                    <Textarea
                      id="input-css"
                      placeholder="Enter CSS to beautify..."
                      value={inputCSS}
                      onChange={(e) => setInputCSS(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div>
              <Label htmlFor="output-css" className="text-white mb-2 block">{mode === 'minify' ? 'Minified' : 'Beautified'} CSS</Label>
              <Textarea
                id="output-css"
                value={outputCSS}
                readOnly
                className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Button onClick={processCSS} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isProcessing}>
                <FileMinus className="w-4 h-4 mr-2" />
                {isProcessing ? `${mode === 'minify' ? 'Minifying' : 'Beautifying'}...` : mode === 'minify' ? 'Minify' : 'Beautify'}
              </Button>
              <Button onClick={() => copyToClipboard(outputCSS)} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button onClick={handleReset} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleDownload} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            {processStats && (
              <div className="bg-gray-700 p-4 rounded-md text-white text-sm">
                <h3 className="font-semibold mb-2">Processing Results:</h3>
                <p>Original size: {processStats.original} bytes</p>
                <p>{mode === 'minify' ? 'Minified' : 'Beautified'} size: {processStats.processed} bytes</p>
                {mode === 'minify' && (
                  <p>Saved: {processStats.savings} bytes ({((processStats.savings / processStats.original) * 100).toFixed(2)}%)</p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Upload CSS File</h3>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".css"
                  onChange={handleFileUpload}
                  className="bg-gray-700 text-white border-gray-600"
                  ref={fileInputRef}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                {fileName && (
                  <span className="text-white bg-gray-700 px-3 py-1 rounded-md">{fileName}</span>
                )}
              </div>
              <p className="text-sm text-gray-400 flex items-center">
                <Info className="w-4 h-4 mr-1" />
                Max file size: {MAX_FILE_SIZE_MB}MB. Allowed type: CSS
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mt-8">
          <CardContent className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">About CSS Minifier and Beautifier</h2>
              <p className="text-gray-300">
                This tool offers two main functions: CSS Minification and CSS Beautification. The CSS Minifier reduces the file size of your CSS stylesheets by removing unnecessary characters, while the CSS Beautifier formats your CSS code for improved readability. Both functions can significantly improve your workflow and website performance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How to Use CSS Minifier and Beautifier?</h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Choose between "Minify CSS" or "Beautify CSS" using the tabs.</li>
                <li>Enter your CSS code in the input area or upload a CSS file (max {MAX_FILE_SIZE_MB}MB).</li>
                <li>Click the "Minify" or "Beautify" button to process your CSS.</li>
                <li>The processed CSS will appear in the output area.</li>
                <li>View the processing results to see the changes in file size.</li>
                <li>Use the "Copy" button to copy the processed CSS to your clipboard.</li>
                <li>Use the "Download" button to save the processed CSS as a file.</li>
                <li>To process a CSS file:</li>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Click the "Upload" button and select a CSS file from your device.</li>
                  <li>The file content will be loaded into the input area.</li>
                  <li>Click "Minify" or "Beautify" to process the uploaded file.</li>
                </ul>
                <li>Use the "Reset" button to clear all inputs and outputs.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>CSS Minification for reducing file size</li>
                <li>CSS Beautification for improving code readability</li>
                <li>Support for direct input and file upload</li>
                <li>Real-time processing statistics</li>
                <li>Copy to clipboard functionality</li>
                <li>Download processed CSS as a file</li>
                <li>File size limit of {MAX_FILE_SIZE_MB}MB for uploads</li>
                <li>Drag and drop file upload support</li>
                <li>Responsive design for use on various devices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Tips and Tricks</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Always keep a backup of your original CSS files before processing.</li>
                <li>Use minification for production code to improve load times.</li>
                <li>Use beautification during development for easier code maintenance.</li>
                <li>Test your minified CSS thoroughly to ensure it works as expected.</li>
                <li>Consider using a CSS preprocessor like Sass or Less for more advanced optimizations.</li>
                <li>Combine multiple CSS files into one before minifying to reduce HTTP requests.</li>
                <li>Use CSS compression in conjunction with other web performance techniques like browser caching and CDN usage.</li>
                <li>For very large CSS files, consider breaking them into smaller, more manageable chunks.</li>
                <li>Regularly minify your CSS as part of your development workflow to maintain optimal performance.</li>
                <li>Use version control to track changes in your original, minified, and beautified CSS files.</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}