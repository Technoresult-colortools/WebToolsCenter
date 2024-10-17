'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, Download, RefreshCw, Settings, Shuffle, Info, Lightbulb, BookOpen } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/sidebarTools';

const loremIpsumWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
  "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "enim",
  "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut",
  "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in",
  "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa",
  "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumGenerator() {
  const [generatedText, setGeneratedText] = useState('');
  const [paragraphs, setParagraphs] = useState(3);
  const [wordsPerParagraph, setWordsPerParagraph] = useState(50);
  const [startWithLoremIpsum, setStartWithLoremIpsum] = useState(true);
  const [includeHTMLTags, setIncludeHTMLTags] = useState(false);

  const generateLoremIpsum = () => {
    let text = '';
    for (let i = 0; i < paragraphs; i++) {
      let paragraph = '';
      for (let j = 0; j < wordsPerParagraph; j++) {
        if (i === 0 && j === 0 && startWithLoremIpsum) {
          paragraph += 'Lorem ipsum dolor sit amet, ';
          j += 4;
        } else {
          paragraph += loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)] + ' ';
        }
      }
      text += includeHTMLTags ? `<p>${paragraph.trim()}</p>\n\n` : paragraph.trim() + '\n\n';
    }
    setGeneratedText(text.trim());
    toast.success('Lorem Ipsum text generated!');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    toast.success('Text copied to clipboard');
  };

  const handleDownload = () => {
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lorem_ipsum.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Text downloaded successfully');
  };

  const handleClear = () => {
    setGeneratedText('');
    toast.success('Text cleared');
  };

  const handleShuffleWords = () => {
    const shuffledText = generatedText
      .split('\n\n')
      .map(paragraph => 
        paragraph.split(' ').sort(() => Math.random() - 0.5).join(' ')
      )
      .join('\n\n');
    setGeneratedText(shuffledText);
    toast.success('Text shuffled');
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
                Lorem Ipsum Generator
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                Create dummy text for layout design or content testing
            </p>
        </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="paragraphs" className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Paragraphs:
                </label>
                <input
                  type="number"
                  id="paragraphs"
                  value={paragraphs}
                  onChange={(e) => setParagraphs(Math.max(1, parseInt(e.target.value)))}
                  className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="words" className="block text-sm font-medium text-gray-300 mb-2">
                  Words per Paragraph:
                </label>
                <input
                  type="number"
                  id="words"
                  value={wordsPerParagraph}
                  onChange={(e) => setWordsPerParagraph(Math.max(1, parseInt(e.target.value)))}
                  className="w-full bg-gray-700 text-white border-gray-600 rounded-md p-2"
                />
              </div>
            </div>

            <div className="mb-6 flex items-center space-x-4">
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={startWithLoremIpsum}
                  onChange={() => setStartWithLoremIpsum(!startWithLoremIpsum)}
                  className="mr-2"
                />
                Start with &quot;Lorem ipsum&quot;
              </label>
              <label className="flex items-center text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={includeHTMLTags}
                  onChange={() => setIncludeHTMLTags(!includeHTMLTags)}
                  className="mr-2"
                />
                Include HTML tags
              </label>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button onClick={generateLoremIpsum} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Settings className="h-5 w-5 mr-2" />
                Generate
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
              <Button onClick={handleShuffleWords} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Shuffle className="h-5 w-5 mr-2" />
                Shuffle Words
              </Button>
            </div>

            <div className="mb-6">
              <label htmlFor="generated-text" className="block text-lg font-medium text-gray-200 mb-2">
                Generated Lorem Ipsum:
              </label>
              <textarea
                id="generated-text"
                value={generatedText}
                readOnly
                className="w-full h-64 bg-gray-700 text-white border-gray-600 rounded-md p-2"
              />
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              What is the Lorem Ipsum Generator?
            </h2>
            <p className="text-gray-300 mb-4">
              The Lorem Ipsum Generator is a useful tool for generating placeholder text. It's ideal for designers, developers, and anyone who needs dummy text for layout design or content testing. This tool makes it simple to generate Lorem Ipsum text and offers additional features like shuffling words, copying, and downloading the text for further use.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Lorem Ipsum Generator?
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Enter the number of paragraphs, sentences, or words you need.</li>
              <li>Click the "Generate" button to create Lorem Ipsum text.</li>
              <li>Use the "Shuffle Words" button to rearrange the text randomly.</li>
              <li>Click "Copy" to copy the generated text to your clipboard.</li>
              <li>Select "Download" to save the generated text as a .txt file.</li>
              <li>Click "Clear" to reset the input fields and output area.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Generate: Creates placeholder Lorem Ipsum text based on your input specifications.</li>
              <li>Shuffle Words: Randomly rearranges the words in the generated text.</li>
              <li>Clear: Resets both input and output fields to their initial state.</li>
              <li>Copy: Copies the generated text to the clipboard for easy use.</li>
              <li>Download: Saves the generated text as a .txt file for offline use.</li>
            </ul>
          </div>
            
        </main>
      </div>  
      <Footer />
    </div>
  );
}