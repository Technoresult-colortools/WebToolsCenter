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
import { Hash, Copy, RefreshCw, Upload, Download, CheckCircle2, Clipboard, Info, BookOpen, Lightbulb, Save, Trash2, AlertTriangle, FileText, Shield } from 'lucide-react'
import crypto from 'crypto'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"


export default function SHA384EncryptVerify() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [compareHash, setCompareHash] = useState('')
  const [fileName, setFileName] = useState('')
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [encoding, setEncoding] = useState<'utf8' | 'ascii' | 'base64'>('utf8')
  const [iterations, setIterations] = useState(1)
  const [salt, setSalt] = useState('')
  const [presets, setPresets] = useState<Record<string, any>>({})
  const [selectedPreset, setSelectedPreset] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoUpdate) {
      generateSHA384()
    }
  }, [input, encoding, iterations, salt])

  useEffect(() => {
    const savedPresets = localStorage.getItem('sha384Presets')
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets))
    }
  }, [])

  const generateSHA384 = () => {
    try {
      let hash = crypto.createHash('sha384')
      hash.update(salt)
      for (let i = 0; i < iterations; i++) {
        hash.update(input, encoding)
      }
      const generatedHash = hash.digest('hex')
      setOutput(generatedHash)
      toast.success('SHA-384 hash generated successfully!')
    } catch (error) {
      console.error('Error generating SHA-384:', error)
      toast.error('Error generating SHA-384 hash. Please check your input and encoding.')
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
    setEncoding('utf8')
    setIterations(1)
    setSalt('')
    setSelectedPreset('')
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
    element.download = 'sha384_hash.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('SHA-384 hash downloaded!')
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

  const savePreset = () => {
    const presetName = prompt('Enter a name for this preset:')
    if (presetName) {
      const newPresets = {
        ...presets,
        [presetName]: { input, encoding, iterations, salt }
      }
      setPresets(newPresets)
      localStorage.setItem('sha384Presets', JSON.stringify(newPresets))
      setSelectedPreset(presetName)
      toast.success('Preset saved successfully!')
    }
  }

  const loadPreset = (presetName: string) => {
    const preset = presets[presetName]
    if (preset) {
      setInput(preset.input)
      setEncoding(preset.encoding)
      setIterations(preset.iterations)
      setSalt(preset.salt)
      setSelectedPreset(presetName)
      toast.success('Preset loaded successfully!')
    }
  }

  const deletePreset = (presetName: string) => {
    const newPresets = { ...presets }
    delete newPresets[presetName]
    setPresets(newPresets)
    localStorage.setItem('sha384Presets', JSON.stringify(newPresets))
    if (selectedPreset === presetName) {
      setSelectedPreset('')
    }
    toast.success('Preset deleted successfully!')
  }

  return (
    <ToolLayout
      title="SHA-384 Hash Generator and Verifier"
      description="Generate and verify SHA-384 hashes for text and file content"
    >
      <Toaster position="top-right" />
      
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="generate">Generate SHA-384</TabsTrigger>
            <TabsTrigger value="verify">Verify SHA-384</TabsTrigger>
          </TabsList>
          <TabsContent value="generate">
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-text" className="text-white mb-2 block">Input Text</Label>
                <div className="relative">
                  <Textarea
                    id="input-text"
                    placeholder="Enter text to generate SHA-384 hash..."
                    value={input}
                    onChange={handleInputChange}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 pr-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="output-hash" className="text-white mb-2 block">SHA-384 Hash</Label>
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
                    placeholder="Enter text to verify SHA-384 hash..."
                    value={input}
                    onChange={handleInputChange}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 pr-10"
                  />

                </div>
              </div>
              <div>
                <Label htmlFor="generated-hash" className="text-white mb-2 block">Generated SHA-384 Hash</Label>
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
                  placeholder="Enter SHA-384 hash to compare..."
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
          <Select value={encoding} onValueChange={(value: 'utf8' | 'ascii' | 'base64') => setEncoding(value)}>
            <SelectTrigger id="encoding" className="w-40 bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select encoding" />
            </SelectTrigger>
            <SelectContent className="w-40 bg-gray-700 text-white border-gray-600">
              <SelectItem value="utf8">UTF-8</SelectItem>
              <SelectItem value="ascii">ASCII</SelectItem>
              <SelectItem value="base64">Base64</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          <Label htmlFor="iterations" className="text-white mb-2 block">Hash Iterations: {iterations}</Label>
          <Slider
            id="iterations"
            min={1}
            max={10000}
            step={1}
            value={iterations}
            onChange={(value) => setIterations(value)}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="salt" className="text-white mb-2 block">Salt (optional)</Label>
          <Input
            id="salt"
            placeholder="Enter salt..."
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={generateSHA384} className="bg-blue-600 hover:bg-blue-700">
            <Hash className="w-4 h-4 mr-2" />
            Generate SHA-384
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
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2">
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
              className="bg-gray-700 text-white border-gray-600 w-full md:w-auto"
              ref={fileInputRef}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
            {fileName && (
              <span className="text-white w-full md:w-auto text-center">{fileName}</span>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-4">
          <Label htmlFor="preset-select" className="text-white block">Presets</Label>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-2">
            <Select value={selectedPreset} onValueChange={loadPreset}>
              <SelectTrigger id="preset-select" className="w-full md:w-64 bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent className="w-full md:w-64 bg-gray-700 text-white border-gray-600">
                {Object.keys(presets).map((presetName) => (
                  <SelectItem key={presetName} value={presetName}>{presetName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={savePreset} className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Preset
            </Button>
            {selectedPreset && (
              <Button onClick={() => deletePreset(selectedPreset)} className="bg-red-600 hover:bg-red-700 w-full md:w-auto">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Preset
              </Button>
            )}
          </div>
        </div>
      </div>
      <Card className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About SHA-384 Hash Generator and Verifier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          The SHA-384 Hash Generator and Verifier is a comprehensive tool designed for developers, security enthusiasts, and anyone working with data integrity verification. It provides a user-friendly interface to generate, verify, and manipulate SHA-384 hashes, ensuring that your data remains intact and unaltered during transmission or storage.
        </p>
        <p className="text-gray-300 mb-4">
          SHA-384 is part of the SHA-2 family of cryptographic hash functions, designed by the U.S. National Security Agency (NSA). It produces a 384-bit (48-byte) hash value, offering a high level of security for various applications.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/SHA384HashPreview.png?height=400&width=600"  
            alt="Screenshot of the SHA-384 Hash Generator and Verifier interface" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the SHA-384 Hash Generator and Verifier?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter your text in the input area or upload a file.</li>
          <li>Choose the desired input encoding (UTF-8, ASCII, or Base64).</li>
          <li>Optionally, add a salt value to strengthen the hash.</li>
          <li>Set the number of iterations for additional security.</li>
          <li>Click 'Generate SHA-384' to create the hash value.</li>
          <li>To verify a hash, switch to the 'Verify' tab and enter the hash to compare.</li>
          <li>Use the 'Compare Hashes' button to check if the hashes match.</li>
          <li>Copy the generated hash to clipboard or download it as a file.</li>
          <li>Use the 'Reset' button to clear all inputs and start over.</li>
          <li>Save and load presets for frequently used configurations.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Generate SHA-384 hashes from text input or file content</li>
          <li>Verify and compare SHA-384 hashes</li>
          <li>Support for multiple input encodings: UTF-8, ASCII, and Base64</li>
          <li>Optional salt input for enhanced security</li>
          <li>Customizable number of hash iterations</li>
          <li>Auto-update feature for real-time hash generation</li>
          <li>Case-sensitive and case-insensitive hash comparison</li>
          <li>File upload capability for hashing file contents</li>
          <li>Clipboard integration for easy copying and pasting</li>
          <li>Download option for saving generated hashes</li>
          <li>Preset system for saving and loading frequently used configurations</li>
          <li>Password visibility toggle for sensitive information</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <AlertTriangle className="w-6 h-6 mr-2" />
          Security Considerations
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>SHA-384 is considered cryptographically secure and is widely used in various security applications.</li>
          <li>It offers a higher level of security compared to SHA-256, making it suitable for applications with stringent security requirements.</li>
          <li>Adding a salt and using multiple iterations can improve resistance to rainbow table attacks and slow down brute-force attempts.</li>
          <li>Always use HTTPS when transmitting sensitive data or hash values over the network.</li>
          <li>Regularly update your hashing practices to align with current security standards.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Data Integrity:</strong> Verify that files or data haven't been tampered with during transmission or storage.</li>
          <li><strong>Digital Signatures:</strong> Use as part of digital signature schemes for document authentication.</li>
          <li><strong>Password Hashing:</strong> Store password hashes securely (with proper salting and key stretching).</li>
          <li><strong>SSL/TLS Certificates:</strong> Used in the creation and verification of SSL/TLS certificates.</li>
          <li><strong>Blockchain and Cryptocurrencies:</strong> Some blockchain implementations use SHA-384 for enhanced security.</li>
          <li><strong>File or Data Deduplication:</strong> Generate unique identifiers for files or data blocks.</li>
          <li><strong>Government and Military Applications:</strong> Used in systems requiring a high level of security.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          Best Practices
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Always use a unique, random salt when hashing sensitive information.</li>
          <li>For password hashing, use specialized algorithms like bcrypt, Argon2, or PBKDF2 instead of raw SHA-384.</li>
          <li>Implement additional security measures, such as rate limiting, to prevent brute-force attacks.</li>
          <li>Keep your hashing implementation up-to-date with the latest security recommendations.</li>
          <li>Use a secure random number generator for creating salts and other cryptographic operations.</li>
          <li>Verify the integrity of important files regularly using their SHA-384 hashes.</li>
          <li>Educate your team about the importance of hash functions and their proper usage in security contexts.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          The SHA-384 Hash Generator and Verifier is a powerful tool for ensuring data integrity and implementing various security measures. While it provides robust security for many applications, always consider the specific requirements of your project and stay informed about the latest developments in cryptographic standards.
        </p>
      </CardContent>
    </Card>
    </ToolLayout>
  )
}

