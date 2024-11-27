'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, Wand2, Code, FileText, History, Download, Upload, Clipboard, Info, BookOpen, Lightbulb, Settings } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
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

interface HistoryEntry {
  input: string
  output: string
  mode: 'encode' | 'decode'
  format: 'html' | 'url' | 'base64'
  timestamp: Date
}

export default function HTMLEncoderDecoder() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')
  const [preserveNewlines, setPreserveNewlines] = useState(true)
  const [encodeQuotes, setEncodeQuotes] = useState(true)
  const [encodeNonASCII, setEncodeNonASCII] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [encodingFormat, setEncodingFormat] = useState<'html' | 'url' | 'base64'>('html')
  const [minifyHTML, setMinifyHTML] = useState(false)
  const [escapeJS, setEscapeJS] = useState(false)
  const [customEntities, setCustomEntities] = useState<Record<string, string>>({})

  useEffect(() => {
    processText(inputText)
  }, [inputText, mode, preserveNewlines, encodeQuotes, encodeNonASCII, encodingFormat, minifyHTML, escapeJS, customEntities])

  const processText = (text: string) => {
    let processedText = ''
    
    if (mode === 'encode') {
      switch (encodingFormat) {
        case 'html':
          processedText = encodeHTML(text)
          break
        case 'url':
          processedText = encodeURIComponent(text)
          break
        case 'base64':
          processedText = btoa(unescape(encodeURIComponent(text)))
          break
      }
    } else {
      switch (encodingFormat) {
        case 'html':
          processedText = decodeHTML(text)
          break
        case 'url':
          try {
            processedText = decodeURIComponent(text)
          } catch {
            processedText = 'Invalid URL-encoded string'
          }
          break
        case 'base64':
          try {
            processedText = decodeURIComponent(escape(atob(text)))
          } catch {
            processedText = 'Invalid Base64 string'
          }
          break
      }
    }

    if (minifyHTML && encodingFormat === 'html') {
      processedText = processedText.replace(/>\s+</g, '><').trim()
    }

    if (escapeJS) {
      processedText = processedText
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
    }

    setOutputText(processedText)
  }

  const encodeHTML = (text: string) => {
    let result = text.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;')
    
    if (encodeQuotes) {
      result = result.replace(/"/g, '&quot;')
                     .replace(/'/g, '&#39;')
    }
    
    if (!preserveNewlines) {
      result = result.replace(/\n/g, '')
    }
    
    if (encodeNonASCII) {
      result = result.replace(/[^\x00-\x7F]/g, function(char) {
        return '&#x' + char.charCodeAt(0).toString(16) + ';'
      })
    }

    // Apply custom entities
    Object.entries(customEntities).forEach(([char, entity]) => {
      result = result.replace(new RegExp(char, 'g'), entity)
    })
    
    return result
  }

  const decodeHTML = (text: string) => {
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text
    let result = textarea.value

    // Reverse custom entities
    Object.entries(customEntities).forEach(([char, entity]) => {
      result = result.replace(new RegExp(entity, 'g'), char)
    })

    return result
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
        format: encodingFormat,
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
    a.download = `${mode}d-text-${encodingFormat}-${new Date().toISOString().slice(0, 10)}.txt`
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

  const handleAddCustomEntity = (char: string, entity: string) => {
    setCustomEntities(prev => ({ ...prev, [char]: entity }))
  }

  return (
    <ToolLayout
      title="HTML Encoder/Decoder"
      description="Encode and Decode text in multiple formats, including HTML entities, URL encoding, and Base64"
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
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

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant={mode === 'encode' ? "default" : "outline"}
              onClick={toggleMode}
              className="py-2 px-4"
            >
              {mode === 'encode' ? <Code className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>
            
            <Select
              value={encodingFormat}
              onValueChange={(value: 'html' | 'url' | 'base64') => setEncodingFormat(value)}
            >
              <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="w-[180px] bg-gray-700 text-white">
                <SelectItem value="html">HTML Entities</SelectItem>
                <SelectItem value="url">URL Encoding</SelectItem>
                <SelectItem value="base64">Base64</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-gray-700 text-white border-gray-600">
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
              <DropdownMenuItem onClick={() => setMinifyHTML(!minifyHTML)}>
                <input
                  type="checkbox"
                  checked={minifyHTML}
                  onChange={() => setMinifyHTML(!minifyHTML)}
                  className="mr-2"
                />
                Minify HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEscapeJS(!escapeJS)}>
                <input
                  type="checkbox"
                  checked={escapeJS}
                  onChange={() => setEscapeJS(!escapeJS)}
                  className="mr-2"
                />
                Escape for JavaScript
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={handleClear}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            
            <Button onClick={() => setShowHistory(!showHistory)}>
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
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
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleCopy} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Result
          </Button>
          
          <Button 
            onClick={handleDownload}
            variant="outline"
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
                  <span>{entry.mode === 'encode' ? 'Encoded' : 'Decoded'} ({entry.format})</span>
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
          The HTML Encoder/Decoder is a powerful and versatile tool designed for developers, web designers, and content creators. It offers comprehensive functionality for encoding and decoding text in multiple formats, including HTML entities, URL encoding, and Base64. This tool goes beyond basic conversion, providing advanced options for handling special characters, preserving formatting, and preparing text for various web-related tasks.
        </p>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Multi-format Support:</strong> Encode and decode text using HTML entities, URL encoding, or Base64.</li>
          <li><strong>Advanced Options:</strong> Customize the encoding process with options like preserving newlines, encoding quotes, and handling non-ASCII characters.</li>
          <li><strong>HTML Minification:</strong> Compress HTML by removing unnecessary whitespace.</li>
          <li><strong>JavaScript Escaping:</strong> Prepare text for use within JavaScript strings.</li>
          <li><strong>Custom Entity Mapping:</strong> Define and use custom character-to-entity mappings.</li>
          <li><strong>File Handling:</strong> Upload text files for processing and download the results.</li>
          <li><strong>History Tracking:</strong> Keep a record of recent encodings and decodings for easy reference.</li>
          <li><strong>Clipboard Integration:</strong> Quickly paste text from and copy results to the clipboard.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Practical Applications
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Web Development:</strong> Prepare text content for safe use in HTML, XML, or JavaScript contexts.</li>
          <li><strong>SEO Optimization:</strong> Encode meta tags and URLs to ensure proper rendering across different platforms.</li>
          <li><strong>Data Interchange:</strong> Convert data between different encoding formats for API communications.</li>
          <li><strong>Content Management:</strong> Process user-generated content to prevent XSS attacks and ensure proper display.</li>
          <li><strong>Email Template Creation:</strong> Encode special characters in email content for compatibility across email clients.</li>
          <li><strong>Debugging:</strong> Decode encoded strings to investigate issues in web applications or network requests.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use HTML Encoder/Decoder
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Choose between "Encode" and "Decode" mode based on your task.</li>
          <li>Select the appropriate encoding format (HTML entities, URL encoding, or Base64).</li>
          <li>Enter or paste your text into the input field, or upload a text file.</li>
          <li>Adjust the encoding options as needed:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Toggle preservation of newlines</li>
              <li>Choose whether to encode quotes</li>
              <li>Enable non-ASCII character encoding</li>
              <li>Activate HTML minification or JavaScript escaping if required</li>
            </ul>
          </li>
          <li>Click the "Encode" or "Decode" button to process your text.</li>
          <li>View the result in the output field.</li>
          <li>Copy the result to your clipboard or download it as a text file.</li>
          <li>Optionally, review your encoding/decoding history for reference.</li>
        </ol>

        <p className="text-gray-300 mt-8">
          Whether you're working on web development projects, managing content across different platforms, or dealing with data interchange, the HTML Encoder/Decoder provides a comprehensive solution for all your text encoding and decoding needs. Its intuitive interface and powerful features make it an essential tool for anyone working with web technologies and text processing.
        </p>
      </div>
    </ToolLayout>
  )
}