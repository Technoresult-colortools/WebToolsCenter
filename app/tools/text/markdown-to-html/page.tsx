'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, Wand2, FileDown, FileCode } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';

export default function MarkdownToHTMLConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'markdown' | 'preview'>('markdown');
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);
  const [sanitizeOutput, setSanitizeOutput] = useState(true);
  const [theme, setTheme] = useState('github');

  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    convertMarkdown(inputText);
  }, [inputText, syntaxHighlighting, sanitizeOutput, theme]);

  const convertMarkdown = (text: string) => {
    if (outputRef.current) {
      // Clear previous content
      outputRef.current.innerHTML = ''; 

      // Render ReactMarkdownComponent directly using ReactDOM
      const root = ReactDOM.createRoot(outputRef.current);
      root.render(
        <ReactMarkdown
          rehypePlugins={[
            ...(syntaxHighlighting ? [rehypeHighlight] : []),
            ...(sanitizeOutput ? [rehypeSanitize] : [])
          ]}
          className={`markdown-body ${theme}`}
        >
          {text}
        </ReactMarkdown>
      );
      
      // Update outputText state with the HTML content
      setOutputText(outputRef.current.innerHTML);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    if (outputRef.current) {
      outputRef.current.innerHTML = '';
    }
  };

  const handleConvert = () => {
    convertMarkdown(inputText);
    toast.success('Markdown converted to HTML!');
  };

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'markdown' ? 'preview' : 'markdown');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Markdown to HTML Converter</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="mb-6">
            <Label htmlFor="input-text" className="text-white mb-2 block">Enter your Markdown:</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type or paste your Markdown here"
              className="w-full bg-gray-700 text-white border-gray-600 h-64"
            />
          </div>

          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <Button
              variant={mode === 'markdown' ? "default" : "outline"}
              onClick={toggleMode}
              className="flex-grow sm:flex-grow-0 py-2 px-4"
            >
              {mode === 'markdown' ? <FileDown className="h-4 w-4 mr-2" /> : <FileCode className="h-4 w-4 mr-2" />}
              {mode === 'markdown' ? 'Markdown' : 'Preview'}
            </Button>
            <div className="flex items-center space-x-2">
              <Switch
                id="syntax-highlighting"
                checked={syntaxHighlighting}
                onCheckedChange={setSyntaxHighlighting}
              />
              <Label htmlFor="syntax-highlighting" className="text-white">Syntax highlighting</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sanitize-output"
                checked={sanitizeOutput}
                onCheckedChange={setSanitizeOutput}
              />
              <Label htmlFor="sanitize-output" className="text-white">Sanitize output</Label>
            </div>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white border-gray-600">
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="github-dark">GitHub Dark</SelectItem>
                <SelectItem value="solarized-light">Solarized Light</SelectItem>
                <SelectItem value="solarized-dark">Solarized Dark</SelectItem>
              </SelectContent>
            </Select>
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
              onClick={handleConvert}
              className="flex-grow sm:flex-grow-0 py-2 px-4 bg-green-600 hover:bg-green-700 text-white"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Convert
            </Button>
          </div>

          <div className="mb-6">
            <Label htmlFor="output-text" className="text-white mb-2 block">Result:</Label>
            {mode === 'markdown' ? (
              <Textarea
                id="output-text"
                value={outputText}
                readOnly
                className="w-full bg-gray-700 text-white border-gray-600 h-64"
              />
            ) : (
              <div 
                ref={outputRef}
                className={`w-full bg-gray-700 text-white border border-gray-600 rounded-md p-4 h-64 overflow-auto markdown-body ${theme}`}
              />
            )}
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
          <h2 className="text-2xl font-bold text-white mb-4">About Markdown to HTML Converter</h2>
          <p className="text-gray-300 mb-4">
            This Markdown to HTML Converter is a powerful tool designed for developers, writers, and content creators who work with Markdown format. It offers a seamless way to transform your Markdown content into clean, properly formatted HTML.
          </p>
          <p className="text-gray-300">
            With features like syntax highlighting, output sanitization, and theme selection, this converter provides both functionality and flexibility. Whether you're preparing content for a blog, documentation, or any web-based platform, this tool simplifies the process of converting Markdown to HTML while giving you control over the output.
          </p>
        </div>

        {/* How to Use section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter or paste your Markdown text into the input field at the top of the page.</li>
            <li>Use the "Markdown" / "Preview" toggle to switch between viewing the raw HTML output and a rendered preview.</li>
            <li>Customize the conversion process with the provided options:
              <ul className="list-disc list-inside ml-6 mt-2">
                <li>"Syntax highlighting" enables code block highlighting in the preview.</li>
                <li>"Sanitize output" removes potentially unsafe HTML to prevent XSS attacks.</li>
                <li>Choose a theme from the dropdown to change the appearance of the preview.</li>
              </ul>
            </li>
            <li>Click the "Convert" button to manually trigger the conversion (it also happens automatically as you type).</li>
            <li>Use the "Copy Result" button to copy the HTML output to your clipboard.</li>
            <li>The "Clear" button resets both input and output fields.</li>
          </ol>
        </div>

        {/* Tips and Tricks section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Tips and Tricks</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Use the preview mode to see how your Markdown will look when rendered as HTML.</li>
            <li>Enable syntax highlighting when working with code blocks to improve readability.</li>
            <li>Always keep the "Sanitize output" option enabled when converting untrusted Markdown to prevent potential security risks.</li>
            <li>Experiment with different themes to find the one that best suits your content or matches your website's style.</li>
            <li>Remember that while this converter handles standard Markdown syntax, some advanced or custom Markdown features may not be supported.</li>
            <li>Use this tool in conjunction with a Markdown cheat sheet to make the most of Markdown's formatting capabilities.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
