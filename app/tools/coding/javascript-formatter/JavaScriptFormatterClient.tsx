'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Input from "@/components/ui/Input"
import { Select } from '@/components/ui/select1';
import { Toaster, toast } from 'react-hot-toast'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { FileMinus, Copy, RefreshCw, Download, Upload, Info, BookOpen, Lightbulb, Code, Settings } from 'lucide-react'
import ToolLayout from '@/components/ToolLayout'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import Image from 'next/image'

export default function JavaScriptFormatter() {
  const [inputJS, setInputJS] = useState('')
  const [outputJS, setOutputJS] = useState('')
  const [isFormatting, setIsFormatting] = useState(false)
  const [useTabs, setUseTabs] = useState(false)
  const [singleQuotes, setSingleQuotes] = useState(false)
  const [semicolons, setSemicolons] = useState(true)
  const [indentSize, setIndentSize] = useState('2')
  const [fileName, setFileName] = useState('')
  const [removeComments, setRemoveComments] = useState(false)
  const [compressCode, setCompressCode] = useState(false)
  const [sortImports, setSortImports] = useState(false)
  const [removeConsoleLog, setRemoveConsoleLog] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

const formatJS = () => {
  setIsFormatting(true);
  try {
    let formatted = inputJS.trim();

    if (removeComments) {
      // Remove single-line comments
      formatted = formatted.replace(/\/\/.*$/gm, '');
      // Remove multi-line comments
      formatted = formatted.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    if (sortImports) {
      const importLines = formatted.match(/import.*from.*;?/g) || [];
      const sortedImports = importLines.sort().join('\n');
      formatted = formatted.replace(/import.*from.*;?/g, '');
      formatted = sortedImports + '\n\n' + formatted;
    }

    if (removeConsoleLog) {
      formatted = formatted.replace(/console\.log$$.*$$;?/g, '');
    }

    if (compressCode) {
      // Remove all whitespace
      formatted = formatted.replace(/\s+/g, ' ');
      // Remove spaces around operators
      formatted = formatted.replace(/\s*([+\-*/%=<>!&|,;:?])\s*/g, '$1');
    } else {
      // Improved formatting logic
      const lines = formatted.split(/\n/);
      let indentLevel = 0;
      formatted = lines.map(line => {
        line = line.trim();
        if (line.match(/[{[(]$/)) {
          const formatted = ' '.repeat(indentLevel * parseInt(indentSize)) + line;
          indentLevel++;
          return formatted;
        } else if (line.match(/^[}\])]/)) {
          indentLevel--;
          return ' '.repeat(indentLevel * parseInt(indentSize)) + line;
        }
        return ' '.repeat(indentLevel * parseInt(indentSize)) + line;
      }).join('\n');

      // Add newlines after semicolons (except in for loops)
      formatted = formatted.replace(/;(?!\s*(?:\s*for\s*\())/g, ';\n');

      // Add newlines before and after blocks
      formatted = formatted.replace(/\{(?!\})/g, '{\n');
      formatted = formatted.replace(/\}(?![\),;])/g, '\n}');

      // Add newlines after commas in object literals and array definitions
      formatted = formatted.replace(/,(?!\s*[\n\]}])/g, ',\n');
    }

    // Handle quotes
    if (singleQuotes) {
      formatted = formatted.replace(/"/g, "'");
    } else {
      formatted = formatted.replace(/'/g, '"');
    }

    // Handle semicolons
    if (semicolons) {
      formatted = formatted.replace(/(?<!;|\{)\s*$/gm, ';');
    } else {
      formatted = formatted.replace(/;(?=\s*$)/gm, '');
    }

    setOutputJS(formatted);
    toast.success('JavaScript formatted successfully!');
  } catch (error) {
    console.error('Formatting error:', error);
    toast.error('Error formatting JavaScript. Please check your input.');
  } finally {
    setIsFormatting(false);
  }
};

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Formatted JavaScript copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy to clipboard')
    })
  }

  const handleReset = () => {
    setInputJS('')
    setOutputJS('')
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Reset done successfully!')
  }

  const handleDownload = () => {
    const blob = new Blob([outputJS], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName || 'formatted.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Formatted JavaScript downloaded!')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInputJS(content)
      }
      reader.readAsText(file)
      toast.success('File uploaded successfully!')
    }
  }

  return (
    <ToolLayout
      title="JavaScript Formatter"
      description="Clean up and standardize your JavaScript code with advanced formatting options"
    >
      <Toaster position="top-right" />
      
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mb-8">
        <div className="space-y-6">
          <Tabs defaultValue="format" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="format">
                <Code className="w-4 h-4 mr-2" />
                Format JavaScript
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Formatting Options
              </TabsTrigger>
            </TabsList>
            <TabsContent value="format">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="input-js" className="text-white mb-2 block">JavaScript to Format</Label>
                  <Textarea
                    id="input-js"
                    placeholder="Enter JavaScript to format..."
                    value={inputJS}
                    onChange={(e) => setInputJS(e.target.value)}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  />
                </div>
                <div>
                  <Label htmlFor="output-js" className="text-white mb-2 block">Formatted JavaScript</Label>
                  <SyntaxHighlighter
                    language="javascript"
                    style={atomDark}
                    className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
                  >
                    {outputJS}
                  </SyntaxHighlighter>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useTabs"
                    checked={useTabs}
                    onCheckedChange={setUseTabs}
                  />
                  <Label htmlFor="useTabs" className="text-white">Use Tabs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="singleQuotes"
                    checked={singleQuotes}
                    onCheckedChange={setSingleQuotes}
                  />
                  <Label htmlFor="singleQuotes" className="text-white">Use Single Quotes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="semicolons"
                    checked={semicolons}
                    onCheckedChange={setSemicolons}
                  />
                  <Label htmlFor="semicolons" className="text-white">Add Semicolons</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="removeComments"
                    checked={removeComments}
                    onCheckedChange={setRemoveComments}
                  />
                  <Label htmlFor="removeComments" className="text-white">Remove Comments</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="compressCode"
                    checked={compressCode}
                    onCheckedChange={setCompressCode}
                  />
                  <Label htmlFor="compressCode" className="text-white">Compress Code</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sortImports"
                    checked={sortImports}
                    onCheckedChange={setSortImports}
                  />
                  <Label htmlFor="sortImports" className="text-white">Sort Imports</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="removeConsoleLog"
                    checked={removeConsoleLog}
                    onCheckedChange={setRemoveConsoleLog}
                  />
                  <Label htmlFor="removeConsoleLog" className="text-white">Remove Console.log</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="indentSize" className="text-white">Indent Size:</Label>
                  <Select
                    label="Indent Size"
                    options={[
                      { value: '2', label: '2 spaces' },
                      { value: '4', label: '4 spaces' },
                      { value: '8', label: '8 spaces' },
                    ]}
                    selectedKey={indentSize}
                    onSelectionChange={setIndentSize}
                    placeholder="Select indent size"
                    className="w-[180px] "
                  
                  />

                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-2 md:gap-4">
            <Button onClick={formatJS} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={isFormatting}>
              <FileMinus className="w-4 h-4 mr-2" />
              {isFormatting ? 'Formatting...' : 'Format'}
            </Button>
            <Button onClick={() => copyToClipboard(outputJS)} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button onClick={handleReset} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleDownload} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Upload JavaScript File</h3>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                id="file-upload"
                type="file"
                accept=".js,.jsx,.ts,.tsx"
                onChange={handleFileUpload}
                className="bg-gray-700 text-white border-gray-600 w-full sm:w-auto"
                ref={fileInputRef}
              />
              <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
            {fileName && (
              <p className="text-sm text-gray-300">Uploaded: {fileName}</p>
            )}
          </div>
        </div>
      </div>

      <Card className="bg-gray-800 shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is JavaScript Formatter?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            The JavaScript Formatter is a powerful and intuitive tool designed for web developers and programmers to clean up and standardize their JavaScript code. By applying consistent formatting rules, it helps improve code readability, maintainability, and collaboration among team members.
          </p>
          <p className="text-gray-300 mb-4">
            This tool goes beyond basic prettifying, offering advanced options like comment removal, code compression, and customizable formatting preferences. Whether you're a seasoned developer working on large-scale projects or a beginner learning JavaScript, our Enhanced JavaScript Formatter provides the flexibility and precision you need to maintain high-quality, consistent code.
          </p>

          <div className="my-8">
            <Image 
              src="/Images/JavaScriptFormatterPreview.png?height=400&width=600"  
              alt="Screenshot of the Enhanced JavaScript Formatter interface showing the code editor and formatting options" 
              width={600} 
              height={400}
              className="rounded-lg shadow-lg" 
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use JavaScript Formatter?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter your JavaScript code in the input area or upload a JavaScript file.</li>
            <li>Adjust formatting options according to your preferences (tabs, quotes, semicolons, indent size, etc.).</li>
            <li>Click the "Format" button to process your code.</li>
            <li>Review the formatted JavaScript in the output area.</li>
            <li>Use the Copy button to copy the formatted JavaScript to your clipboard.</li>
            <li>Use the Download button to save the formatted JavaScript as a file.</li>
            <li>Click Reset to clear all inputs and start over.</li>
            <li>Experiment with different formatting options to find the style that best suits your needs.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Custom formatting implementation for JavaScript</li>
            <li>Customizable indentation (spaces or tabs)</li>
            <li>Option to use single or double quotes for strings</li>
            <li>Control over semicolon insertion</li>
            <li>Adjustable indent size (2, 4, or 8 spaces)</li>
            <li>Comment removal option for cleaner output</li>
            <li>Code compression feature for minification</li>
            <li>Syntax highlighting for easy code reading</li>
            <li>File upload support for formatting existing JavaScript files</li>
            <li>One-click copy and download of formatted code</li>
            <li>Real-time formatting preview</li>
            <li>Import statement sorting</li>
            <li>Console.log removal option</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            Applications and Use Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Code Maintenance:</strong> Quickly format and standardize legacy JavaScript code.</li>
            <li><strong>Team Collaboration:</strong> Ensure consistent coding style across team members.</li>
            <li><strong>Learning Tool:</strong> Help beginners understand proper JavaScript formatting practices.</li>
            <li><strong>Code Review:</strong> Improve readability of code during review processes.</li>
            <li><strong>Debugging:</strong> Format minified or poorly formatted code for easier debugging.</li>
            <li><strong>Version Control:</strong> Standardize code before committing to maintain clean diffs.</li>
            <li><strong>Performance Optimization:</strong> Use the compression feature to minify code for production.</li>
            <li><strong>Documentation:</strong> Format code snippets for technical documentation or tutorials.</li>
          </ul>

          <p className="text-gray-300 mt-6">
            The JavaScript Formatter empowers you to maintain clean, consistent, and professional JavaScript code effortlessly. By providing an intuitive interface with advanced formatting options, this tool bridges the gap between manual code styling and automated formatting. Whether you're working on small scripts or large-scale applications, the Enhanced JavaScript Formatter gives you the control and flexibility you need to ensure your code adheres to best practices and team standards.
          </p>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}

