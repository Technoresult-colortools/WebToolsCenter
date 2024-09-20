'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, Download, RefreshCw, Shuffle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WordsCounter() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [includeSpaces, setIncludeSpaces] = useState(true);

  // Function to update word and character counts
  const updateCounts = () => {
    const words = text.trim().split(/\s+/);
    setWordCount(words.length);
    setCharCount(includeSpaces ? text.length : text.replace(/\s+/g, '').length);
  };

  // Update counts when text changes
  const handleTextChange = (e) => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Words Counter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <label htmlFor="text" className="block text-lg font-medium text-gray-300 mb-2">
              Input Text:
            </label>
            <textarea
              id="text"
              value={text}
              onChange={handleTextChange}
              className="w-full h-64 bg-gray-700 text-white border-gray-600 rounded-md p-2"
            />
          </div>

          <div className="mb-6 flex items-center space-x-4">
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={includeSpaces}
                onChange={() => {
                  setIncludeSpaces(!includeSpaces);
                  updateCounts(); // Update counts when checkbox changes
                }}
                className="mr-2"
              />
              Include Spaces in Character Count
            </label>
          </div>

          <div className="mb-6 flex flex-wrap justify-center gap-4">
            <Button onClick={handleCopy} className="bg-green-600 hover:bg-green-700 text-white">
              <Copy className="h-5 w-5 mr-2" />
              Copy
            </Button>
            <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download
            </Button>
            <Button onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white">
              <RefreshCw className="h-5 w-5 mr-2" />
              Clear
            </Button>
            <Button onClick={handleShuffleWords} className="bg-yellow-600 hover:bg-yellow-700 text-white">
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

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">About Words Counter</h2>
              <p className="text-white">
                This tool allows you to count the number of words and characters in your text. You can choose whether to include spaces in the character count. It also provides options to shuffle words, copy the text, download it, and clear the input and output fields.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <ol className="text-white list-decimal list-inside">
                <li>Paste or type your text in the input area.</li>
                <li>Click &quot;Update Counts&quot; to view the number of words and characters.</li>
                <li>Use the &quot;Shuffle Words&quot; button to rearrange the words randomly.</li>
                <li>Click &quot;Copy&quot; to copy the text to your clipboard.</li>
                <li>Select &quot;Download&quot; to save the text as a .txt file.</li>
                <li>Click &quot;Clear&quot; to reset the input and output fields.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="text-white list-disc list-inside">
                <li>Count Words: Displays the total number of words in the text.</li>
                <li>Count Characters: Displays the total number of characters in the text, with an option to include or exclude spaces.</li>
                <li>Shuffle Words: Randomly rearranges the words in the text.</li>
                <li>Clear: Resets the input and output fields.</li>
                <li>Copy: Copies the text to the clipboard for easy use.</li>
                <li>Download: Saves the text as a .txt file for offline use.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
