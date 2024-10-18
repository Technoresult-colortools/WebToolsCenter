'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster, toast } from 'react-hot-toast'
import { RefreshCw, Copy, Download, Shuffle, Info, Lightbulb, BookOpen, Type, Filter } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/sidebarTools'

type FontSettings = {
  family: string;
  size: number;
  weight: string;
  lineHeight: number;
  letterSpacing: number;
  style: 'normal' | 'italic';
};

type Font = {
  family: string;
  category: string;
  variants: string[];
  popularity: number;
  lastModified: string;
  subsets: string[];
};

type FontCategory = 'serif' | 'sans-serif' | 'display' | 'handwriting' | 'monospace';

const initialHeadingFont: FontSettings = {
  family: 'Roboto',
  size: 32,
  weight: '700',
  lineHeight: 1.2,
  letterSpacing: 0,
  style: 'normal',
};

const initialBodyFont: FontSettings = {
  family: 'Open Sans',
  size: 16,
  weight: '400',
  lineHeight: 1.5,
  letterSpacing: 0,
  style: 'normal',
};


const fontSizeOptions = [
  { value: 12, label: '12px' },
  { value: 14, label: '14px' },
  { value: 16, label: '16px' },
  { value: 18, label: '18px' },
  { value: 20, label: '20px' },
  { value: 24, label: '24px' },
  { value: 28, label: '28px' },
  { value: 32, label: '32px' },
  { value: 36, label: '36px' },
  { value: 48, label: '48px' },
  { value: 64, label: '64px' },
];

const popularityOptions = [
  { value: 'all', label: 'Use All' },
  { value: 'top100', label: 'Top 100' },
  { value: 'top250', label: 'Top 250' },
  { value: 'top500', label: 'Top 500' },
];

export default function GoogleFontsPairFinder() {
  const [headingFont, setHeadingFont] = useState<FontSettings>(initialHeadingFont);
  const [bodyFont, setBodyFont] = useState<FontSettings>(initialBodyFont);
  const [activeTab, setActiveTab] = useState<'profile' | 'article' | 'card'>('profile');
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loadingFonts, setLoadingFonts] = useState(false);
  const [headingCategories, setHeadingCategories] = useState<FontCategory[]>(['serif', 'sans-serif']);
  const [bodyCategories, setBodyCategories] = useState<FontCategory[]>(['serif', 'sans-serif']);
  const [headingPopularity, setHeadingPopularity] = useState('all');
  const [bodyPopularity, setBodyPopularity] = useState('all');
  const [showFontsPair, setShowFontsPair] = useState(false);

  useEffect(() => {
    const preloadFonts = () => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${initialHeadingFont.family.replace(' ', '+')}:wght@${initialHeadingFont.weight}&family=${initialBodyFont.family.replace(' ', '+')}:wght@${initialBodyFont.weight}&display=swap`;
      link.rel = 'preload';
      link.as = 'style';
      document.head.appendChild(link);
    };

    preloadFonts();
  }, []);

  useEffect(() => {
    const fetchFonts = async () => {
      setLoadingFonts(true);
      try {
        const response = await fetch(
          'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBuElNJbNr3TBhSrnSbrtt6ro_8gmSjBDM&sort=popularity'
        );
        const data = await response.json();
        setFonts(data.items);
      } catch (error) {
        console.error('Error fetching fonts:', error);
        toast.error("Failed to load fonts. Please try again later.");
      } finally {
        setLoadingFonts(false);
      }
    };

    fetchFonts();
  }, []);

  useEffect(() => {
    const updateFontStyles = () => {
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${headingFont.family.replace(' ', '+')}:wght@${headingFont.weight}&family=${bodyFont.family.replace(' ', '+')}:wght@${bodyFont.weight}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    };

    updateFontStyles();
  }, [headingFont.family, headingFont.weight, bodyFont.family, bodyFont.weight]);

  const filteredHeadingFonts = fonts?.filter(font => 
    headingCategories.includes(font.category as FontCategory) &&
    (headingPopularity === 'all' || 
     (headingPopularity === 'top100' && font.popularity <= 100) ||
     (headingPopularity === 'top250' && font.popularity <= 250) ||
     (headingPopularity === 'top500' && font.popularity <= 500))
  ) || [];

  const filteredBodyFonts = fonts?.filter(font => 
    bodyCategories.includes(font.category as FontCategory) &&
    (bodyPopularity === 'all' || 
     (bodyPopularity === 'top100' && font.popularity <= 100) ||
     (bodyPopularity === 'top250' && font.popularity <= 250) ||
     (bodyPopularity === 'top500' && font.popularity <= 500))
  ) || [];

  const handleRandomPair = () => {
    const newHeadingFont = {
      ...headingFont,
      family: filteredHeadingFonts[Math.floor(Math.random() * filteredHeadingFonts.length)].family,
    };
    let newBodyFont;
    do {
      newBodyFont = {
        ...bodyFont,
        family: filteredBodyFonts[Math.floor(Math.random() * filteredBodyFonts.length)].family,
      };
    } while (newBodyFont.family === newHeadingFont.family);
    setHeadingFont(newHeadingFont);
    setBodyFont(newBodyFont);
    toast.success("A new font pair has been generated!");
  };

  const handleShuffleHeading = () => {
    const newHeadingFont = {
      ...headingFont,
      family: filteredHeadingFonts[Math.floor(Math.random() * filteredHeadingFonts.length)].family,
    };
    setHeadingFont(newHeadingFont);
    toast.success("A new heading font has been selected!");
  };

  const handleShuffleBody = () => {
    const newBodyFont = {
      ...bodyFont,
      family: filteredBodyFonts[Math.floor(Math.random() * filteredBodyFonts.length)].family,
    };
    setBodyFont(newBodyFont);
    toast.success("A new body font has been selected!");
  };

  const handleCopyCSS = () => {
    const css = `
      @import url('https://fonts.googleapis.com/css2?family=${headingFont.family.replace(' ', '+')}:wght@${headingFont.weight}&family=${bodyFont.family.replace(' ', '+')}:wght@${bodyFont.weight}&display=swap');

      h1, h2, h3, h4, h5, h6 {
        font-family: '${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category};
        font-size: ${headingFont.size}px;
        font-weight: ${headingFont.weight};
        line-height: ${headingFont.lineHeight};
        letter-spacing: ${headingFont.letterSpacing}px;
      }

      body, p {
        font-family: '${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category};
        font-size: ${bodyFont.size}px;
        font-weight: ${bodyFont.weight};
        line-height: ${bodyFont.lineHeight};
        letter-spacing: ${bodyFont.letterSpacing}px;
      }
    `;
    navigator.clipboard.writeText(css);
    toast.success("The CSS has been copied to your clipboard.");
  };

  const FontControls = useCallback(({ isHeading }: { isHeading: boolean }) => {
    const font = isHeading ? headingFont : bodyFont;
    const setFont = isHeading ? setHeadingFont : setBodyFont;
    const handleShuffle = isHeading ? handleShuffleHeading : handleShuffleBody;
    const filteredFonts = isHeading ? filteredHeadingFonts : filteredBodyFonts;
    
    return (
      <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${isHeading ? 'heading' : 'body'}-font-family`} className="text-white">
          {isHeading ? 'Heading' : 'Body'} Font Family
        </Label>
        <div className="flex space-x-2">
          <Button onClick={handleShuffle} size="sm" className="bg-red-600 hover:bg-red-700 text-white" variant="destructive">
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
          <FontDetails font={font} setFont={setFont} isHeading={isHeading} fonts={fonts} />
        </div>
      </div>
        <Select
          value={font.family}
          onValueChange={(value) => setFont({ ...font, family: value })}
          disabled={loadingFonts}
        >
          <SelectTrigger id={`${isHeading ? 'heading' : 'body'}-font-family`} className="bg-gray-700 text-white border-gray-600">
            <SelectValue placeholder="Select a font" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white border-gray-600 max-h-60 overflow-y-auto">
            {filteredFonts.map((font) => (
              <SelectItem key={font.family} value={font.family}>
                {font.family}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-font-size`} className="text-white">
            Font Size
          </Label>
          <Select
            value={font.size.toString()}
            onValueChange={(value) => setFont({ ...font, size: parseInt(value) })}
          >
            <SelectTrigger id={`${isHeading ? 'heading' : 'body'}-font-size`} className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              {fontSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-font-weight`} className="text-white">
            Font Weight
          </Label>
          <Select
            value={font.weight}
            onValueChange={(value) => setFont({ ...font, weight: value })}
          >
            <SelectTrigger id={`${isHeading ? 'heading' : 'body'}-font-weight`} className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600 max-h-60 overflow-y-auto">
              {fonts.find(f => f.family === font.family)?.variants?.map((variant) => (
                <SelectItem key={variant} value={variant}>
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-line-height`} className="text-white">
            Line Height
          </Label>
          <Select
            value={font.lineHeight.toString()}
            onValueChange={(value) => setFont({ ...font, lineHeight: parseFloat(value) })}
          >
            <SelectTrigger id={`${isHeading ? 'heading' : 'body'}-line-height`} className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select line height" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              {[1, 1.2, 1.4, 1.6, 1.8, 2].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value.toFixed(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-letter-spacing`} className="text-white">
            Letter Spacing
          </Label>
          <Select
            value={font.letterSpacing.toString()}
            onValueChange={(value) => setFont({ ...font, letterSpacing: parseFloat(value)   })}
          >
            <SelectTrigger id={`${isHeading ? 'heading' : 'body'}-letter-spacing`} className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select letter spacing" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              {[-2, -1, -0.5, 0, 0.5, 1, 2].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value.toFixed(1)}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }, [fonts, headingFont, bodyFont, loadingFonts, filteredHeadingFonts, filteredBodyFonts]);

  const FontDetails = React.memo(({ font, setFont, isHeading, fonts }: { 
    font: FontSettings; 
    setFont: React.Dispatch<React.SetStateAction<FontSettings>>; 
    isHeading: boolean;
    fonts: Font[];
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentFont = fonts.find(f => f.family === font.family);
    const [previewSettings, setPreviewSettings] = useState(font);
  
    // Calculate popularity percentage and ranking
    const popularityRank = currentFont?.popularity || 0;
    const totalFonts = fonts.length;
    const popularityPercentage = totalFonts > 0 ? 
      ((totalFonts - popularityRank + 1) / totalFonts * 100).toFixed(1) : 0;
  
    const allVariants = currentFont?.variants || [];
    const regularVariants = allVariants.filter(v => !v.includes('italic'));
    const italicVariants = allVariants.filter(v => v.includes('italic'));
  
    const handleVariantChange = useCallback((variant: string) => {
      setPreviewSettings(prev => ({
        ...prev,
        weight: variant.replace('italic', ''),
        style: variant.includes('italic') ? 'italic' : 'normal'
      }));
    }, []);
  
    const handleApplyChanges = useCallback(() => {
      setFont(previewSettings);
      setIsOpen(false);
    }, [previewSettings, setFont]);
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Info className="h-4 w-4 mr-2" />
            Details
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white max-w-3xl max-h-[75vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isHeading ? 'Heading' : 'Body'} Font Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p><strong>Font Family:</strong> {currentFont?.family}</p>
            <p><strong>Category:</strong> {currentFont?.category}</p>
            <div className="space-y-1">
              <p><strong>Popularity:</strong></p>
              <p className="text-sm">Rank: {popularityRank} of {totalFonts} fonts</p>
              <p className="text-sm">Percentile: Top {popularityPercentage}%</p>
            </div>
            <p><strong>Available Subsets:</strong> {currentFont?.subsets.join(', ')}</p>
            <p><strong>Last Modified:</strong> {new Date(currentFont?.lastModified || '').toLocaleDateString()}</p>
            <div>
              <strong>Available Variants:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {regularVariants.map((variant) => (
                  <Button
                    key={variant}
                    size="sm"
                    variant={variant === previewSettings.weight && previewSettings.style === 'normal' ? 'default' : 'outline'}
                    onClick={() => handleVariantChange(variant)}
                    className="text-xs"
                  >
                    {variant}
                  </Button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {italicVariants.map((variant) => (
                  <Button
                    key={variant}
                    size="sm"
                    variant={variant.replace('italic', '') === previewSettings.weight && previewSettings.style === 'italic' ? 'default' : 'outline'}
                    onClick={() => handleVariantChange(variant)}
                    className="text-xs italic"
                  >
                    {variant}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <strong>Font Preview:</strong>
              <div className="bg-white text-black p-4 rounded-md mt-2">
                {[12, 16, 20, 24, 32, 48].map((size) => (
                  <p
                    key={size}
                    style={{
                      fontFamily: `'${currentFont?.family}', ${currentFont?.category}`,
                      fontSize: `${size}px`,
                      fontWeight: previewSettings.weight,
                      fontStyle: previewSettings.style,
                      lineHeight: previewSettings.lineHeight,
                      letterSpacing: `${previewSettings.letterSpacing}px`,
                    }}
                  >
                    The swift orange cat leaps across the sleepy owl ({size}px)
                  </p>
                ))}
              </div>
            </div>
            <Button onClick={handleApplyChanges} className="w-full bg-green-600 hover:bg-green-700 text-white">
              Apply Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  });

  const FontFilters = ({ isHeading }: { isHeading: boolean }) => {
    const categories = isHeading ? headingCategories : bodyCategories;
    const setCategories = isHeading ? setHeadingCategories : setBodyCategories;
    const popularity = isHeading ? headingPopularity : bodyPopularity;
    const setPopularity = isHeading ? setHeadingPopularity : setBodyPopularity;

    const handleCategoryChange = (category: FontCategory) => {
      setCategories(prev => 
        prev.includes(category) 
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{isHeading ? 'Heading' : 'Body'} Font Filters</h3>
        <div className="space-y-2">
          <p className="text-white">Categories:</p>
          {(['serif', 'sans-serif', 'display', 'handwriting', 'monospace'] as FontCategory[]).map(category => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`${isHeading ? 'heading' : 'body'}-${category}`}
                checked={categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="mr-2"
              />
              <label 
                htmlFor={`${isHeading ? 'heading' : 'body'}-${category}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            </div>
          ))}
        </div>
        <div>
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-popularity`} className="text-white">
            Limit Fonts by Popularity
          </Label>
          <Select
            value={popularity}
            onValueChange={(value) => setPopularity(value)}
          >
            <SelectTrigger id={`${isHeading ? 'heading' : 'body'}-popularity`} className="bg-gray-700 text-white border-gray-600">
              <SelectValue placeholder="Select popularity" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              {popularityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const ShowFontsPair = () => {
    const headingWeights = fonts.find(f => f.family === headingFont.family)?.variants || [];
    const bodyWeights = fonts.find(f => f.family === bodyFont.family)?.variants || [];

    const [selectedHeadingWeights, setSelectedHeadingWeights] = useState<string[]>([headingFont.weight]);
    const [selectedBodyWeights, setSelectedBodyWeights] = useState<string[]>([bodyFont.weight]);
    const [embedType, setEmbedType] = useState<'link' | 'import'>('link');

    const toggleWeight = (weight: string, isHeading: boolean) => {
      if (isHeading) {
        setSelectedHeadingWeights(prev => 
          prev.includes(weight) ? prev.filter(w => w !== weight) : [...prev, weight]
        );
      } else {
        setSelectedBodyWeights(prev => 
          prev.includes(weight) ? prev.filter(w => w !== weight) : [...prev, weight]
        );
      }
    };

    const generateCode = () => {
      const headingFontString = `${headingFont.family.replace(' ', '+')}:wght@${selectedHeadingWeights.join(';')}`;
      const bodyFontString = `${bodyFont.family.replace(' ', '+')}:wght@${selectedBodyWeights.join(';')}`;
      
      const linkCode = `<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=${headingFontString}&family=${bodyFontString}&display=swap" rel="stylesheet">`;

      const importCode = `<style>
@import url('https://fonts.googleapis.com/css2?family=${headingFontString}&family=${bodyFontString}&display=swap');
</style>`;

      return embedType === 'link' ? linkCode : importCode;
    };

    return (
      <Dialog open={showFontsPair} onOpenChange={setShowFontsPair}>
        <DialogContent className="bg-gray-800 text-white max-w-3xl max-h-[75vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Use Fonts in Web</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Heading Font Family</h3>
              <p>{headingFont.family}, {fonts.find(f => f.family === headingFont.family)?.category}</p>
            </div>
            <div>
              <h3 className="font-semibold">Body Font Family</h3>
              <p>{bodyFont.family}, {fonts.find(f => f.family === bodyFont.family)?.category}</p>
            </div>
            <div>
              <h3 className="font-semibold">Heading Weights</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {headingWeights.map((weight) => (
                  <Button
                    key={weight}
                    size="sm"
                    variant={selectedHeadingWeights.includes(weight) ? 'default' : 'outline'}
                    onClick={() => toggleWeight(weight, true)}
                    className="text-xs"
                  >
                    {weight}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Body Weights</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {bodyWeights.map((weight) => (
                  <Button
                    key={weight}
                    size="sm"
                    variant={selectedBodyWeights.includes(weight) ? 'default' : 'outline'}
                    onClick={() => toggleWeight(weight, false)}
                    className="text-xs"
                  >
                    {weight}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Embed Code Type</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="link"
                    checked={embedType === 'link'}
                    onChange={() => setEmbedType('link')}
                    className="mr-2"
                  />
                  Link
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="import"
                    checked={embedType === 'import'}
                    onChange={() => setEmbedType('import')}
                    className="mr-2"
                  />
                  CSS Import
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Embed Code</h3>
              <pre className="bg-gray-900 p-2 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {generateCode()}
              </pre>
            </div>
            <Button onClick={() => {
              navigator.clipboard.writeText(generateCode());
              toast.success('Embed code copied to clipboard!');
            }} className="bg-green-600 hover:bg-green-700 text-white">
              Copy Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      <div className='flex-grow flex'>
        <aside className="bg-gray-800">
          <Sidebar />
        </aside>
        <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12 text-center px-4">
              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
                  Google Fonts Pair Finder
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
                 Discover the perfect font combinations for your design projects.
              </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
            {/* Preview Section */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'profile' | 'article' | 'card')}>
              <TabsList className="mb-4 bg-gray-700">
                <TabsTrigger value="profile" className="data-[state=active]:bg-gray-600">Profile</TabsTrigger>
                <TabsTrigger value="article" className="data-[state=active]:bg-gray-600">Article</TabsTrigger>
                <TabsTrigger value="card" className="data-[state=active]:bg-gray-600">Card</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <div className="bg-white text-black rounded-lg p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <img src="/Images/prem.jpg?height=100&width=100" alt="Profile" className="w-24 h-24 rounded-full" />
                    <div>
                      <h2 style={{
                        fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category || 'sans-serif'}`,
                        fontSize: `${headingFont.size}px`,
                        fontWeight: headingFont.weight,
                        lineHeight: headingFont.lineHeight,
                        letterSpacing: `${headingFont.letterSpacing}px`,
                      }}>Premnash</h2>
                      <p style={{
                        fontFamily: `'${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category || 'sans-serif'}`,
                        fontSize: `${bodyFont.size}px`,
                        fontWeight: bodyFont.weight,
                        lineHeight: bodyFont.lineHeight,
                        letterSpacing: `${bodyFont.letterSpacing}px`,
                      }}>Software Engineer - Microsoft</p>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: `'${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category || 'sans-serif'}`,
                    fontSize: `${bodyFont.size}px`,
                    fontWeight: bodyFont.weight,
                    lineHeight: bodyFont.lineHeight,
                    letterSpacing: `${bodyFont.letterSpacing}px`,
                  }}>
                    <p className="mb-2">premnash@mario.com</p>
                    <p className="mb-2">+13 345 325 123</p>
                    <p className="mb-4">Las Vegas, USA</p>
                    <h3 style={{
                      fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category || 'sans-serif'}`,
                      fontSize: `${headingFont.size * 0.8}px`,
                      fontWeight: headingFont.weight,
                      lineHeight: headingFont.lineHeight,
                      letterSpacing: `${headingFont.letterSpacing}px`,
                    }} className="mb-2">Biography</h3>
                    <p className="mb-4">
                      I'm Premnash, a software engineer at Innovative Tech Solutions in San Francisco. I specialize in developing robust applications that deliver seamless functionality and enhance user engagement.
                    </p>
                    <h3 style={{
                      fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category || 'sans-serif'}`,
                      fontSize: `${headingFont.size * 0.8}px`,
                      fontWeight: headingFont.weight,
                      lineHeight: headingFont.lineHeight,
                      letterSpacing: `${headingFont.letterSpacing}px`,
                    }} className="mb-2">Hobbies</h3>
                    <p>
                      In my spare time, I love hiking in nature, trying out new recipes in the kitchen, and practicing photography to capture the beauty around me.
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="article">
                <div className="bg-white text-black rounded-lg p-6">
                  <h2 style={{
                    fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category || 'sans-serif'}`,
                    fontSize: `${headingFont.size}px`,
                    fontWeight: headingFont.weight,
                    lineHeight: headingFont.lineHeight,
                    letterSpacing: `${headingFont.letterSpacing}px`,
                  }} className="mb-4">The Art of Web Design: Crafting Engaging Digital Experiences</h2>
                  <p style={{
                    fontFamily: `'${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category || 'sans-serif'}`,
                    fontSize: `${bodyFont.size}px`,
                    fontWeight: bodyFont.weight,
                    lineHeight: bodyFont.lineHeight,
                    letterSpacing: `${bodyFont.letterSpacing}px`,
                  }}>
                    Web design is the creative process of planning and building websites, focusing on aesthetics, usability, and user experience. It involves a blend of graphic design, interface design, and interaction design to create visually appealing and functional websites. Effective web design enhances user engagement by ensuring that content is organized, easy to navigate, and responsive across devices. Key elements include color schemes, typography, imagery, and layout, all harmonizing to convey a brand's message. As technology evolves, trends in web design continue to shift, emphasizing minimalism, accessibility, and interactivity. A well-designed website not only attracts visitors but also fosters trust and encourages conversions, making it a crucial aspect of any online presence. Embracing the principles of web design can transform a simple webpage into a captivating digital experience that resonates with users.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="card">
                <div className="bg-white text-black rounded-lg overflow-hidden">
                  <img src="/placeholder.svg?height=200&width=400" alt="Card" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 style={{
                      fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category || 'sans-serif'}`,
                      fontSize: `${headingFont.size * 0.8}px`,
                      fontWeight: headingFont.weight,
                      lineHeight: headingFont.lineHeight,
                      letterSpacing: `${headingFont.letterSpacing}px`,
                    }} className="mb-2">Exploring Typography</h3>
                    <p style={{
                      fontFamily: `'${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category || 'sans-serif'}`,
                      fontSize: `${bodyFont.size}px`,
                      fontWeight: bodyFont.weight,
                      lineHeight: bodyFont.lineHeight,
                      letterSpacing: `${bodyFont.letterSpacing}px`,
                    }}>
                      Discover the world of fonts and how they can transform your designs. Learn about serif, sans-serif, and display typefaces.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Controls */}
            <div className="mt-8">
              <Tabs defaultValue="heading">
                <TabsList className="mb-4 bg-gray-700">
                  <TabsTrigger value="heading" className="data-[state=active]:bg-gray-600">
                    <Type className="h-4 w-4 mr-2" />
                    Heading Font
                  </TabsTrigger>
                  <TabsTrigger value="body" className="data-[state=active]:bg-gray-600">
                    <Type className="h-4 w-4 mr-2" />
                    Body Font
                  </TabsTrigger>
                  <TabsTrigger value="filters" className="data-[state=active]:bg-gray-600">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="heading">
                  <FontControls isHeading={true} />
                </TabsContent>
                <TabsContent value="body">
                  <FontControls isHeading={false} />
                </TabsContent>
                <TabsContent value="filters">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FontFilters isHeading={true} />
                    <FontFilters isHeading={false} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button onClick={handleRandomPair} className="bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className="h-5 w-5 mr-2" />
                Random Pair
              </Button>
              <Button onClick={handleCopyCSS} className="bg-green-600 hover:bg-green-700 text-white">
                <Copy className="h-5 w-5 mr-2" />
                Copy CSS
              </Button>
              <Button onClick={() => setShowFontsPair(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Download className="h-5 w-5 mr-2" />
                Use Fonts in Web
              </Button>
            </div>
          </div>

          {/* About section */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2" />
              About Google Fonts Pair Finder
            </h2>
            <p className="text-gray-300 mb-4">
              The Google Fonts Pair Finder is a powerful tool designed to help designers and developers discover harmonious font combinations from Google's extensive font library. Whether you're working on web design, print projects, or branding, this tool simplifies the process of finding the perfect typography pairing.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2" />
              How to Use Google Fonts Pair Finder
            </h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Select font categories and popularity filters for both heading and body fonts.</li>
              <li>Choose fonts from the filtered lists or use the shuffle button for random selection.</li>
              <li>Adjust font properties such as size, weight, line height, and letter spacing.</li>
              <li>Preview your font combination in different contexts using the tabs (Profile, Article, Card).</li>
              <li>Generate a random font pair using the "Random Pair" button for quick inspiration.</li>
              <li>Copy the CSS for your selected fonts or generate embed code for web use.</li>
              <li>Experiment with different combinations until you find the perfect pair for your project.</li>
            </ol>

            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 mt-8 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2" />
              Features
            </h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm md:text-base">
              <li>Advanced filtering options by font category and popularity.</li>
              <li>Real-time preview of font combinations in various contexts (Profile, Article, Card).</li>
              <li>Fine-tuning controls for font size, weight, line height, and letter spacing.</li>
              <li>Random pair generation for quick inspiration.</li>
              <li>Detailed font information available for each selected font, including popularity ranking and available weights.</li>
              <li>Easy export of CSS and embed code for immediate use in projects.</li>
              <li>Responsive design for use on various devices.</li>
              <li>Ability to select multiple font weights for each font family.</li>
              <li>Option to choose between link and CSS import methods for embedding fonts.</li>
              <li>Toast notifications for user feedback on actions like copying CSS or generating new font pairs.</li>
            </ul>
          </div>
        </main>
      </div>
      <Footer />
      <Toaster position="top-right" />
      <ShowFontsPair />
    </div>
  )
}