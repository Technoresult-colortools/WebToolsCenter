'use client'

import React, { useState, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileLock, FileLock2, Upload, Copy, RefreshCw, Check } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function HTMLEncoderDecoder() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const [fileName, setFileName] = useState("")
  const [preserveNewlines, setPreserveNewlines] = useState(true)
  const [encodeQuotes, setEncodeQuotes] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE_MB = 2 // 2MB limit

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
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">HTML Encoder/Decoder</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="space-y-8">
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
              <Button onClick={handleProcess} className="bg-green-600 hover:bg-green-700">
                {activeTab === 'encode' ? 'Encode' : 'Decode'} HTML
              </Button>
              <Button onClick={() => copyToClipboard(outputText)} className="bg-blue-600 hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Result
              </Button>
              <Button onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={validateHTML} className="bg-yellow-600 hover:bg-yellow-700">
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
              <div className="flex items-center space-x-4">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="bg-purple-600 hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2 px-4 py-2 rounded-md shadow-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload File</span>
                </Button>
                {fileName && (
                  <span className="text-white bg-gray-700 px-3 py-1 rounded-md">{fileName}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}