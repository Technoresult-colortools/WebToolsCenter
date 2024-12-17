'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, Unlink, Upload, Copy, RefreshCw, Check, FileText, Info, Settings, BookOpen, Lightbulb, Download, Eye, EyeOff, AlertTriangle, Shield } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"


export default function URLEncoderDecoder() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const [fileName, setFileName] = useState("")
  const [encodeMode, setEncodeMode] = useState<'standard' | 'all' | 'component'>('standard')
  const [decodeMode, setDecodeMode] = useState<'standard' | 'plus' | 'component'>('standard')
  const [autoTrim, setAutoTrim] = useState(true)
  const [preserveLineBreaks, setPreserveLineBreaks] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE_MB = 5 // 5MB limit

  useEffect(() => {
    if (activeTab === 'encode') {
      handleEncode()
    } else {
      handleDecode()
    }
  }, [inputText, encodeMode, decodeMode, autoTrim, preserveLineBreaks])

  const handleEncode = () => {
    try {
      let encoded = inputText
      if (autoTrim) {
        encoded = encoded.trim()
      }
      
      const lines = preserveLineBreaks ? encoded.split('\n') : [encoded]
      const encodedLines = lines.map(line => {
        if (encodeMode === 'all') {
          return encodeURIComponent(line)
        } else if (encodeMode === 'component') {
          return encodeURIComponent(line).replace(/%20/g, '+')
        } else {
          return line.replace(/[^a-zA-Z0-9-._~]/g, (char) => {
            return '%' + char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()
          })
        }
      })

      setOutputText(encodedLines.join(preserveLineBreaks ? '\n' : ''))
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

      const lines = preserveLineBreaks ? decoded.split('\n') : [decoded]
      const decodedLines = lines.map(line => {
        if (decodeMode === 'plus') {
          line = line.replace(/\+/g, ' ')
        } else if (decodeMode === 'component') {
          return decodeURIComponent(line.replace(/\+/g, '%20'))
        }
        return decodeURIComponent(line)
      })

      setOutputText(decodedLines.join(preserveLineBreaks ? '\n' : ''))
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

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([outputText], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `${activeTab === 'encode' ? 'encoded' : 'decoded'}_urls.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success(`${activeTab === 'encode' ? 'Encoded' : 'Decoded'} URLs downloaded!`)
  }

  return (
    <ToolLayout
      title="URL Encoder/Decoder"
      description="Convert special characters in URLs into their encoded forms and vice versa"
    >
      <Toaster position="top-right" />

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
                  <div className="relative">
                    <Textarea
                      id="input-text"
                      placeholder="Enter URL(s) to encode..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 pr-10"

                    />

                  </div>
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
              </div>
            </TabsContent>
            <TabsContent value="decode">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-text" className="text-white mb-2 block">Encoded URL(s) to Decode (one per line)</Label>
                  <div className="relative">
                    <Textarea
                      id="input-text"
                      placeholder="Enter encoded URL(s) to decode..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 pr-10"
                    />

                  </div>
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
            <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download Result
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
            <div className="flex items-center space-x-2">
              <Switch
                id="preserve-line-breaks"
                checked={preserveLineBreaks}
                onCheckedChange={setPreserveLineBreaks}
              />
              <Label htmlFor="preserve-line-breaks" className="text-white">Preserve Line Breaks</Label>
            </div>
            {activeTab === 'encode' && (
              <div>
                <Label htmlFor="encode-mode" className="text-white mb-2 block">Encode Mode</Label>
                <Select value={encodeMode} onValueChange={(value: 'standard' | 'all' | 'component') => setEncodeMode(value)}>
                  <SelectTrigger id="encode-mode" className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select encode mode" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectItem value="standard">Standard (RFC 3986)</SelectItem>
                    <SelectItem value="all">Encode All Characters</SelectItem>
                    <SelectItem value="component">Encode URI Component</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {activeTab === 'decode' && (
              <div>
                <Label htmlFor="decode-mode" className="text-white mb-2 block">Decode Mode</Label>
                <Select value={decodeMode} onValueChange={(value: 'standard' | 'plus' | 'component') => setDecodeMode(value)}>
                  <SelectTrigger id="decode-mode" className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectValue placeholder="Select decode mode" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="plus">Decode '+' as Space</SelectItem>
                    <SelectItem value="component">Decode URI Component</SelectItem>
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
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About URL Encoder/Decoder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          The URL Encoder/Decoder is an advanced tool designed to convert special characters in URLs into their encoded forms (URL encoding) or decode them back into readable characters. URL encoding is essential for making URLs compatible with different browsers and ensuring safe transmission over the web. This tool supports bulk processing, file uploads, and various encoding/decoding modes for maximum flexibility and efficiency.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/URLEncoderPreview.png?height=400&width=600"  
            alt="Screenshot of the URL Encoder/Decoder interface" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Key Features of URL Encoder/Decoder
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Encode URLs to convert special characters into encoded forms</li>
          <li>Decode encoded URLs back into readable text</li>
          <li>Support for multiple encoding/decoding modes (Standard, All Characters, URI Component)</li>
          <li>Bulk processing support for multiple URLs at once</li>
          <li>File upload support for batch processing of URLs or encoded content (up to 5MB)</li>
          <li>Automatic detection of encoded content for appropriate processing</li>
          <li>Copy and paste functionality for quick input/output handling</li>
          <li>Option to trim whitespace for cleaner results</li>
          <li>Preserve line breaks option for maintaining input structure</li>
          <li>URL validation feature to ensure the input URLs are correct</li>
          <li>Password visibility toggle for sensitive information</li>
          <li>Download functionality for saving processed results</li>
          <li>Real-time encoding/decoding as you type</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use URL Encoder/Decoder?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Choose between Encode and Decode tabs based on your needs.</li>
          <li>Enter your URL(s) or encoded URL(s) in the input area for processing.</li>
          <li>The tool will automatically process your input in real-time.</li>
          <li>To upload a file, click the "Upload File" button and select a text file (max 5MB) containing URLs or encoded content.</li>
          <li>Adjust your settings for encoding/decoding:</li>
          <ul className="list-disc list-inside ml-6">
            <li>Toggle "Auto Trim Whitespace" to clean up input.</li>
            <li>Toggle "Preserve Line Breaks" to maintain input structure.</li>
            <li>Select between "Standard", "Encode All Characters", or "Encode URI Component" modes for encoding.</li>
            <li>Select between "Standard", "Decode '+' as Space", or "Decode URI Component" modes for decoding.</li>
          </ul>
          <li>Use the "Validate URL(s)" button to check the validity of your URLs.</li>
          <li>Click the "Copy" button to quickly copy the result to your clipboard.</li>
          <li>Use the "Download Result" button to save the processed URLs as a text file.</li>
          <li>Click the "Reset" button to clear all inputs and start over.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Best Practices
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use the "Auto Trim Whitespace" feature to ensure clean input, especially when pasting URLs from other sources.</li>
          <li>Enable "Preserve Line Breaks" when working with multiple URLs to maintain the structure of your input.</li>
          <li>For security purposes, always validate URLs before using them in production environments.</li>
          <li>Use the "Encode All Characters" mode to safely encode special characters not normally encoded by default.</li>
          <li>When decoding, enable the "Decode '+' as Space" option for URLs where '+' represents a space character (common in query parameters).</li>
          <li>Use the "Encode/Decode URI Component" modes when working with specific parts of a URL, such as query parameters.</li>
          <li>Utilize bulk processing for large lists of URLs to save time.</li>
          <li>Check the encoding format of files you upload to ensure proper decoding of special characters.</li>
          <li>Use the password visibility toggle when working with sensitive information in URLs.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2" />
          Common Pitfalls and How to Avoid Them
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Double encoding: Be cautious not to encode already encoded URLs. This can lead to issues when decoding.</li>
          <li>Incomplete decoding: Ensure you're using the correct decoding mode, especially when dealing with '+' characters or URI components.</li>
          <li>Ignoring character encoding: Be aware of the character encoding of your input, especially when uploading files.</li>
          <li>Overlooking URL structure: Remember that different parts of a URL (path, query, fragment) may require different encoding approaches.</li>
          <li>Forgetting to validate: Always validate your URLs after encoding to ensure they remain functional.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          Security Considerations
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Be cautious when decoding unknown URLs, as they may contain malicious content.</li>
          <li>Always validate and sanitize URLs before using them in your applications, especially if they come from user input.</li>
          <li>Use the password visibility toggle feature wisely when working with URLs containing sensitive information.</li>
          <li>Be aware that URL encoding is not a form of encryption and should not be used to protect sensitive data.</li>
          <li>When working with sensitive URLs, consider using secure communication protocols (HTTPS) and additional security measures.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          The URL Encoder/Decoder is a powerful tool for managing and processing URLs in various contexts. By understanding its features and following best practices, you can ensure efficient and secure handling of URLs in your web development projects.
        </p>
      </CardContent>
    </Card>

    </ToolLayout>
  )
}
