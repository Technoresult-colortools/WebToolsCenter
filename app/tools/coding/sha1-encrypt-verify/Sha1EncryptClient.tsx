'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import { Hash, Copy, RefreshCw, Upload, Download, CheckCircle2, Clipboard, Info, BookOpen, Lightbulb} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import crypto from 'crypto-js'
import Sidebar from '@/components/sidebarTools';

export default function SHA1Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [compareHash, setCompareHash] = useState('')
  const [fileName, setFileName] = useState('')
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [encoding, setEncoding] = useState('UTF-8')
  const [showPassword, setShowPassword] = useState(false)
  const [iterations, setIterations] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoUpdate) {
      generateSHA1()
    }
  }, [input, encoding, iterations])

  const generateSHA1 = () => {
    try {
      let encodedInput = input
      if (encoding === 'Base64') {
        encodedInput = crypto.enc.Base64.parse(input).toString(crypto.enc.Utf8)
      } else if (encoding === 'Hex') {
        encodedInput = crypto.enc.Hex.parse(input).toString(crypto.enc.Utf8)
      }
      let hash = crypto.SHA1(encodedInput)
      for (let i = 1; i < iterations; i++) {
        hash = crypto.SHA1(hash)
      }
      setOutput(hash.toString())
      toast.success('SHA-1 hash generated successfully!')
    } catch (error) {
      console.error('Error generating SHA-1:', error)
      toast.error('Error generating SHA-1 hash. Please check your input and encoding.')
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
    setIterations(1)
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
    element.download = 'sha1_hash.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('SHA-1 hash downloaded!')
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
                SHA-1 Hash Generator and Verifier
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Generate and verify SHA-1 hashes for text and file content.
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="generate">Generate SHA-1</TabsTrigger>
                <TabsTrigger value="verify">Verify SHA-1</TabsTrigger>
              </TabsList>
              <TabsContent value="generate">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="input-text" className="text-white mb-2 block">Input Text</Label>
                    <div className="relative">
                      <Textarea
                        id="input-text"
                        placeholder="Enter text to generate SHA-1 hash..."
                        value={input}
                        onChange={handleInputChange}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="output-hash" className="text-white mb-2 block">SHA-1 Hash</Label>
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
                    <div className="relative">
                      <Textarea
                        id="input-text"
                        placeholder="Enter text to verify SHA-1 hash..."
                        value={input}
                        onChange={handleInputChange}
                        className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      >
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="generated-hash" className="text-white mb-2 block">Generated SHA-1 Hash</Label>
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
                      placeholder="Enter SHA-1 hash to compare..."
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
                <SelectTrigger id="encoding" className="w-40 bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select encoding" />
                </SelectTrigger>
                <SelectContent className="w-40 bg-gray-700 text-white border-gray-600">
                  <SelectItem value="UTF-8">UTF-8</SelectItem>
                  <SelectItem value="Base64">Base64</SelectItem>
                  <SelectItem value="Hex">Hexadecimal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Label htmlFor="iterations" className="text-white mb-2 block">Hash Iterations: {iterations}</Label>
              <Slider
                id="iterations"
                min={1}
                max={10}
                step={1}
                value={iterations}
                onChange={(value) => setIterations(value)}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={generateSHA1} className="bg-blue-600 hover:bg-blue-700">
                <Hash className="w-4 h-4 mr-2" />
                Generate SHA-1
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
              <div className="flex items-center space-x-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  className="bg-gray-700 text-white border-gray-600 w-full md:w-auto"
                  ref={fileInputRef}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                {fileName && (
                  <span className="text-white">{fileName}</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About SHA-1 Encrypt Verifier
            </h2>
            <p className="text-gray-300 mb-4">
              Our SHA-1 Encrypt Verifier allows users to generate and verify SHA-1 hashes for text and file content. Use this tool to hash data with SHA-1, compare existing hashes, and experiment with hashing features. While SHA-1 is outdated for security-critical tasks, it still has uses for integrity checks.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the SHA-1 Encrypt Verifier?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter the text you want to hash in the "Input Text" field, or upload a file.</li>
              <li>Select the appropriate input encoding (UTF-8, Base64, or Hexadecimal).</li>
              <li>Adjust the number of hash iterations if needed (default is 1).</li>
              <li>The SHA-1 hash will be generated automatically if "Auto-update" is enabled.</li>
              <li>Otherwise, click the "Generate SHA-1" button to create the hash.</li>
              <li>To verify a hash, switch to the "Verify SHA-1" tab.</li>
              <li>Enter the text or upload the file you want to verify.</li>
              <li>Enter the SHA-1 hash you want to compare against in the "Hash to Compare" field.</li>
              <li>Choose whether the comparison should be case-sensitive.</li>
              <li>Click "Compare Hashes" to check if they match.</li>
              <li>Use the "Copy Hash" button to copy the generated hash to your clipboard.</li>
              <li>Use the "Download Hash" button to save the hash as a text file.</li>
              <li>Use the "Paste from Clipboard" button to quickly input text from your clipboard.</li>
              <li>Click "Reset" to clear all fields and start over.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Key Features and Tips
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Auto-update: Automatically generate the hash as you type.</li>
              <li>Case-sensitive comparison: Choose whether hash comparison should be case-sensitive.</li>
              <li>Multiple input encodings: Support for UTF-8, Base64, and Hexadecimal input.</li>
              <li>Hash iterations: Apply multiple rounds of SHA-1 hashing for increased security.</li>
              <li>Password visibility toggle: Show/hide the input text for sensitive information.</li>
              <li>File upload: Generate SHA-1 hash from file contents.</li>
              <li>Clipboard integration: Paste text directly from the clipboard.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Important Notes
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>SHA-1 is a one-way hash function and cannot be decrypted.</li>
              <li>SHA-1 is no longer considered cryptographically secure for certain applications.</li>
              <li>This tool is for educational and non-security-critical purposes only.</li>
              <li>For secure hashing, consider using SHA-256 or other more robust algorithms.</li>
              <li>Multiple hash iterations can increase security but also increase computation time.</li>
            </ul>
          </div>

        </main>
      </div>  
      <Footer />
    </div>
  )
}