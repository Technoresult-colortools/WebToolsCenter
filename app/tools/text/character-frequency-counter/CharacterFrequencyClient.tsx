'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/Button"
import Input  from "@/components/ui/Input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from '@/components/ui/select1';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, Download, RefreshCw, BarChart, Info, Lightbulb, BookOpen, Settings, Filter} from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'

const countModeOptions = [
  { value: "character", label: "Character Frequency" },
  { value: "word", label: "Word Frequency" },
];

const sortOrderOptions = [
  { value: "descending", label: "Descending" },
  { value: "ascending", label: "Ascending" },
];

export default function CharacterFrequencyCounter() {
  const [inputText, setInputText] = useState('')
  const [charFrequency, setCharFrequency] = useState<Record<string, number>>({})
  const [wordFrequency, setWordFrequency] = useState<Record<string, number>>({})
  const [mode, setMode] = useState('character')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [excludeSpaces, setExcludeSpaces] = useState(false)
  const [excludePunctuation, setExcludePunctuation] = useState(false)
  const [sortOrder, setSortOrder] = useState('descending')
  const [minFrequency, setMinFrequency] = useState(1)

  const calculateFrequency = () => {
    const text = caseSensitive ? inputText : inputText.toLowerCase()
    const charFreq: Record<string, number> = {}
    const wordFreq: Record<string, number> = {}

    if (mode === 'character') {
      for (const char of text) {
        if (excludeSpaces && char === ' ') continue
        if (excludePunctuation && /[^\w\s]/.test(char)) continue
        charFreq[char] = (charFreq[char] || 0) + 1
      }
      setCharFrequency(charFreq)
    } else if (mode === 'word') {
      const words = text.split(/\s+/)
      for (const word of words) {
        const cleanWord = excludePunctuation ? word.replace(/[^\w\s]/g, '') : word
        if (cleanWord) {
          wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1
        }
      }
      setWordFrequency(wordFreq)
    }
    toast.success(`${mode === 'character' ? 'Character' : 'Word'} frequency calculated!`)
  }

  const handleCopy = () => {
    const frequency = mode === 'character' ? charFrequency : wordFrequency
    const sortedEntries = Object.entries(frequency)
      .filter(([, value]) => value >= minFrequency)
      .sort((a, b) => sortOrder === 'descending' ? b[1] - a[1] : a[1] - b[1])
    const text = sortedEntries.map(([key, value]) => `${key}: ${value}`).join('\n')
    navigator.clipboard.writeText(text)
    toast.success(`${mode === 'character' ? 'Character' : 'Word'} frequency copied to clipboard`)
  }

  const handleDownload = () => {
    const frequency = mode === 'character' ? charFrequency : wordFrequency
    const sortedEntries = Object.entries(frequency)
      .filter(([, value]) => value >= minFrequency)
      .sort((a, b) => sortOrder === 'descending' ? b[1] - a[1] : a[1] - b[1])
    const text = sortedEntries.map(([key, value]) => `${key}: ${value}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mode}_frequency.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${mode.charAt(0).toUpperCase() + mode.slice(1)} frequency downloaded`)
  }

  const handleClear = () => {
    setInputText('')
    setCharFrequency({})
    setWordFrequency({})
    toast.success('Input and results cleared')
  }

  return (
    <ToolLayout
      title="Character Frequency Counter"
      description="Analyze the frequency of characters and words in your text with advanced options and visualizations."
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <Textarea
          className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 mb-4"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Select
              label="Count Mode"
              options={countModeOptions}
              selectedKey={mode}
              onSelectionChange={(key) => setMode(key)}
              className="max-w-full"
              placeholder="Select Count Mode"
            />
          </div>
          <div>
            <Select
              label="Sort Order"
              options={sortOrderOptions}
              selectedKey={sortOrder}
              onSelectionChange={(key) => setSortOrder(key)}
              className="max-w-full"
              placeholder="Select Sort Order"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-gray-700 text-white border-gray-600">
                <Settings className="mr-2 h-4 w-4" />
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-700 text-white border-gray-600">
              <DropdownMenuLabel>Analysis Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCaseSensitive(!caseSensitive)}>
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={() => setCaseSensitive(!caseSensitive)}
                  className="mr-2"
                />
                Case Sensitive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setExcludeSpaces(!excludeSpaces)}>
                <input
                  type="checkbox"
                  checked={excludeSpaces}
                  onChange={() => setExcludeSpaces(!excludeSpaces)}
                  className="mr-2"
                />
                Exclude Spaces
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setExcludePunctuation(!excludePunctuation)}>
                <input
                  type="checkbox"
                  checked={excludePunctuation}
                  onChange={() => setExcludePunctuation(!excludePunctuation)}
                  className="mr-2"
                />
                Exclude Punctuation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center">
            <Label htmlFor="min-frequency" className="mr-2 text-sm font-medium text-gray-300">
              Min Frequency:
            </Label>
            <Input
              id="min-frequency"
              type="number"
              min="1"
              value={minFrequency}
              onChange={(e) => setMinFrequency(parseInt(e.target.value) || 1)}
              className="w-20 bg-gray-700 text-white border-gray-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Button onClick={calculateFrequency} className="bg-blue-600 hover:bg-blue-700 text-white">
            <BarChart className="h-5 w-5 mr-2" />
            Calculate Frequency
          </Button>
          <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Copy className="h-5 w-5 mr-2" />
            Copy
          </Button>
          <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-5 w-5 mr-2" />
            Download
          </Button>
          <Button onClick={handleClear} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RefreshCw className="h-5 w-5 mr-2" />
            Clear
          </Button>
        </div>

        <div className="mb-6">
          <Label htmlFor="frequency-results" className="block text-lg font-medium text-gray-200 mb-2">
            Frequency Results:
          </Label>
          <Textarea
            id="frequency-results"
            value={
              (() => {
                const frequency = mode === 'character' ? charFrequency : wordFrequency
                return Object.entries(frequency)
                  .filter(([, value]) => value >= minFrequency)
                  .sort((a, b) => sortOrder === 'descending' ? b[1] - a[1] : a[1] - b[1])
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n')
              })()
            }
            readOnly
            className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Character Frequency Counter?
        </h2>
        <p className="text-gray-300 mb-4">
          The Character Frequency Counter is an advanced text analysis tool designed for writers, linguists, cryptographers, and data analysts. It goes beyond simple counting, offering detailed insights into the composition of your text with customizable options and <Link href="#features" className="text-blue-400 hover:underline">powerful features</Link>. Whether you're analyzing writing styles, decoding messages, or conducting language research, our tool provides the flexibility and precision you need.
        </p>
        <p className="text-gray-300 mb-4">
          From character-level analysis to word frequency counting, this tool offers a comprehensive view of your text's structure. It's like having a microscope for your writing, revealing patterns and frequencies that might otherwise go unnoticed!
        </p>

        <div className="my-8">
          <Image 
            src="/Images/CharacterFrequencyPreview.png?height=400&width=600" 
            alt="Screenshot of the Character Frequency Counter interface showing text input area, analysis options, and frequency results" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Character Frequency Counter
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter or paste your text into the input area.</li>
          <li>Choose between Character Frequency or Word Frequency mode.</li>
          <li>Adjust analysis options like case sensitivity, space exclusion, and punctuation handling.</li>
          <li>Set the minimum frequency threshold if you want to filter out rare occurrences.</li>
          <li>Click "Calculate Frequency" to analyze your text.</li>
          <li>View the results in the output area, sorted by frequency.</li>
          <li>Use the "Copy" button to copy results to your clipboard or "Download" to save as a file.</li>
          <li>Click "Clear" to reset the tool for a new analysis.</li>
        </ol>

        <h2 id="features" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Dual Mode Analysis:</strong> Switch between character and word frequency counting.</li>
          <li><strong>Customizable Options:</strong> Adjust for case sensitivity, space exclusion, and punctuation handling.</li>
          <li><strong>Frequency Threshold:</strong> Filter results based on minimum occurrence count.</li>
          <li><strong>Sorting Options:</strong> View results in ascending or descending order of frequency.</li>
          <li><strong>Instant Calculations:</strong> Get real-time updates as you modify your text or options.</li>
          <li><strong>Export Functionality:</strong> Copy results to clipboard or download as a text file.</li>
          <li><strong>Clear and Reset:</strong> Easily start a new analysis with a single click.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Filter className="w-6 h-6 mr-2" />
          Advanced Options Explained
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Case Sensitivity:</strong> Choose whether to treat uppercase and lowercase letters as distinct.</li>
          <li><strong>Exclude Spaces:</strong> Option to ignore space characters in character frequency analysis.</li>
          <li><strong>Exclude Punctuation:</strong> Remove punctuation marks from the analysis.</li>
          <li><strong>Minimum Frequency:</strong> Set a threshold to focus on more frequent characters or words.</li>
          <li><strong>Sort Order:</strong> Arrange results from most to least frequent (descending) or vice versa (ascending).</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Practical Applications
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Linguistic Analysis:</strong> Study language patterns and character distributions.</li>
          <li><strong>Cryptography:</strong> Analyze frequency patterns for code-breaking or creating ciphers.</li>
          <li><strong>Writing Style Analysis:</strong> Compare character or word usage across different texts or authors.</li>
          <li><strong>SEO Optimization:</strong> Analyze keyword frequency and density in web content.</li>
          <li><strong>Data Cleaning:</strong> Identify and quantify non-standard characters or typos in large datasets.</li>
          <li><strong>Language Learning:</strong> Study character or word frequency to prioritize vocabulary learning.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to dive deep into your text analysis? Start using our Character Frequency Counter now and uncover the hidden patterns in your writing. Whether you're a professional analyst, a curious writer, or a student exploring language, our tool provides the insights you need to understand your text at a granular level. Try it out and see what you discover in your words!
        </p>
      </div>
    </ToolLayout>
  )
}