'use client'

import React, { useState, useRef } from 'react'
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
import * as parserCss from 'prettier/plugins/postcss'
import { FileMinus, Copy, RefreshCw, Download, Upload, Info, BookOpen, Lightbulb } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools';


export default function CSSFormatter() {
  const [inputCSS, setInputCSS] = useState('')
  const [outputCSS, setOutputCSS] = useState('')
  const [isFormatting, setIsFormatting] = useState(false)
  const [useTabs, setUseTabs] = useState(false)
  const [singleQuotes, setSingleQuotes] = useState(false)
  const [sortProperties, setSortProperties] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatCSS = async () => {
    setIsFormatting(true)
    try {
      const formattedCode = await prettier.format(inputCSS, {
        parser: 'css',
        plugins: [parserCss],
        useTabs: useTabs,
        singleQuote: singleQuotes,
        cssDeclarationSorter: sortProperties ? 'alphabetical' : false,
      })
      setOutputCSS(formattedCode)
      toast.success('CSS formatted successfully!')
    } catch (error) {
      console.error('Formatting error:', error)
      toast.error('Error formatting CSS. Please check your input.')
    } finally {
      setIsFormatting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Formatted CSS copied to clipboard!')
  }

  const handleReset = () => {
    setInputCSS('')
    setOutputCSS('')
    setFileName('')
  }

  const handleDownload = () => {
    const blob = new Blob([outputCSS], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || 'formatted.css'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputCSS(content)
      }
      reader.readAsText(file)
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
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                CSS Formatter
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                 Clean up and standardize your CSS code.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
            <div className="space-y-6">
              <Tabs defaultValue="format" className="w-full">
                <TabsList className="grid w-full grid-cols-1 mb-4">
                  <TabsTrigger value="format">
                    <FileMinus className="w-4 h-4 mr-2" />
                    Format CSS
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="format">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="input-css" className="text-white mb-2 block">CSS to Format</Label>
                      <Textarea
                        id="input-css"
                        placeholder="Enter CSS to format..."
                        value={inputCSS}
                        onChange={(e) => setInputCSS(e.target.value)}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-css" className="text-white mb-2 block">Formatted CSS</Label>
                      <SyntaxHighlighter
                        language="css"
                        style={atomDark}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      >
                        {outputCSS}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useTabs"
                    checked={useTabs}
                    onCheckedChange={setUseTabs}
                  />
                  <Label htmlFor="useTabs" className="text-white">Use Tabs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="singleQuotes"
                    checked={singleQuotes}
                    onCheckedChange={setSingleQuotes}
                  />
                  <Label htmlFor="singleQuotes" className="text-white">Use Single Quotes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sortProperties"
                    checked={sortProperties}
                    onCheckedChange={setSortProperties}
                  />
                  <Label htmlFor="sortProperties" className="text-white">Sort Properties</Label>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:gap-4">
                <Button onClick={formatCSS} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isFormatting}>
                  <FileMinus className="w-4 h-4 mr-2" />
                  {isFormatting ? 'Formatting...' : 'Format'}
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
                  <Button onClick={() => fileInputRef.current?.click()} className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm">
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
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About CSS Formatter
            </h2>
            <p className="text-gray-300 mb-4">
              Our CSS Formatter is a powerful tool designed to clean up and standardize your CSS code. It uses Prettier, a popular code formatting engine, to ensure consistent and readable CSS output. Whether you're a web developer, designer, or just someone working with CSS, this tool can help you maintain clean and organized stylesheets.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use CSS Formatter?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter your CSS code in the input area or upload a CSS file.</li>
              <li>Adjust formatting options if needed (tabs, quotes, property sorting).</li>
              <li>Click the "Format" button to process your code.</li>
              <li>Review the formatted CSS in the output area.</li>
              <li>Use the Copy button to copy the formatted CSS to your clipboard.</li>
              <li>Use the Download button to save the formatted CSS as a file.</li>
              <li>Click Reset to clear all inputs and start over.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features and Tips
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Prettier-powered formatting for consistent results</li>
              <li>Customizable indentation (spaces or tabs)</li>
              <li>Option to use single or double quotes for strings</li>
              <li>Alphabetical sorting of CSS properties within selectors</li>
              <li>Syntax highlighting for easy code reading</li>
              <li>File upload support for formatting existing CSS files</li>
              <li>One-click copy and download of formatted code</li>
              <li>Always keep a backup of your original CSS files</li>
              <li>Test your formatted CSS to ensure it still applies styles correctly</li>
              <li>For large CSS files, be patient as processing may take longer</li>
              <li>Consider using a CSS linter alongside this formatter for best practices</li>
              <li>Use this tool regularly to maintain consistent code style across your projects</li>
              <li>Sorting properties can help maintain consistency but may affect cascading order</li>
              <li>For large projects, consider integrating Prettier into your development workflow</li>
            </ul>
          </div>
        </main>
       </div> 
      <Footer />
    </div>
  )
}