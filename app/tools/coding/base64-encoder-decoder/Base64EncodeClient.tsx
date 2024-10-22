'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileLock, FileLock2, Upload, Copy, RefreshCw, Info, BookOpen, Settings, Lightbulb } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/Card"
import ToolLayout from '@/components/ToolLayout'


const MAX_FILE_SIZE_MB = 5
const ALLOWED_FILE_TYPES = ['text/plain', 'image/png', 'image/jpeg']

export default function Base64EncoderDecoder() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const [fileName, setFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEncode = () => {
    try {
      const encoded = btoa(inputText)
      setOutputText(encoded)
    } catch (error) {
      toast.error('Error encoding text. Make sure it\'s valid UTF-8.')
    }
  }

  const handleDecode = () => {
    try {
      const decoded = atob(inputText)
      setOutputText(decoded)
    } catch (error) {
      toast.error('Error decoding text. Make sure it\'s valid Base64.')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
  
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`)
        return
      }
  
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        toast.error('Invalid file type. Please upload a PNG, JPEG, or text file.')
        return
      }
  
      setFileName(file.name)
  
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  
          if (base64Regex.test(result.trim())) {
            try {
              const decoded = atob(result)
              setInputText(result)
              setOutputText(decoded)
              setActiveTab('decode')
              toast.success('Base64 file decoded successfully!')
            } catch (err) {
              toast.error('Error decoding Base64 content. Invalid Base64 format.')
            }
          } else {
            setInputText(result)
            const base64 = btoa(result)
            setOutputText(base64)
            setActiveTab('encode')
            toast.success('File uploaded and encoded successfully!')
          }
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

  useEffect(() => {
    if (activeTab === 'encode') {
      handleEncode()
    } else {
      handleDecode()
    }
  }, [inputText, activeTab])

  return (
   <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode binary data for storage or transfer"
    >

      <Toaster position="top-right" />
          
          <Card className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <CardContent className="space-y-8">
              <Tabs defaultValue="encode" className="w-full" onValueChange={setActiveTab}>
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
                      <Label htmlFor="input-text" className="text-white mb-2 block">Text to Encode</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter text to encode..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-text" className="text-white mb-2 block">Encoded Base64</Label>
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
                      <Label htmlFor="input-text" className="text-white mb-2 block">Base64 to Decode</Label>
                      <Textarea
                        id="input-text"
                        placeholder="Enter Base64 to decode..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="output-text" className="text-white mb-2 block">Decoded Text</Label>
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
                <Button onClick={() => copyToClipboard(outputText)} className="bg-blue-600 hover:bg-blue-400">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy {activeTab === 'encode' ? 'Encoded' : 'Decoded'}
                </Button>
                <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-400">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Upload File to Encode/Decode</h3>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="bg-gray-700 text-white border-gray-600"
                    ref={fileInputRef}
                  />
                  <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-400 w-full sm:w-auto">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                {fileName && (
                  <p className="text-sm text-gray-300">Uploaded: {fileName}</p>
                )}
                <p className="text-sm text-gray-400 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Max file size: {MAX_FILE_SIZE_MB}MB. Allowed types: PNG, JPEG, TXT
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Base64 Encoder/Decoder
            </h2>
            <p className="text-gray-300 mb-4">
              Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used to encode binary data for storage or transfer in environments that only support text content, such as email attachments, XML, or JSON.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Base64 Encoder/Decoder?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Choose between Encode and Decode tabs.</li>
              <li>Enter your text or Base64 in the input area.</li>
              <li>The result will appear automatically in the output area.</li>
              <li>Use the Copy button to copy the result to your clipboard.</li>
              <li>To encode or decode a file:</li>
              <ul className="list-disc list-inside ml-6">
                <li>Click the "Upload" button or use the file input.</li>
                <li>Select a file from your device (max 5MB, PNG/JPEG/TXT).</li>
                <li>The file will be processed and the result displayed in the input/output areas.</li>
              </ul>
              <li>Use the Reset button to clear all inputs and outputs.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Real-time encoding and decoding of text input.</li>
              <li>File upload support for encoding and decoding.</li>
              <li>Automatic detection of Base64 content in uploaded files.</li>
              <li>Copy to clipboard functionality.</li>
              <li>Reset feature to clear all inputs and outputs.</li>
              <li>Responsive design for use on various devices.</li>
              <li>File size and type restrictions for security.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Ensure your input is valid UTF-8 text when encoding to avoid errors.</li>
              <li>When decoding, make sure your input is valid Base64 (it should only contain A-Z, a-z, 0-9, +, /, and =).</li>
              <li>Use the file upload feature to quickly encode images or text files.</li>
              <li>The tool automatically switches to the appropriate tab (Encode/Decode) when you upload a file.</li>
              <li>For large text inputs, consider breaking them into smaller chunks to improve performance.</li>
              <li>Remember that Base64 encoding increases the data size by approximately 33%, so encoded strings will be longer than the original text.</li>
              <li>Use Base64 encoding for binary data or when you need to transmit data that may contain special characters that could be misinterpreted by text-based systems.</li>
            </ul>
          </div>
  </ToolLayout>
  )
}