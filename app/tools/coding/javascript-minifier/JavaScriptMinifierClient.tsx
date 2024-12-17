'use client'

import React, { useState, useRef } from 'react'
import { FileMinus, Copy, RefreshCw, Upload, Download, Info, BookOpen, Lightbulb } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { toast, Toaster } from 'react-hot-toast'
import { minify } from 'terser'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'

// Constants
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const MAX_CODE_LENGTH = 500000; // 500KB for direct input

export default function JavaScriptMinifier() {
  const [inputJS, setInputJS] = useState('')
  const [outputJS, setOutputJS] = useState('')
  const [fileName, setFileName] = useState('')
  const [minificationStats, setMinificationStats] = useState<{ original: number; minified: number; savings: number } | null>(null)
  const [isMinifying, setIsMinifying] = useState(false)
  const [dropConsole, setDropConsole] = useState(false)
  const [mangle, setMangle] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const minifyJavaScript = async (code: string) => {
    setIsMinifying(true)
    try {
      if (code.length > MAX_CODE_LENGTH) {
        throw new Error('Input code exceeds maximum length limit of 500KB')
      }

      const minifyOptions = {
        compress: {
          dead_code: true,
          drop_debugger: true,
          conditionals: true,
          evaluate: true,
          booleans: true,
          loops: true,
          unused: true,
          hoist_funs: true,
          keep_fargs: false,
          hoist_vars: true,
          if_return: true,
          join_vars: true,
          drop_console: dropConsole,
          passes: 2
        },
        mangle: mangle,
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

    if (!file.name.endsWith('.js')) {
      toast.error('Please upload a JavaScript file (.js)')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

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
    <ToolLayout
      title="JavaScript Minifier"
      description="JavaScript Minifier is a powerful tool designed to reduce the file size of your JavaScript code"
    >
      <Toaster position="top-right" />
      
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

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="drop-console"
                checked={dropConsole}
                onCheckedChange={setDropConsole}
              />
              <Label htmlFor="drop-console" className="text-white">Remove console.log statements</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="mangle"
                checked={mangle}
                onCheckedChange={setMangle}
              />
              <Label htmlFor="mangle" className="text-white">Mangle variable names</Label>
            </div>
          </div>

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

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is JavaScript Minifier?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The JavaScript Minifier is a powerful and intuitive tool designed for web developers and programmers to reduce the file size of their JavaScript code. By removing unnecessary characters, such as whitespace, newlines, and comments, and applying various optimizations, it helps improve code performance and reduce load times for web pages.
          </p>
          <p className="text-gray-300 mb-4">
            This tool goes beyond basic minification, offering advanced options like console.log removal and variable name mangling. Whether you're a seasoned developer working on large-scale projects or a beginner optimizing your first JavaScript application, our Enhanced JavaScript Minifier provides the flexibility and precision you need to maintain high-performance, optimized code.
          </p>

          <div className="my-8">
            <Image 
              src="/Images/JavascriptMinifierPreview.png?height=400&width=600"  
              alt="Screenshot of the Enhanced JavaScript Minifier interface showing the code editor and minification options" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use JavaScript Minifier?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter your JavaScript code in the input area or upload a JavaScript file (max 1MB).</li>
            <li>Adjust minification options according to your preferences (console.log removal, variable name mangling).</li>
            <li>Click the "Minify" button to process your code.</li>
            <li>Review the minified JavaScript in the output area and check the minification statistics.</li>
            <li>Use the Copy button to copy the minified JavaScript to your clipboard.</li>
            <li>Use the Download button to save the minified JavaScript as a file.</li>
            <li>Click Reset to clear all inputs and start over.</li>
            <li>Experiment with different minification options to find the optimal balance between file size and code readability.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Efficient JavaScript minification using the Terser library</li>
            <li>Advanced compression options for optimal file size reduction</li>
            <li>Option to remove console.log statements</li>
            <li>Variable name mangling for further size reduction</li>
            <li>Support for direct input and file upload (up to 1MB)</li>
            <li>Real-time minification statistics</li>
            <li>Copy to clipboard functionality</li>
            <li>Download minified JavaScript as a file</li>
            <li>Responsive design for use on various devices</li>
            <li>Syntax error detection and reporting</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Performance Optimization:</strong> Reduce JavaScript file sizes for faster page loads.</li>
            <li><strong>Bandwidth Savings:</strong> Minimize data transfer, especially beneficial for mobile users.</li>
            <li><strong>Code Obfuscation:</strong> Make it harder for others to read or reverse-engineer your code.</li>
            <li><strong>Development Workflow:</strong> Integrate minification into your build process for consistent optimization.</li>
            <li><strong>CDN Preparation:</strong> Optimize files before uploading to Content Delivery Networks.</li>
            <li><strong>Legacy System Support:</strong> Reduce code size to support older systems with memory constraints.</li>
            <li><strong>A/B Testing:</strong> Quickly create minified versions of scripts for performance comparisons.</li>
            <li><strong>Open Source Contributions:</strong> Prepare minified versions of your libraries for easy distribution.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The JavaScript Minifier empowers you to optimize your JavaScript code efficiently and effectively. By providing an intuitive interface with advanced minification options, this tool bridges the gap between manual code optimization and automated minification processes. Whether you're working on small scripts or large-scale applications, the Enhanced JavaScript Minifier gives you the control and flexibility you need to ensure your code is as lean and performant as possible.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

