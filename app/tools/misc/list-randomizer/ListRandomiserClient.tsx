'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Slider from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { Shuffle, Copy, Upload, Download, Undo, Redo, Save, FolderOpen, Info, BookOpen, Lightbulb } from 'lucide-react';
import seedrandom from 'seedrandom';
import ToolLayout from '@/components/ToolLayout'


export default function ListRandomizer() {
  const [inputList, setInputList] = useState<string>('');
  const [outputList, setOutputList] = useState<string>('');
  const [separator, setSeparator] = useState<string>('\n');
  const [customSeparator, setCustomSeparator] = useState<string>('');
  const [trimItems, setTrimItems] = useState<boolean>(true);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(false);
  const [sortBeforeRandomize, setSortBeforeRandomize] = useState<boolean>(false);
  const [caseInsensitive, setCaseInsensitive] = useState<boolean>(false);
  const [randomizationMethod, setRandomizationMethod] = useState<string>('fisher-yates');
  const [subsetSize, setSubsetSize] = useState<number>(0);
  const [weightedRandomization, setWeightedRandomization] = useState<boolean>(false);
  const [seed, setSeed] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [groupSize, setGroupSize] = useState<number>(1);
  const [reverseOutput, setReverseOutput] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputList(e.target.value);
  };

  const handleSeparatorChange = (value: string) => {
    setSeparator(value);
    if (value === 'custom') {
      setCustomSeparator('');
    }
  };

  const handleCustomSeparatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomSeparator(e.target.value);
  };

  const randomizeList = () => {
    let items = inputList.split(separator === 'custom' ? customSeparator : separator);

    if (trimItems) {
      items = items.map(item => item.trim());
    }

    if (removeDuplicates) {
      items = [...new Set(items)];
    }

    if (sortBeforeRandomize) {
      items.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseInsensitive ? 'base' : 'variant' }));
    }

    let randomizedItems: string[];

    if (randomizationMethod === 'fisher-yates') {
      randomizedItems = fisherYatesShuffle([...items]);
    } else if (randomizationMethod === 'sort') {
      randomizedItems = [...items].sort(() => Math.random() - 0.5);
    } else {
      randomizedItems = items;
    }

    if (subsetSize > 0 && subsetSize < randomizedItems.length) {
      randomizedItems = randomizedItems.slice(0, subsetSize);
    }

    if (weightedRandomization) {
      randomizedItems = weightedRandomize(randomizedItems);
    }

    if (groupSize > 1) {
      randomizedItems = groupItems(randomizedItems, groupSize);
    }

    if (reverseOutput) {
      randomizedItems.reverse();
    }

    const result = randomizedItems.join('\n');
    setOutputList(result);
    addToHistory(result);
  };

  const fisherYatesShuffle = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const weightedRandomize = (items: string[]): string[] => {
    const weightedItems = items.map((item, index) => ({
      item,
      weight: items.length - index
    }));

    return weightedItems
      .sort((a, b) => Math.random() * b.weight - Math.random() * a.weight)
      .map(({ item }) => item);
  };

  const groupItems = (items: string[], size: number): string[] => {
    return items.reduce((acc, item, index) => {
      const groupIndex = Math.floor(index / size);
      if (!acc[groupIndex]) {
        acc[groupIndex] = [];
      }
      acc[groupIndex].push(item);
      return acc;
    }, [] as string[][]).map(group => group.join(', '));
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(outputList).then(() => {
      toast.success('Randomized list copied to clipboard!');
    }, () => {
      toast.error('Failed to copy randomized list.');
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputList(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([outputList], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'randomized_list.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const addToHistory = (result: string) => {
    setHistory(prevHistory => [...prevHistory.slice(0, historyIndex + 1), result]);
    setHistoryIndex(prevIndex => prevIndex + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prevIndex => prevIndex - 1);
      setOutputList(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prevIndex => prevIndex + 1);
      setOutputList(history[historyIndex + 1]);
    }
  };

  const saveConfiguration = () => {
    const config = {
      separator,
      customSeparator,
      trimItems,
      removeDuplicates,
      sortBeforeRandomize,
      caseInsensitive,
      randomizationMethod,
      subsetSize,
      weightedRandomization,
      seed,
      groupSize,
      reverseOutput
    };
    localStorage.setItem('listRandomizerConfig', JSON.stringify(config));
    toast.success('Configuration saved successfully!');
  };

  const loadConfiguration = () => {
    const savedConfig = localStorage.getItem('listRandomizerConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setSeparator(config.separator);
      setCustomSeparator(config.customSeparator);
      setTrimItems(config.trimItems);
      setRemoveDuplicates(config.removeDuplicates);
      setSortBeforeRandomize(config.sortBeforeRandomize);
      setCaseInsensitive(config.caseInsensitive);
      setRandomizationMethod(config.randomizationMethod);
      setSubsetSize(config.subsetSize);
      setWeightedRandomization(config.weightedRandomization);
      setSeed(config.seed);
      setGroupSize(config.groupSize);
      setReverseOutput(config.reverseOutput);
      toast.success('Configuration loaded successfully!');
    } else {
      toast.error('No saved configuration found.');
    }
  };

  useEffect(() => {
    if (seed) {
      seedrandom(seed, { global: true });
    } else {
      seedrandom();
    }
  }, [seed]);

  return (
    <ToolLayout
      title="List Randomizer"
      description="Powerfull tool designed to shuffle and manipulate list of items"
    >

      <Toaster position="top-right" />

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Input List</h2>
              <Textarea
                value={inputList}
                onChange={handleInputChange}
                placeholder="Enter your list items here, one per line"
                className="w-full h-64 p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
              />
              <div className="mt-4">
                <Label htmlFor="separator" className="text-white mb-2 block">Separator</Label>
                <Select value={separator} onValueChange={handleSeparatorChange}>
                  <SelectTrigger id="separator" className="bg-gray-700 text-white border-gray-600">
                    <SelectValue>{separator === '\n' ? 'New line' : separator || 'Select separator'}</SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-600">
                    <SelectItem value="\n">New line</SelectItem>
                    <SelectItem value=",">Comma</SelectItem>
                    <SelectItem value=";">Semicolon</SelectItem>
                    <SelectItem value="\t">Tab</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {separator === 'custom' && (
                  <Input
                    value={customSeparator}
                    onChange={handleCustomSeparatorChange}
                    placeholder="Enter custom separator"
                    className="mt-2 bg-gray-700 text-white border-gray-600"
                  />
                )}
              </div>
              <div className="mt-4">
                <Button onClick={() => document.getElementById('file-upload')?.click()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload List
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Randomization Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="trim-items" className="text-white">Trim items</Label>
                  <Switch
                    id="trim-items"
                    checked={trimItems}
                    onCheckedChange={setTrimItems}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="remove-duplicates" className="text-white">Remove duplicates</Label>
                  <Switch
                    id="remove-duplicates"
                    checked={removeDuplicates}
                    onCheckedChange={setRemoveDuplicates}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sort-before-randomize" className="text-white">Sort before randomize</Label>
                  <Switch
                    id="sort-before-randomize"
                    checked={sortBeforeRandomize}
                    onCheckedChange={setSortBeforeRandomize}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="case-insensitive" className="text-white">Case-insensitive</Label>
                  <Switch
                    id="case-insensitive"
                    checked={caseInsensitive}
                    onCheckedChange={setCaseInsensitive}
                  />
                </div>
                <div>
                  <Label htmlFor="randomization-method" className="text-white mb-2 block">Randomization Method</Label>
                  <Select value={randomizationMethod} onValueChange={setRandomizationMethod}>
                    <SelectTrigger id="randomization-method" className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 text-white border-gray-600">
                      <SelectItem value="fisher-yates">Fisher-Yates Shuffle</SelectItem>
                      <SelectItem value="sort">JavaScript Sort</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subset-size" className="text-white mb-2 block">Subset Size (0 for all): {subsetSize}</Label>
                  <Slider
                    id="subset-size"
                    min={0}
                    max={100}
                    step={1}
                    value={subsetSize}
                    onChange={(value) => setSubsetSize(value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weighted-randomization" className="text-white">Weighted Randomization</Label>
                  <Switch
                    id="weighted-randomization"
                    checked={weightedRandomization}
                    onCheckedChange={setWeightedRandomization}
                  />
                </div>
                <div>
                  <Label htmlFor="seed" className="text-white mb-2 block">Random Seed (optional)</Label>
                  <Input
                    id="seed"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Enter a seed for reproducible results"
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
                <div>
                  <Label htmlFor="group-size" className="text-white mb-2 block">Group Size: {groupSize}</Label>
                  <Slider
                    id="group-size"
                    min={1}
                    max={10}
                    step={1}
                    value={groupSize}
                    onChange={(value) => setGroupSize(value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="reverse-output" className="text-white">Reverse Output</Label>
                  <Switch
                    id="reverse-output"
                    checked={reverseOutput}
                    onCheckedChange={setReverseOutput}
                  />
                </div>
              </div>
              <Button onClick={randomizeList} className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white">
                <Shuffle className="h-5 w-5 mr-2" />
                Randomize List
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Randomized Output</h2>
          <Textarea
            value={outputList}
            readOnly
            className="w-full h-64 p-2 bg-gray-700 text-white border border-gray-600 rounded-md"
          />
          <div className="mt-4 flex flex-wrap justify-between gap-2">
            <Button onClick={handleCopyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Copy className="h-5 w-5 mr-2" />
              Copy to Clipboard
            </Button>
            <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download Result
            </Button>
            <Button onClick={undo} disabled={historyIndex <= 0} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Undo className="h-5 w-5 mr-2" />
              Undo
            </Button>
            <Button onClick={redo} disabled={historyIndex >= history.length - 1} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              <Redo className="h-5 w-5 mr-2" />
              Redo
            </Button>
            <Button onClick={saveConfiguration} className="bg-teal-600 hover:bg-teal-700 text-white">
              <Save className="h-5 w-5 mr-2" />
              Save Config
            </Button>
            <Button onClick={loadConfiguration} className="bg-teal-600 hover:bg-teal-700 text-white">
              <FolderOpen className="h-5 w-5 mr-2" />
              Load Config
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
            <Info className="w-6 h-6 mr-2" />
            What is List Randomizer?
          </h2>
          <p className="text-gray-300 mb-4">
            The List Randomizer is a powerful tool designed to shuffle and manipulate lists of items. Whether you're conducting a random draw, organizing a playlist, or simply need to randomize data, this tool offers a wide range of features to meet your needs. With options for different randomization methods, custom separators, and advanced settings like weighted randomization and grouping, you can achieve precise control over your randomized output.
          </p>
          <p className="text-gray-300 mb-4">
            This tool is perfect for researchers, educators, project managers, and anyone who needs to introduce randomness or reorganize lists in their work or personal projects. The ability to save and load configurations makes it easy to replicate your randomization processes, ensuring consistency across multiple sessions.
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            How to Use List Randomizer?
          </h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Enter your list items in the input textarea or upload a text file.</li>
            <li>Choose the appropriate separator for your list items.</li>
            <li>Adjust the randomization settings according to your needs:
              <ul className="list-disc list-inside ml-4">
                <li>Set trimming, duplicate removal, and sorting options</li>
                <li>Choose the randomization method</li>
                <li>Adjust subset size, grouping, and other advanced options</li>
              </ul>
            </li>
            <li>Click the <strong>Randomize List</strong> button to generate a randomized version of your list.</li>
            <li>View the randomized output in the result textarea.</li>
            <li>Use the undo/redo buttons to navigate through your randomization history.</li>
            <li>Copy the result to your clipboard or download it as a text file.</li>
            <li>Save your current configuration for future use or load a previously saved configuration.</li>
          </ol>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Key Features
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Multiple input methods: Enter text directly or upload files.</li>
            <li>Flexible separators: Choose from common separators or use a custom one.</li>
            <li>Advanced randomization options: Fisher-Yates shuffle or JavaScript sort.</li>
            <li>List preprocessing: Trim items, remove duplicates, and sort before randomization.</li>
            <li>Subset selection: Choose a specific number of items from the randomized list.</li>
            <li>Weighted randomization: Prioritize items based on their original position.</li>
            <li>Grouping: Organize randomized items into groups of a specified size.</li>
            <li>Reversible output: Option to reverse the final randomized list.</li>
            <li>Reproducible results: Use a seed for consistent randomization across sessions.</li>
            <li>Undo/Redo functionality: Navigate through your randomization history.</li>
            <li>Configuration management: Save and load your randomization settings.</li>
            <li>Export options: Copy to clipboard or download as a text file.</li>
          </ul>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
            <Lightbulb className="w-6 h-6 mr-2" />
            Tips & Tricks
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
            <li>Use seeds for consistency: When you need to reproduce the same random order, use a specific seed value.</li>
            <li>Combine features: Use sorting with weighted randomization for a semi-random order that preserves some original structure.</li>
            <li>Grouping for team assignment: Use the grouping feature to quickly divide a list of names into teams or groups.</li>
            <li>Custom separators: For complex data, use a unique custom separator to ensure accurate list item separation.</li>
            <li>Save configurations: Create and save different configurations for various randomization tasks you perform regularly.</li>
            <li>Subset for sampling: Use the subset feature to randomly select a sample from a larger population.</li>
            <li>Reverse for alternative view: After randomizing, use the reverse option to see if any interesting patterns emerge from the bottom up.</li>
            <li>Undo for comparisons: Use the undo/redo feature to quickly compare different randomization results.</li>
            <li>Weighted randomization for priority: Use this feature when you want to maintain some influence of the original order.</li>
            <li>Combine with other tools: Use the randomized output with other tools in the WebToolsCenter for more complex data processing tasks.</li>
          </ul>
        </div>
  </ToolLayout>
  );
}