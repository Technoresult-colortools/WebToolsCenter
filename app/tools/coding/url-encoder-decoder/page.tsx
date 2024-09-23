'use client'

import React, { useState, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, Unlink, Upload, Copy, RefreshCw, Check, FileText } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"

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
      reader.onerror = (e) => {
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
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">URL Encoder/Decoder</h1>

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
              <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={validateURL} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Validate URL(s)
              </Button>
              <Button onClick={handlePasteFromClipboard} className="bg-purple-600 hover:bg-purple-700">
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
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-gray-700 hover:bg-gray-600">
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

        <div className="bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Choose between Encode and Decode tabs.</li>
            <li>Enter your URL(s) or encoded URL(s) in the input area, one per line for bulk processing.</li>
            <li>Click the Encode or Decode button to process the input.</li>
            <li>The result will appear in the output area.</li>
            <li>Use the Copy button to copy the result to your clipboard.</li>
            <li>To encode/decode from a file:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Click the "Upload File" button.</li>
              <li>Select a text file containing URLs or encoded content.</li>
              <li>The file contents will be loaded into the input area.</li>
              <li>The tool will automatically detect if the content is encoded and switch tabs accordingly.</li>
            </ul>
            <li>Use the Reset button to clear all inputs and outputs.</li>
            <li>Use the Validate URL(s) button to check if your URLs are valid.</li>
            <li>Use the Paste from Clipboard button to quickly input text.</li>
            <li>Adjust encoding/decoding options:</li>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Toggle "Auto Trim Whitespace" to automatically remove leading/trailing spaces.</li>
              <li>Choose between Standard and Encode All Characters modes for encoding.</li>
              <li>Choose between Standard and Decode '+' as Space modes for decoding.</li>
            </ul>
          </ol>
        </div>
        </main>
      <Footer />
    </div>
  )
}