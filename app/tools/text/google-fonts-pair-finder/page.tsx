'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import Slider  from "@/components/ui/Slider";
import { Toaster, toast } from 'react-hot-toast';
import { RefreshCw, Copy, Download, Shuffle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FontSettings = {
  family: string;
  size: number;
  weight: string;
  lineHeight: number;
  letterSpacing: number;
};

type Font = {
  family: string;
  category: string;
  variants: string[];
};

const initialHeadingFont: FontSettings = {
  family: 'Roboto',
  size: 32,
  weight: '700',
  lineHeight: 1.2,
  letterSpacing: 0,
};

const initialBodyFont: FontSettings = {
  family: 'Open Sans',
  size: 16,
  weight: '400',
  lineHeight: 1.5,
  letterSpacing: 0,
};

export default function GoogleFontsPairFinder() {
  const [headingFont, setHeadingFont] = useState<FontSettings>(initialHeadingFont);
  const [bodyFont, setBodyFont] = useState<FontSettings>(initialBodyFont);
  const [activeTab, setActiveTab] = useState<'profile' | 'article' | 'card'>('profile');
  const [fonts, setFonts] = useState<Font[]>([]);
  const [loadingFonts, setLoadingFonts] = useState(false);

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
        toast.error('Failed to load fonts. Please try again later.');
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

  const handleRandomPair = () => {
    const newHeadingFont = {
      ...headingFont,
      family: fonts[Math.floor(Math.random() * fonts.length)].family,
    };
    let newBodyFont;
    do {
      newBodyFont = {
        ...bodyFont,
        family: fonts[Math.floor(Math.random() * fonts.length)].family,
      };
    } while (newBodyFont.family === newHeadingFont.family);
    setHeadingFont(newHeadingFont);
    setBodyFont(newBodyFont);
    toast.success('New font pair generated!');
  };

  const handleShuffleHeading = () => {
    const newHeadingFont = {
      ...headingFont,
      family: fonts[Math.floor(Math.random() * fonts.length)].family,
    };
    setHeadingFont(newHeadingFont);
    toast.success('New heading font selected!');
  };

  const handleShuffleBody = () => {
    const newBodyFont = {
      ...bodyFont,
      family: fonts[Math.floor(Math.random() * fonts.length)].family,
    };
    setBodyFont(newBodyFont);
    toast.success('New body font selected!');
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
    toast.success('CSS copied to clipboard!');
  };

  const handleDownloadHTML = () => {
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Font Pair Preview</title>
        <link href="https://fonts.googleapis.com/css2?family=${headingFont.family.replace(' ', '+')}:wght@${headingFont.weight}&family=${bodyFont.family.replace(' ', '+')}:wght@${bodyFont.weight}&display=swap" rel="stylesheet">
        <style>
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
        </style>
      </head>
      <body>
        <h1>This is a heading in ${headingFont.family}</h1>
        <p>This is body text in ${bodyFont.family}. The quick brown fox jumps over the lazy dog.</p>
      </body>
      </html>
    `;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'font-pair-preview.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('HTML preview downloaded!');
  };

  const FontControls = useCallback(({ isHeading }: { isHeading: boolean }) => {
    const font = isHeading ? headingFont : bodyFont;
    const setFont = isHeading ? setHeadingFont : setBodyFont;
    const handleShuffle = isHeading ? handleShuffleHeading : handleShuffleBody;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-font-family`} className="text-white">
            {isHeading ? 'Heading' : 'Body'} Font Family
          </Label>
          <Button onClick={handleShuffle} size="sm" className="bg-red-600 hover:bg-red-700 text-white" variant="outline">
            <Shuffle className="h-4 w-4 mr-2" />
            Shuffle
          </Button>
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
            {fonts.map((font) => (
              <SelectItem key={font.family} value={font.family}>
                {font.family}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div>
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-font-size`} className="text-white">
            Font Size: {font.size}px
          </Label>
          <Slider
            id={`${isHeading ? 'heading' : 'body'}-font-size`}
            min={8}
            max={isHeading ? 72 : 24}
            step={1}
            value={font.size}
            onChange={(value) => setFont({ ...font, size: value })}
            className="mt-2"
          />
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
              {fonts.find(f => f.family === font.family)?.variants.map((variant: string) => (
                <SelectItem key={variant} value={variant}>
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-line-height`} className="text-white">
            Line Height: {font.lineHeight.toFixed(1)}
          </Label>
          <Slider
            id={`${isHeading ? 'heading' : 'body'}-line-height`}
            min={0.8}
            max={2}
            step={0.1}
            value={font.lineHeight} // Pass single value
            onChange={(value) => setFont({ ...font, lineHeight: value })} // Handle single value
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor={`${isHeading ? 'heading' : 'body'}-letter-spacing`} className="text-white">
            Letter Spacing: {font.letterSpacing}px
          </Label>
          <Slider
            id={`${isHeading ? 'heading' : 'body'}-letter-spacing`}
            min={-2}
            max={10}
            step={0.5}
            value={font.letterSpacing}
            onChange={(value) => setFont({ ...font, letterSpacing: value})}
            className="mt-2"
          />
        </div>
      </div>
    );
  }, [fonts, headingFont, bodyFont, loadingFonts]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Google Fonts Pair Finder</h1>

        <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Heading Font</h2>
              <FontControls isHeading={true} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Body Font</h2>
              <FontControls isHeading={false} />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button onClick={handleRandomPair} className="bg-blue-600 hover:bg-blue-700 text-white">
              <RefreshCw className="h-5 w-5 mr-2" />
              Random Pair
            </Button>
            <Button onClick={handleCopyCSS} className="bg-green-600 hover:bg-green-700 text-white">
              <Copy className="h-5 w-5 mr-2" />
              Copy CSS
            </Button>
            <Button onClick={handleDownloadHTML} className="bg-purple-600 hover:bg-purple-700 text-white">
              <Download className="h-5 w-5 mr-2" />
              Download HTML
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'profile' | 'article' | 'card')}>
            <TabsList className="mb-4 bg-gray-700">
              <TabsTrigger value="profile" className="data-[state=active]:bg-gray-600">Profile</TabsTrigger>
              <TabsTrigger value="article" className="data-[state=active]:bg-gray-600">Article</TabsTrigger>
              <TabsTrigger value="card" className="data-[state=active]:bg-gray-600">Card</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <div className="bg-white text-black rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <img src="/placeholder.svg?height=100&width=100" alt="Profile" className="w-24 h-24 rounded-full" />
                  <div>
                    <h2 style={{
                      fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category}`,
                      fontSize: `${headingFont.size}px`,
                      fontWeight: headingFont.weight,
                      lineHeight: headingFont.lineHeight,
                      letterSpacing: `${headingFont.letterSpacing}px`,
                    }}>Jane Doe</h2>
                    <p style={{
                      fontFamily: `'${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category}`,
                      fontSize: `${bodyFont.size}px`,
                      fontWeight: bodyFont.weight,
                      lineHeight: bodyFont.lineHeight,
                      letterSpacing: `${bodyFont.letterSpacing}px`,
                    }}>UI/UX Lead at Cool Company</p>
                  </div>
                </div>
                <div style={{
                  fontFamily: `'${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category}`,
                  fontSize: `${bodyFont.size}px`,
                  fontWeight: bodyFont.weight,
                  lineHeight: bodyFont.lineHeight,
                  letterSpacing: `${bodyFont.letterSpacing}px`,
                }}>
                  <p className="mb-2">jane.doe@coolcompany.com</p>
                  <p className="mb-2">+1 123 456 78 90</p>
                  <p className="mb-4">New York, USA</p>
                  <h3 style={{
                    fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category}`,
                    fontSize: `${headingFont.size * 0.8}px`,
                    fontWeight: headingFont.weight,
                    lineHeight: headingFont.lineHeight,
                    letterSpacing: `${headingFont.letterSpacing}px`,
                  }} className="mb-2">Biography</h3>
                  <p className="mb-4">
                    I'm Jane Doe, UI/UX lead at Cool Company based in New York. I'm passionate about creating intuitive and beautiful user interfaces that enhance the user experience.
                  </p>
                  <h3 style={{
                    fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category}`,
                    fontSize: `${headingFont.size * 0.8}px`,
                    fontWeight: headingFont.weight,
                    lineHeight: headingFont.lineHeight,
                    letterSpacing: `${headingFont.letterSpacing}px`,
                  }} className="mb-2">Hobbies</h3>
                  <p>
                    In my spare time, I enjoy exploring new design tools, reading about typography, and experimenting with different font combinations to improve my craft.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="article">
              <div className="bg-white text-black rounded-lg p-6">
                <h2 style={{
                  fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category}`,
                  fontSize: `${headingFont.size}px`,
                  fontWeight: headingFont.weight,
                  lineHeight: headingFont.lineHeight,
                  letterSpacing: `${headingFont.letterSpacing}px`,
                }} className="mb-4">The Art of Typography</h2>
                <p style={{
                  fontFamily: `'${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category}`,
                  fontSize: `${bodyFont.size}px`,
                  fontWeight: bodyFont.weight,
                  lineHeight: bodyFont.lineHeight,
                  letterSpacing: `${bodyFont.letterSpacing}px`,
                }}>
                  Typography is the art and technique of arranging type to make written language legible, readable, and appealing when displayed. The arrangement of type involves selecting typefaces, point sizes, line lengths, line-spacing (leading), and letter-spacing (tracking), and adjusting the space between pairs of letters (kerning).
                </p>
              </div>
            </TabsContent>
            <TabsContent value="card">
              <div className="bg-white text-black rounded-lg overflow-hidden">
                <img src="/placeholder.svg?height=200&width=400" alt="Card" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 style={{
                    fontFamily: `'${headingFont.family}', ${fonts.find(f => f.family === headingFont.family)?.category}`,
                    fontSize: `${headingFont.size * 0.8}px`,
                    fontWeight: headingFont.weight,
                    lineHeight: headingFont.lineHeight,
                    letterSpacing: `${headingFont.letterSpacing}px`,
                  }} className="mb-2">Exploring Typography</h3>
                  <p style={{
                    fontFamily: `'${bodyFont.family}', ${fonts.find(f => f.family === bodyFont.family)?.category}`,
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
        </div>
      </main>
      <Footer />
    </div>
  );
}