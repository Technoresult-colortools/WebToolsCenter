'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Toaster, toast } from 'react-hot-toast';
import Image from 'next/image'
import Link from 'next/link'
import { Copy, Download, RefreshCw, Settings, Info, Lightbulb, BookOpen, ArrowLeftRight, Zap, Type, Puzzle } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout'
import { Select } from '@/components/ui/select1';

const reverseOption = [
  {value: "character", label: "By Character"},
 {value: "word", label:  "By Word"},
 {value: "sentence", label: "By Sentence"}
]

export default function TextReverser() {
  const [inputText, setInputText] = useState('');
  const [reversedText, setReversedText] = useState('');
  const [reverseMode, setReverseMode] = useState('character');

  const reverseText = () => {
    const text = inputText.trim();
    if (reverseMode === 'character') {
      setReversedText(text.split('').reverse().join(''));
    } else if (reverseMode === 'word') {
      setReversedText(text.split(' ').reverse().join(' '));
    } else if (reverseMode === 'sentence') {
      setReversedText(text.split('.').reverse().join('. '));
    }
    toast.success('Text reversed!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reversedText);
    toast.success('Text copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([reversedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reversed_text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text downloaded successfully');
  };

  const handleClear = () => {
    setInputText('');
    setReversedText('');
    toast.success('Text cleared');
  };

  return (
    <ToolLayout
      title="Text Reverser"
      description="Text Reverser is a simple yet powerful tool that allows you to reverse the order of characters in your text"
    >
         <Toaster position="top-right" />

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <textarea
              className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2 mb-4"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
            />
            
            <div className="mb-4">
              <Select
                label="Reverse Mode"
                options={reverseOption}
                selectedKey={reverseMode}
                onSelectionChange={(key) => setReverseMode(key)}
                className="max-w-full"
                placeholder="Select Reverse Mode"
              />
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-4">
              <Button onClick={reverseText} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="h-5 w-5 mr-2" />
                Reverse
              </Button>
              <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Copy className="h-5 w-5 mr-2" />
                Copy
              </Button>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Download className="h-5 w-5 mr-2" />
                Download
              </Button>
              <Button onClick={handleClear} className="bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className="h-5 w-5 mr-2" />
                Clear
              </Button>
            </div>

            <div className="mb-6">
              <label htmlFor="reversed-text" className="block text-lg font-medium text-gray-200 mb-2">
                Reversed Text:
              </label>
              <textarea
                id="reversed-text"
                value={reversedText}
                readOnly
                className="w-full h-40 bg-gray-700 text-white border-gray-600 rounded-md p-2"
              />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the Text Reverser?
            </h2>
            <p className="text-gray-300 mb-4">
              The Text Reverser is a simple yet powerful tool designed to flip the order of characters in your text. It goes beyond basic reversal, offering a <Link href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</Link> and additional features to enhance your text manipulation experience. Whether you're creating word puzzles, experimenting with text formatting, or just having fun with your content, our Text Reverser provides an efficient and enjoyable way to transform your text.
            </p>
            <p className="text-gray-300 mb-4">
              From reversing single words to entire paragraphs, this tool offers versatility for various creative and practical applications. It's like having a magic mirror for your text, instantly showing you the flip side of your words!
            </p>

            <div className="my-8">
              <Image 
                src="/Images/TextReverserPreview.png?height=400&width=600" 
                alt="Screenshot of the Text Reverser interface showing input area, reverse button, and output area with reversed text" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>

            <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Text Reverser
            </h2>
            <p className="text-gray-300 mb-4">
              Using our Text Reverser is quick and straightforward. Here's a step-by-step guide to get you started:
            </p>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter or paste your text into the input area provided. This can be a single word, a sentence, or multiple paragraphs.</li>
              <li>Click the "Reverse Text" button to instantly flip the order of characters in your text.</li>
              <li>View the reversed text in the output area below the input field.</li>
              <li>Use the "Copy" button to copy the reversed text to your clipboard for easy sharing or use in other applications.</li>
              <li>If you want to reverse more text, simply click the "Clear" button to reset both input and output areas, ready for new content.</li>
              <li>Experiment with different types of text to see how they look when reversed!</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <ArrowLeftRight className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <p className="text-gray-300 mb-4">
              Our Text Reverser offers several features to enhance your text reversal experience:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>Instant Reversal:</strong> Flip your text with just one click, no matter the length.</li>
              <li><strong>Multi-line Support:</strong> Reverse entire paragraphs while maintaining line breaks.</li>
              <li><strong>Preserve Spacing:</strong> Keeps the original spacing intact, only reversing the characters.</li>
              <li><strong>Copy Functionality:</strong> Easily copy your reversed text to the clipboard with a single click.</li>
              <li><strong>Clear Function:</strong> Quickly reset the input and output areas for a fresh start.</li>
              <li><strong>Large Text Capacity:</strong> Handle substantial amounts of text for reversal.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features That Make Us Stand Out
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><Zap className="w-4 h-4 inline-block mr-1" /> <strong>Lightning-Fast Reversal:</strong> Instantly reverse text of any length</li>
              <li><Type className="w-4 h-4 inline-block mr-1" /> <strong>Preserve Formatting:</strong> Maintain original spacing and line breaks</li>
              <li><Copy className="w-4 h-4 inline-block mr-1" /> <strong>One-Click Copying:</strong> Easily copy reversed text to clipboard</li>
              <li><RefreshCw className="w-4 h-4 inline-block mr-1" /> <strong>Quick Reset:</strong> Clear function for easy start-over</li>
              <li><Puzzle className="w-4 h-4 inline-block mr-1" /> <strong>Versatile Applications:</strong> Useful for puzzles, games, and creative writing</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Practical Applications
            </h2>
            <p className="text-gray-300 mb-4">
              The Text Reverser tool can be useful in various creative and practical scenarios:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>Word Puzzles:</strong> Create reverse word challenges or riddles for games and quizzes</li>
              <li><strong>Creative Writing:</strong> Experiment with reversed text in poetry or storytelling</li>
              <li><strong>Language Learning:</strong> Practice reading backwards to improve letter recognition</li>
              <li><strong>Cryptography:</strong> Use as a simple form of text encoding</li>
              <li><strong>Graphic Design:</strong> Create mirrored text effects for logos or artistic designs</li>
              <li><strong>Proofreading:</strong> Reverse text to spot errors you might miss reading forward</li>
              <li><strong>Fun and Entertainment:</strong> Amuse friends with reversed messages or create social media content</li>
            </ul>

            <p className="text-gray-300 mt-4">
              Ready to flip your text and explore the world of reversed writing? Start using our Text Reverser tool now and experience the fun and utility of instant text reversal. Whether you're a puzzle enthusiast, a creative writer, or just someone who enjoys playing with words, our tool is here to add a new dimension to your text manipulation toolkit. Give it a try and see your text from a whole new perspective!
            </p>
          </div>
          </ToolLayout>
  );
}
