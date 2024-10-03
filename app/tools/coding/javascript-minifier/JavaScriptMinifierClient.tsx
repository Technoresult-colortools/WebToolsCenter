'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FileMinus, Copy, RefreshCw, Upload, Download } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast, { Toaster } from 'react-hot-toast'
import { minify } from 'terser'

// Constants
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const MAX_CODE_LENGTH = 500000; // 500KB for direct input

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
      // Input validation
      if (code.length > MAX_CODE_LENGTH) {
        throw new Error('Input code exceeds maximum length limit of 500KB')
      }

      const minifyOptions = {
        compress: {
          dead_code: true,
          drop_console: false,
          drop_debugger: true,
          keep_fnames: false,
          keep_classnames: false,
          reduce_vars: true
        },
        mangle: {
          toplevel: true,
          keep_fnames: false,
          keep_classnames: false
        },
        format: {
          comments: false
        }
      };

      const result = await minify(code, minifyOptions);

      if (!result || !result.code) {
        throw new Error('Minification failed: No output generated');
      }

      return result.code;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Minification error:', error.message);
        throw new Error(`Minification failed: ${error.message}`);
      }
      throw error;
    } finally {
      setIsMinifying(false);
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(errorMessage)
      setOutputJS('')
      setMinificationStats(null)
    }
  }

  const copyToClipboard = async (text: string) => {
    if (!text.trim()) {
      toast.error('No minified JavaScript to copy.')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleReset = () => {
    setInputJS('')
    setOutputJS('')
    setFileName('')
    setMinificationStats(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Reset successful!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.name.endsWith('.js')) {
      toast.error('Please upload a JavaScript file (.js)')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 1MB limit')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (content.length > MAX_CODE_LENGTH) {
        toast.error('File content exceeds maximum length limit of 500KB')
        setFileName('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        return
      }
      setInputJS(content)
      toast.success('File uploaded successfully!')
    }

    reader.onerror = () => {
      toast.error('Error reading file')
      setFileName('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    reader.readAsText(file)
  }

  const handleDownload = () => {
    if (!outputJS.trim()) {
      toast.error('No minified JavaScript to download.')
      return
    }
    try {
      const blob = new Blob([outputJS], { type: 'application/javascript' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName ? `${fileName.replace('.js', '.min.js')}` : 'minified.js'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success('Download started!')
    } catch (error) {
      toast.error('Failed to download file')
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
              <Button 
                onClick={handleMinify} 
                className="flex-1 bg-blue-600 hover:bg-blue-700" 
                disabled={isMinifying}
              >
                <FileMinus className="w-4 h-4 mr-2" />
                {isMinifying ? 'Minifying...' : 'Minify'}
              </Button>
              <Button 
                onClick={() => copyToClipboard(outputJS)} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button 
                onClick={handleReset} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                onClick={handleDownload} 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
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
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm"
                >
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

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mt-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">About JavaScript Minifier</h2>
              <p className="text-gray-300">
                The JavaScript Minifier is a powerful tool designed to reduce the file size of your JavaScript code. It removes unnecessary characters, such as whitespace, newlines, and comments, and applies various optimizations without changing the code's functionality. This process can significantly decrease load times for web pages, improving overall site performance and user experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How to Use JavaScript Minifier?</h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Enter your JavaScript code in the input area or upload a JavaScript file (max 1MB).</li>
                <li>Click the "Minify" button to process your JavaScript using the Terser minification library.</li>
                <li>The minified JavaScript will appear in the output area.</li>
                <li>View the minification results to see how much space you've saved.</li>
                <li>Use the "Copy" button to copy the minified JavaScript to your clipboard.</li>
                <li>Use the "Download" button to save the minified JavaScript as a file.</li>
                <li>To minify a JavaScript file:</li>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Click the "Upload" button and select a JavaScript file from your device.</li>
                  <li>The file content will be loaded into the input area.</li>
                  <li>Click "Minify" to process the uploaded file.</li>
                </ul>
                <li>Use the "Reset" button to clear all inputs and outputs.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Efficient JavaScript minification using the Terser library</li>
                <li>Support for direct input and file upload</li>
                <li>Real-time minification statistics</li>
                <li>Copy to clipboard functionality</li>
                <li>Download minified JavaScript as a file</li>
                <li>File size limit of 1MB for uploads</li>
                <li>Responsive design for use on various devices</li>
                <li>Syntax error detection and reporting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Tips and Tricks</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Always keep a backup of your original JavaScript files before minifying.</li>
                <li>Test your minified JavaScript thoroughly to ensure it works as expected.</li>
                <li>Use source maps for easier debugging of minified code in production.</li>
                <li>Consider using a module bundler like Webpack or Rollup for more advanced optimizations.</li>
                <li>Combine multiple JavaScript files into one before minifying to reduce HTTP requests.</li>
                <li>Use JavaScript minification in conjunction with other web performance techniques like browser caching and CDN usage.</li>
                <li>For very large JavaScript files, consider breaking them into smaller, more manageable chunks.</li>
                <li>Regularly minify your JavaScript as part of your development workflow to maintain optimal performance.</li>
                <li>Use version control to track changes in your original and minified JavaScript files.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}