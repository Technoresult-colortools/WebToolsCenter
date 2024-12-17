'use client'

import React, { useState, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileLock, FileLock2, Upload, Copy, RefreshCw, Check, Info, BookOpen, Lightbulb, Zap } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/Card"
import ToolLayout from '@/components/ToolLayout'
import NextImage from 'next/image'

const MAX_FILE_SIZE_MB = 2 // 2MB limit

export default function HTMLEncoderDecoder() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const [fileName, setFileName] = useState("")
  const [preserveNewlines, setPreserveNewlines] = useState(true)
  const [encodeQuotes, setEncodeQuotes] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const encodeHTML = (text: string): string => {
    let encoded = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    if (encodeQuotes) {
      encoded = encoded
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }

    if (!preserveNewlines) {
      encoded = encoded.replace(/\n/g, '')
    }

    return encoded
  }

  const decodeHTML = (text: string): string => {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }

  const handleProcess = () => {
    try {
      const result = activeTab === 'encode' ? encodeHTML(inputText) : decodeHTML(inputText)
      setOutputText(result)
      toast.success(`HTML ${activeTab}d successfully!`)
    } catch (error) {
      toast.error(`Error ${activeTab}ing HTML. Please check your input.`)
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
          setInputText(result)
          // Determine if the content is likely encoded HTML
          if (result.includes('&lt;') || result.includes('&gt;') || result.includes('&amp;')) {
            setActiveTab('decode')
          } else {
            setActiveTab('encode')
          }
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
    setInputText("")
    setOutputText("")
    setFileName("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    toast.success('All fields have been reset.')
  }

  const validateHTML = () => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(inputText, 'text/html')
    const errors = doc.getElementsByTagName('parsererror')
    if (errors.length > 0) {
      toast.error('Invalid HTML detected. Please check your input.')
    } else {
      toast.success('HTML is valid!')
    }
  }

  return (
    <ToolLayout
      title="HTML Encoder/Decoder"
      description="Convert HTML special characters to their corresponding HTML entities and vice versa"
    >
      <Toaster position="top-right" />

      <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <CardContent className="space-y-8">
          <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="encode">
                <FileLock className="w-4 h-4 mr-2" />
                Encode
              </TabsTrigger>
              <TabsTrigger value="decode">
                <FileLock2 className="w-4 h-4 mr-2" />
                Decode
              </TabsTrigger>
            </TabsList>
            <TabsContent value="encode">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-white mb-2 block">HTML to Encode</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Enter HTML to encode..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  />
                </div>
                <div>
                  <Label htmlFor="output-text" className="text-white mb-2 block">Encoded HTML</Label>
                  <Textarea
                    id="output-text"
                    value={outputText}
                    readOnly
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="decode">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-white mb-2 block">Encoded HTML to Decode</Label>
                  <Textarea
                    id="input-text"
                    placeholder="Enter encoded HTML to decode..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  />
                </div>
                <div>
                  <Label htmlFor="output-text" className="text-white mb-2 block">Decoded HTML</Label>
                  <Textarea
                    id="output-text"
                    value={outputText}
                    readOnly
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleProcess} className="bg-blue-600 hover:bg-blue-700">
              {activeTab === 'encode' ? 'Encode' : 'Decode'} HTML
            </Button>
            <Button onClick={() => copyToClipboard(outputText)} className="bg-blue-600 hover:bg-blue-700">
              <Copy className="w-4 h-4 mr-2" />
              Copy Result
            </Button>
            <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={validateHTML} className="bg-blue-600 hover:bg-blue-700">
              <Check className="w-4 h-4 mr-2" />
              Validate HTML
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Options</h3>
            <div className="flex items-center space-x-2">
              <Switch
                id="preserve-newlines"
                checked={preserveNewlines}
                onCheckedChange={setPreserveNewlines}
              />
              <Label htmlFor="preserve-newlines" className="text-white">Preserve Newlines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="encode-quotes"
                checked={encodeQuotes}
                onCheckedChange={setEncodeQuotes}
              />
              <Label htmlFor="encode-quotes" className="text-white">Encode Quotes</Label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Upload File</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".html,.txt"
                onChange={handleFileUpload}
                className="bg-gray-700 text-white border-gray-600"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 px-4 py-2 rounded-md shadow-lg w-full sm:w-auto"
              >
                <Upload className="w-5 h-5" />
                <span>Upload File</span>
              </Button>
              {fileName && (
                <span className="text-white bg-gray-700 px-3 py-1 rounded-md">{fileName}</span>
              )}
            </div>
            <p className="text-sm text-gray-400 flex items-center">
              <Info className="w-4 h-4 mr-1" />
              Max file size: {MAX_FILE_SIZE_MB}MB. Allowed types: HTML, TXT
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About HTML Encoder and Decoder
        </h2>
        <p className="text-gray-300 mb-4">
          Our HTML Encoder and Decoder is a powerful tool designed to convert HTML special characters to their corresponding HTML entities and vice versa. This process is crucial for ensuring that HTML code is displayed correctly in web browsers and for preventing potential security vulnerabilities such as cross-site scripting (XSS) attacks. Whether you're a web developer, content creator, or just someone working with HTML, this tool can help you maintain clean and secure HTML content.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/HTMLEncoderPreview.png?height=400&width=600" 
            alt="Screenshot of the HTML Encoder and Decoder interface showing input area, options, and output" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use HTML Encoder and Decoder?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Choose between the "Encode" and "Decode" tabs based on your needs.</li>
          <li>Enter or paste your HTML content into the input text area.</li>
          <li>Adjust the encoding options if needed:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Preserve Newlines: Keep line breaks in the encoded output.</li>
              <li>Encode Quotes: Convert quotation marks to their HTML entities.</li>
            </ul>
          </li>
          <li>Click the "Encode HTML" or "Decode HTML" button to process the text.</li>
          <li>Review the processed HTML in the output area.</li>
          <li>Use the "Copy Result" button to copy the processed HTML to your clipboard.</li>
          <li>To process an HTML file:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Click the "Upload File" button and select an HTML or TXT file (max 2MB).</li>
              <li>The file content will be loaded into the input area automatically.</li>
              <li>The tool will switch to the appropriate tab (Encode/Decode) based on the content.</li>
            </ul>
          </li>
          <li>Use the "Reset" button to clear all inputs and outputs and start over.</li>
          <li>Click "Validate HTML" to check if the input HTML is structurally valid.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Encode HTML special characters to their corresponding entities</li>
          <li>Decode HTML entities back to their original characters</li>
          <li>Option to preserve newlines during encoding for maintaining format</li>
          <li>Option to encode quotation marks for use within attributes</li>
          <li>File upload support for easy processing of HTML files</li>
          <li>Automatic detection of encoded content for appropriate processing</li>
          <li>HTML validation feature to check input validity</li>
          <li>Copy to clipboard functionality for quick use of results</li>
          <li>Responsive design for use on various devices and screen sizes</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Best Practices and Tips
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Always encode user-generated content before displaying it on your website to prevent XSS attacks.</li>
          <li>Use the "Preserve Newlines" option when encoding to maintain the original formatting of your HTML.</li>
          <li>Enable "Encode Quotes" when you need to include the encoded HTML within attribute values.</li>
          <li>For large HTML files, consider breaking them into smaller chunks to improve processing speed.</li>
          <li>Always validate your HTML after decoding to ensure it's structurally correct.</li>
          <li>Use the file upload feature to quickly process entire HTML documents or templates.</li>
          <li>Remember that encoding increases the length of the text, which may affect storage or transmission limits.</li>
          <li>Regularly validate your HTML to catch and fix any syntax errors early in your development process.</li>
          <li>When working with dynamic content, consider implementing server-side encoding for better performance.</li>
          <li>Use this tool in conjunction with other security measures like Content Security Policy (CSP) for comprehensive protection.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Zap className="w-6 h-6 mr-2" />
          Advanced Usage
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Integrate this tool into your development workflow for consistent HTML encoding practices.</li>
          <li>Use the encoded output in email templates to ensure proper rendering across different email clients.</li>
          <li>Implement the encoding logic in your backend services for server-side processing of user inputs.</li>
          <li>Combine HTML encoding with URL encoding for handling complex query parameters in web applications.</li>
          <li>Utilize the tool for encoding HTML snippets in JSON payloads for API communications.</li>
          <li>Create custom scripts to batch process multiple HTML files using the core encoding/decoding functions.</li>
          <li>Experiment with different encoding strategies to find the best balance between security and performance for your specific use case.</li>
        </ul>
      </div>
    </ToolLayout>
  )
}