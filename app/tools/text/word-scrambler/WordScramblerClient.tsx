'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from 'react-hot-toast';
import { BookOpen, Lightbulb, Info, WrapText, RefreshCcw, Copy, Download, Settings } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout';
import Slider from "@/components/ui/Slider";
import { Switch } from "@/components/ui/switch";
import Input from "@/components/ui/Input";
import Image from 'next/image';

const scrambleWord = (word: string, preserveEnds: boolean, intensity: number): string => {
  if (word.length <= 3) return word;
  
  const start = preserveEnds ? 1 : 0;
  const end = preserveEnds ? word.length - 1 : word.length;
  
  const middleChars = word.slice(start, end).split('');
  const shuffleCount = Math.floor(middleChars.length * intensity);
  
  for (let i = 0; i < shuffleCount; i++) {
    const j = start + Math.floor(Math.random() * middleChars.length);
    const k = start + Math.floor(Math.random() * middleChars.length);
    [middleChars[j], middleChars[k]] = [middleChars[k], middleChars[j]];
  }
  
  return (preserveEnds ? word[0] : '') + middleChars.join('') + (preserveEnds ? word[word.length - 1] : '');
};

export default function WordScrambler() {
  const [inputText, setInputText] = useState('');
  const [scrambledText, setScrambledText] = useState('');
  const [preserveEnds, setPreserveEnds] = useState(false);
  const [intensity, setIntensity] = useState(0.5);
  const [minWordLength, setMinWordLength] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleScramble = () => {
    const words = inputText.split(' ');
    const scrambledWords = words.map(word => 
      word.length >= minWordLength ? scrambleWord(word, preserveEnds, intensity) : word
    ).join(' ');
    setScrambledText(scrambledWords);
    toast.success('Words scrambled successfully!');
  };

  const handleClear = () => {
    setInputText('');
    setScrambledText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scrambledText);
    toast.success('Scrambled text copied to clipboard!');
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([scrambledText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'scrambled_text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Scrambled text downloaded!');
  };

  return (
    <ToolLayout
      title="Word Scrambler"
      description="Shuffle the letters of each word in your input text with advanced options"
    >
      <Toaster position="top-right" />

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="preserve-ends"
              checked={preserveEnds}
              onCheckedChange={setPreserveEnds}
            />
            <Label htmlFor="preserve-ends" className="text-white">Preserve first and last letter</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="intensity" className="text-white">Scramble Intensity: {intensity.toFixed(2)}</Label>
            <Slider
              id="intensity"
              min={0}
              max={1}
              step={0.01}
              value={intensity}
              onChange={(value) => setIntensity(value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min-word-length" className="text-white">Minimum Word Length to Scramble</Label>
            <Input
              id="min-word-length"
              type="number"
              min={0}
              value={minWordLength}
              onChange={(e) => setMinWordLength(parseInt(e.target.value))}
              className="bg-gray-700 text-white border-gray-600"
            />
          </div>
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

        <div className="flex flex-wrap justify-end items-center gap-4">
          <Button onClick={handleCopy} className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white">
            <Copy className="h-5 w-5 mr-2" />
            Copy to Clipboard
          </Button>
          <Button onClick={handleDownload} className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white">
            <Download className="h-5 w-5 mr-2" />
            Download Text
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          What is the Word Scrambler?
        </h2>
        <p className="text-gray-300 mb-4">
          The Word Scrambler is an advanced tool that allows you to shuffle the letters within each word of your input text. It's perfect for creating word puzzles, generating unique text for creative projects, or simply having fun with language. With its <a href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</a> and customizable options, you can create scrambled text that suits your specific needs.
        </p>
        <p className="text-gray-300 mb-4">
          Whether you're a teacher looking to create engaging word games, a puzzle enthusiast, or someone who enjoys playing with words, our Word Scrambler provides you with the flexibility and control you need. It's like having a personal word puzzle generator right in your browser!
        </p>

        <div className="my-8">
          <Image 
            src="/Images/WordScramblerPreview.png?height=400&width=600" 
            alt="Screenshot of the Word Scrambler interface showing input area, scramble options, and scrambled output" 
            width={600} 
            height={400} 
            className="rounded-lg shadow-lg"
          />
        </div>

        <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <BookOpen className="w-6 h-6 mr-2" />
          How to Use the Word Scrambler?
        </h2>
        <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Enter or paste your text into the input field at the top of the page.</li>
          <li>Adjust the scrambling options to your preference:
            <ul className="list-disc list-inside ml-6 mt-2">
              <li>Toggle "Preserve first and last letter" to keep word endings intact.</li>
              <li>Set the "Scramble Intensity" to control how much the words are shuffled.</li>
              <li>Specify a "Minimum Word Length" to scramble only longer words.</li>
            </ul>
          </li>
          <li>Click the "Scramble Words" button to shuffle the letters in each word.</li>
          <li>View the scrambled result in the output field below.</li>
          <li>Use the "Copy to Clipboard" or "Download Text" buttons to save your scrambled text.</li>
          <li>Click the "Clear" button to reset both the input and output fields.</li>
        </ol>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Key Features
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Customizable Scrambling:</strong> Control the intensity and specifics of word scrambling.</li>
          <li><strong>Preserve Word Ends:</strong> Option to keep the first and last letters of each word unchanged.</li>
          <li><strong>Selective Scrambling:</strong> Set a minimum word length for scrambling, leaving shorter words intact.</li>
          <li><strong>Real-time Preview:</strong> See the scrambled result instantly as you adjust settings.</li>
          <li><strong>Copy and Download:</strong> Easily copy scrambled text to clipboard or download as a text file.</li>
          <li><strong>User-friendly Interface:</strong> Intuitive design with clear options and instant feedback.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Lightbulb className="w-6 h-6 mr-2" />
          Tips and Tricks
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li>Use the "Preserve first and last letter" option to create more readable scrambled text.</li>
          <li>Adjust the scramble intensity for different levels of difficulty in word puzzles.</li>
          <li>Set a higher minimum word length to focus scrambling on longer, more complex words.</li>
          <li>Experiment with different types of text to see how well the scrambling works for various writing styles.</li>
          <li>Use the tool to create unique codes or ciphers by scrambling important words in a message.</li>
          <li>Teachers can use this tool to create engaging vocabulary exercises or spelling challenges.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
          <Info className="w-6 h-6 mr-2" />
          Applications and Use Cases
        </h2>
        <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
          <li><strong>Education:</strong> Create word puzzles, spelling exercises, and vocabulary games for students.</li>
          <li><strong>Puzzle Creation:</strong> Generate content for word search puzzles, crosswords, or other word games.</li>
          <li><strong>Creative Writing:</strong> Inspire new ideas by scrambling existing text and finding new word combinations.</li>
          <li><strong>Language Learning:</strong> Practice unscrambling words to improve vocabulary and spelling skills.</li>
          <li><strong>Team Building:</strong> Use scrambled words for icebreaker games or team challenges.</li>
          <li><strong>Marketing:</strong> Create intriguing scrambled messages for advertising campaigns or social media posts.</li>
        </ul>

        <p className="text-gray-300 mt-4">
          Ready to start scrambling words and creating unique text puzzles? Dive into our Word Scrambler tool now and discover new ways to play with language. Whether you're a teacher, puzzle enthusiast, or someone who loves word games, our tool provides endless possibilities for creating engaging and challenging word scrambles. Try it out and see how it can enhance your word-based activities and projects!
        </p>
      </div>
    </ToolLayout>
  );
}