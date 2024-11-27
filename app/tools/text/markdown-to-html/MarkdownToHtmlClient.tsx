'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, Download, RefreshCw, Code, Info, Lightbulb, BookOpen, Zap, Type, Eye, Upload } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Image from 'next/image'

export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState('')
  const [html, setHtml] = useState('')
  const [activeTab, setActiveTab] = useState('markdown')
  const [isConverting, setIsConverting] = useState(false)
  const [autoConvert, setAutoConvert] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const convertToHtml = useCallback(async (inputMarkdown: string) => {
    if (inputMarkdown.trim() === '') {
      setHtml('')
      return
    }

    setIsConverting(true)
    try {
      const rawHtml = await marked.parse(inputMarkdown)
      const sanitizedHtml = DOMPurify.sanitize(rawHtml)
      setHtml(sanitizedHtml)
    } catch (error) {
      console.error('Error converting markdown:', error)
      toast.error('Error converting markdown')
    } finally {
      setIsConverting(false)
    }
  }, [])

  useEffect(() => {
    if (autoConvert) {
      const debounceTimer = setTimeout(() => {
        convertToHtml(markdown)
      }, 300)

      return () => clearTimeout(debounceTimer)
    }
  }, [markdown, convertToHtml, autoConvert])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(html)
      .then(() => toast.success('HTML copied to clipboard'))
      .catch(() => toast.error('Failed to copy HTML'))
  }

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('HTML file downloaded successfully')
  }

  const handleClear = () => {
    setMarkdown('')
    setHtml('')
    toast.success('Content cleared')
  }

  const handleShowPreview = () => {
    const previewWindow = window.open('', '_blank')
    if (previewWindow) {
      previewWindow.document.write(html)
      previewWindow.document.close()
    } else {
      toast.error('Unable to open preview window. Please check your pop-up blocker settings.')
    }
  }

  const handleManualConvert = () => {
    convertToHtml(markdown)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setMarkdown(content)
        if (autoConvert) {
          convertToHtml(content)
        }
      }
      reader.readAsText(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <ToolLayout
      title="Markdown to HTML Converter"
      description="Convert your Markdown to clean, properly formatted HTML with our user-friendly tool."
    >
      <Toaster position="top-right" />
      
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="auto-convert"
              checked={autoConvert}
              onCheckedChange={setAutoConvert}
            />
            <Label htmlFor="auto-convert" className="text-white">Auto Convert</Label>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-700 mb-6 rounded-xl">
              <TabsTrigger 
                value="markdown" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl"
              >
                Markdown Input
              </TabsTrigger>
              <TabsTrigger 
                value="html" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-xl"
              >
                HTML Output
              </TabsTrigger>
            </TabsList>

            <TabsContent value="markdown">
              <div className="space-y-4">
                <Label htmlFor="input-markdown" className="text-lg font-medium text-gray-200">
                  Input Markdown:
                </Label>
                <Textarea
                  id="input-markdown"
                  value={markdown}
                  onChange={handleInputChange}
                  className="w-full h-80 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  placeholder="Enter your Markdown here..."
                />
                <div className="flex justify-between items-center">
                  <Button onClick={triggerFileUpload} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Markdown File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".md,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {!autoConvert && (
                    <Button onClick={handleManualConvert} disabled={isConverting} className="bg-green-600 hover:bg-green-700 text-white">
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Convert
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="html">
              <div className="space-y-4">
                <Label htmlFor="output-html" className="text-lg font-medium text-gray-200">
                  Generated HTML:
                </Label>
                <pre id="output-html" className="bg-gray-600 rounded p-2 text-sm text-gray-300 overflow-x-auto h-80">
                  {isConverting ? 'Converting...' : html}
                </pre>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button onClick={handleCopy} disabled={!html || isConverting} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Copy className="h-5 w-5 mr-2" />
              Copy HTML
            </Button>
            <Button onClick={handleDownload} disabled={!html || isConverting} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download HTML
            </Button>
            <Button onClick={handleClear} disabled={isConverting} className="bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCw className="h-5 w-5 mr-2" />
              Clear
            </Button>
            <Button onClick={handleShowPreview} disabled={!html || isConverting} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Eye className="h-5 w-5 mr-2" />
              Preview HTML
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardContent>
          <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About the Markdown to HTML Converter
          </h2>
          <p className="text-gray-300 mb-4">
            Our Markdown to HTML Converter is a powerful, user-friendly tool designed for writers, developers, and content creators who work with Markdown and need to convert it to HTML. It provides a simple, efficient way to transform your Markdown content into clean, properly formatted HTML that's ready for web publishing.
          </p>

          <div className="my-8">
            <Image 
              src="/Images/MarkDownHTMLPreview.png?height=400&width=600" 
              alt="Screenshot of the Markdown to HTML Converter interface" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-lg"
            />
          </div>

          <h2 className="text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use Markdown to HTML Converter?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter or paste your Markdown text into the input box, or upload a Markdown file.</li>
            <li>The tool automatically converts your Markdown to HTML in real-time (if auto-convert is enabled).</li>
            <li>View the generated HTML in the output area.</li>
            <li>Use the "Preview HTML" button to see how your HTML will render in a browser.</li>
            <li>Copy the HTML to your clipboard or download it as a file.</li>
            <li>Use the "Clear" button to start over with a new conversion.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><Zap className="w-4 h-4 inline-block mr-1" /> <strong>Real-time Conversion:</strong> See HTML output instantly as you type</li>
            <li><Upload className="w-4 h-4 inline-block mr-1" /> <strong>File Upload:</strong> Easily upload Markdown files for conversion</li>
            <li><Eye className="w-4 h-4 inline-block mr-1" /> <strong>Live Preview:</strong> Visualize how your HTML will render in a browser</li>
            <li><Code className="w-4 h-4 inline-block mr-1" /> <strong>Syntax Highlighting:</strong> Easy-to-read HTML output</li>
            <li><Copy className="w-4 h-4 inline-block mr-1" /> <strong>One-click Copying:</strong> Easily copy generated HTML to clipboard</li>
            <li><Download className="w-4 h-4 inline-block mr-1" /> <strong>HTML File Download:</strong> Save your converted HTML as a file</li>
            <li><RefreshCw className="w-4 h-4 inline-block mr-1" /> <strong>Quick Reset:</strong> Clear function for easy start-over</li>
            <li><Type className="w-4 h-4 inline-block mr-1" /> <strong>No Character Limit:</strong> Convert Markdown of any length</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Practical Applications
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Blogging:</strong> Convert Markdown drafts to HTML for your blog platform</li>
            <li><strong>Documentation:</strong> Transform Markdown docs into HTML for web-based documentation</li>
            <li><strong>Web Development:</strong> Quickly generate HTML content from Markdown</li>
            <li><strong>Content Management:</strong> Streamline content creation workflows</li>
            <li><strong>Email Marketing:</strong> Create HTML emails from Markdown templates</li>
            <li><strong>Academic Writing:</strong> Convert research papers or notes from Markdown to HTML</li>
            <li><strong>Technical Writing:</strong> Easily format complex technical documents</li>
          </ul>

          <p className="text-gray-300 mt-4">
            Ready to streamline your Markdown to HTML workflow? Start using our Markdown to HTML Converter now and experience the ease of converting your content. Whether you're a blogger, developer, researcher, or content creator, our tool is here to make your work more efficient. Try it out and see how it can enhance your content creation process!
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}