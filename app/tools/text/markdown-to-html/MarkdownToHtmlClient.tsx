'use client'
import React, { useState, useEffect, ChangeEvent } from 'react';
import ReactDOMServer from 'react-dom/server';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Toaster, toast } from 'react-hot-toast';
import { Copy, RefreshCw, Wand2, Maximize2, Minimize2, Download, Info, BookOpen, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ToolLayout from '@/components/ToolLayout'


const sampleMarkdown = `# My Awesome Markdown

Welcome to my markdown example! Let's explore some features.

## Features Overview

* This document contains:
  * Bullet points
  * Numbered lists
  * **Bold text** and *italic text*
  * Quotes and links

### Numbered List

1. First item
2. Second item
3. Third item

### Unordered List

- Item A
- Item B
- Item C

> "This is a blockquote to highlight important information."

### Code Snippets

Here's a JavaScript code snippet:

\`\`\`javascript
const greet = (name) => {
    return \`Hello, \${name}!\`;
};
\`\`\`

Inline code example: \`const a = 10;\`

### Images

Check out these cute kittens:

![Kittens](https://placekitten.com/150/150)

![Kittens](https://placekitten.com/160/160)

### Conclusion

Thanks for checking out this markdown example!
`;


export default function MarkdownToHTMLConverter() {
  const [inputText, setInputText] = useState<string>(sampleMarkdown);
  const [outputText, setOutputText] = useState<string>('');
  const [syntaxHighlighting, setSyntaxHighlighting] = useState<boolean>(true);
  const [sanitizeOutput, setSanitizeOutput] = useState<boolean>(true);
  const [theme, setTheme] = useState<string>('github');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autoConvert, setAutoConvert] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (autoConvert) {
      convertMarkdown(inputText);
    }
  }, [inputText, syntaxHighlighting, sanitizeOutput, theme, autoConvert]);

  const convertMarkdown = (text: string) => {
    const MarkdownComponent = () => (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          ...(syntaxHighlighting ? [rehypeHighlight] : []),
          ...(sanitizeOutput ? [rehypeSanitize] : [])
        ]}
        className={`markdown-body ${theme}`}
      >
        {text}
      </ReactMarkdown>
    );

    // Generate HTML string
    const htmlString = ReactDOMServer.renderToString(<MarkdownComponent />);
    setOutputText(htmlString);
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleConvert = () => {
    convertMarkdown(inputText);
    toast.success('Markdown converted to HTML!');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    setIsDialogOpen(true);
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_markdown.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('HTML file downloaded!');
  };

  return (
    <ToolLayout
      title="Markdown to HTML Converter"
      description="Transform your Markdown content into clean, properly formatted HTML"
    >
       <Toaster position="top-right" />

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
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-convert"
                  checked={autoConvert}
                  onCheckedChange={setAutoConvert}
                />
                <Label htmlFor="auto-convert" className="text-white">Auto-convert</Label>
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
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="html">HTML Output</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                  <div 
                    className={`w-full bg-white text-black border border-gray-300 rounded-md p-4 h-[400px] overflow-auto markdown-body ${theme}`}
                    dangerouslySetInnerHTML={{ __html: outputText }}
                  />
                </TabsContent>
                <TabsContent value="html">
                  <Textarea
                    id="output-text"
                    value={outputText}
                    readOnly
                    className="w-full bg-gray-700 text-white border-gray-600 h-[400px]"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <Button 
                onClick={handleCopy} 
                className="flex-grow sm:flex-grow-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy HTML
              </Button>
              <Button 
                onClick={handleDownload} 
                className="flex-grow sm:flex-grow-0 bg-green-600 hover:bg-green-700 text-white py-2 px-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setIsFullscreen(false);
          }}>
            <DialogTrigger asChild>
              <Button 
                className="flex-grow sm:flex-grow-0 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4 mr-2" /> : <Maximize2 className="h-4 w-4 mr-2" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Preview'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-full h-full flex flex-col bg-grey-700">
              <DialogHeader>
                <DialogTitle>Fullscreen Preview</DialogTitle>
              </DialogHeader>
              <div className="flex-grow overflow-auto bg-gray-700">
                <div 
                  className={`w-full h-full p-4 bg-gray-700 text-white markdown-body ${theme}`}
                  dangerouslySetInnerHTML={{ __html: outputText }}
                />
              </div>
            </DialogContent>
          </Dialog>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Markdown to HTML Converter
            </h2>
            <p className="text-gray-300 mb-4">
              This Markdown to HTML Converter is a powerful tool designed for developers, writers, and content creators who work with Markdown format. It offers a seamless way to transform your Markdown content into clean, properly formatted HTML.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              Key Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Syntax Highlighting: Highlights code blocks in the preview for better readability.</li>
              <li>Output Sanitization: Removes potentially unsafe HTML to prevent XSS attacks.</li>
              <li>Theme Selection: Choose a theme from the dropdown to customize the preview's appearance.</li>
              <li>Automatic Conversion: Conversion happens as you type, with a manual option via the "Convert" button.</li>
              <li>Clipboard Support: Easily copy the HTML output to your clipboard.</li>
            </ul>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              How to Use
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Input: Enter or paste your Markdown text into the input field.</li>
              <li>Preview: Use the "Preview" / "HTML Output" tabs to switch between views.</li>
              <li>Customization: Customize the conversion with syntax highlighting and output sanitization options.</li>
              <li>Actions: Click the "Convert" button to manually trigger conversion or let it auto-update as you type.</li>
              <li>Fullscreen: Use the "Fullscreen Preview" button for a distraction-free environment.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Tips and Tricks
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Use preview mode to see how your Markdown will look when rendered as HTML.</li>
              <li>Enable syntax highlighting for code blocks to improve readability.</li>
              <li>Always keep the "Sanitize output" option enabled when converting untrusted Markdown.</li>
              <li>Experiment with different themes to match your website's style.</li>
              <li>Refer to a Markdown cheat sheet to make the most of Markdown's formatting capabilities.</li>
            </ul>
          </div>
          </ToolLayout>
  )        
}