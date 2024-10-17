'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, Info, Lightbulb, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/sidebarTools';

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
    toast.success('Text Cleared!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <div className='flex-grow flex'>
        {/* Sidebar */}
        <aside className=" bg-gray-800">
            <Sidebar />  
        </aside>
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="mb-12 text-center px-4">
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                  Text to ASCII/Hex/Binary Converter
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                  Text to ASCII/Hex/Binary Converter is a powerful tool that allows you to convert plain text into its ASCII, hexadecimal, and binary representations
              </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <Label htmlFor="input-text" className="text-white mb-2 block">
              Enter your text:
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here"
                className="w-full bg-gray-700 text-white border-gray-600"
              />
              <Button
                onClick={handleClear}
                variant="outline"
                className="bg-red-500 hover:bg-red-600 text-white flex-shrink-0"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
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
                <Button onClick={() => handleCopy(asciiResult)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy ASCII
                </Button>
              </TabsContent>
              <TabsContent value="hex">
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-white break-all">{hexResult || 'Hexadecimal result will appear here'}</p>
                </div>
                <Button onClick={() => handleCopy(hexResult)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Hexadecimal
                </Button>
              </TabsContent>
              <TabsContent value="binary">
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <p className="text-white break-all">{binaryResult || 'Binary result will appear here'}</p>
                </div>
                <Button onClick={() => handleCopy(binaryResult)} className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Binary
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About
            </h2>
            <p className="text-gray-300 mb-4">
              This Text to ASCII/Hex/Binary Converter is a powerful tool that allows you to convert plain text into its ASCII, 
              hexadecimal, and binary representations. It's useful for various purposes, including data encoding, cryptography, 
              and understanding how computers represent text internally.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter or paste your text into the input field at the top of the page.</li>
              <li>The converter will automatically generate the ASCII, hexadecimal, and binary representations.</li>
              <li>Use the tabs to switch between different representations.</li>
              <li>Click the "Copy" button to copy the desired representation to your clipboard.</li>
              <li>Use the "Clear" button to reset the input and all conversions.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>ASCII values range from 0 to 127, representing standard English characters and control codes.</li>
              <li>Hexadecimal uses base-16, with digits from 0-9 and A-F. Each ASCII character is represented by two hexadecimal digits.</li>
              <li>Binary uses base-2, with only 0s and 1s. Each ASCII character is represented by 8 binary digits (bits).</li>
              <li>You can use this tool to encode messages or create visual patterns with binary or hexadecimal representations.</li>
              <li>For programming tasks, you can use the hexadecimal output to represent characters in many programming languages (e.g., '\x41' for 'A' in C).</li>
              <li>The binary output can be useful for understanding bitwise operations or creating binary art.</li>
            </ul>
          </div>

        </main>
       </div> 
      <Footer />
    </div>
  );
}