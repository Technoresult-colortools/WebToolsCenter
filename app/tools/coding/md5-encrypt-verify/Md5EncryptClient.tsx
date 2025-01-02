'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select } from '@/components/ui/select1';
import { Toaster, toast } from 'react-hot-toast'
import { Hash, Copy, RefreshCw, Upload, Download, CheckCircle2, Clipboard, Info, BookOpen, Lightbulb, AlertCircle, FileText, Shield } from 'lucide-react'
import crypto from 'crypto-js'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'


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
              <Select
                selectedKey={encoding}
                onSelectionChange={setEncoding}
                label="Encoding"
                options={[
                  { value: "UTF-8", label: "UTF-8" },
                  { value: "Base64", label: "Base64" },
                  { value: "Hex", label: "Hexadecimal" },
                ]}
                placeholder="Select encoding"
              />

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

          <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-2" />
                What is the MD5 Hash Generator and Verifier?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                The MD5 Hash Generator and Verifier is a versatile and user-friendly tool designed for developers, security professionals, and anyone working with data integrity verification. It provides a comprehensive set of features to generate, verify, and manipulate MD5 hashes, ensuring that your data remains intact and unaltered during transmission or storage.
              </p>
              <p className="text-gray-300 mb-4">
                While primarily focused on MD5, our tool now includes support for the more secure SHA256 algorithm, making it suitable for a wider range of applications. Whether you're verifying file downloads, implementing data integrity checks, or learning about cryptographic hash functions, our MD5 Hash Generator and Verifier streamlines your workflow and helps prevent data corruption issues.
              </p>

              <div className="my-8">
                <Image 
                  src="/Images/MD5HashPreview.png?height=400&width=600"  
                  alt="Screenshot of the MD5 Hash Generator and Verifier interface" 
                  width={600} 
                  height={400}
                  className="rounded-lg shadow-lg" 
                />
              </div>

              <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                How to Use the MD5 Hash Generator and Verifier?
              </h2>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Enter your text in the input area or upload a file.</li>
                <li>Choose the desired hashing algorithm (MD5 or SHA256).</li>
                <li>Optionally, add a salt value to strengthen the hash.</li>
                <li>Set the number of iterations for additional security.</li>
                <li>Select the appropriate input encoding (UTF-8, Base64, or Hex).</li>
                <li>Click 'Generate Hash' to create the hash value.</li>
                <li>To verify a hash, switch to the 'Verify' tab and enter the hash to compare.</li>
                <li>Use the 'Compare Hashes' button to check if the hashes match.</li>
                <li>Copy the generated hash to clipboard or download it as a file.</li>
                <li>Use the 'Reset' button to clear all inputs and start over.</li>
              </ol>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Key Features
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Support for both MD5 and SHA256 hashing algorithms</li>
                <li>Optional salt input for enhanced security</li>
                <li>Customizable number of hash iterations</li>
                <li>Multiple input encodings: UTF-8, Base64, and Hexadecimal</li>
                <li>File upload capability for hashing file contents</li>
                <li>Real-time hash generation with auto-update option</li>
                <li>Hash verification with case-sensitive comparison</li>
                <li>Clipboard integration for easy copying and pasting</li>
                <li>Download option for saving generated hashes</li>
                <li>Clear and intuitive user interface</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                Security Considerations
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>MD5 is considered cryptographically broken and should not be used for security-critical applications.</li>
                <li>For security-sensitive tasks, use SHA256 or other stronger algorithms.</li>
                <li>Adding a salt and using multiple iterations can improve resistance to rainbow table attacks.</li>
                <li>Always use HTTPS when transmitting sensitive data or hash values over the network.</li>
                <li>Regularly update your hashing practices to align with current security standards.</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                Applications and Use Cases
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li><strong>File Integrity:</strong> Verify that downloaded files haven't been tampered with.</li>
                <li><strong>Password Storage:</strong> Generate hash values for secure password storage (with proper salting and stronger algorithms).</li>
                <li><strong>Data Deduplication:</strong> Identify duplicate files or data blocks in storage systems.</li>
                <li><strong>Digital Signatures:</strong> Create simple digital signatures for data authentication.</li>
                <li><strong>Caching:</strong> Generate cache keys for web applications and content delivery networks.</li>
                <li><strong>Blockchain:</strong> Understand basic concepts of hashing in blockchain technology.</li>
                <li><strong>Data Validation:</strong> Ensure data integrity in database records or during data transfer.</li>
              </ul>

              <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
                <Shield className="w-6 h-6 mr-2" />
                Best Practices
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
                <li>Always use salted hashes for password storage and other security-critical applications.</li>
                <li>Implement slow hash functions (e.g., bcrypt, Argon2) for password hashing instead of fast algorithms like MD5 or SHA256.</li>
                <li>Regularly review and update your hashing strategies to align with current security standards.</li>
                <li>Use HTTPS to protect data and hash transmissions over networks.</li>
                <li>Educate your team about the strengths and weaknesses of different hashing algorithms.</li>
                <li>Implement additional security measures, such as rate limiting, to prevent brute-force attacks.</li>
              </ul>

              <p className="text-gray-300 mt-6">
                The MD5 Hash Generator and Verifier is an essential tool for anyone working with data integrity and basic cryptographic functions. By providing a user-friendly interface with powerful features, it simplifies the process of generating and verifying hash values, helping you ensure data integrity and explore fundamental concepts in cryptography. While it's a great learning tool, always remember to use appropriate algorithms and best practices for security-critical applications.
              </p>
            </CardContent>
          </Card>

    </ToolLayout>
  )
}

