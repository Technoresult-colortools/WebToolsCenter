'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Toaster, toast } from 'react-hot-toast';
import {Copy, Download, RefreshCw, ArchiveIcon } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function WhiteSpaceRemover() {
  const [text, setText] = useState('');
  const [removeLeadingTrailing, setRemoveLeadingTrailing] = useState(true);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);
  const [compressLineBreaks, setCompressLineBreaks] = useState(true);

  const handleRemoveWhiteSpace = () => {
    let result = text;
    
    if (removeLeadingTrailing) {
      result = result.trim();
    }
    
    if (removeExtraSpaces) {
      result = result.replace(/\s{2,}/g, ' ');
    }
    
    if (compressLineBreaks) {
      result = result.replace(/\n{2,}/g, '\n\n');
    }
    
    setText(result);
    toast.success('White spaces removed!');
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
    a.download = 'cleaned_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text downloaded successfully');
  };

  const handleClear = () => {
    setText('');
    toast.success('Text cleared');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">White Space Remover</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <label htmlFor="text" className="block text-lg font-medium text-gray-300 mb-2">
              Input Text:
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 bg-gray-700 text-white border-gray-600 rounded-md p-2"
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-4">
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={removeLeadingTrailing}
                onChange={() => setRemoveLeadingTrailing(!removeLeadingTrailing)}
                className="mr-2"
              />
              Remove Leading/Trailing Spaces
            </label>
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={removeExtraSpaces}
                onChange={() => setRemoveExtraSpaces(!removeExtraSpaces)}
                className="mr-2"
              />
              Remove Extra Spaces
            </label>
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={compressLineBreaks}
                onChange={() => setCompressLineBreaks(!compressLineBreaks)}
                className="mr-2"
              />
              Compress Line Breaks
            </label>
          </div>

          <div className="mb-6 flex flex-wrap justify-center gap-4">
            <Button onClick={handleRemoveWhiteSpace} className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArchiveIcon className="h-5 w-5 mr-2" />
              Remove White Spaces
            </Button>
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
          </div>

          <div className="mb-6">
            <label htmlFor="cleaned-text" className="block text-lg font-medium text-gray-200 mb-2">
              Cleaned Text:
            </label>
            <textarea
              id="cleaned-text"
              value={text}
              readOnly
              className="w-full h-64 bg-gray-700 text-white border-gray-600 rounded-md p-2"
            />
          </div>
        </div>

        <div className="bg-gray-800 shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">About White Space Remover</h2>
              <p className="text-white">
                This tool allows you to clean up your text by removing unwanted white spaces, extra spaces between words, and compressing multiple line breaks. It’s useful for formatting text to ensure consistency and readability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
              <ol className="text-white list-decimal list-inside">
                <li>Paste or type your text in the input area.</li>
                <li>Select the options for removing white spaces, extra spaces, and compressing line breaks as needed.</li>
                <li>Click the "Remove White Spaces" button to process the text.</li>
                <li>Use the "Copy" button to copy the cleaned text to your clipboard.</li>
                <li>Click "Download" to save the cleaned text as a .txt file.</li>
                <li>Click "Clear" to reset the input and output fields.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
              <ul className="text-white list-disc list-inside">
                <li>Remove Leading/Trailing Spaces: Trims spaces at the beginning and end of the text.</li>
                <li>Remove Extra Spaces: Collapses multiple spaces between words into a single space.</li>
                <li>Compress Line Breaks: Reduces multiple line breaks to a single line break.</li>
                <li>Clear: Resets the input and output fields.</li>
                <li>Copy: Copies the cleaned text to the clipboard.</li>
                <li>Download: Saves the cleaned text as a .txt file.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}