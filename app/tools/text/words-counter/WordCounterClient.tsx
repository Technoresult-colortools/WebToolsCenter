'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import Image from 'next/image'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast';
import { Copy, Download, RefreshCw, Shuffle, Info, Lightbulb, BookOpen, Hash, ZapIcon, ToggleLeft, Type } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout'

const MAX_CHARS = 5000;

export default function WordsCounter() {
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [includeSpaces, setIncludeSpaces] = useState(true);

  
  const updateCounts = () => {
    const words = text.trim().split(/\s+/);
    setWordCount(words.length);
    setCharCount(includeSpaces ? text.length : text.replace(/\s+/g, '').length);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    updateCounts();
  };
   

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text downloaded successfully');
  };

  const handleClear = () => {
    setText('');
    setWordCount(0);
    setCharCount(0);
    toast.success('Text cleared');
  };

  const handleShuffleWords = () => {
    const shuffledText = text
      .split(/\s+/)
      .sort(() => Math.random() - 0.5)
      .join(' ');
    setText(shuffledText);
    updateCounts();
    toast.success('Text shuffled');
  };

  return (
    <ToolLayout
      title="Words Counter"
      description="Count the number of words and characters in your text"
    >
      <Toaster position="top-right" />
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-6">
              <label htmlFor="text" className="block text-lg font-medium text-gray-300 mb-2">
                Input Text:
              </label>
              <textarea
                id="text"
                value={text}
                onChange={handleTextChange}
                placeholder="Enter your text here..."
                className="w-full h-64 bg-gray-700 text-white border-gray-600 rounded-md p-2"
              />
              <p className="text-sm text-gray-400 mt-2">
                {text.length}/{MAX_CHARS} characters
              </p>
            </div>

            <div className="mb-6 flex items-center space-x-4">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={includeSpaces}
                  onChange={() => {
                    setIncludeSpaces(!includeSpaces);
                    updateCounts(); 
                  }}
                  className="mr-2"
                />
                Include Spaces in Character Count
              </label>
            </div>

            <div className="mb-6 flex flex-wrap justify-center gap-4">
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
              <Button onClick={handleShuffleWords} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Shuffle className="h-5 w-5 mr-2" />
                Shuffle Words
              </Button>
            </div>

            <div className="mb-6">
              <p className="text-lg font-medium text-gray-200 mb-2">
                Word Count: {wordCount}
              </p>
              <p className="text-lg font-medium text-gray-200">
                Character Count: {charCount}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the Words Counter?
            </h2>
            <p className="text-gray-300 mb-4">
              The Words Counter is a powerful and versatile text analysis tool designed for writers, students, content creators, and anyone working with text. It goes beyond simple word counting, offering comprehensive text statistics and manipulation features. With its <Link href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</Link> and advanced functionality, it's the perfect companion for content creation, editing, and text analysis tasks.
            </p>
            <p className="text-gray-300 mb-4">
              Whether you're crafting an essay, optimizing your content for SEO, or simply curious about your writing metrics, our Words Counter provides you with valuable insights at your fingertips. It's like having a personal text analyst and editor right in your browser!
            </p>

            <div className="my-8">
              <Image 
                src="/Images/WordCounterPreview.png?height=400&width=600" 
                alt="Screenshot of the Words Counter interface showing text input area, word and character count statistics, and action buttons" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>

            <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Words Counter?
            </h2>
            <p className="text-gray-300 mb-4">
              Using our Words Counter is straightforward and efficient. Here's a step-by-step guide to get you started:
            </p>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Paste or type your text into the input area provided.</li>
              <li>Click the "Update Counts" button to instantly see the word and character count statistics.</li>
              <li>Toggle the "Include Spaces" option to include or exclude spaces in the character count.</li>
              <li>Use the "Shuffle Words" button to randomly rearrange the words in your text.</li>
              <li>Click "Copy" to copy the entire text to your clipboard for easy sharing or pasting elsewhere.</li>
              <li>Select "Download" to save your text as a .txt file for offline use or backup.</li>
              <li>Use the "Clear" button to reset both the input area and count statistics, ready for new text.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Hash className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <p className="text-gray-300 mb-4">
              Our Words Counter offers a range of features to help you analyze and manipulate your text:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>Word Count:</strong> Accurately counts the total number of words in your text.</li>
              <li><strong>Character Count:</strong> Provides a total character count, with the option to include or exclude spaces.</li>
              <li><strong>Word Shuffling:</strong> Randomly rearranges the words in your text for creative exercises or to gain new perspectives.</li>
              <li><strong>Copy Functionality:</strong> Easily copy your entire text to the clipboard with a single click.</li>
              <li><strong>Download Option:</strong> Save your text as a .txt file for offline access or backup.</li>
              <li><strong>Clear Function:</strong> Quickly reset the input area and count statistics for a fresh start.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features That Make Us Stand Out
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><ZapIcon className="w-4 h-4 inline-block mr-1" /> <strong>Real-time Counting:</strong> See word and character counts update as you type</li>
              <li><ToggleLeft className="w-4 h-4 inline-block mr-1" /> <strong>Flexible Character Counting:</strong> Option to include or exclude spaces</li>
              <li><Shuffle className="w-4 h-4 inline-block mr-1" /> <strong>Word Shuffling:</strong> Unique feature for creative writing and brainstorming</li>
              <li><Copy className="w-4 h-4 inline-block mr-1" /> <strong>One-Click Copying:</strong> Easily copy your entire text to clipboard</li>
              <li><Download className="w-4 h-4 inline-block mr-1" /> <strong>Download Option:</strong> Save your text as a file for offline use</li>
              <li><RefreshCw className="w-4 h-4 inline-block mr-1" /> <strong>Quick Reset:</strong> Clear function for easy start-over</li>
              <li><Type className="w-4 h-4 inline-block mr-1" /> <strong>User-Friendly Interface:</strong> Clean, intuitive design for effortless use</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Practical Applications
            </h2>
            <p className="text-gray-300 mb-4">
              The Words Counter tool can be invaluable in various scenarios:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>Academic Writing:</strong> Keep track of word counts for essays and research papers</li>
              <li><strong>Content Creation:</strong> Ensure articles and blog posts meet specific length requirements</li>
              <li><strong>Social Media:</strong> Optimize posts to fit character limits on various platforms</li>
              <li><strong>SEO Optimization:</strong> Monitor keyword density and content length</li>
              <li><strong>Creative Writing:</strong> Use word shuffling for inspiration and to overcome writer's block</li>
              <li><strong>Editing and Proofreading:</strong> Quickly assess text length and make necessary adjustments</li>
              <li><strong>Translation Work:</strong> Compare character counts between original and translated texts</li>
            </ul>

            <p className="text-gray-300 mt-4">
              Ready to gain valuable insights into your text? Start using our Words Counter tool now and experience the power of efficient text analysis at your fingertips. Whether you're a professional writer, a student, or just someone who works with text regularly, our tool is here to provide you with accurate, instant, and comprehensive text statistics. Try it out and see how it can enhance your writing and editing process!
            </p>
          </div>

          </ToolLayout>
  );
}
