'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster, toast } from 'react-hot-toast';
import { Copy, Download, RefreshCw, BarChart } from 'lucide-react';

export default function CharacterFrequencyCounter() {
  const [inputText, setInputText] = useState('');
  const [charFrequency, setCharFrequency] = useState<Record<string, number>>({});
  const [wordFrequency, setWordFrequency] = useState<Record<string, number>>({});
  const [mode, setMode] = useState('character'); // 'character' or 'word'

  const calculateFrequency = () => {
    let text = inputText.trim().toLowerCase();
    const charFreq: Record<string, number> = {};
    const wordFreq: Record<string, number> = {};

    if (mode === 'character') {
      for (let char of text) {
        if (char !== ' ') {
          charFreq[char] = (charFreq[char] || 0) + 1;
        }
      }
      setCharFrequency(charFreq);
    } else if (mode === 'word') {
      const words = text.split(/\s+/);
      for (let word of words) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
      setWordFrequency(wordFreq);
    }
    toast.success(`${mode === 'character' ? 'Character' : 'Word'} frequency calculated!`);
  };

  const handleCopy = () => {
    const frequency = mode === 'character' ? charFrequency : wordFrequency;
    const text = Object.entries(frequency)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast.success(`${mode === 'character' ? 'Character' : 'Word'} frequency copied to clipboard`);
  };

  const handleDownload = () => {
    const frequency = mode === 'character' ? charFrequency : wordFrequency;
    const text = Object.entries(frequency)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}_frequency.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`${mode.charAt(0).toUpperCase() + mode.slice(1)} frequency downloaded`);
  };

  const handleClear = () => {
    setInputText('');
    setCharFrequency({});
    setWordFrequency({});
    toast.success('Input and results cleared');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Character Frequency Counter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <textarea
            className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Count Mode:
            </label>
            <select
              className="bg-gray-700 text-white border-gray-600 rounded-md p-2 w-full"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="character">Character Frequency</option>
              <option value="word">Word Frequency</option>
            </select>
          </div>

          <div className="mb-6 flex flex-wrap justify-center gap-4">
            <Button onClick={calculateFrequency} className="bg-blue-600 hover:bg-blue-700 text-white">
              <BarChart className="h-5 w-5 mr-2" />
              Calculate Frequency
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
            <label htmlFor="frequency-results" className="block text-lg font-medium text-gray-200 mb-2">
              Frequency Results:
            </label>
            <textarea
              id="frequency-results"
              value={
                mode === 'character'
                  ? Object.entries(charFrequency)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join('\n')
                  : Object.entries(wordFrequency)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join('\n')
              }
              readOnly
              className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
            />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
              <section>
                <h2 className="text-xl font-semibold text-white mb-2">About Character Frequency Counter</h2>
                <p className="text-white">
                    The Character Frequency Counter is a tool designed to analyze the frequency of characters and words in a given text. It’s useful for text analysis, statistical research, and pattern detection. Whether you're a writer, developer, or linguist, this tool can help you identify the most common and rare characters in your text.
                </p>
              </section>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
              <section>
                <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
                <ol className="text-white list-decimal list-inside">
                    <li>Enter or paste the text you want to analyze in the input field.</li>
                    <li>Click the "Analyze" button to count the frequency of each character.</li>
                    <li>The results will display the character frequencies, including spaces or punctuation, based on your input.</li>
                    <li>Use the "Copy" button to copy the frequency results to your clipboard.</li>
                    <li>Select "Download" to save the results as a text file for further use.</li>
                    <li>Click "Clear" to reset the input and output fields.</li>
                </ol>
              </section>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
              <section>
                <h2 className="text-xl font-semibold text-white mb-2">Features</h2>
                <ul className="text-white list-disc list-inside">
                    <li>Analyze: Calculates the frequency of characters in the provided text.</li>
                    <li>Copy: Copies the character frequency results to your clipboard for easy sharing.</li>
                    <li>Download: Saves the analysis results as a .txt file for offline usage or archiving.</li>
                    <li>Clear: Resets the input and output areas for new text analysis.</li>
                </ul>
              </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
