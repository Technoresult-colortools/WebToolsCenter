'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Input from "@/components/ui/Input";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, ArrowDown, ArrowUp, } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DuplicateLineRemover() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [keepFirstOccurrence, setKeepFirstOccurrence] = useState(true);
  const [addLineNumbers, setAddLineNumbers] = useState(false);
  const [startingLineNumber, setStartingLineNumber] = useState(1);

  useEffect(() => {
    removeDuplicates(inputText);
  }, [inputText, caseSensitive, trimWhitespace, keepFirstOccurrence, addLineNumbers, startingLineNumber]);

  const removeDuplicates = (text: string) => {
    const lines = text.split('\n');
    const seen = new Set();
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (trimWhitespace) {
        line = line.trim();
      }
      const key = caseSensitive ? line : line.toLowerCase();
      
      if (!seen.has(key) || (keepFirstOccurrence && i === lines.indexOf(line))) {
        seen.add(key);
        result.push(line);
      }
    }

    if (addLineNumbers) {
      const numberedLines = result.map((line, index) => 
        `${(index + startingLineNumber).toString().padStart(4, ' ')}  ${line}`
      );
      setOutputText(numberedLines.join('\n'));
    } else {
      setOutputText(result.join('\n'));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleSort = (ascending: boolean) => {
    const sortedLines = outputText.split('\n').sort((a, b) => {
      if (ascending) {
        return a.localeCompare(b);
      } else {
        return b.localeCompare(a);
      }
    });
    setOutputText(sortedLines.join('\n'));
    toast.success(`Lines sorted ${ascending ? 'ascending' : 'descending'}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Duplicate Line Remover</h1>

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
            <div className="flex items-center space-x-2">
              <Switch
                id="case-sensitive"
                checked={caseSensitive}
                onCheckedChange={setCaseSensitive}
              />
              <Label htmlFor="case-sensitive" className="text-white">Case sensitive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="trim-whitespace"
                checked={trimWhitespace}
                onCheckedChange={setTrimWhitespace}
              />
              <Label htmlFor="trim-whitespace" className="text-white">Trim whitespace</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="keep-first"
                checked={keepFirstOccurrence}
                onCheckedChange={setKeepFirstOccurrence}
              />
              <Label htmlFor="keep-first" className="text-white">Keep first occurrence</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="add-line-numbers"
                checked={addLineNumbers}
                onCheckedChange={setAddLineNumbers}
              />
              <Label htmlFor="add-line-numbers" className="text-white">Add line numbers</Label>
            </div>
          </div>

          {addLineNumbers && (
            <div className="mb-6">
              <Label htmlFor="starting-line-number" className="text-white mb-2 block">Starting line number:</Label>
              <Input
                id="starting-line-number"
                type="number"
                value={startingLineNumber}
                onChange={(e) => setStartingLineNumber(Number(e.target.value))}
                className="w-full bg-gray-700 text-white border-gray-600"
              />
            </div>
          )}

          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <Button onClick={handleClear} variant="destructive" className="flex-grow sm:flex-grow-0">
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button onClick={() => handleSort(true)} className="flex-grow sm:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowDown className="h-4 w-4 mr-2" />
              Sort A-Z
            </Button>
            <Button onClick={() => handleSort(false)} className="flex-grow sm:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowUp className="h-4 w-4 mr-2" />
              Sort Z-A
            </Button>
          </div>

          <div className="mb-6">
            <Label htmlFor="output-text" className="text-white mb-2 block">Result:</Label>
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              className="w-full bg-gray-700 text-white border-gray-600 h-32"
            />
          </div>

          <Button onClick={handleCopy} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
            <Copy className="h-4 w-4 mr-2" />
            Copy Result
          </Button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About Duplicate Line Remover</h2>
          <p className="text-gray-300 mb-4">
            The Duplicate Line Remover is a powerful tool designed to clean up your text by removing duplicate lines. It offers several features to customize how duplicates are identified and removed, making it useful for a variety of text processing tasks.
          </p>
          <p className="text-gray-300">
            Whether you&apos;re cleaning up data, organizing lists, or preparing text for further processing, this tool can help you quickly and efficiently remove unwanted duplicate lines.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter or paste your text into the input field at the top of the page.</li>
            <li>Use the switches to customize how duplicates are identified and removed:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>Case sensitive: Toggle to treat uppercase and lowercase letters as distinct.</li>
                <li>Trim whitespace: Remove leading and trailing whitespace when comparing lines.</li>
                <li>Keep first occurrence: Retain the first instance of a duplicate line instead of removing all occurrences.</li>
                <li>Add line numbers: Prefix each line with a number in the output.</li>
              </ul>
            </li>
            <li>If &quot;Add line numbers&quot; is enabled, you can set the starting line number.</li>
            <li>Use the &quot;Sort A-Z&quot; or &quot;Sort Z-A&quot; buttons to sort the output alphabetically.</li>
            <li>Click the &quot;Copy Result&quot; button to copy the processed text to your clipboard.</li>
            <li>Use the &quot;Clear&quot; button to reset both input and output fields.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Use the &quot;Case sensitive&quot; option when you need to distinguish between uppercase and lowercase versions of the same word or phrase.</li>
            <li>The &quot;Trim whitespace&quot; option is useful for cleaning up data where extra spaces might have been introduced accidentally.</li>
            <li>&quot;Keep first occurrence&quot; is helpful when you want to maintain the original order of your list while removing subsequent duplicates.</li>
            <li>Adding line numbers can be useful for referencing specific lines in the processed text, especially in large datasets.</li>
            <li>The sorting feature can help you organize your data alphabetically after removing duplicates.</li>
            <li>You can use this tool to clean up lists of email addresses, remove duplicate log entries, or consolidate any type of line-based data.</li>

          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}