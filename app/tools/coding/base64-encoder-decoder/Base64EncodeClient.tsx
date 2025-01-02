'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Label } from "@/components/ui/label"
import Input from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileLock, FileLock2, Upload, Copy, RefreshCw, Info, BookOpen, Settings, Lightbulb, Download, Eye, EyeOff } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/Card"
import { Select } from '@/components/ui/select1';
import ToolLayout from '@/components/ToolLayout'
import NextImage from 'next/image'

const MAX_FILE_SIZE_MB = 5
const ALLOWED_FILE_TYPES = ['text/plain', 'image/png', 'image/jpeg', 'application/pdf']

export default function Base64EncoderDecoder() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const [fileName, setFileName] = useState("")
  const [encoding, setEncoding] = useState("UTF-8")
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEncode = () => {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(inputText)
      const encoded = btoa(String.fromCharCode.apply(null, Array.from(data)))
      setOutputText(encoded)
    } catch (error) {
      toast.error(`Error encoding text. Make sure it's valid ${encoding}.`)
    }
  }

  const handleDecode = () => {
    try {
      const decoded = atob(inputText)
      const decoder = new TextDecoder(encoding)
      const decodedText = decoder.decode(new Uint8Array([...decoded].map(char => char.charCodeAt(0))))
      setOutputText(decodedText)
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
        toast.error('Invalid file type. Please upload a PNG, JPEG, PDF, or text file.')
        return
      }
  
      setFileName(file.name)
  
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/
  
          if (base64Regex.test(result.split(',')[1] || result)) {
            try {
              const base64Content = result.split(',')[1] || result
              const decoded = atob(base64Content)
              setInputText(base64Content)
              setOutputText(decoded)
              setActiveTab('decode')
              toast.success('Base64 file decoded successfully!')
            } catch (err) {
              toast.error('Error decoding Base64 content. Invalid Base64 format.')
            }
          } else {
            setInputText(result.split(',')[1] || result)
            setOutputText(result)
            setActiveTab('encode')
            toast.success('File uploaded and encoded successfully!')
          }
        }
      }
  
      reader.onerror = () => {
        toast.error('Error reading file. Please try again.')
      }
  
      reader.readAsDataURL(file)
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

  const handleDownload = () => {
    const element = document.createElement("a")
    const file = new Blob([outputText], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `${activeTab === 'encode' ? 'encoded' : 'decoded'}_output.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  useEffect(() => {
    if (activeTab === 'encode') {
      handleEncode()
    } else {
      handleDecode()
    }
  }, [inputText, activeTab, encoding])

  return (
   <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode and decode data using Base64 encoding with advanced features"
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
            <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-400">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setShowPreview(!showPreview)} className="bg-purple-600 hover:bg-purple-400">
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Hide' : 'Show'} Preview
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
              Max file size: {MAX_FILE_SIZE_MB}MB. Allowed types: PNG, JPEG, PDF, TXT
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Advanced Options</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Label htmlFor="encoding" className="text-white mb-2 block">Encoding:</Label>
              <Select
                label="Encoding"
                options={[
                  { value: "UTF-8", label: "UTF-8" },
                  { value: "ASCII", label: "ASCII" },
                  { value: "ISO-8859-1", label: "ISO-8859-1" },
                ]}
                selectedKey={encoding}
                onSelectionChange={setEncoding}
                placeholder="Select encoding"
                className="w-[180px] "
              />

            </div>
          </div>

          {showPreview && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Preview</h3>
              <div className="bg-white p-4 rounded-md">
                <div dangerouslySetInnerHTML={{ __html: outputText }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About Base64 Encoder/Decoder
        </h2>
        <p className="text-gray-300 mb-4">
          Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used to encode binary data for storage or transfer in environments that only support text content, such as email attachments, XML, or JSON. This tool provides a user-friendly interface for encoding and decoding Base64 data, with additional features for file handling and advanced options.
        </p>

        <div className="my-8">
          <NextImage 
            src="/Images/Base64EncoderPreview.png?height=400&width=600" 
            alt="Screenshot of the Code to Image Converter interface showing code input area and customization options" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

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
            <li>Select a file from your device (max 5MB, PNG/JPEG/PDF/TXT).</li>
            <li>The file will be processed and the result displayed in the input/output areas.</li>
          </ul>
          <li>Use the Reset button to clear all inputs and outputs.</li>
          <li>Download the result as a text file using the Download button.</li>
          <li>Toggle the preview to see a rendered version of the decoded content (useful for HTML).</li>
          <li>Use the Advanced Options to select different text encodings for more precise conversions.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Real-time encoding and decoding of text input.</li>
          <li>File upload support for encoding and decoding (now including PDF files).</li>
          <li>Automatic detection of Base64 content in uploaded files.</li>
          <li>Copy to clipboard functionality.</li>
          <li>Reset feature to clear all inputs and outputs.</li>
          <li>Download option for saving encoded or decoded content.</li>
          <li>Preview functionality for rendered output (especially useful for HTML content).</li>
          <li>Advanced encoding options (UTF-8, ASCII, ISO-8859-1) for precise conversions.</li>
          <li>Responsive design for use on various devices.</li>
          <li>File size and type restrictions for security.</li>
          <li>Error handling with informative toast notifications.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Ensure your input is valid UTF-8 text when encoding to avoid errors.</li>
          <li>When decoding, make sure your input is valid Base64 (it should only contain A-Z, a-z, 0-9, +, /, and =).</li>
          <li>Use the file upload feature to quickly encode images, PDFs, or text files.</li>
          <li>The tool automatically switches to the appropriate tab (Encode/Decode) when you upload a file.</li>
          <li>For large text inputs, consider breaking them into smaller chunks to improve performance.</li>
          <li>Remember that Base64 encoding increases the data size by approximately 33%, so encoded strings will be longer than the original text.</li>
          <li>Use Base64 encoding for binary data or when you need to transmit data that may contain special characters that could be misinterpreted by text-based systems.</li>
          <li>Experiment with different text encodings in the Advanced Options for handling various character sets.</li>
          <li>Use the preview feature to quickly check the rendered output of decoded HTML or other markup languages.</li>
          <li>When working with sensitive data, remember to clear your inputs and outputs using the Reset button after use.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Encode binary data for inclusion in HTML, CSS, or JavaScript files.</li>
          <li><strong>Email Systems:</strong> Safely transmit binary attachments through text-only email protocols.</li>
          <li><strong>API Development:</strong> Encode data for secure transmission in API requests and responses.</li>
          <li><strong>Data Storage:</strong> Store binary data in text-based databases or file systems.</li>
          <li><strong>Image Handling:</strong> Convert images to Base64 for embedding directly in HTML or CSS.</li>
          <li><strong>Cryptography:</strong> Use as part of more complex encryption systems or for encoding cryptographic keys.</li>
          <li><strong>Data Compression:</strong> Combine with compression algorithms for efficient data storage and transfer.</li>
          <li><strong>URL Encoding:</strong> Safely include complex data in URL parameters.</li>
          <li><strong>Digital Signatures:</strong> Encode binary signature data for use in text-based systems.</li>
          <li><strong>Cross-Platform Data Exchange:</strong> Ensure consistent data representation across different systems and programming languages.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          This advanced Base64 Encoder/Decoder tool offers a comprehensive solution for handling Base64 conversions in various scenarios. Whether you're a web developer working with data URIs, a system administrator dealing with binary data in text-based configs, or a security professional handling encoded data, this tool provides the functionality and flexibility you need. Start exploring the power of Base64 encoding and decoding with our feature-rich, user-friendly interface today!
        </p>
      </div>
    </ToolLayout>
  )
}