'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, Download, RefreshCw, Shuffle, Info, Lightbulb, BookOpen } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout'

const MAX_CHARS = 5000;

export default function WordsCounter() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [includeSpaces, setIncludeSpaces] = useState(true);

  
  const updateCounts = () => {
    const words = text.trim().split(/\s+/);
    setWordCount(words.length);
    setCharCount(includeSpaces ? text.length : text.replace(/\s+/g, '').length);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    updateCounts();
  };
   

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text downloaded successfully');
  };

  const handleClear = () => {
    setText('');
    setWordCount(0);
    setCharCount(0);
    toast.success('Text cleared');
  };

  const handleShuffleWords = () => {
    const shuffledText = text
      .split(/\s+/)
      .sort(() => Math.random() - 0.5)
      .join(' ');
    setText(shuffledText);
    updateCounts();
    toast.success('Text shuffled');
  };

  return (
    <ToolLayout
      title="Words Counter"
      description="Count the number of words and characters in your text"
    >
      <Toaster position="top-right" />
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-6">
              <label htmlFor="text" className="block text-lg font-medium text-gray-300 mb-2">
                Input Text:
              </label>
              <textarea
                id="text"
                value={text}
                onChange={handleTextChange}
                placeholder="Enter your text here..."
                className="w-full h-64 bg-gray-700 text-white border-gray-600 rounded-md p-2"
              />
              <p className="text-sm text-gray-400 mt-2">
                {text.length}/{MAX_CHARS} characters
              </p>
            </div>

            <div className="mb-6 flex items-center space-x-4">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={includeSpaces}
                  onChange={() => {
                    setIncludeSpaces(!includeSpaces);
                    updateCounts(); 
                  }}
                  className="mr-2"
                />
                Include Spaces in Character Count
              </label>
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-4">
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
              <Button onClick={handleShuffleWords} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Shuffle className="h-5 w-5 mr-2" />
                Shuffle Words
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium text-gray-200 mb-2">
                Word Count: {wordCount}
              </p>
              <p className="text-lg font-medium text-gray-200">
                Character Count: {charCount}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the Words Counter?
            </h2>
            <p className="text-gray-300 mb-4">
              The Words Counter is a versatile tool that helps you count the number of words and characters in your text. You can also choose whether to include spaces in the character count. It's ideal for writers, students, and anyone working with text. Additional features include the ability to shuffle words, copy the text, download it as a file, or clear the input and output fields.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Words Counter?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Paste or type your text in the input area.</li>
              <li>Click "Update Counts" to view the number of words and characters.</li>
              <li>Use the "Shuffle Words" button to rearrange the words randomly.</li>
              <li>Click "Copy" to copy the text to your clipboard.</li>
              <li>Select "Download" to save the text as a .txt file.</li>
              <li>Click "Clear" to reset the input and output fields.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Count Words: Displays the total number of words in the text.</li>
              <li>Count Characters: Displays the total number of characters, with an option to include or exclude spaces.</li>
              <li>Shuffle Words: Randomly rearranges the words in the text.</li>
              <li>Clear: Resets the input and output fields to their initial state.</li>
              <li>Copy: Copies the text to the clipboard for easy use.</li>
              <li>Download: Saves the text as a .txt file for offline use.</li>
            </ul>
          </div>

          </ToolLayout>
  );
}
