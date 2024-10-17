'use client'

import React, { useState, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileLock, FileLock2, Upload, Copy, RefreshCw, Check, Info, BookOpen, Lightbulb } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/Card"
import Sidebar from '@/components/sidebarTools';

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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-12 text-center px-4">
            <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                HTML Encoder/Decoder
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Convert HTML special characters to their corresponding HTML entities and vice versa.
            </p>
          </div>

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

          <Card className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mt-8">
            <CardContent className="space-y-8">
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                  <Info className="w-6 h-6 mr-2" />
                  About HTML Encoder and Decoder
                </h2>
                <p className="text-gray-300">
                  The HTML Encoder and Decoder is a tool designed to convert HTML special characters to their corresponding HTML entities and vice versa. This process is crucial for ensuring that HTML code is displayed correctly in web browsers and for preventing potential security vulnerabilities such as cross-site scripting (XSS) attacks.
                </p>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center"><BookOpen className="w-6 h-6 mr-2" />How to Use HTML Endode/Decoder?</h2>
                <ol className="list-decimal list-inside text-gray-300 space-y-2">
                  <li>Choose between the Encode and Decode tabs based on your needs.</li>
                  <li>Enter or paste your HTML content into the input text area.</li>
                  <li>Click the "Encode HTML" or "Decode HTML" button to process the text.</li>
                  <li>The result will appear in the output text area.</li>
                  <li>Use the "Copy Result" button to copy the processed text to your clipboard.</li>
                  <li>To process an HTML file:</li>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Click the "Upload File" button and select an HTML or TXT file (max {MAX_FILE_SIZE_MB}MB).</li>
                    <li>The file content will be loaded into the input area.</li>
                    <li>The tool will automatically switch to the appropriate tab (Encode/Decode) based on the content.</li>
                  </ul>
                  <li>Use the "Reset" button to clear all inputs and outputs.</li>
                  <li>Click "Validate HTML" to check if the input HTML is valid.</li>
                </ol>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center"><Lightbulb className="w-6 h-6 mr-2" />Key Features</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Encode HTML special characters to their corresponding entities</li>
                  <li>Decode HTML entities back to their original characters</li>
                  <li>Option to preserve newlines during encoding</li>
                  <li>Option to encode quotation marks</li>
                  <li>File upload support for easy processing of HTML files</li>
                  <li>Automatic detection of encoded content for appropriate processing</li>
                  <li>HTML validation feature to check input validity</li>
                  <li>Copy to clipboard functionality for quick use of results</li>
                  <li>Responsive design for use on various devices</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center"><Lightbulb className="w-6 h-6 mr-2" />Tips and Tricks</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Use the "Preserve Newlines" option when encoding to maintain the original formatting of your HTML.</li>
                  <li>Enable "Encode Quotes" when you need to include the encoded HTML within attribute values.</li>
                  <li>For large HTML files, consider breaking them into smaller chunks to improve processing speed.</li>
                  <li>Always validate your HTML after decoding to ensure it's structurally correct.</li>
                  <li>When working with user-generated content, always encode it before displaying to prevent XSS attacks.</li>
                  <li>Use the file upload feature to quickly process entire HTML documents or templates.</li>
                  <li>Remember that encoding increases the length of the text, which may affect storage or transmission limits.</li>
                  <li>Regularly validate your HTML to catch and fix any syntax errors early in your development process.</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </main>
       </div> 
      <Footer />
    </div>
  )
}