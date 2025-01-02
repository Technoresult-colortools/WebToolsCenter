'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select } from '@/components/ui/select1';
import Slider from "@/components/ui/Slider"
import { Toaster, toast } from 'react-hot-toast'
import { Hash, Copy, RefreshCw, Upload, Download, CheckCircle2, Clipboard, Info, BookOpen, Lightbulb, Save, Trash2, Shield, FileText, AlertTriangle } from 'lucide-react'
import crypto from 'crypto-js'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Image from 'next/image'

export default function SHA1Tool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [compareHash, setCompareHash] = useState('')
  const [fileName, setFileName] = useState('')
  const [autoUpdate, setAutoUpdate] = useState(false)
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [encoding, setEncoding] = useState('UTF-8')
  const [iterations, setIterations] = useState(1)
  const [salt, setSalt] = useState('')
  const [presets, setPresets] = useState<Record<string, any>>({}) // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedPreset, setSelectedPreset] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoUpdate) {
      generateSHA1()
    }
  }, [input, encoding, iterations, salt])

  useEffect(() => {
    const savedPresets = localStorage.getItem('sha1Presets')
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets))
    }
  }, [])

  const generateSHA1 = () => {
    try {
      let encodedInput = input
      if (encoding === 'Base64') {
        encodedInput = crypto.enc.Base64.parse(input).toString(crypto.enc.Utf8)
      } else if (encoding === 'Hex') {
        encodedInput = crypto.enc.Hex.parse(input).toString(crypto.enc.Utf8)
      }
      let hash = crypto.SHA1(salt + encodedInput)
      for (let i = 1; i < iterations; i++) {
        hash = crypto.SHA1(salt + hash)
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

  const savePreset = () => {
    const presetName = prompt('Enter a name for this preset:')
    if (presetName) {
      const newPresets = {
        ...presets,
        [presetName]: { input, encoding, iterations, salt }
      }
      setPresets(newPresets)
      localStorage.setItem('sha1Presets', JSON.stringify(newPresets))
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
    localStorage.setItem('sha1Presets', JSON.stringify(newPresets))
    if (selectedPreset === presetName) {
      setSelectedPreset('')
    }
    toast.success('Preset deleted successfully!')
  }

  return (
    <ToolLayout
      title="SHA-1 Hash Generator and Verifier"
      description="Generate and verify SHA-1 hashes for text and file content"
    >
      <Toaster position="top-right" />
      
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
          <Select
            selectedKey={selectedPreset}
            onSelectionChange={loadPreset}
            label="Preset"
            options={Object.keys(presets).map((presetName) => ({
              value: presetName,
              label: presetName
            }))}
         
          />

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
          About SHA-1 Hash Generator and Verifier
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">
          The SHA-1 (Secure Hash Algorithm 1) Hash Generator and Verifier is a comprehensive tool designed for developers, security enthusiasts, and anyone working with data integrity verification. It provides a user-friendly interface to generate, verify, and manipulate SHA-1 hashes, ensuring that your data remains intact and unaltered during transmission or storage.
        </p>
        <p className="text-gray-300 mb-4">
          While SHA-1 is no longer considered cryptographically secure for certain applications, it still has uses in various non-security-critical scenarios. This tool allows you to explore the properties of SHA-1 hashing and understand its behavior in different contexts.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/SH1HashPreview.png?height=400&width=600"  
            alt="Screenshot of the SHA-1 Hash Generator and Verifier interface" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the SHA-1 Hash Generator and Verifier?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter your text in the input area or upload a file.</li>
          <li>Choose the desired input encoding (UTF-8, Base64, or Hex).</li>
          <li>Optionally, add a salt value to strengthen the hash.</li>
          <li>Set the number of iterations for additional security.</li>
          <li>Click 'Generate SHA-1' to create the hash value.</li>
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
          <li>Generate SHA-1 hashes from text input or file content</li>
          <li>Verify and compare SHA-1 hashes</li>
          <li>Support for multiple input encodings: UTF-8, Base64, and Hexadecimal</li>
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
          <li>SHA-1 is considered cryptographically broken and should not be used for security-critical applications.</li>
          <li>For security-sensitive tasks, use SHA-256 or other stronger algorithms.</li>
          <li>Adding a salt and using multiple iterations can improve resistance to rainbow table attacks, but does not make SHA-1 secure for critical applications.</li>
          <li>This tool is primarily for educational purposes and non-security-critical use cases.</li>
          <li>Always use HTTPS when transmitting sensitive data or hash values over the network.</li>
          <li>Regularly update your hashing practices to align with current security standards.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Data Integrity:</strong> Verify that files or data haven't been tampered with during transmission or storage.</li>
          <li><strong>Version Control:</strong> Generate unique identifiers for file versions in version control systems.</li>
          <li><strong>Caching:</strong> Create cache keys for web applications and content delivery networks.</li>
          <li><strong>Digital Signatures:</strong> Understand basic concepts of hashing in digital signature systems (though SHA-1 should not be used for this purpose in practice).</li>
          <li><strong>Educational Purposes:</strong> Learn about hash functions, their properties, and limitations.</li>
          <li><strong>Legacy System Compatibility:</strong> Generate SHA-1 hashes for systems that still require them (while planning for migration to stronger algorithms).</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Shield className="w-6 h-6 mr-2" />
          Best Practices
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use SHA-1 only for non-security-critical applications or when compatibility with legacy systems is required.</li>
          <li>For security-sensitive applications, use SHA-256 or other approved cryptographic hash functions.</li>
          <li>Always use a unique, random salt when hashing sensitive information.</li>
          <li>Implement slow hash functions (e.g., bcrypt, Argon2) for password hashing instead of fast algorithms like SHA-1.</li>
          <li>Regularly review and update your hashing strategies to align with current security standards.</li>
          <li>Use HTTPS to protect data and hash transmissions over networks.</li>
          <li>Educate your team about the strengths and weaknesses of different hashing algorithms.</li>
          <li>Implement additional security measures, such as rate limiting, to prevent brute-force attacks.</li>
        </ul>

        <p className="text-gray-300 mt-6">
          The SHA-1 Hash Generator and Verifier is a valuable tool for understanding hash functions and their properties. While it's important to recognize the limitations of SHA-1 in modern cryptographic applications, this tool provides insights into hashing concepts and can be useful for various non-security-critical tasks. Always prioritize security best practices and use appropriate algorithms for sensitive applications.
        </p>
      </CardContent>
    </Card>

  </ToolLayout>
  )
}