'use client'

import React, { useState, useRef } from 'react'
import { FileMinus, Copy, RefreshCw, Upload, Download, Info, BookOpen, Settings, Lightbulb, Zap } from 'lucide-react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/Card"
import { toast, Toaster } from 'react-hot-toast'
import ToolLayout from '@/components/ToolLayout'
import NextImage from 'next/image'

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

export default function CSSMinifier() {
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
        
        const event = { target: input } as React.ChangeEvent<HTMLInputElement>;
        handleFileUpload(event);
      }
    }
  };

  return (
    <ToolLayout
      title={`CSS ${mode === 'minify' ? 'Minifier' : 'Beautifier'}`}
      description="Optimize your CSS with our powerful minification and beautification tool"
    >
      <Toaster position="top-right" />
      
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

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About CSS Minifier and Beautifier
        </h2>
        <p className="text-gray-300 mb-4">
          Our CSS Minifier and Beautifier is a powerful tool designed to optimize and format your CSS code. It offers two main functions: CSS Minification for reducing file size, and CSS Beautification for improving code readability. Whether you're a web developer looking to optimize your stylesheets or a designer wanting to clean up your CSS, this tool can significantly enhance your workflow and website performance.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/CSSMinifierPreview.png?height=400&width=600" 
            alt="Screenshot of the CSS Minifier and Beautifier interface showing input area, options, and output" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use CSS Minifier and Beautifier?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Choose between "Minify CSS" or "Beautify CSS" using the tabs at the top.</li>
          <li>Enter your CSS code in the input area or upload a CSS file (max 2MB).</li>
          <li>Click the "Minify" or "Beautify" button to process your CSS.</li>
          <li>Review the processed CSS in the output area below.</li>
          <li>Check the processing results to see the changes in file size.</li>
          <li>Use the "Copy" button to copy the processed CSS to your clipboard.</li>
          <li>Use the "Download" button to save the processed CSS as a file.</li>
          <li>To process a CSS file:
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li>Click the "Upload" button or drag and drop a CSS file into the input area.</li>
              <li>The file content will be loaded into the input area automatically.</li>
              <li>Click "Minify" or "Beautify" to process the uploaded file.</li>
            </ul>
          </li>
          <li>Use the "Reset" button to clear all inputs and outputs and start over.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>CSS Minification for reducing file size and improving load times.</li>
          <li>CSS Beautification for improving code readability and maintainability.</li>
          <li>Support for direct input and file upload (drag and drop supported).</li>
          <li>Real-time processing statistics showing file size reduction.</li>
          <li>Copy to clipboard functionality for quick use of processed CSS.</li>
          <li>Download processed CSS as a file for easy integration into your project.</li>
          <li>File size limit of 2MB for uploads to ensure optimal performance.</li>
          <li>Responsive design for use on various devices and screen sizes.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Best Practices
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Always keep a backup of your original CSS files before processing.</li>
          <li>Use minification for production code to improve website load times.</li>
          <li>Use beautification during development for easier code maintenance and debugging.</li>
          <li>Test your minified CSS thoroughly to ensure it works as expected in all browsers.</li>
          <li>Consider using a CSS preprocessor like Sass or Less for more advanced optimizations.</li>
          <li>Combine multiple CSS files into one before minifying to reduce HTTP requests.</li>
          <li>Use CSS compression in conjunction with other web performance techniques like browser caching and CDN usage.</li>
          <li>For very large CSS files, consider breaking them into smaller, more manageable chunks.</li>
          <li>Regularly minify your CSS as part of your development workflow to maintain optimal performance.</li>
          <li>Use version control to track changes in your original, minified, and beautified CSS files.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Zap className="w-6 h-6 mr-2" />
          Advanced Usage
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Integrate this tool into your build process for automatic CSS optimization.</li>
          <li>Use the minified output as part of a larger asset pipeline, combining it with JavaScript and HTML minification.</li>
          <li>Experiment with different levels of minification to find the best balance between file size and readability for your project.</li>
          <li>Utilize the beautified output for code reviews and collaborative development.</li>
          <li>Compare the minified output with other CSS optimization tools to ensure you're getting the best results.</li>
          <li>Consider creating project-specific CSS formatting rules and use the beautifier to enforce them across your team.</li>
        </ul>
      </div>
    </ToolLayout>
  )
}