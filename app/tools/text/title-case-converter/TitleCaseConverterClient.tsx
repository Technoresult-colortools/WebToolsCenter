'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from 'react-hot-toast';
import { 
  Copy, RefreshCw, ArrowRight, Wand2, Info, Lightbulb, 
  BookOpen, ChartColumnBig, History, Download, Upload, Settings2, Cog, Shield
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import ToolLayout from '@/components/ToolLayout'

const lowercaseWords = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 
  'to', 'from', 'by', 'in', 'of', 'over', 'with', 'under', 'between',
  'into', 'through', 'after', 'over', 'between', 'against', 'during'
]);

interface TextStats {
  characters: number;
  words: number;
  sentences: number;
  averageWordLength: number;
}

export default function TitleCaseConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [capitalizeFirst, ] = useState(true);
  const [respectAcronyms, setRespectAcronyms] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState('standard');
  const [history, setHistory] = useState<Array<{ input: string; output: string }>>([]);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    words: 0,
    sentences: 0,
    averageWordLength: 0
  });
  const [customExceptions, ] = useState<string[]>([]);
  const [preserveFormatting, setPreserveFormatting] = useState(false);
  const [capitalizeAfterPunctuation, setCapitalizeAfterPunctuation] = useState(true);

  useEffect(() => {
    convertToTitleCase(inputText);
    calculateStats(inputText);
  }, [inputText, capitalizeFirst, respectAcronyms, selectedStyle, customExceptions, preserveFormatting, capitalizeAfterPunctuation]);

  const calculateStats = (text: string) => {
    const characters = text.length;
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    const averageWordLength = words > 0 ? characters / words : 0;

    setStats({
      characters,
      words,
      sentences,
      averageWordLength: Number(averageWordLength.toFixed(1))
    });
  };

  const convertToTitleCase = (text: string) => {
    if (!text.trim()) {
      setOutputText('');
      return;
    }

    const words = preserveFormatting 
      ? text.split(/(\s+)/).filter(word => word.length > 0)
      : text.split(/\s+/);

    const titleCaseWords = words.map((word, index) => {
      // Handle preservation of whitespace
      if (preserveFormatting && word.match(/^\s+$/)) {
        return word;
      }

      // Handle acronyms
      if (respectAcronyms && word === word.toUpperCase() && word.length > 1) {
        return word;
      }

      const lowerWord = word.toLowerCase();
      const shouldCapitalize = () => {
        switch (selectedStyle) {
          case 'all':
            return true;
          case 'first':
            return index === 0;
          case 'standard':
            return index === 0 || 
                   index === words.length - 1 || 
                   !lowercaseWords.has(lowerWord) ||
                   (capitalizeAfterPunctuation && index > 0 && words[index - 1].match(/[.!?]$/));
          default:
            return true;
        }
      };

      if (shouldCapitalize()) {
        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
      }

      return lowerWord;
    });

    const result = preserveFormatting ? titleCaseWords.join('') : titleCaseWords.join(' ');
    setOutputText(result);
  };

  const handleConvert = () => {
    convertToTitleCase(inputText);
    setHistory(prev => [...prev, { input: inputText, output: outputText }].slice(-5));
    toast.success('Text converted!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    toast.success('Cleared!');
  };

  const handleExport = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'title-case-output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File exported!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
      toast.success('File uploaded!');
    }
  };

  return (
    <ToolLayout
      title="Advanced Title Case Converter"
      description="Transforms your text into properly formatted titles using intelligent capitalization rules"
    >
    
    <Toaster position="top-right" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8  md:p-6 max-w-4xl mx-auto">
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Input Text</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enter or paste your text below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or paste your text here"
                    className="w-full bg-gray-700 text-white border-gray-600 h-40 mb-4"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Select
                      value={selectedStyle}
                      onValueChange={setSelectedStyle}
                    >
                      <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Title Case</SelectItem>
                        <SelectItem value="all">Capitalize All Words</SelectItem>
                        <SelectItem value="first">First Word Only</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center justify-end space-x-4">
                      <Label htmlFor="preserve-formatting" className="text-white">
                        Preserve Formatting
                      </Label>
                      <Switch
                        id="preserve-formatting"
                        checked={preserveFormatting}
                        onCheckedChange={setPreserveFormatting}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant={respectAcronyms ? "default" : "outline"}
                      onClick={() => setRespectAcronyms(!respectAcronyms)}
                      size="sm"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Respect Acronyms
                    </Button>
                    <Button
                      variant={capitalizeAfterPunctuation ? "default" : "outline"}
                      onClick={() => setCapitalizeAfterPunctuation(!capitalizeAfterPunctuation)}
                      size="sm"
                    >
                      <Settings2 className="h-4 w-4 mr-2" />
                      Cap. After Punctuation
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => setShowStats(!showStats)}
                      size="sm"
                      
                    >
                      <ChartColumnBig className="h-4 w-4 mr-2 " />
                      Toggle Stats
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 mt-8">
                <CardHeader>
                  <CardTitle className="text-white">Output</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your converted text will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={outputText}
                    readOnly
                    className="w-full bg-gray-700 text-white border-gray-600 h-40 mb-4"
                  />

                  <div className="flex flex-wrap gap-4">
                    <Button onClick={handleConvert}>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Convert
                    </Button>
                    <Button onClick={handleCopy} variant="secondary">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button onClick={handleClear} variant="destructive">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                    <Button onClick={handleExport} variant="default">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".txt"
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        variant="default"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              {showStats && (
                <Card className="bg-gray-800 border-gray-700 mb-8">
                  <CardHeader>
                    <CardTitle className="text-white">Text Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Characters:</span>
                        <span className="text-white">{stats.characters}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Words:</span>
                        <span className="text-white">{stats.words}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sentences:</span>
                        <span className="text-white">{stats.sentences}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Word Length:</span>
                        <span className="text-white">{stats.averageWordLength}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Accordion type="single" collapsible className="bg-gray-800 rounded-lg">
                <AccordionItem value="history">
                  <AccordionTrigger className="px-4 text-white">
                    <History className="h-4 w-4 mr-2" />
                    Recent Conversions
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {history.map((item, index) => (
                      <div key={index} className="mb-4 p-2 bg-gray-700 rounded">
                        <p className="text-sm text-gray-400">Input:</p>
                        <p className="text-white truncate">{item.input}</p>
                        <p className="text-sm text-gray-400 mt-2">Output:</p>
                        <p className="text-white truncate">{item.output}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Advanced Title Case Converter
            </h2>
            <p className="text-gray-300 mb-4">
              The Advanced Title Case Converter is a sophisticated tool that transforms your text into properly formatted titles using intelligent capitalization rules. 
              It offers multiple formatting styles, advanced customization options, and powerful features for professional content creation. 
              Perfect for writers, editors, content creators, and anyone needing properly formatted titles for articles, books, headlines, or academic work.
            </p>

            <p className="text-gray-300 mb-4">
              Our converter goes beyond basic capitalization by offering features like format preservation, statistical analysis, conversion history tracking, and file handling capabilities. 
              With support for different title case styles and special handling of acronyms and punctuation, it provides the flexibility needed for various style guides and formatting requirements.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter or paste your text into the input field at the top of the page.</li>
              <li>Select your preferred title case style (Standard, Capitalize All, or First Word Only).</li>
              <li>Adjust additional settings like "Preserve Formatting" or "Respect Acronyms" as needed.</li>
              <li>Use the "Convert" button to process your text (conversion also happens automatically as you type).</li>
              <li>View text statistics by toggling the stats panel to analyze your content.</li>
              <li>Copy the result, export it as a file, or view it in your conversion history.</li>
              <li>Use the "Clear" button to reset both input and output fields when needed.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Cog className="w-6 h-6 mr-2" />
              Features & Options
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Choose from three title case styles: Standard, Capitalize All Words, or First Word Only</li>
              <li>Preserve original text formatting with the "Preserve Formatting" option</li>
              <li>Maintain acronyms in uppercase with "Respect Acronyms" feature</li>
              <li>Automatic capitalization after punctuation marks</li>
              <li>Real-time text statistics including character count, word count, and more</li>
              <li>Import and export functionality for handling larger documents</li>
              <li>Conversion history tracking for easy reference to previous work</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use "Standard" style for traditional title case rules, which keep articles and prepositions lowercase unless they're the first or last word.</li>
              <li>Enable "Preserve Formatting" when working with pre-formatted text or special layouts to maintain spacing and line breaks.</li>
              <li>The "Capitalize After Punctuation" feature ensures proper capitalization in titles containing multiple sentences or clauses.</li>
              <li>Use the statistics panel to ensure your titles meet specific length requirements or style guidelines.</li>
              <li>Take advantage of the conversion history to compare different versions of your titles or recover previous conversions.</li>
              <li>For batch processing, use the file import feature to convert multiple titles from a text file.</li>
              <li>Export your converted text to share with others or integrate into your documents while preserving the formatting.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Style Guide Compliance
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>The Standard style follows common title case conventions used in most professional publishing.</li>
              <li>Customize settings to match specific style guides (AP, Chicago, MLA, etc.) requirements.</li>
              <li>Use the "First Word Only" style for sentence case formatting, popular in some academic journals.</li>
              <li>The tool handles special cases like hyphenated words and compound expressions according to standard rules.</li>
              <li>Remember to review your style guide's specific requirements, as conventions may vary between publications.</li>
            </ul>
          </div>

          </ToolLayout>
  );
}