'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import Image from 'next/image'
import Link from 'next/link'
import { Toaster, toast } from 'react-hot-toast';
import { Copy, Download, RefreshCw, Settings, Shuffle, Info, Lightbulb, BookOpen, ZapIcon, Type } from 'lucide-react';
import ToolLayout from '@/components/ToolLayout'

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
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Create dummy text for layout design or content testing"
    >

        <Toaster position="top-right" />
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
              The Lorem Ipsum Generator is a powerful tool designed for designers, developers, and content creators who need placeholder text for their projects. It goes beyond simple text generation, offering customizable options and additional features to make your workflow smoother. With its <Link href="#how-to-use" className="text-blue-400 hover:underline">user-friendly interface</Link> and advanced functionality, it's the perfect companion for layout design, content testing, and mockup creation.
            </p>
            <p className="text-gray-300 mb-4">
              Whether you're working on a website prototype, designing a brochure, or testing a new font, our Lorem Ipsum Generator provides you with the flexibility and control you need. It's like having a personal content filler right in your browser, tailored to your specific requirements!
            </p>

            <div className="my-8">
              <Image 
                src="/Images/LoremIpsumPreview.png?height=400&width=600" 
                alt="Screenshot of the Lorem Ipsum Generator interface showing text generation options and generated Lorem Ipsum text" 
                width={600} 
                height={400} 
                className="rounded-lg shadow-lg"
              />
            </div>

            <h2 id="how-to-use" className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use the Lorem Ipsum Generator
            </h2>
            <p className="text-gray-300 mb-4">
              Using our Lorem Ipsum Generator is straightforward and efficient. Here's a step-by-step guide to get you started:
            </p>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Set the number of paragraphs you want to generate using the "Number of Paragraphs" input.</li>
              <li>Adjust the "Words per Paragraph" to control the length of each paragraph.</li>
              <li>Choose whether to start with the classic "Lorem ipsum" phrase by toggling the checkbox.</li>
              <li>Decide if you want to include HTML paragraph tags in the output.</li>
              <li>Click the "Generate" button to create your Lorem Ipsum text.</li>
              <li>Use the "Copy" button to copy the generated text to your clipboard.</li>
              <li>Click "Download" to save the text as a .txt file for offline use.</li>
              <li>Use "Shuffle Words" to randomize the word order for more variety.</li>
              <li>Click "Clear" to reset the generator and start over.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Customization Options
            </h2>
            <p className="text-gray-300 mb-4">
              Our Lorem Ipsum Generator offers several customization options to tailor the output to your needs:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>Number of Paragraphs:</strong> Control the overall length of your Lorem Ipsum text.</li>
              <li><strong>Words per Paragraph:</strong> Adjust the density of each paragraph.</li>
              <li><strong>Start with "Lorem ipsum":</strong> Choose whether to begin with the classic Lorem Ipsum opening.</li>
              <li><strong>Include HTML Tags:</strong> Wrap each paragraph in {'<p>'} tags for easy integration into HTML documents.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features That Make Us Stand Out
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><ZapIcon className="w-4 h-4 inline-block mr-1" /> <strong>Instant Generation:</strong> Create Lorem Ipsum text with a single click</li>
              <li><Shuffle className="w-4 h-4 inline-block mr-1" /> <strong>Word Shuffling:</strong> Randomize word order for unique outputs</li>
              <li><Copy className="w-4 h-4 inline-block mr-1" /> <strong>One-Click Copying:</strong> Easily copy generated text to clipboard</li>
              <li><Download className="w-4 h-4 inline-block mr-1" /> <strong>Download Option:</strong> Save your Lorem Ipsum text as a file</li>
              <li><RefreshCw className="w-4 h-4 inline-block mr-1" /> <strong>Quick Reset:</strong> Clear function for easy start-over</li>
              <li><Type className="w-4 h-4 inline-block mr-1" /> <strong>HTML Tag Integration:</strong> Option to include HTML paragraph tags</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Practical Applications
            </h2>
            <p className="text-gray-300 mb-4">
              The Lorem Ipsum Generator is a versatile tool with numerous applications:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li><strong>Web Design:</strong> Fill in layouts and templates with realistic-looking content</li>
              <li><strong>Graphic Design:</strong> Create mockups for brochures, posters, and other visual materials</li>
              <li><strong>UI/UX Design:</strong> Test user interfaces with various content lengths</li>
              <li><strong>Content Planning:</strong> Visualize content distribution in your layouts</li>
              <li><strong>Typography:</strong> Test different fonts and text styles with consistent content</li>
              <li><strong>Responsive Design:</strong> Check how your design adapts to different amounts of text</li>
            </ul>

            <p className="text-gray-300 mt-4">
              Ready to streamline your design process? Start using our Lorem Ipsum Generator now and experience the convenience of customizable placeholder text at your fingertips. Whether you're a seasoned designer or just starting out, our tool is here to make your content creation and layout design tasks easier and more efficient. Give it a try and see how it can enhance your workflow!
            </p>
          </div>
          </ToolLayout>  
  );
}