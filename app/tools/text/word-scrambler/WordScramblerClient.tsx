'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {BookOpen, Lightbulb, Info, WrapText, RefreshCcw} from 'lucide-react';

const scrambleWord = (word: string): string => {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
};

export default function WordScrambler() {
  const [inputText, setInputText] = useState('');
  const [scrambledText, setScrambledText] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleScramble = () => {
    const words = inputText.split(' ');
    const scrambledWords = words.map(word => scrambleWord(word)).join(' ');
    setScrambledText(scrambledWords);
    toast.success('Words scrambled successfully!');
  };

  const handleClear = () => {
    setInputText('');
    setScrambledText('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Word Scrambler</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <Label htmlFor="input-text" className="text-white mb-2 block">Enter your text:</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type or paste your text here"
              className="w-full bg-gray-700 text-white border-gray-600 h-64"
            />
          </div>

          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <Button
              onClick={handleScramble}
              className="flex-grow sm:flex-grow-0 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <WrapText className="h-5 w-5 mr-2" />
              Scramble Words
            </Button>
            <Button
              variant="destructive"
              onClick={handleClear}
              className="flex-grow sm:flex-grow-0 py-2 px-4"
            >
              <RefreshCcw className="h-5 w-5 mr-2" />
              Clear
            </Button>
          </div>

          <div className="mb-6">
            <Label htmlFor="scrambled-text" className="text-white mb-2 block">Scrambled Result:</Label>
            <Textarea
              id="scrambled-text"
              value={scrambledText}
              readOnly
              className="w-full bg-gray-700 text-white border-gray-600 h-64"
            />
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            About Word Scrambler
          </h2>
          <p className="text-gray-300 mb-4">
            The Word Scrambler tool allows you to shuffle the letters of each word in your input text. This can be useful for creating puzzles, games, or simply for fun. Just enter your text, click the "Scramble Words" button, and see the scrambled result.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Type or paste your text into the input field at the top of the page.</li>
            <li>Click the "Scramble Words" button to shuffle the letters in each word.</li>
            <li>The scrambled result will appear in the output field below the button.</li>
            <li>Click the "Clear" button to reset both the input and output fields.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips and Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Experiment with different types of text to see how well the scrambling works for various word lengths and structures.</li>
            <li>Use the tool to create word puzzles or games by scrambling lists of words.</li>
            <li>If you want to generate a large amount of scrambled text, you can paste or type longer passages into the input field.</li>
            <li>Consider using the tool in combination with other text-processing tools for more advanced uses.</li>
          </ul>
        </div>

      </main>
      <Footer />
    </div>
  );
}
