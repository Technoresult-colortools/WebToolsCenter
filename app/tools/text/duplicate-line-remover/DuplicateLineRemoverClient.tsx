'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Input from "@/components/ui/Input"
import { Toaster, toast } from 'react-hot-toast'
import { Copy, RefreshCw, ArrowDown, ArrowUp, Info, Lightbulb, BookOpen, FileDown, FileUp, Settings, Filter, Zap } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Select } from '@/components/ui/select1';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image'

const filterModeOptions = [
  { value: "remove", label: "Remove duplicates" },
  { value: "keep", label: "Keep only duplicates" },
];

export default function DuplicateLineRemover() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [trimWhitespace, setTrimWhitespace] = useState(true)
  const [keepFirstOccurrence, setKeepFirstOccurrence] = useState(true)
  const [addLineNumbers, setAddLineNumbers] = useState(false)
  const [startingLineNumber, setStartingLineNumber] = useState(1)
  const [ignoreEmptyLines, setIgnoreEmptyLines] = useState(false)
  const [customSeparator, setCustomSeparator] = useState('')
  const [filterMode, setFilterMode] = useState('remove') // 'remove' or 'keep'

  useEffect(() => {
    processText(inputText)
  }, [inputText, caseSensitive, trimWhitespace, keepFirstOccurrence, addLineNumbers, startingLineNumber, ignoreEmptyLines, customSeparator, filterMode])

  const processText = (text: string) => {
    const lines = text.split(customSeparator || '\n')
    const seen = new Set()
    const result = []

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]
      if (trimWhitespace) {
        line = line.trim()
      }
      if (ignoreEmptyLines && line === '') {
        continue
      }
      const key = caseSensitive ? line : line.toLowerCase()
      
      const isDuplicate = seen.has(key)
      if (filterMode === 'remove' && (!isDuplicate || (keepFirstOccurrence && i === lines.indexOf(line)))) {
        seen.add(key)
        result.push(line)
      } else if (filterMode === 'keep' && isDuplicate) {
        result.push(line)
      }
    }

    if (addLineNumbers) {
      const numberedLines = result.map((line, index) => 
        `${(index + startingLineNumber).toString().padStart(4, ' ')}  ${line}`
      )
      setOutputText(numberedLines.join('\n'))
    } else {
      setOutputText(result.join('\n'))
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText)
    toast.success('Copied to clipboard!')
  }

  const handleClear = () => {
    setInputText('')
    setOutputText('')
    toast.success('Input and output cleared')
  }

  const handleSort = (ascending: boolean) => {
    const sortedLines = outputText.split('\n').sort((a, b) => {
      if (ascending) {
        return a.localeCompare(b)
      } else {
        return b.localeCompare(a)
      }
    })
    setOutputText(sortedLines.join('\n'))
    toast.success(`Lines sorted ${ascending ? 'ascending' : 'descending'}`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputText(content)
        toast.success('File uploaded successfully')
      }
      reader.readAsText(file)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'processed_text.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('File downloaded')
  }

  return (
    <ToolLayout
      title="Duplicate Line Remover"
      description="Clean up your text by removing or keeping duplicate lines with advanced options"
    >
      <Toaster position="top-right" />

      <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
        <div className="mb-6">
          <Label htmlFor="input-text" className="text-white mb-2 block">Enter your text:</Label>
          <Textarea
            id="input-text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here"
            className="w-full bg-gray-700 text-white border-gray-600 h-32"
          />
        </div>

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="bg-gray-700 text-white border-gray-600">
                <Settings className="mr-2 h-4 w-4" />
                Options
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-700 text-white border-gray-600">
              <DropdownMenuLabel>Processing Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCaseSensitive(!caseSensitive)}>
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={() => setCaseSensitive(!caseSensitive)}
                  className="mr-2"
                />
                Case sensitive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTrimWhitespace(!trimWhitespace)}>
                <input
                  type="checkbox"
                  checked={trimWhitespace}
                  onChange={() => setTrimWhitespace(!trimWhitespace)}
                  className="mr-2"
                />
                Trim whitespace
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setKeepFirstOccurrence(!keepFirstOccurrence)}>
                <input
                  type="checkbox"
                  checked={keepFirstOccurrence}
                  onChange={() => setKeepFirstOccurrence(!keepFirstOccurrence)}
                  className="mr-2"
                />
                Keep first occurrence
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAddLineNumbers(!addLineNumbers)}>
                <input
                  type="checkbox"
                  checked={addLineNumbers}
                  onChange={() => setAddLineNumbers(!addLineNumbers)}
                  className="mr-2"
                />
                Add line numbers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIgnoreEmptyLines(!ignoreEmptyLines)}>
                <input
                  type="checkbox"
                  checked={ignoreEmptyLines}
                  onChange={() => setIgnoreEmptyLines(!ignoreEmptyLines)}
                  className="mr-2"
                />
                Ignore empty lines
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            label="Select Filter Mode"
            options={filterModeOptions}
            selectedKey={filterMode}
            onSelectionChange={(key) => setFilterMode(key)}
            className="max-w-full"
            placeholder="Select Filter Mode"
          />

          <Input
            placeholder="Custom separator (optional)"
            value={customSeparator}
            onChange={(e) => setCustomSeparator(e.target.value)}
            className="w-full sm:w-auto bg-gray-700 text-white border-gray-600"
          />
        </div>

        {addLineNumbers && (
          <div className="mb-6">
            <Label htmlFor="starting-line-number" className="text-white mb-2 block">Starting line number:</Label>
            <Input
              id="starting-line-number"
              type="number"
              value={startingLineNumber}
              onChange={(e) => setStartingLineNumber(Number(e.target.value))}
              className="w-full bg-gray-700 text-white border-gray-600"
            />
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <Button onClick={handleClear} variant="destructive" className="flex-grow sm:flex-grow-0">
            <RefreshCw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button onClick={() => handleSort(true)} className="flex-grow sm:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowDown className="h-4 w-4 mr-2" />
            Sort A-Z
          </Button>
          <Button onClick={() => handleSort(false)} className="flex-grow sm:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowUp className="h-4 w-4 mr-2" />
            Sort Z-A
          </Button>
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="flex-grow sm:flex-grow-0 bg-green-600 hover:bg-green-700 text-white inline-flex items-center px-4 py-2 rounded-md">
              <FileUp className="h-4 w-4 mr-2" />
              Upload File
            </span>
            <input
              id="file-upload"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

        </div>

        <div className="mb-6">
          <Label htmlFor="output-text" className="text-white mb-2 block">Result:</Label>
          <Textarea
            id="output-text"
            value={outputText}
            readOnly
            className="w-full bg-gray-700 text-white border-gray-600 h-32"
          />
        </div>

        <div className="flex space-x-4">
          <Button onClick={handleCopy} className="flex-grow sm:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white">
            <Copy className="h-4 w-4 mr-2" />
            Copy Result
          </Button>
          <Button onClick={handleDownload} className="flex-grow sm:flex-grow-0 bg-green-600 hover:bg-green-700 text-white">
            <FileDown className="h-4 w-4 mr-2" />
            Download Result
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Duplicate Line Remover?
        </h2>
        <p className="text-gray-300 mb-4">
          The Duplicate Line Remover is an advanced text processing tool designed for writers, data analysts, and anyone working with large text datasets. It goes beyond simple duplicate removal, offering customizable options to clean, filter, and organize your text data. With its <a href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</a> and powerful features, it's the perfect companion for text cleaning, data preprocessing, and content organization tasks.
        </p>
        <p className="text-gray-300 mb-4">
          Whether you're cleaning up log files, organizing lists, or preparing data for analysis, our tool provides you with the flexibility and precision you need. It's like having a Swiss Army knife for text processing right in your browser!
        </p>

        <div className="my-8">
          <Image 
            src="/Images/DuplicateLinePreview.png?height=400&width=600" 
            alt="Screenshot of the Duplicate Line Remover interface showing text input area, processing options, and result output" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Duplicate Line Remover
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter or paste your text into the input area, or use the "Upload File" button for larger datasets.</li>
          <li>Adjust the processing options to suit your needs:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Toggle case sensitivity for matching</li>
              <li>Choose to trim whitespace from lines</li>
              <li>Decide whether to keep the first occurrence of duplicates</li>
              <li>Enable or disable line numbering</li>
              <li>Set a custom separator for splitting lines (optional)</li>
            </ul>
          </li>
          <li>Select the filter mode: remove duplicates or keep only duplicates.</li>
          <li>View the processed result in the output area.</li>
          <li>Use the "Sort A-Z" or "Sort Z-A" buttons to organize the output if needed.</li>
          <li>Copy the result to your clipboard or download it as a text file.</li>
          <li>Use the "Clear" button to reset both input and output for a new task.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Zap className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Flexible Duplicate Handling:</strong> Remove duplicates or isolate them based on your needs.</li>
          <li><strong>Case Sensitivity Option:</strong> Choose whether to treat uppercase and lowercase as distinct.</li>
          <li><strong>Whitespace Trimming:</strong> Optionally remove leading and trailing spaces from each line.</li>
          <li><strong>First Occurrence Retention:</strong> Keep the first instance of duplicate lines if desired.</li>
          <li><strong>Line Numbering:</strong> Add sequential numbers to your output for easy reference.</li>
          <li><strong>Empty Line Filtering:</strong> Option to ignore blank lines during processing.</li>
          <li><strong>Custom Separators:</strong> Define your own line separators for specialized formats.</li>
          <li><strong>Sorting Capabilities:</strong> Arrange your output in ascending or descending order.</li>
          <li><strong>File Handling:</strong> Upload text files and download processed results.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Filter className="w-6 h-6 mr-2" />
          Advanced Options Explained
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Case Sensitivity:</strong> When enabled, "Hello" and "hello" are treated as different lines.</li>
          <li><strong>Trim Whitespace:</strong> Removes spaces at the beginning and end of each line before comparison.</li>
          <li><strong>Keep First Occurrence:</strong> Retains the first instance of a duplicate line instead of removing all occurrences.</li>
          <li><strong>Add Line Numbers:</strong> Prefixes each line in the output with a sequential number.</li>
          <li><strong>Ignore Empty Lines:</strong> Skips blank lines during the duplicate removal process.</li>
          <li><strong>Custom Separator:</strong> Allows processing of data that isn't newline-separated (e.g., comma-separated values).</li>
          <li><strong>Filter Mode:</strong> Choose between removing all duplicates or keeping only the lines that have duplicates.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Practical Applications
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Data Cleaning:</strong> Remove duplicate entries from datasets or logs.</li>
          <li><strong>List Management:</strong> Clean up mailing lists, contact information, or inventory lists.</li>
          <li><strong>Code Optimization:</strong> Identify and remove duplicate lines in source code or configuration files.</li>
          <li><strong>Content Analysis:</strong> Isolate unique or repeated phrases in large text corpora.</li>
          <li><strong>SEO Optimization:</strong> Identify duplicate meta descriptions or titles across web pages.</li>
          <li><strong>Log Analysis:</strong> Clean up log files by removing or isolating repeated entries.</li>
          <li><strong>Text Comparison:</strong> Prepare texts for diff operations by removing common lines.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to streamline your text processing tasks? Start using our Duplicate Line Remover now and experience the power of efficient, customizable text cleaning at your fingertips. Whether you're a data analyst, a content creator, or anyone dealing with large volumes of text, our tool is here to make your work easier and more productive. Try it out and see how it can transform your text processing workflow!
        </p>
      </div>
    </ToolLayout>
  )
}