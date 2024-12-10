'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Info, Lightbulb, BookOpen, ArrowRightLeft, Settings, FileDown } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import Image from 'next/image'

export default function TextToAsciiHexBinary() {
  const [inputText, setInputText] = useState('')
  const [asciiResult, setAsciiResult] = useState('')
  const [hexResult, setHexResult] = useState('')
  const [binaryResult, setBinaryResult] = useState('')
  const [base64Result, setBase64Result] = useState('')
  const [outputFormat, setOutputFormat] = useState('space')
  const [caseSensitive, setCaseSensitive] = useState(true)
  const [reverseMode, setReverseMode] = useState(false)

  useEffect(() => {
    if (reverseMode) {
      convertFromEncoded(inputText)
    } else {
      convertText(inputText)
    }
  }, [inputText, outputFormat, caseSensitive, reverseMode])

  const convertText = (text: string) => {
    const processedText = caseSensitive ? text : text.toLowerCase()
    const separator = outputFormat === 'space' ? ' ' : outputFormat === 'comma' ? ',' : ''

    // ASCII conversion
    const ascii = processedText.split('').map(char => char.charCodeAt(0)).join(separator)
    setAsciiResult(ascii)

    // Hexadecimal conversion
    const hex = processedText.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(separator)
    setHexResult(hex)

    // Binary conversion
    const binary = processedText.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(separator)
    setBinaryResult(binary)

    // Base64 conversion
    const base64 = btoa(processedText)
    setBase64Result(base64)
  }

  const convertFromEncoded = (encodedText: string) => {
    try {
      const parts = encodedText.split(/[\s,]+/)
      let decodedText = ''

      if (parts.every(part => /^[0-9]+$/.test(part))) {
        // ASCII to text
        decodedText = parts.map(code => String.fromCharCode(parseInt(code, 10))).join('')
      } else if (parts.every(part => /^[0-9A-Fa-f]{2}$/.test(part))) {
        // Hex to text
        decodedText = parts.map(hex => String.fromCharCode(parseInt(hex, 16))).join('')
      } else if (parts.every(part => /^[01]{8}$/.test(part))) {
        // Binary to text
        decodedText = parts.map(bin => String.fromCharCode(parseInt(bin, 2))).join('')
      } else {
        // Attempt Base64 decoding
        decodedText = atob(encodedText)
      }

      setInputText(decodedText)
    } catch (error) {
      toast.error('Invalid input for decoding')
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const handleClear = () => {
    setInputText('')
    setAsciiResult('')
    setHexResult('')
    setBinaryResult('')
    setBase64Result('')
    toast.success('Text Cleared!')
  }

  const handleDownload = (content: string, fileType: string) => {
    const element = document.createElement('a')
    const file = new Blob([content], {type: 'text/plain'})
    element.href = URL.createObjectURL(file)
    element.download = `converted_${fileType}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <ToolLayout
      title="Text to ASCII/Hex/Binary Converter"
      description="Convert plain text into ASCII, hexadecimal, binary, and Base64 representations, or decode them back to text."
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto mb-8">
        <div className="mb-6">
          <Label htmlFor="input-text" className="text-white mb-2 block">
            {reverseMode ? "Enter encoded text:" : "Enter your text:"}
          </Label>
          <div className="flex flex-col space-y-4">
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={reverseMode ? "Enter ASCII, Hex, Binary, or Base64" : "Type or paste your text here"}
              className="w-full bg-gray-700 text-white border-gray-600"
              rows={4}
            />
          </div>
          <div className="flex flex-col space-y-4 mt-4">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full">
                <Button
                  onClick={handleClear}
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Switch
                    id="reverse-mode"
                    checked={reverseMode}
                    onCheckedChange={setReverseMode}
                  />
                  <Label htmlFor="reverse-mode" className="text-white">
                    Reverse Mode
                  </Label>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Switch
                    id="case-sensitive"
                    checked={caseSensitive}
                    onCheckedChange={setCaseSensitive}
                  />
                  <Label htmlFor="case-sensitive" className="text-white">
                    Case Sensitive
                  </Label>
                </div>
              </div>
            </div>
            

            <div className="flex flex-col items-start space-y-2">
              <Label className="text-white">Output Separator</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger className="w-full bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent className="w-full bg-gray-700 text-white border-gray-600">
                  <SelectItem value="space">Space Separated</SelectItem>
                  <SelectItem value="comma">Comma Separated</SelectItem>
                  <SelectItem value="none">No Separator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="ascii">
          <TabsList className="mb-4 flex overflow-x-auto">
            <TabsTrigger value="ascii">ASCII</TabsTrigger>
            <TabsTrigger value="hex">Hexadecimal</TabsTrigger>
            <TabsTrigger value="binary">Binary</TabsTrigger>
            <TabsTrigger value="base64">Base64</TabsTrigger>
          </TabsList>
          {/* Rest of the Tabs content remains unchanged */}
          <TabsContent value="ascii">
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-white break-all">{asciiResult || 'ASCII result will appear here'}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => handleCopy(asciiResult)} className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">
                <Copy className="h-4 w-4 mr-2" />
                Copy ASCII
              </Button>
              <Button onClick={() => handleDownload(asciiResult, 'ascii')} className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                <FileDown className="h-4 w-4 mr-2" />
                Download ASCII
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="hex">
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-white break-all">{hexResult || 'Hexadecimal result will appear here'}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => handleCopy(hexResult)} className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">
                <Copy className="h-4 w-4 mr-2" />
                Copy Hexadecimal
              </Button>
              <Button onClick={() => handleDownload(hexResult, 'hex')} className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                <FileDown className="h-4 w-4 mr-2" />
                Download Hexadecimal
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="binary">
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-white break-all">{binaryResult || 'Binary result will appear here'}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => handleCopy(binaryResult)} className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">
                <Copy className="h-4 w-4 mr-2" />
                Copy Binary
              </Button>
              <Button onClick={() => handleDownload(binaryResult, 'binary')} className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                <FileDown className="h-4 w-4 mr-2" />
                Download Binary
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="base64">
            <div className="bg-gray-700 p-4 rounded-lg mb-4">
              <p className="text-white break-all">{base64Result || 'Base64 result will appear here'}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button onClick={() => handleCopy(base64Result)} className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto">
                <Copy className="h-4 w-4 mr-2" />
                Copy Base64
              </Button>
              <Button onClick={() => handleDownload(base64Result, 'base64')} className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                <FileDown className="h-4 w-4 mr-2" />
                Download Base64
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Text to ASCII/Hex/Binary Converter?
        </h2>
        <p className="text-gray-300 mb-4">
          The Text to ASCII/Hex/Binary Converter is a versatile tool designed for developers, cryptographers, and digital enthusiasts. It goes beyond simple conversion, offering bi-directional transformation between plain text and various encoded formats. With its <a href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</a> and advanced functionality, it's the perfect companion for data encoding, decoding, and analysis tasks.
        </p>
        <p className="text-gray-300 mb-4">
          Whether you're working on low-level programming, data encryption, or simply exploring how computers represent text, our converter provides you with the flexibility and precision you need. It's like having a universal translator for text and its various digital representations right in your browser!
        </p>

        <div className="my-8">
          <Image 
            src="/Images/TextToASCIIPreview.png?height=400&width=600" 
            alt="Screenshot of the Text to ASCII/Hex/Binary Converter interface showing input area, conversion options, and multiple output formats" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>

        <h2 id="how-to-use" className="text-xl sm:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Text to ASCII/Hex/Binary Converter
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm sm:text-base">
          <li>Enter or paste your text into the input area.</li>
          <li>Choose between normal mode (text to encoded) or reverse mode (encoded to text).</li>
          <li>Select your desired output format: ASCII, Hexadecimal, Binary, or Base64.</li>
          <li>Adjust settings like case sensitivity and output separator as needed.</li>
          <li>View the converted result in real-time View the converted result in real-time as you type or modify settings.</li>
          <li>Use the "Copy" button to copy the result to your clipboard.</li>
          <li>Click "Download" to save the result as a text file.</li>
          <li>Use "Clear" to reset the input and all conversions for a new task.</li>
        </ol>

        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm sm:text-base">
          <li><strong>Multiple Conversion Formats:</strong> Convert text to ASCII, Hexadecimal, Binary, and Base64.</li>
          <li><strong>Reverse Mode:</strong> Decode ASCII, Hex, Binary, or Base64 back into plain text.</li>
          <li><strong>Real-time Conversion:</strong> See results update instantly as you type or change settings.</li>
          <li><strong>Case Sensitivity Toggle:</strong> Choose whether to preserve or ignore letter case during conversion.</li>
          <li><strong>Output Format Options:</strong> Select space-separated, comma-separated, or continuous output.</li>
          <li><strong>Copy and Download:</strong> Easily copy results to clipboard or download as text files.</li>
          <li><strong>Clear Function:</strong> Quickly reset the converter for new inputs.</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <ArrowRightLeft className="w-6 h-6 mr-2" />
          Understanding the Conversion Process
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm sm:text-base">
          <li><strong>ASCII (American Standard Code for Information Interchange):</strong> Represents each character as a number from 0 to 127.</li>
          <li><strong>Hexadecimal:</strong> Base-16 number system, using digits 0-9 and letters A-F. Each ASCII character is represented by two hex digits.</li>
          <li><strong>Binary:</strong> Base-2 number system, using only 0s and 1s. Each ASCII character is represented by 8 bits.</li>
          <li><strong>Base64:</strong> Encodes binary data using 64 characters, useful for transmitting data over text-based protocols.</li>
        </ul>

        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Practical Applications
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm sm:text-base">
          <li><strong>Programming and Debugging:</strong> Quickly convert between text and its various representations for low-level programming tasks.</li>
          <li><strong>Data Encoding:</strong> Prepare text for transmission over protocols that only support certain character sets.</li>
          <li><strong>Cryptography:</strong> Use as a first step in creating or analyzing simple substitution ciphers.</li>
          <li><strong>Digital Forensics:</strong> Analyze encoded data found in digital investigations.</li>
          <li><strong>Web Development:</strong> Encode strings for use in URLs or as part of data URIs.</li>
          <li><strong>Educational Tool:</strong> Learn about different number systems and how computers represent text.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to explore the world of text encoding and decoding? Start using our Text to ASCII/Hex/Binary Converter now and unlock new ways to understand and manipulate digital text. Whether you're a seasoned developer, a curious student, or anyone working with digital information, our tool provides the insights and conversions you need. Try it out and see how it can enhance your understanding of text representation in the digital world!
        </p>
      </div>
    </ToolLayout>
  )
}