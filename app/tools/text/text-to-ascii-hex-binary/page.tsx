'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TextToAsciiHexBinary() {
  const [inputText, setInputText] = useState('');
  const [asciiResult, setAsciiResult] = useState('');
  const [hexResult, setHexResult] = useState('');
  const [binaryResult, setBinaryResult] = useState('');

  useEffect(() => {
    convertText(inputText);
  }, [inputText]);

  const convertText = (text: string) => {
    // ASCII conversion
    const ascii = text.split('').map(char => char.charCodeAt(0)).join(' ');
    setAsciiResult(ascii);

    // Hexadecimal conversion
    const hex = text.split('').map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    setHexResult(hex);

    // Binary conversion
    const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    setBinaryResult(binary);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setInputText('');
    setAsciiResult('');
    setHexResult('');
    setBinaryResult('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Text to ASCII/Hex/Binary Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <Label htmlFor="input-text" className="text-white mb-2 block">Enter your text:</Label>
            <Input
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type or paste your text here"
              className="w-full bg-gray-700 text-white border-gray-600"
            />
          </div>

          <div className="flex justify-end space-x-4 mb-6">
            <Button onClick={handleClear} variant="outline" className="bg-red-600 hover:bg-red-700 text-white">
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>

          <Tabs defaultValue="ascii">
            <TabsList className="mb-4">
              <TabsTrigger value="ascii">ASCII</TabsTrigger>
              <TabsTrigger value="hex">Hexadecimal</TabsTrigger>
              <TabsTrigger value="binary">Binary</TabsTrigger>
            </TabsList>
            <TabsContent value="ascii">
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-white break-all">{asciiResult || 'ASCII result will appear here'}</p>
              </div>
              <Button onClick={() => handleCopy(asciiResult)} className="bg-green-600 hover:bg-green-700 text-white">
                <Copy className="h-4 w-4 mr-2" />
                Copy ASCII
              </Button>
            </TabsContent>
            <TabsContent value="hex">
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-white break-all">{hexResult || 'Hexadecimal result will appear here'}</p>
              </div>
              <Button onClick={() => handleCopy(hexResult)} className="bg-green-600 hover:bg-green-700 text-white">
                <Copy className="h-4 w-4 mr-2" />
                Copy Hexadecimal
              </Button>
            </TabsContent>
            <TabsContent value="binary">
              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-white break-all">{binaryResult || 'Binary result will appear here'}</p>
              </div>
              <Button onClick={() => handleCopy(binaryResult)} className="bg-green-600 hover:bg-green-700 text-white">
                <Copy className="h-4 w-4 mr-2" />
                Copy Binary
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        {/* About section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About</h2>
          <p className="text-gray-300 mb-4">
            This Text to ASCII/Hex/Binary Converter is a powerful tool that allows you to convert plain text into its ASCII, hexadecimal, and binary representations. It's useful for various purposes, including data encoding, cryptography, and understanding how computers represent text internally.
          </p>
        </div>

        {/* How to Use section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter or paste your text into the input field at the top of the page.</li>
            <li>The converter will automatically generate the ASCII, hexadecimal, and binary representations.</li>
            <li>Use the tabs to switch between different representations.</li>
            <li>Click the "Copy" button to copy the desired representation to your clipboard.</li>
            <li>Use the "Clear" button to reset the input and all conversions.</li>
          </ol>
        </div>

        {/* Tips and Tricks section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>ASCII values range from 0 to 127, representing standard English characters and control codes.</li>
            <li>Hexadecimal uses base-16, with digits from 0-9 and A-F. Each ASCII character is represented by two hexadecimal digits.</li>
            <li>Binary uses base-2, with only 0s and 1s. Each ASCII character is represented by 8 binary digits (bits).</li>
            <li>You can use this tool to encode messages or create visual patterns with binary or hexadecimal representations.</li>
            <li>For programming tasks, you can use the hexadecimal output to represent characters in many programming languages (e.g., '\x41' for 'A' in C).</li>
            <li>The binary output can be useful for understanding bitwise operations or creating binary art.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}