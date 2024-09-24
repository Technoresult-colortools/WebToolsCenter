import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";

interface FormatterOptions {
    indentSize: number;
    useTabs: boolean;
    maxLineLength: number;
    wrapAttributes: 'auto' | 'force' | 'none';
    sortAttributes: boolean;
    preserveNewlines: boolean;
    maxPreserveNewlines: number;
  }

const HTMLFormatter = () => {
  const [inputHTML, setInputHTML] = useState('');
  const [outputHTML, setOutputHTML] = useState('');
  const [options, setOptions] = useState({
    indentSize: 2,
    useTabs: false,
    maxLineLength: 80,
    wrapAttributes: 'auto',
    sortAttributes: false,
    preserveNewlines: true,
    maxPreserveNewlines: 2,
  });

  const formatHTML = (html:string) => {
    const indentChar = options.useTabs ? '\t' : ' '.repeat(options.indentSize);
    let formatted = '';
    let indent = 0;
    let inTag = false;
    let inScript = false;
    let inStyle = false;
    let inComment = false;
    let currentLine = '';
    let lastChar = '';
    let newlines = 0;

    const pushLine = () => {
      if (currentLine.trim()) {
        formatted += indentChar.repeat(indent) + currentLine.trim() + '\n';
      }
      currentLine = '';
      newlines = 0;
    };

    const wrapAttributes = (tag:string) => {
      if (options.wrapAttributes === 'none') return tag;

      const [tagName, ...attrs] = tag.split(' ');
      if (attrs.length === 0) return tag;

      let wrappedAttrs = attrs.join(' ').replace(/(\S+)="(.*?)"/g, ( attr, value) => {
        return `\n${indentChar.repeat(indent + 1)}${attr}="${value}"`;
      });

      if (options.sortAttributes) {
        wrappedAttrs = wrappedAttrs
          .split('\n')
          .sort((a, b) => a.trim().localeCompare(b.trim()))
          .join('\n');
      }

      return `${tagName}${wrappedAttrs}\n${indentChar.repeat(indent)}>`;
    };

    const isVoidElement = (tag:string) => {
      const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
      return voidElements.includes(tag.toLowerCase());
    };

    for (let i = 0; i < html.length; i++) {
      const char = html[i];

      if (inComment) {
        currentLine += char;
        if (char === '>' && lastChar === '-' && html[i - 2] === '-') {
          inComment = false;
          pushLine();
        }
      } else if (inScript || inStyle) {
        currentLine += char;
        if (char === '>' && lastChar === '/') {
          inScript = false;
          inStyle = false;
          pushLine();
          indent--;
        }
      } else if (char === '<' && html.substr(i, 4) === '<!--') {
        pushLine();
        inComment = true;
        currentLine += '<!--';
        i += 3;
      } else if (char === '<' && html.substr(i, 7).toLowerCase() === '<script') {
        pushLine();
        inScript = true;
        currentLine += '<script';
        i += 6;
        indent++;
      } else if (char === '<' && html.substr(i, 6).toLowerCase() === '<style') {
        pushLine();
        inStyle = true;
        currentLine += '<style';
        i += 5;
        indent++;
      } else if (char === '<' && html[i + 1] !== '/') {
        pushLine();
        inTag = true;
        currentLine += '<';
      } else if (char === '<' && html[i + 1] === '/') {
        pushLine();
        indent--;
        inTag = true;
        currentLine += '</';
      } else if (char === '>' && inTag) {
        inTag = false;
        currentLine += '>';
        if (options.wrapAttributes !== 'none' && currentLine.includes(' ')) {
          currentLine = wrapAttributes(currentLine);
        }
        pushLine();
        if (!isVoidElement(currentLine.split(' ')[0].slice(1, -1))) {
          indent++;
        }
      } else {
        if (char === '\n') {
          newlines++;
          if (options.preserveNewlines && newlines <= options.maxPreserveNewlines) {
            pushLine();
          }
        } else if (char !== '\r') {
          currentLine += char;
          if (currentLine.length >= options.maxLineLength && !inTag) {
            pushLine();
          }
        }
      }

      lastChar = char;
    }

    pushLine();
    return formatted.trim();
  };

  const handleFormat = () => {
    if (!inputHTML.trim()) {
      alert('Please enter some HTML to format.');
      return;
    }
    const formatted = formatHTML(inputHTML);
    setOutputHTML(formatted);
  };

  const updateOption = <K extends keyof FormatterOptions>(
    key: K,
    value: FormatterOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="input-html">HTML to Format</Label>
        <Textarea
          id="input-html"
          value={inputHTML}
          onChange={(e) => setInputHTML(e.target.value)}
          placeholder="Enter HTML to format..."
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="indent-size">Indent Size</Label>
          <Input
            id="indent-size"
            type="number"
            value={options.indentSize}
            onChange={(e) => updateOption('indentSize', parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="max-line-length">Max Line Length</Label>
          <Input
            id="max-line-length"
            type="number"
            value={options.maxLineLength}
            onChange={(e) => updateOption('maxLineLength', parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-tabs"
            checked={options.useTabs}
            onChange={(checked) => updateOption('useTabs', checked)}
          />
          <Label htmlFor="use-tabs">Use tabs instead of spaces</Label>
        </div>
        <div>
          <Label htmlFor="wrap-attributes">Wrap Attributes</Label>
          <Select 
            onValueChange={(value: string) => 
              updateOption('wrapAttributes', value as 'auto' | 'force' | 'none')
            }
          >
            <SelectTrigger id="wrap-attributes">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="force">Force</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="sort-attributes"
            checked={options.sortAttributes}
            onChange={(checked) => updateOption('sortAttributes', checked)}
          />
          <Label htmlFor="sort-attributes">Sort attributes alphabetically</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="preserve-newlines"
            checked={options.preserveNewlines}
            onChange={(checked) => updateOption('preserveNewlines', checked)}
          />
          <Label htmlFor="preserve-newlines">Preserve newlines</Label>
        </div>
        <div>
          <Label htmlFor="max-preserve-newlines">Max Preserve Newlines</Label>
          <Input
            id="max-preserve-newlines"
            type="number"
            value={options.maxPreserveNewlines}
            onChange={(e) => updateOption('maxPreserveNewlines', parseInt(e.target.value))}
            className="mt-1"
          />
        </div>
      </div>

      <Button onClick={handleFormat}>Format HTML</Button>

      <div>
        <Label htmlFor="output-html">Formatted HTML</Label>
        <Textarea
          id="output-html"
          value={outputHTML}
          readOnly
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default HTMLFormatter;