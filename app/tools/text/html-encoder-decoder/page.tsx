'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, ArrowRight, Wand2, Code, FileCode, FileText } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HTMLEncoderDecoder() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [preserveNewlines, setPreserveNewlines] = useState(true);
  const [encodeQuotes, setEncodeQuotes] = useState(true);
  const [encodeNonASCII, setEncodeNonASCII] = useState(false);

  useEffect(() => {
    processText(inputText);
  }, [inputText, mode, preserveNewlines, encodeQuotes, encodeNonASCII]);

  const processText = (text: string) => {
    if (mode === 'encode') {
      setOutputText(encodeHTML(text));
    } else {
      setOutputText(decodeHTML(text));
    }
  };

  const encodeHTML = (text: string) => {
    let result = text.replace(/&/g, '&amp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;');
    
    if (encodeQuotes) {
      result = result.replace(/"/g, '&quot;')
                     .replace(/'/g, '&#39;');
    }
    
    if (!preserveNewlines) {
      result = result.replace(/\n/g, '');
    }
    
    if (encodeNonASCII) {
      result = result.replace(/[^\x00-\x7F]/g, function(char) {
        return '&#x' + char.charCodeAt(0).toString(16) + ';';
      });
    }
    
    return result;
  };

  const decodeHTML = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    processText(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleProcess = () => {
    processText(inputText);
    toast.success(`Text ${mode}d!`);
  };

  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'encode' ? 'decode' : 'encode';
      processText(inputText);
      return newMode;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">HTML Encoder/Decoder</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <Label htmlFor="input-text" className="text-white mb-2 block">Enter your text:</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={handleInputChange}
              placeholder={`Type or paste your ${mode === 'encode' ? 'plain' : 'HTML-encoded'} text here`}
              className="w-full bg-gray-700 text-white border-gray-600 h-32"
            />
          </div>

          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <Button
              variant={mode === 'encode' ? "default" : "outline"}
              onClick={toggleMode}
              className="flex-grow sm:flex-grow-0 py-2 px-4"
            >
              {mode === 'encode' ? <Code className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="preserve-newlines"
                checked={preserveNewlines}
                onCheckedChange={(checked) => {
                  setPreserveNewlines(checked);
                  processText(inputText);
                }}
              />
              <Label htmlFor="preserve-newlines" className="text-white">Preserve newlines</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="encode-quotes"
                checked={encodeQuotes}
                onCheckedChange={(checked) => {
                  setEncodeQuotes(checked);
                  processText(inputText);
                }}
              />
              <Label htmlFor="encode-quotes" className="text-white">Encode quotes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="encode-non-ascii"
                checked={encodeNonASCII}
                onCheckedChange={(checked) => {
                  setEncodeNonASCII(checked);
                  processText(inputText);
                }}
              />
              <Label htmlFor="encode-non-ascii" className="text-white">Encode non-ASCII</Label>
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <Button 
              variant="destructive" 
              onClick={handleClear}
              className="flex-grow sm:flex-grow-0 py-2 px-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button 
              onClick={handleProcess}
              className="flex-grow sm:flex-grow-0 py-2 px-4 bg-green-600 hover:bg-green-700 text-white"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              {mode === 'encode' ? 'Encode' : 'Decode'}
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

          <Button 
            onClick={handleCopy} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Result
          </Button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">About HTML Encoder/Decoder</h2>
          <p className="text-gray-300 mb-4">
            The HTML Encoder/Decoder is a versatile tool designed to convert text between plain text and HTML-encoded format. It's essential for web developers and content creators who need to ensure their text is properly formatted for HTML documents.
          </p>
          <p className="text-gray-300">
            This tool offers features like preserving newlines, encoding quotes, and handling non-ASCII characters, giving you precise control over the encoding process. Whether you're preparing content for a website, debugging HTML issues, or decoding encoded text, this tool simplifies the process and helps prevent common encoding-related problems.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter or paste your text into the input field at the top of the page.</li>
            <li>Choose between "Encode" and "Decode" mode depending on your needs.</li>
            <li>Use the toggle switches to customize the encoding process:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>"Preserve newlines" keeps line breaks in the encoded output.</li>
                <li>"Encode quotes" converts quotation marks to their HTML entities.</li>
                <li>"Encode non-ASCII" converts non-ASCII characters to their numeric character references.</li>
              </ul>
            </li>
            <li>Click the "Encode" or "Decode" button to manually trigger the process (it also happens automatically as you type).</li>
            <li>Click the "Copy Result" button to copy the processed text to your clipboard.</li>
            <li>Use the "Clear" button to reset both input and output fields.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Use the "Encode" mode when preparing text to be inserted into HTML documents to prevent potential rendering issues or security vulnerabilities.</li>
            <li>The "Decode" mode is useful for converting HTML-encoded text back to its original form, which can be helpful when editing or reviewing encoded content.</li>
            <li>The "Preserve newlines" option is particularly useful when encoding multi-line text, such as paragraphs or code snippets.</li>
            <li>"Encode quotes" is important when your text will be used within HTML attributes to prevent attribute value conflicts.</li>
            <li>Use "Encode non-ASCII" when you need to ensure your text is compatible with older systems or when you want to represent all characters using only ASCII characters.</li>
            <li>Remember that while HTML encoding helps prevent certain issues, it's not a substitute for proper sanitization when dealing with user-generated content. Always implement appropriate security measures on the server-side.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}