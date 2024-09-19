'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/Button";
import { Copy, Download } from 'lucide-react';
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

          <Button
            onClick={handleConvert}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Convert
          </Button>

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
            <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-700 text-white">
              <Copy className="h-5 w-5 mr-2" />
              Copy
            </Button>
            <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download
            </Button>
            <Button onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white">
              Clear
            </Button>
            <Button onClick={handleReverse} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Reverse
            </Button>
            <Button onClick={handleRemoveSpaces} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Remove Spaces
            </Button>
            <Button onClick={handleTrim} className="bg-pink-600 hover:bg-pink-700 text-white">
              Trim
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">About Case Converter</h2>
              <p className="text-white">
                This tool allows you to easily convert text between different cases and perform various text manipulations. It's perfect for developers, writers, and anyone who needs to quickly transform text.
              </p>
            </section>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <ol className="text-white list-decimal list-inside">
                <li>Enter or paste your text in the input area.</li>
                <li>Select the desired case conversion from the dropdown menu.</li>
                <li>Click the "Convert" button to transform your text.</li>
                <li>Use additional buttons for more text manipulations.</li>
                <li>Copy or download the converted text as needed.</li>
              </ol>
            </section>

        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Available Cases</h2>
              <ul className="text-white list-disc list-inside">
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
            </section>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Additional Features</h2>
              <ul className="text-white list-disc list-inside">
                <li>Reverse: Reverses the order of characters in the text.</li>
                <li>Remove Spaces: Removes all spaces from the text.</li>
                <li>Trim: Removes leading and trailing whitespace.</li>
                <li>Copy: Copies the converted text to clipboard.</li>
                <li>Download: Saves the converted text as a .txt file.</li>
                <li>Clear: Resets both input and output fields.</li>
              </ul>
            </section>

        </div>
            

            

          
      </main>
      <Footer />
    </div>
  );
}