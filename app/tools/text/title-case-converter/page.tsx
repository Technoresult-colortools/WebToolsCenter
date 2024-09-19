'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, ArrowRight, Wand2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const lowercaseWords = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 
  'to', 'from', 'by', 'in', 'of', 'over', 'with'
]);

export default function TitleCaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [capitalizeFirst, setCapitalizeFirst] = useState(true);
  const [respectAcronyms, setRespectAcronyms] = useState(true);

  useEffect(() => {
    convertToTitleCase(inputText);
  }, [inputText, capitalizeFirst, respectAcronyms]);

  const convertToTitleCase = (text: string) => {
    const words = text.split(/\s+/);
    const titleCaseWords = words.map((word, index) => {
      if (respectAcronyms && word === word.toUpperCase() && word.length > 1) {
        return word;
      }

      const lowerWord = word.toLowerCase();
      
      if (capitalizeFirst || index === 0 || index === words.length - 1 || !lowercaseWords.has(lowerWord)) {
        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
      }
      
      return lowerWord;
    });
    setOutputText(titleCaseWords.join(' '));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleConvert = () => {
    convertToTitleCase(inputText);
    toast.success('Text converted!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Title Case Converter</h1>

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
            <Button
              variant={capitalizeFirst ? "default" : "outline"}
              onClick={() => setCapitalizeFirst(!capitalizeFirst)}
              className="flex-grow sm:flex-grow-0 py-2 px-4"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Capitalize all words
            </Button>
            <Button
              variant={respectAcronyms ? "default" : "outline"}
              onClick={() => setRespectAcronyms(!respectAcronyms)}
              className="flex-grow sm:flex-grow-0 py-2 px-4"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Respect acronyms
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClear}
              className="flex-grow sm:flex-grow-0 py-2 px-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button 
              onClick={handleConvert}
              className="flex-grow sm:flex-grow-0 py-2 px-4 bg-green-600 hover:bg-green-700 text-white"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Convert
            </Button>
          </div>

          <div className="mb-6">
            <Label htmlFor="output-text" className="text-white mb-2 block">Title Case Result:</Label>
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              className="w-full bg-gray-700 text-white border-gray-600 h-32"
            />
          </div>

          <Button 
            onClick={handleCopy} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Result
          </Button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Title Case Converter</h2>
          <p className="text-gray-300 mb-4">
            The Title Case Converter is a powerful tool designed to transform your text into proper title case format. It intelligently capitalizes the first letter of each word, while keeping certain words in lowercase as per standard title case rules. This tool is perfect for creating headlines, book titles, article names, and more.
          </p>
          <p className="text-gray-300">
            Our converter offers additional features like the option to capitalize all words and respect acronyms, giving you more control over the output. Whether you're a writer, editor, or just someone looking to format text correctly, this tool simplifies the process of creating properly formatted titles.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter or paste your text into the input field at the top of the page.</li>
            <li>Use the "Capitalize all words" button to toggle between standard title case rules and capitalizing every word.</li>
            <li>Use the "Respect acronyms" button to toggle keeping acronyms in all caps.</li>
            <li>Click the "Convert" button to manually trigger the conversion (it also happens automatically as you type).</li>
            <li>Click the "Copy Result" button to copy the converted text to your clipboard.</li>
            <li>Use the "Clear" button to reset both input and output fields.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>By default, the converter follows standard title case rules, keeping certain words (like "and", "the", "in") lowercase unless they're the first or last word.</li>
            <li>Use the "Capitalize all words" option for formats that require every word to be capitalized, such as some headline styles.</li>
            <li>The "Respect acronyms" feature is useful when your text contains abbreviations or acronyms that should remain in all caps, like "NASA" or "FBI".</li>
            <li>For hyphenated words, the converter will capitalize both parts (e.g., "Self-Esteem" instead of "Self-esteem").</li>
            <li>Remember that while this tool follows general title case rules, some style guides may have specific requirements. Always check your target style guide for any special rules.</li>
            <li>You can use this tool to quickly format multiple titles or headlines by pasting them all at once, with each on a new line.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}