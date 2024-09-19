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
import { Shuffle, Copy, Upload, Download } from 'lucide-react';
import Header from '@/components/Header';
import seedrandom from 'seedrandom';
import Footer from '@/components/Footer';

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

    setOutputList(randomizedItems.join('\n'));
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

  useEffect(() => {
    if (seed) {
      // Set the seed for the global random number generator
      seedrandom(seed, { global: true });
    } else {
      // Optionally reset the global RNG
      seedrandom(); 
    }
  }, [seed]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">List Randomizer</h1>

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
                    <SelectValue placeholder="Select separator" />
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
          <div className="mt-4 flex justify-between">
            <Button onClick={handleCopyToClipboard} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Copy className="h-5 w-5 mr-2" />
              Copy to Clipboard
            </Button>
            <Button onClick={handleDownload} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download Result
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Enter your list items in the input textarea or upload a text file.</li>
            <li>Choose the appropriate separator for your list items.</li>
            <li>Adjust the randomization settings according to your needs.</li>
            <li>Click the "Randomize List" button to generate a randomized version of your list.</li>
            <li>View the randomized output in the result textarea.</li>
            <li>Copy the result to your clipboard or download it as a text file.</li>
          </ol>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">Features Explained</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li><strong>Trim items:</strong> Removes leading and trailing whitespace from each item.</li>
            <li><strong>Remove duplicates:</strong> Ensures each item appears only once in the list.</li>
            <li><strong>Sort before randomize:</strong> Alphabetically sorts the list before randomization.</li>
            <li><strong>Case-insensitive:</strong> Treats uppercase and lowercase letters as the same when sorting or removing duplicates.</li>
            <li><strong>Randomization methods:</strong> Choose between Fisher-Yates (unbiased) or JavaScript's built-in sort function.</li>
            <li><strong>Subset size:</strong> Select a specific number of items from the randomized list.</li>
            <li><strong>Weighted randomization:</strong> Gives higher priority to items at the beginning of the list.</li>
            <li><strong>Random seed:</strong> Allows for reproducible randomization results.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}