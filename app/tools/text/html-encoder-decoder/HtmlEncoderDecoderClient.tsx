'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, Wand2, Code, FileText, History, Download, Upload, Clipboard, Info, BookOpen, Lightbulb } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import ToolLayout from '@/components/ToolLayout'


interface HistoryEntry {
  input: string;
  output: string;
  mode: 'encode' | 'decode';
  timestamp: Date;
}

export default function HTMLEncoderDecoder() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [preserveNewlines, setPreserveNewlines] = useState(true);
  const [encodeQuotes, setEncodeQuotes] = useState(true);
  const [encodeNonASCII, setEncodeNonASCII] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [encodingFormat, setEncodingFormat] = useState<'html' | 'url' | 'base64'>('html');
  const [minifyHTML, setMinifyHTML] = useState(false);
  const [escapeJS, setEscapeJS] = useState(false);

  useEffect(() => {
    processText(inputText);
  }, [inputText, mode, preserveNewlines, encodeQuotes, encodeNonASCII, encodingFormat, minifyHTML, escapeJS]);

  const processText = (text: string) => {
    let processedText = '';
    
    if (mode === 'encode') {
      switch (encodingFormat) {
        case 'html':
          processedText = encodeHTML(text);
          break;
        case 'url':
          processedText = encodeURIComponent(text);
          break;
        case 'base64':
          processedText = btoa(unescape(encodeURIComponent(text)));
          break;
      }
    } else {
      switch (encodingFormat) {
        case 'html':
          processedText = decodeHTML(text);
          break;
        case 'url':
          try {
            processedText = decodeURIComponent(text);
          } catch {
            processedText = 'Invalid URL-encoded string';
          }
          break;
        case 'base64':
          try {
            processedText = decodeURIComponent(escape(atob(text)));
          } catch {
            processedText = 'Invalid Base64 string';
          }
          break;
      }
    }

    if (minifyHTML && encodingFormat === 'html') {
      processedText = processedText.replace(/>\s+</g, '><').trim();
    }

    if (escapeJS) {
      processedText = processedText
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
    }

    setOutputText(processedText);
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
    if (inputText.trim()) {
      setHistory(prev => [...prev, {
        input: inputText,
        output: outputText,
        mode,
        timestamp: new Date()
      }].slice(-10));
    }
    toast.success(`Text ${mode}d!`);
  };

  const toggleMode = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'encode' ? 'decode' : 'encode';
      processText(inputText);
      return newMode;
    });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast.success('Text pasted from clipboard!');
    } catch (err) {
      toast.error('Failed to read from clipboard');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encoded-text-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
        toast.success('File uploaded!');
      };
      reader.readAsText(file);
    }
  };

  return (
    <ToolLayout
      title="HTML Encoder/Decoder"
      description="Encode and Decode text in multiple formats, including HTML entities, URL encoding, and Base64"
    >
      <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="input-text" className="text-white">Enter your text:</Label>
                <Button variant="ghost" onClick={handlePaste} className="text-white">
                  <Clipboard className="h-4 w-4 mr-2" />
                  Paste
                </Button>
              </div>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={handleInputChange}
                placeholder={`Type or paste your ${mode === 'encode' ? 'plain' : 'HTML-encoded'} text here`}
                className="w-full bg-gray-700 text-white border-gray-600 h-32"
              />
            </div>

            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant={mode === 'encode' ? "default" : "outline"}
                  onClick={toggleMode}
                  className="py-2 px-4"
                >
                  {mode === 'encode' ? <Code className="h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                  {mode === 'encode' ? 'Encode' : 'Decode'}
                </Button>
                
                <Select
                  value={encodingFormat}
                  onValueChange={(value: 'html' | 'url' | 'base64') => setEncodingFormat(value)}
                >
                  <SelectTrigger className="w-[180px] bg-gray-700 text-white">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="w-[180px] bg-gray-700 text-white">
                    <SelectItem value="html">HTML Entities</SelectItem>
                    <SelectItem value="url">URL Encoding</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserve-newlines"
                    checked={preserveNewlines}
                    onCheckedChange={setPreserveNewlines}
                  />
                  <Label htmlFor="preserve-newlines" className="text-white">Preserve newlines</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="encode-quotes"
                    checked={encodeQuotes}
                    onCheckedChange={setEncodeQuotes}
                  />
                  <Label htmlFor="encode-quotes" className="text-white">Encode quotes</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="encode-non-ascii"
                    checked={encodeNonASCII}
                    onCheckedChange={setEncodeNonASCII}
                  />
                  <Label htmlFor="encode-non-ascii" className="text-white">Encode non-ASCII</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="minify-html"
                  checked={minifyHTML}
                  onCheckedChange={setMinifyHTML}
                />
                <Label htmlFor="minify-html" className="text-white">Minify HTML</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="escape-js"
                  checked={escapeJS}
                  onCheckedChange={setEscapeJS}
                />
                <Label htmlFor="escape-js" className="text-white">Escape for JavaScript</Label>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={handleClear}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
                
                <Button onClick={() => setShowHistory(!showHistory)}>
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".txt"
                    onChange={handleFileUpload}
                  />
                </Button>
                
                <Button 
                  onClick={handleProcess}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  {mode === 'encode' ? 'Encode' : 'Decode'}
                </Button>
              </div>
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

            <div className="flex gap-2">
              <Button 
                onClick={handleCopy} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Result
              </Button>
              
              <Button 
                onClick={handleDownload}
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Result
              </Button>
            </div>
          </div>

          {showHistory && (
            <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">History</h2>
              <div className="space-y-4">
                {history.map((entry, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>{entry.mode === 'encode' ? 'Encoded' : 'Decoded'}</span>
                      <span>{entry.timestamp.toLocaleString()}</span>
                    </div>
                    <div className="text-white">
                      <div className="mb-2">
                        <Label className="text-gray-400">Input:</Label>
                        <div className="bg-gray-800 p-2 rounded">{entry.input}</div>
                      </div>
                      <div>
                        <Label className="text-gray-400">Output:</Label>
                        <div className="bg-gray-800 p-2 rounded">{entry.output}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About HTML Encoder/Decoder
            </h2>
            <p className="text-gray-300 mb-4">
              The HTML Encoder/Decoder tool provides a robust solution for encoding and decoding text in multiple formats, including HTML entities, URL encoding, and Base64. This tool is particularly useful for developers working with web content, as it offers a range of options to handle special characters, quotes, and non-ASCII text.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Multi-format Support: Allows you to encode/decode text to HTML entities, URL encoding, or Base64.</li>
              <li>Preserve Newlines: Keeps line breaks intact during encoding.</li>
              <li>Encode Quotes: Converts single and double quotes to their HTML entity equivalents.</li>
              <li>Encode Non-ASCII: Transforms non-ASCII characters into numeric references, ensuring compatibility with older systems.</li>
              <li>Minify HTML: Removes unnecessary whitespace from HTML code.</li>
              <li>Escape for JavaScript: Escapes special characters for use within JavaScript strings.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Practical Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Clipboard support for pasting and copying text.</li>
              <li>File uploads and download functionality for processed text.</li>
              <li>History of recent encodings/decodings for easy reference.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use HTML Encoder/Decoder?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Input: Enter your text into the input field. Choose between "Encode" and "Decode" mode.</li>
              <li>Format Selection: Select between HTML entities, URL encoding, or Base64.</li>
              <li>Processing Options: Customize options like preserving newlines, encoding quotes, minifying HTML, or escaping for JavaScript.</li>
              <li>Actions: Click the "Process" button or let the tool auto-update as you type. You can copy the result or download it as a text file.</li>
              <li>History: View the last 10 encodings/decodings for easy reference.</li>
            </ol>

            <p className="text-gray-300 mt-8">
              This tool ensures smooth conversions while avoiding common encoding pitfalls, making it ideal for preparing web content, debugging code, and securing text in various formats.
            </p>
          </div>
          </ToolLayout>
  );
}