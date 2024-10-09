'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/Button";
import { Copy, Download, Info, Lightbulb, BookOpen, RefreshCw, Undo2, Space, Slice, RefreshCcw } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

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
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'camel':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      ).replace(/\s+/g, '');
    case 'pascal':
      return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
    case 'snake':
      return text.toLowerCase().replace(/\s+/g, '_');
    case 'kebab':
      return text.toLowerCase().replace(/\s+/g, '-');
    case 'toggle':
      return text.split('').map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      ).join('');
    default:
      return text;
  }
}



export default function CaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedCase, setSelectedCase] = useState('lower');

  const handleConvert = () => {
    const converted = convertCase(inputText, selectedCase);
    setOutputText(converted);
    toast.success('Text converted successfully');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setInputText(text);
    } else {
      setInputText(text.slice(0, MAX_CHARS));
      toast.error(`Character limit of ${MAX_CHARS} reached`);
    }
  };

  const handleDownload = () => {
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
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    toast.success('Text cleared');
  };

  const handleReverse = () => {
    setOutputText(outputText.split('').reverse().join(''));
    toast.success('Text reversed');
  };

  const handleRemoveSpaces = () => {
    setOutputText(outputText.replace(/\s+/g, ''));
    toast.success('Spaces removed');
  };

  const handleTrim = () => {
    setOutputText(outputText.trim());
    toast.success('Text trimmed');
  };
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
     <Header />
     <Toaster position="top-right" />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Case Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <label htmlFor="input-text" className="block text-lg font-medium text-gray-200 mb-2">
              Input Text:
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={handleInputChange}
              className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
              placeholder="Enter your text here..."
            />
            <p className="text-sm text-gray-400 mt-2">
              {inputText.length}/{MAX_CHARS} characters
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="case-select" className="block text-lg font-medium text-gray-200 mb-2">
              Select Case:
            </label>
            <select
              id="case-select"
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
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
            </select>
          </div>

          <div className="flex justify-center">
            <Button
              
              onClick={handleConvert}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4"
              variant='default'
            >
              <RefreshCcw className="h-5 w-5 mr-2" />
              Convert
            </Button>
          </div>


          <div className="mb-6">
            <label htmlFor="output-text" className="block text-lg font-medium text-gray-200 mb-2">
              Output Text:
            </label>
            <textarea
              id="output-text"
              value={outputText}
              readOnly
              className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
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
            <Button onClick={handleReverse} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Undo2 className="h-5 w-5 mr-2" />
              Reverse
            </Button>
            <Button onClick={handleRemoveSpaces} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Space className="h-5 w-5 mr-2" />
              Remove Spaces
            </Button>
            <Button onClick={handleTrim} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Slice className="h-5 w-5 mr-2" />
              Trim
            </Button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is the Case Converter?
          </h2>
          <p className="text-gray-300 mb-4">
            The Case Converter is a simple yet powerful tool that allows users to quickly convert text between various cases and perform a range of text manipulations. 
            Whether you're a developer, writer, or anyone working with text, this tool provides an efficient way to transform your content into the desired format.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use the Case Converter?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter or paste your text in the input area.</li>
            <li>Select the desired case conversion from the dropdown menu.</li>
            <li>Click the "Convert" button to transform your text.</li>
            <li>Use additional buttons for more text manipulations.</li>
            <li>Copy or download the converted text as needed.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Available Cases
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>lowercase: all characters in lowercase</li>
            <li>UPPERCASE: all characters in uppercase</li>
            <li>Title Case: First Letter Of Each Word Capitalized</li>
            <li>Sentence case: Only first letter of the sentence capitalized</li>
            <li>camelCase: firstWordLowerCaseRestCapitalized</li>
            <li>PascalCase: EachWordStartsWithCapitalLetter</li>
            <li>snake_case: words_separated_by_underscores</li>
            <li>kebab-case: words-separated-by-hyphens</li>
            <li>ToGgLe CaSe: aLtErNaTiNg UpPeR aNd LoWeR cAsE</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Additional Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Reverse: Reverses the order of characters in the text.</li>
            <li>Remove Spaces: Removes all spaces from the text.</li>
            <li>Trim: Removes leading and trailing whitespace.</li>
            <li>Copy: Copies the converted text to clipboard.</li>
            <li>Download: Saves the converted text as a .txt file.</li>
            <li>Clear: Resets both input and output fields.</li>
          </ul>
        </div>


       
      </main>
      <Footer />
    </div>
  );
}