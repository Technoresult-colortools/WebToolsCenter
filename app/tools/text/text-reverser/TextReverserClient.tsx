'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Toaster, toast } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Copy, Download, RefreshCw, Settings, Info, Lightbulb, BookOpen } from 'lucide-react';

export default function TextReverser() {
  const [inputText, setInputText] = useState('');
  const [reversedText, setReversedText] = useState('');
  const [reverseMode, setReverseMode] = useState('character');

  const reverseText = () => {
    const text = inputText.trim();
    if (reverseMode === 'character') {
      setReversedText(text.split('').reverse().join(''));
    } else if (reverseMode === 'word') {
      setReversedText(text.split(' ').reverse().join(' '));
    } else if (reverseMode === 'sentence') {
      setReversedText(text.split('.').reverse().join('. '));
    }
    toast.success('Text reversed!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reversedText);
    toast.success('Text copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([reversedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reversed_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text downloaded successfully');
  };

  const handleClear = () => {
    setInputText('');
    setReversedText('');
    toast.success('Text cleared');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Text Reverser</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <textarea
            className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reverse Mode:
            </label>
            <select
              className="bg-gray-700 text-white border-gray-600 rounded-md p-2 w-full"
              value={reverseMode}
              onChange={(e) => setReverseMode(e.target.value)}
            >
              <option value="character">By Character</option>
              <option value="word">By Word</option>
              <option value="sentence">By Sentence</option>
            </select>
          </div>

          <div className="mb-6 flex flex-wrap justify-center gap-4">
            <Button onClick={reverseText} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Settings className="h-5 w-5 mr-2" />
              Reverse
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
            <label htmlFor="reversed-text" className="block text-lg font-medium text-gray-200 mb-2">
              Reversed Text:
            </label>
            <textarea
              id="reversed-text"
              value={reversedText}
              readOnly
              className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
            />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Text Reverser
          </h2>
          <p className="text-gray-300 mb-4">
            The Text Reverser is a simple yet powerful tool that allows you to reverse the order of characters in your text. 
            Whether you want to reverse a sentence, a word, or a block of text, this tool makes it easy to do so in just one click. 
            It's great for creating puzzles, experimenting with text formatting, or simply having fun with your content!
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter or paste the text you want to reverse into the input field.</li>
            <li>Click the "Reverse Text" button to flip the text.</li>
            <li>The reversed text will appear in the output area below the input field.</li>
            <li>Use the "Copy" button to copy the reversed text to your clipboard.</li>
            <li>Click "Clear" to reset the input and output fields for new text.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Reverse: Instantly reverses the characters in the provided text.</li>
            <li>Copy: Copies the reversed text to your clipboard for easy use.</li>
            <li>Clear: Clears the input and output areas to start fresh.</li>
          </ul>
        </div>

      </main>
      <Footer />
    </div>
  );
}
