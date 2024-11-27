'use client';

import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/Button";
import Image from 'next/image'
import Link from 'next/link'
import { 
  Copy, Download, Info, Lightbulb, BookOpen, RefreshCw, 
  Undo2, Space, Slice, RefreshCcw, Type, Trash2, 
  AlignJustify, SplitSquareHorizontal, Scissors, ZapIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ToolLayout from '@/components/ToolLayout';

const MAX_CHARS = 5000;

function convertCase(text: string, caseType: string): string {
  switch (caseType) {
    case 'lower':
      return text.toLowerCase();
    case 'upper':
      return text.toUpperCase();
    case 'title':
      return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    case 'sentence':
      return text.split('. ').map(sentence => 
        sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()
      ).join('. ');
    case 'camel':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '');
    case 'pascal':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
    case 'snake':
      return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
    case 'kebab':
      return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
    case 'toggle':
      return text.split('').map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      ).join('');
    case 'alternate':
      return text.split(' ').map((word, index) => 
        index % 2 === 0 ? word.toLowerCase() : word.toUpperCase()
      ).join(' ');
    case 'dot':
      return text.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '.');
    default:
      return text;
  }
}

export default function CaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedCase, setSelectedCase] = useState('lower');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const addToHistory = useCallback((text: string) => {
    setHistory(prev => [...prev, text]);
    setHistoryIndex(prev => prev + 1);
  }, []);

  const handleConvert = useCallback(() => {
    const converted = convertCase(inputText, selectedCase);
    setOutputText(converted);
    addToHistory(converted);
    toast.success('Text converted successfully');
  }, [inputText, selectedCase, addToHistory]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard');
  }, [outputText]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setInputText(text);
    } else {
      setInputText(text.slice(0, MAX_CHARS));
      toast.error(`Character limit of ${MAX_CHARS} reached`);
    }
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text downloaded successfully');
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText('');
    setOutputText('');
    setHistory([]);
    setHistoryIndex(-1);
    toast.success('Text cleared');
  }, []);

  const handleReverse = useCallback(() => {
    const reversed = outputText.split('').reverse().join('');
    setOutputText(reversed);
    addToHistory(reversed);
    toast.success('Text reversed');
  }, [outputText, addToHistory]);

  const handleRemoveSpaces = useCallback(() => {
    const noSpaces = outputText.replace(/\s+/g, '');
    setOutputText(noSpaces);
    addToHistory(noSpaces);
    toast.success('Spaces removed');
  }, [outputText, addToHistory]);

  const handleTrim = useCallback(() => {
    // Enhanced trim functionality
    const trimmed = outputText
      .replace(/^\s+/gm, '') // Remove leading spaces from each line
      .replace(/\s+$/gm, '') // Remove trailing spaces from each line
      .replace(/\n\s*\n\s*\n/g, '\n\n'); // Replace multiple blank lines with max two
    setOutputText(trimmed);
    addToHistory(trimmed);
    toast.success('Text trimmed');
  }, [outputText, addToHistory]);

  const handleCapitalizeWords = useCallback(() => {
    const capitalized = outputText.replace(/\b\w/g, char => char.toUpperCase());
    setOutputText(capitalized);
    addToHistory(capitalized);
    toast.success('Words capitalized');
  }, [outputText, addToHistory]);

  const handleRemoveDuplicateLines = useCallback(() => {
    const uniqueLines = Array.from(new Set(outputText.split('\n'))).join('\n');
    setOutputText(uniqueLines);
    addToHistory(uniqueLines);
    toast.success('Duplicate lines removed');
  }, [outputText, addToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setOutputText(history[historyIndex - 1]);
      toast.success('Undo successful');
    } else {
      toast.error('No more undo history');
    }
  }, [history, historyIndex]);


  return (
    <ToolLayout
      title="Case Converter"
      description="Transform your text into any case format instantly"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <label htmlFor="input-text" className="block text-lg font-medium text-gray-200 mb-2">
              Input Text:
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={handleInputChange}
              className="w-full h-48 bg-gray-700/50 text-white border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your text here..."
            />
            <p className="text-sm text-gray-400 mt-2">
              {inputText.length}/{MAX_CHARS} characters
            </p>

            <div className="mt-4">
              <label htmlFor="case-select" className="block text-lg font-medium text-gray-200 mb-2">
                Select Case:
              </label>
              <select
                id="case-select"
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                className="w-full bg-gray-700/50 text-white border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lower">lowercase</option>
                <option value="upper">UPPERCASE</option>
                <option value="title">Title Case</option>
                <option value="sentence">Sentence case</option>
                <option value="camel">camelCase</option>
                <option value="pascal">PascalCase</option>
                <option value="snake">snake_case</option>
                <option value="kebab">kebab-case</option>
                <option value="toggle">ToGgLe CaSe</option>
                <option value="alternate">Alternate WORDS</option>
                <option value="dot">dot.case</option>
              </select>
            </div>

            <Button
              onClick={handleConvert}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              <RefreshCcw className="h-5 w-5 mr-2" />
              Convert
            </Button>
          </div>

          {/* Output Section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <label htmlFor="output-text" className="block text-lg font-medium text-gray-200 mb-2">
              Output Text:
            </label>
            <textarea
              id="output-text"
              value={outputText}
              readOnly
              className="w-full h-48 bg-gray-700/50 text-white border border-gray-600 rounded-lg p-3"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700">
                <Copy className="h-4 w-4 mr-2" />
                <div className='text-xs'>Copy</div>
              </Button>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                <div className='text-xs'>Download</div>
              </Button>
              <Button onClick={handleReverse} className="bg-blue-600 hover:bg-blue-700">
                <Undo2 className="h-4 w-4 mr-2" />
                <div className='text-xs'>Reverse</div>
              </Button>
              <Button onClick={handleRemoveSpaces} className="bg-blue-600 hover:bg-blue-700">
                <Space className="h-4 w-4 mr-2" />
                <div className='text-xs'>No Spaces</div>
              </Button>
              <Button onClick={handleTrim} className="bg-blue-600 hover:bg-blue-700">
                <Slice className="h-4 w-4 mr-2" />
                <div className='text-xs'>Trim</div>
              </Button>
              <Button onClick={handleCapitalizeWords} className="bg-blue-600 hover:bg-blue-700">
                <Type className="h-4 w-4 mr-2" />
                <div className='text-xs'>Capitalize</div>
              </Button>
              <Button onClick={handleRemoveDuplicateLines} className="bg-blue-600 hover:bg-blue-700">
                <SplitSquareHorizontal className="h-4 w-4 mr-2" />
                <div className='text-xs'>Unique Lines</div>
              </Button>
              <Button onClick={handleClear} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                <div className='text-xs'>Clear</div>
              </Button>
              <Button 
                onClick={handleUndo} 
                disabled={historyIndex <= 0}
                className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                <div className='text-xs'>Undo</div>
              </Button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is the Case Converter?
          </h2>
          <p className="text-gray-300 mb-4">
            The Case Converter is a versatile text transformation tool designed for writers, developers, and content creators. It offers a wide range of text case conversions and manipulation features, all wrapped up in a <Link href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</Link>. Whether you need to quickly change text case for coding conventions, content formatting, or creative writing, our Case Converter has got you covered.
          </p>
          <p className="text-gray-300 mb-4">
            With support for multiple case types and additional text manipulation features, it's like having a Swiss Army knife for text editing right at your fingertips. Say goodbye to manual text reformatting and hello to efficiency!
          </p>

          <div className="my-8">
            <Image 
              src="/Images/CaseConverterPreview.png?height=400&width=600" 
              alt="Screenshot of the Case Converter interface showing various case conversion options and text manipulation tools" 
              width={600} 
              height={400} 
              className="rounded-lg shadow-lg"
            />
          </div>

          <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use the Case Converter
          </h2>
          <p className="text-gray-300 mb-4">
            Using our Case Converter is as easy as 1-2-3. Here's a quick guide to get you started:
          </p>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter or paste your text into the input box. Don't worry about the current formatting - we'll take care of that!</li>
            <li>Choose your desired case conversion from the <Link href="#case-types" className="text-blue-400 hover:underline">dropdown menu</Link>. We offer everything from lowercase to camelCase and beyond.</li>
            <li>Click the "Convert" button and watch as your text is instantly transformed.</li>
            <li>Need more tweaks? Use our additional <Link href="#text-tools" className="text-blue-400 hover:underline">text manipulation tools</Link> to further refine your text.</li>
            <li>Copy your converted text to the clipboard with a single click, or download it as a text file.</li>
            <li>Experiment freely! Our undo/redo feature lets you try different options without losing your work.</li>
          </ol>

          <h2 id="case-types" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Type className="w-6 h-6 mr-2" />
            Supported Case Types
          </h2>
          <p className="text-gray-300 mb-4">
            Our Case Converter supports a wide range of text case transformations to suit every need:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>lowercase</strong>: Convert all characters to lowercase</li>
            <li><strong>UPPERCASE</strong>: Transform all characters to uppercase</li>
            <li><strong>Title Case</strong>: Capitalize the first letter of each word</li>
            <li><strong>Sentence case</strong>: Capitalize the first letter of each sentence</li>
            <li><strong>camelCase</strong>: Join words and capitalize each word after the first</li>
            <li><strong>PascalCase</strong>: Similar to camelCase, but capitalize the first word too</li>
            <li><strong>snake_case</strong>: Replace spaces with underscores and use all lowercase</li>
            <li><strong>kebab-case</strong>: Replace spaces with hyphens and use all lowercase</li>
            <li><strong>ToGgLe CaSe</strong>: Alternate between uppercase and lowercase for each character</li>
            <li><strong>Alternate CASE</strong>: Alternate between lowercase and uppercase for each word</li>
            <li><strong>dot.case</strong>: Replace spaces with dots and use all lowercase</li>
          </ul>

          <h2 id="text-tools" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Scissors className="w-6 h-6 mr-2" />
            Additional Text Manipulation Tools
          </h2>
          <p className="text-gray-300 mb-4">
            Beyond case conversion, our tool offers several handy text manipulation features:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><strong>Reverse Text</strong>: Flip your text backwards</li>
            <li><strong>Remove Spaces</strong>: Eliminate all spaces from your text</li>
            <li><strong>Trim</strong>: Remove leading and trailing whitespace, and reduce multiple line breaks</li>
            <li><strong>Capitalize Words</strong>: Capitalize the first letter of every word</li>
            <li><strong>Remove Duplicate Lines</strong>: Keep only unique lines in your text</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Features That Make Us Stand Out
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li><ZapIcon className="w-4 h-4 inline-block mr-1" /> <strong>Lightning-fast conversions</strong>: Transform your text instantly</li>
            <li><RefreshCw className="w-4 h-4 inline-block mr-1" /> <strong>Undo/Redo functionality</strong>: Experiment without fear</li>
            <li><AlignJustify className="w-4 h-4 inline-block mr-1" /> <strong>Multiple case types</strong>: 11 different case conversions to choose from</li>
            <li><Scissors className="w-4 h-4 inline-block mr-1" /> <strong>Additional text tools</strong>: Go beyond simple case conversion</li>
            <li><Type className="w-4 h-4 inline-block mr-1" /> <strong>Character count</strong>: Keep track of your text length</li>
          </ul>

          <p className="text-gray-300 mt-4">
            Ready to transform your text with ease? Dive into our Case Converter and experience the power of efficient text manipulation. Whether you're a coder adhering to naming conventions, a writer perfecting your prose, or just someone who loves playing with text, our tool is here to make your life easier. Start converting and see the difference for yourself!
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}