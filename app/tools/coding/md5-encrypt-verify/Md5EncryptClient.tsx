'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Hash, Copy, RefreshCw, Upload, Download, CheckCircle2, Clipboard, Info, BookOpen, Lightbulb } from 'lucide-react'
import crypto from 'crypto-js'
import ToolLayout from '@/components/ToolLayout'

export default function MD5Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [compareHash, setCompareHash] = useState('')
  const [fileName, setFileName] = useState('')
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [encoding, setEncoding] = useState('UTF-8')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoUpdate) {
      generateMD5()
    }
  }, [input, encoding])

  const generateMD5 = () => {
    try {
      let encodedInput = input
      if (encoding === 'Base64') {
        encodedInput = crypto.enc.Base64.parse(input).toString(crypto.enc.Utf8)
      } else if (encoding === 'Hex') {
        encodedInput = crypto.enc.Hex.parse(input).toString(crypto.enc.Utf8)
      }
      const hash = crypto.MD5(encodedInput).toString()
      setOutput(hash)
      toast.success('MD5 hash generated successfully!')
    } catch (error) {
      console.error('Error generating MD5:', error)
      toast.error('Error generating MD5 hash. Please check your input and encoding.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleReset = () => {
    setInput('')
    setOutput('')
    setCompareHash('')
    setFileName('')
    setEncoding('UTF-8')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('All fields have been reset.')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInput(content)
      }
      reader.readAsText(file)
      toast.success('File uploaded successfully!')
    }
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([output], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = 'md5_hash.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('MD5 hash downloaded!')
  }

  const compareHashes = () => {
    if (caseSensitive) {
      if (output === compareHash) {
        toast.success('Hashes match!')
      } else {
        toast.error('Hashes do not match.')
      }
    } else {
      if (output.toLowerCase() === compareHash.toLowerCase()) {
        toast.success('Hashes match!')
      } else {
        toast.error('Hashes do not match.')
      }
    }
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
      toast.success('Text pasted from clipboard!')
    } catch (error) {
      toast.error('Failed to paste from clipboard. Please try again.')
    }
  }

  return (
    <ToolLayout
      title="MD5 Hash Generator and Verifier"
      description="User-friendly tool designed to create and verify MD5 hashes from text or file inputs"
    >

      <Toaster position="top-right" />
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="generate">Generate MD5</TabsTrigger>
                <TabsTrigger value="verify">Verify MD5</TabsTrigger>
              </TabsList>
              <TabsContent value="generate">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text" className="text-white mb-2 block">Input Text</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Enter text to generate MD5 hash..."
                      value={input}
                      onChange={handleInputChange}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="output-hash" className="text-white mb-2 block">MD5 Hash</Label>
                    <Input
                      id="output-hash"
                      value={output}
                      readOnly
                      className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="verify">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text" className="text-white mb-2 block">Input Text</Label>
                    <Textarea
                      id="input-text"
                      placeholder="Enter text to verify MD5 hash..."
                      value={input}
                      onChange={handleInputChange}
                      className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="generated-hash" className="text-white mb-2 block">Generated MD5 Hash</Label>
                    <Input
                      id="generated-hash"
                      value={output}
                      readOnly
                      className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="compare-hash" className="text-white mb-2 block">Hash to Compare</Label>
                    <Input
                      id="compare-hash"
                      placeholder="Enter MD5 hash to compare..."
                      value={compareHash}
                      onChange={(e) => setCompareHash(e.target.value)}
                      className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                    />
                  </div>
                  <Button onClick={compareHashes} className="w-full bg-blue-600 hover:bg-blue-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Compare Hashes
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-update"
                  checked={autoUpdate}
                  onCheckedChange={setAutoUpdate}
                />
                <Label htmlFor="auto-update" className="text-white">Auto-update hash on input change</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="case-sensitive"
                  checked={caseSensitive}
                  onCheckedChange={setCaseSensitive}
                />
                <Label htmlFor="case-sensitive" className="text-white">Case-sensitive hash comparison</Label>
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="encoding" className="text-white mb-2 block">Input Encoding</Label>
              <Select value={encoding} onValueChange={setEncoding}>
                <SelectTrigger id="encoding" className="w-full bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select encoding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTF-8">UTF-8</SelectItem>
                  <SelectItem value="Base64">Base64</SelectItem>
                  <SelectItem value="Hex">Hexadecimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={generateMD5} className="bg-blue-600 hover:bg-blue-700">
                <Hash className="w-4 h-4 mr-2" />
                Generate MD5
              </Button>
              <Button onClick={() => copyToClipboard(output)} className="bg-blue-600 hover:bg-blue-700">
                <Copy className="w-4 h-4 mr-2" />
                Copy Hash
              </Button>
              <Button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleDownload} disabled={!output} className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download Hash
              </Button>
              <Button onClick={handlePasteFromClipboard} className="bg-blue-600 hover:bg-blue-700">
                <Clipboard className="w-4 h-4 mr-2" />
                Paste from Clipboard
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              <Label htmlFor="file-upload" className="text-white block">Upload File</Label>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="bg-gray-700 text-white border-gray-600 w-full sm:w-auto"
                  ref={fileInputRef}
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                {fileName && (
                  <span className="text-white sm:w-auto w-full text-center">{fileName}</span>
                )}
              </div>
            </div>

          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About MD5 Hash Generator
            </h2>
            <p className="text-gray-300 mb-4">
              The MD5 Hash Generator is a user-friendly tool designed to create and verify MD5 hashes from text or file inputs. MD5 (Message Digest Algorithm 5) produces a 128-bit hash value that is commonly used to verify data integrity. This tool is ideal for quick hash generation, verifying file integrity, and comparing MD5 values.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter the text you want to hash in the "Input Text" field, or upload a file.</li>
              <li>Select the appropriate input encoding (UTF-8, Base64, or Hexadecimal).</li>
              <li>Click the "Generate MD5" button to create the hash.</li>
              <li>To verify a hash, switch to the "Verify MD5" tab, and input the text or file to compare with the target hash.</li>
              <li>Click "Compare Hashes" to see if the hashes match.</li>
              <li>Use the "Copy Hash" button to copy the generated hash, or "Download Hash" to save it as a text file.</li>
              <li>Click "Reset" to clear all inputs and start over.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features and Tips
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Auto-update for real-time MD5 hash generation.</li>
              <li>Support for verifying MD5 hashes for text and files.</li>
              <li>Multiple input encodings: UTF-8, Base64, Hexadecimal.</li>
              <li>Case-sensitive comparison for accurate hash matching.</li>
              <li>File upload support for generating MD5 from file content.</li>
              <li>Clipboard integration for easy copying and pasting.</li>
              <li>MD5 is not cryptographically secure—use it only for non-sensitive applications.</li>
              <li>For secure hashing, consider using SHA-256 or other stronger algorithms.</li>
              <li>Test hash values to ensure data integrity.</li>
            </ul>
          </div>


  </ToolLayout>
  )
}