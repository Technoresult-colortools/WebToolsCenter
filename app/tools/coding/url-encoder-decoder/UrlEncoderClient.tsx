'use client'

import React, { useState, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, Unlink, Upload, Copy, RefreshCw, Check, FileText, Info, Settings, BookOpen, Lightbulb } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Sidebar from '@/components/sidebarTools';

export default function URLEncoderDecoder() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const [fileName, setFileName] = useState("")
  const [encodeMode, setEncodeMode] = useState<'standard' | 'all'>('standard')
  const [decodeMode, setDecodeMode] = useState<'standard' | 'plus'>('standard')
  const [autoTrim, setAutoTrim] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE_MB = 2 // 2MB limit

  const handleEncode = () => {
    try {
      let encoded = inputText
      if (autoTrim) {
        encoded = encoded.trim()
      }
      
      const lines = encoded.split('\n')
      const encodedLines = lines.map(line => {
        if (encodeMode === 'all') {
          return encodeURIComponent(line)
        } else {
          return line.replace(/[^a-zA-Z0-9-._~]/g, (char) => {
            return '%' + char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()
          })
        }
      })

      setOutputText(encodedLines.join('\n'))
      toast.success('URL encoded successfully!')
    } catch (error) {
      toast.error('Error encoding URL. Please check your input.')
    }
  }

  const handleDecode = () => {
    try {
      let decoded = inputText
      if (autoTrim) {
        decoded = decoded.trim()
      }

      const lines = decoded.split('\n')
      const decodedLines = lines.map(line => {
        if (decodeMode === 'plus') {
          line = line.replace(/\+/g, ' ')
        }
        return decodeURIComponent(line)
      })

      setOutputText(decodedLines.join('\n'))
      toast.success('URL decoded successfully!')
    } catch (error) {
      toast.error('Error decoding URL. Please check your input.')
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
          detectEncoding(result)
          toast.success('File uploaded successfully!')
        }
      }
      reader.onerror = () => {
        toast.error('Error reading file. Please try again.')
      }
      reader.readAsText(file)
    }
  }

  const detectEncoding = (text: string) => {
    // Simple heuristic: if the text contains '%' followed by two hex digits, assume it's encoded
    const encodedRegex = /%[0-9A-Fa-f]{2}/
    if (encodedRegex.test(text)) {
      setActiveTab('decode')
    } else {
      setActiveTab('encode')
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

  const validateURL = () => {
    const urls = inputText.split('\n').filter(url => url.trim() !== '')
    const validUrls = urls.filter(url => {
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    })
    toast.success(`${validUrls.length} out of ${urls.length} URLs are valid.`)
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputText(text)
      detectEncoding(text)
      toast.success('Text pasted from clipboard!')
    } catch (error) {
      toast.error('Failed to paste from clipboard. Please try again.')
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
                URL Encoder/Decoder
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Convert special characters in URLs into their encoded forms and vice versa.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="space-y-8">
              <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="encode">
                    <Link className="w-4 h-4 mr-2" />
                    Encode
                  </TabsTrigger>
                  <TabsTrigger value="decode">
                    <Unlink className="w-4 h-4 mr-2" />
                    Decode
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="encode">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="input-text" className="text-white mb-2 block">URL(s) to Encode (one per line)</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter URL(s) to encode..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-text" className="text-white mb-2 block">Encoded URL(s)</Label>
                      <Textarea
                        id="output-text"
                        value={outputText}
                        readOnly
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <Button onClick={handleEncode} className="bg-blue-600 hover:bg-blue-700">
                      Encode URL(s)
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="decode">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="input-text" className="text-white mb-2 block">Encoded URL(s) to Decode (one per line)</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter encoded URL(s) to decode..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-text" className="text-white mb-2 block">Decoded URL(s)</Label>
                      <Textarea
                        id="output-text"
                        value={outputText}
                        readOnly
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <Button onClick={handleDecode} className="bg-blue-600 hover:bg-blue-700">
                      Decode URL(s)
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-wrap gap-4">
                <Button onClick={() => copyToClipboard(outputText)} className="bg-blue-600 hover:bg-blue-700">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy {activeTab === 'encode' ? 'Encoded' : 'Decoded'}
                </Button>
                <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={validateURL} className="bg-blue-600 hover:bg-blue-700">
                  <Check className="w-4 h-4 mr-2" />
                  Validate URL(s)
                </Button>
                <Button onClick={handlePasteFromClipboard} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Paste from Clipboard
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Options</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-trim"
                    checked={autoTrim}
                    onCheckedChange={setAutoTrim}
                  />
                  <Label htmlFor="auto-trim" className="text-white">Auto Trim Whitespace</Label>
                </div>
                {activeTab === 'encode' && (
                  <div>
                    <Label htmlFor="encode-mode" className="text-white mb-2 block">Encode Mode</Label>
                    <Select value={encodeMode} onValueChange={(value: 'standard' | 'all') => setEncodeMode(value)}>
                      <SelectTrigger id="encode-mode" className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select encode mode" />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectItem value="standard">Standard (RFC 3986)</SelectItem>
                        <SelectItem value="all">Encode All Characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {activeTab === 'decode' && (
                  <div>
                    <Label htmlFor="decode-mode" className="text-white mb-2 block">Decode Mode</Label>
                    <Select value={decodeMode} onValueChange={(value: 'standard' | 'plus') => setDecodeMode(value)}>
                      <SelectTrigger id="decode-mode" className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select decode mode" />
                      </SelectTrigger>
                      <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="plus">Decode '+' as Space</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Upload File</h3>
                <div className="flex items-center space-x-4">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.html,.htm,.xml,.json"
                    onChange={handleFileUpload}
                    className="bg-gray-700 hover:bg-gray-600"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  {fileName && (
                    <span className="text-white">{fileName}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About URL Encoder/Decoder
            </h2>
            <p className="text-gray-300 mb-4">
              The URL Encoder/Decoder is a tool designed to convert special characters in URLs into their encoded forms (URL encoding) or decode them back into readable characters. URL encoding is essential for making URLs compatible with different browsers and ensuring safe transmission over the web. This tool supports bulk processing and file uploads for convenience.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Key Features of URL Encoder/Decoder
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Encode URLs to convert special characters into encoded forms.</li>
              <li>Decode encoded URLs back into readable text.</li>
              <li>Bulk processing support for multiple URLs at once.</li>
              <li>File upload support for batch processing of URLs or encoded content.</li>
              <li>Automatic detection of encoded content for appropriate processing.</li>
              <li>Copy and paste functionality for quick input/output handling.</li>
              <li>Option to trim whitespace for cleaner results.</li>
              <li>Customizable encoding and decoding modes for flexibility.</li>
              <li>URL validation feature to ensure the input URLs are correct.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use URL Encoder/Decoder?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Choose between Encode and Decode tabs based on your needs.</li>
              <li>Enter your URL(s) or encoded URL(s) in the input area for processing.</li>
              <li>Click the "Encode" or "Decode" button to get the result.</li>
              <li>To upload a file, click the "Upload File" button and select a text file (max 2MB) containing URLs or encoded content.</li>
              <li>Adjust your settings for encoding/decoding:</li>
              <ul className="list-disc list-inside ml-6">
                <li>Toggle "Auto Trim Whitespace" to clean up input.</li>
                <li>Select between "Standard" or "Encode All Characters" modes for encoding.</li>
                <li>Select between "Standard" or "Decode '+' as Space" modes for decoding.</li>
              </ul>
              <li>Click the "Validate URL(s)" button to check the validity of your URLs.</li>
              <li>Use the "Copy" button to quickly copy the result to your clipboard.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use the "Auto Trim Whitespace" feature to ensure clean input, especially when pasting URLs from other sources.</li>
              <li>For security purposes, always validate URLs before using them in production environments.</li>
              <li>Use the "Encode All Characters" mode to safely encode special characters not normally encoded by default.</li>
              <li>When decoding, enable the "Decode '+' as Space" option for URLs where '+' represents a space character.</li>
              <li>Use bulk processing for large lists of URLs to save time.</li>
              <li>Check the encoding format of files you upload to ensure proper decoding of special characters.</li>
            </ul>
          </div>
          </main>
         </div> 
      <Footer />
    </div>
  )
}