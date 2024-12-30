'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Wand2, Code, FileText, History, Download, Upload, Clipboard, Info, BookOpen, Lightbulb, Settings } from 'lucide-react'
import { Select } from '@/components/ui/select1'
import ToolLayout from '@/components/ToolLayout'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'

interface HistoryEntry {
  input: string
  output: string
  mode: 'encode' | 'decode'
  timestamp: Date
}

const encodingOptions = [
  { value: "named", label: "Named Entities" },
  { value: "decimal", label: "Decimal Entities" },
  { value: "hexadecimal", label: "Hexadecimal Entities" },
];

export default function HTMLEncoderDecoder() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [preserveNewlines, setPreserveNewlines] = useState(true)
  const [encodeQuotes, setEncodeQuotes] = useState(true)
  const [encodeNonASCII, setEncodeNonASCII] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [encodingType, setEncodingType] = useState<'named' | 'decimal' | 'hexadecimal'>('named')

  useEffect(() => {
    processText(inputText)
  }, [inputText, mode, preserveNewlines, encodeQuotes, encodeNonASCII, encodingType])

  const processText = (text: string) => {
    let processedText = ''
    
    if (mode === 'encode') {
      processedText = encodeHTML(text)
    } else {
      processedText = decodeHTML(text)
    }

    setOutputText(processedText)
  }

  const encodeHTML = (text: string) => {
    let result = text

    const encodeChar = (char: string) => {
      const code = char.charCodeAt(0)
      switch (encodingType) {
        case 'named':
          return namedEntities[char] || `&#${code};`
        case 'decimal':
          return `&#${code};`
        case 'hexadecimal':
          return `&#x${code.toString(16)};`
      }
    }

    if (encodeQuotes) {
      result = result.replace(/['"]/g, encodeChar)
    }
    
    result = result.replace(/[<>&]/g, encodeChar)
    
    if (!preserveNewlines) {
      result = result.replace(/\n/g, '')
    }
    
    if (encodeNonASCII) {
      result = result.replace(/[^\x00-\x7F]/g, encodeChar)
    }
    
    return result
  }

  const decodeHTML = (text: string) => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    return textarea.value
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    processText(e.target.value)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    toast.success('Copied to clipboard!')
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
  }

  const handleProcess = () => {
    processText(inputText)
    if (inputText.trim()) {
      setHistory(prev => [...prev, {
        input: inputText,
        output: outputText,
        mode,
        timestamp: new Date()
      }].slice(-10))
    }
    toast.success(`Text ${mode}d!`)
  }

  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'encode' ? 'decode' : 'encode'
      processText(inputText)
      return newMode
    })
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInputText(text)
      toast.success('Text pasted from clipboard!')
    } catch (err) {
      toast.error('Failed to read from clipboard')
    }
  }

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mode}d-html-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('File downloaded!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setInputText(text)
        toast.success('File uploaded!')
      }
      reader.readAsText(file)
    }
  }

  const namedEntities: { [key: string]: string } = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
  }

  return (
    <ToolLayout
      title="HTML Encoder/Decoder"
      description="Encode and Decode HTML entities with various options"
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto mb-8">
        <Tabs defaultValue="input" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          <TabsContent value="input">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="input-text" className="text-white">Enter your text:</Label>
              <Button variant="ghost" onClick={handlePaste} className="text-white">
                <Clipboard className="h-4 w-4 mr-2" />
                Paste
              </Button>
            </div>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={`Type or paste your ${mode === 'encode' ? 'plain' : 'encoded'} text here`}
              className="w-full bg-gray-700 text-white border-gray-600 h-32"
            />
          </TabsContent>
          <TabsContent value="output">
            <Label htmlFor="output-text" className="text-white mb-2 block">Result:</Label>
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              className="w-full bg-gray-700 text-white border-gray-600 h-32"
            />
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center justify-center sm:justify-start">
            <Button
              variant={mode === 'encode' ? "default" : "outline"}
              onClick={toggleMode}
              className="w-full sm:w-auto"
            >
              {mode === 'encode' ? <Code className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>
          </div>
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Select
              label="Encoding Type"
              options={encodingOptions}
              selectedKey={encodingType}
              onSelectionChange={(key) => setEncodingType(key as 'named' | 'decimal' | 'hexadecimal')}
              className="w-full"
              placeholder="Select Encoding Type"
            />
          </div>

          <div className="flex items-center justify-center sm:justify-end lg:col-start-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="bg-gray-700 text-white border-gray-600 w-full sm:w-auto">
                  <Settings className="mr-2 h-4 w-4" />
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-700 text-white border-gray-600">
                <DropdownMenuLabel>Encoding Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPreserveNewlines(!preserveNewlines)}>
                  <input
                    type="checkbox"
                    checked={preserveNewlines}
                    onChange={() => setPreserveNewlines(!preserveNewlines)}
                    className="mr-2"
                  />
                  Preserve newlines
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEncodeQuotes(!encodeQuotes)}>
                  <input
                    type="checkbox"
                    checked={encodeQuotes}
                    onChange={() => setEncodeQuotes(!encodeQuotes)}
                    className="mr-2"
                  />
                  Encode quotes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEncodeNonASCII(!encodeNonASCII)}>
                  <input
                    type="checkbox"
                    checked={encodeNonASCII}
                    onChange={() => setEncodeNonASCII(!encodeNonASCII)}
                    className="mr-2"
                  />
                  Encode non-ASCII
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="destructive" 
              onClick={handleClear}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            
            <Button 
              onClick={() => setShowHistory(!showHistory)}
              className="w-full sm:w-auto"
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="w-full sm:w-auto"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".txt"
                onChange={handleFileUpload}
              />
            </Button>
            
            <Button 
              onClick={handleProcess}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleCopy} 
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Result
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Result
          </Button>
        </div>
      </div>

      {showHistory && (
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">History</h2>
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between text-gray-300 mb-2">
                  <span>{entry.mode === 'encode' ? 'Encoded' : 'Decoded'}</span>
                  <span>{entry.timestamp.toLocaleString()}</span>
                </div>
                <div className="text-white">
                  <div className="mb-2">
                    <Label className="text-gray-400">Input:</Label>
                    <div className="bg-gray-800 p-2 rounded">{entry.input}</div>
                  </div>
                  <div>
                    <Label className="text-gray-400">Output:</Label>
                    <div className="bg-gray-800 p-2 rounded">{entry.output}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          About HTML Encoder/Decoder
        </h2>
        <p className="text-gray-300 mb-4">
          The HTML Encoder/Decoder is a powerful tool designed for web developers, content creators, and anyone working with HTML. It provides a simple and efficient way to convert plain text into HTML entities and vice versa, ensuring that your content displays correctly in web browsers and prevents potential security vulnerabilities.
        </p>

        <div className="my-8">
          <Image 
            src="/Images/HTMLEncoderDecoderPreview.png?height=400&width=600" 
            alt="Screenshot of the HTML Encoder/Decoder interface showing input and output areas, encoding options, and various controls" 
            width={600} 
            height={400}
            className="rounded-lg shadow-lg" 
          />
        </div>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Bidirectional Conversion:</strong> Easily encode plain text to HTML entities and decode HTML entities back to plain text.</li>
          <li><strong>Multiple Encoding Types:</strong> Choose between named entities, decimal entities, or hexadecimal entities for encoding.</li>
          <li><strong>Customizable Options:</strong> Control how newlines, quotes, and non-ASCII characters are handled during encoding.</li>
          <li><strong>Real-time Processing:</strong> See the results of your encoding or decoding instantly as you type or modify options.</li>
          <li><strong>File Handling:</strong> Upload text files for processing and download the results with ease.</li>
          <li><strong>History Tracking:</strong> Keep a record of your recent encodings and decodings for reference.</li>
          <li><strong>Clipboard Integration:</strong> Quickly paste text from and copy results to your clipboard.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Content Management:</strong> Safely prepare text for use in HTML documents, avoiding rendering issues and potential XSS vulnerabilities.</li>
          <li><strong>Data Scraping:</strong> Clean and process HTML content extracted from web pages.</li>
          <li><strong>Email Template Creation:</strong> Ensure special characters in email content display correctly across different email clients.</li>
          <li><strong>XML Processing:</strong> Prepare text for use in XML documents, ensuring proper escaping of special characters.</li>
          <li><strong>Debugging:</strong> Decode encoded HTML to investigate rendering issues or unexpected behavior in web applications.</li>
          <li><strong>Accessibility:</strong> Ensure that screen readers and other assistive technologies can correctly interpret your web content.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Choose between "Encode" and "Decode" mode based on your task.</li>
          <li>Select the encoding type (Named, Decimal, or Hexadecimal entities) when in encode mode.</li>
          <li>Enter or paste your text into the input field, or upload a text file.</li>
          <li>Adjust the encoding options as needed:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Toggle preservation of newlines</li>
              <li>Choose whether to encode quotes</li>
              <li>Enable non-ASCII character encoding</li>
            </ul>
          </li>
          <li>View the processed result in real-time in the output field.</li>
          <li>Use the "Encode" or "Decode" button to process the entire text at once.</li>
          <li>Copy the result to your clipboard or download it as a text file.</li>
          <li>Optionally, review your encoding/decoding history for reference.</li>
        </ol>

        <p className="text-gray-300 mt-8">
          Whether you're a web developer ensuring your content renders correctly, a content creator preparing text for various platforms, or a security professional safeguarding against XSS attacks, the HTML Encoder/Decoder is an indispensable tool in your web development toolkit. Its user-friendly interface, coupled with powerful features, streamlines the process of working with HTML entities, saving you time and reducing errors in your web projects.
        </p>
      </div>
    </ToolLayout>
  )
}

