'use client';

import React, { useCallback, useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Input from "@/components/ui/Input";
import Slider from "@/components/ui/Slider";

interface Shade {
    hex: string;
    rgb: [number, number, number];
    hsv: [number, number, number];
    hsl: [number, number, number];
}


export default function ColorShadesGenerator() {
    const [baseColor, setBaseColor] = useState('#3da013');
    const [shadeCount, setShadeCount] = useState(10);
    const [shades, setShades] = useState<Shade[]>([]);
    const [selectedShade, setSelectedShade] = useState<Shade | null>(null);


    function hexToRgb(hex: string): [number, number, number] {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [r, g, b];
    }

    function rgbToHex(r: number, g: number, b: number): string {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const v = max;
        const d = max - min;
        const s = max === 0 ? 0 : d / max;
        let h = 0;
        if (max !== min) {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
    }
    


    function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s: number; 
        const l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
    }
    

    const generateShades = useCallback((hex: string, count: number): Shade[] => {
        const [r, g, b] = hexToRgb(hex);
        return Array.from({ length: count }, (_, i) => {
            const factor = i / (count - 1);
            const shadeR = Math.round(r * (1 - factor) + 255 * factor);
            const shadeG = Math.round(g * (1 - factor) + 255 * factor);
            const shadeB = Math.round(b * (1 - factor) + 255 * factor);
            const shadeHex = rgbToHex(shadeR, shadeG, shadeB);
            return {
                hex: shadeHex,
                rgb: [shadeR, shadeG, shadeB],
                hsv: rgbToHsv(shadeR, shadeG, shadeB),
                hsl: rgbToHsl(shadeR, shadeG, shadeB)
            };
        });
    }, []);

    useEffect(() => {
        const newShades = generateShades(baseColor, shadeCount);
        setShades(newShades);
        setSelectedShade(newShades[Math.floor(newShades.length / 2)]);
    }, [baseColor, shadeCount, generateShades]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-800">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">Color Shades Generator</h1>
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
                    <div className="mb-6">
                        <label htmlFor="color-picker" className="block text-lg font-medium text-gray-200 mb-2">
                            Enter Color:
                        </label>
                        <div className="flex items-center">
                            <Input
                                id="color-input"
                                type="text"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="flex-grow mr-2 bg-gray-700 text-white border-gray-600"
                            />
                            <input
                                id="color-picker"
                                type="color"
                                value={baseColor}
                                onChange={(e) => setBaseColor(e.target.value)}
                                className="w-10 h-10 p-1 rounded"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="shade-slider" className="block text-lg font-medium text-gray-200 mb-2">
                            Shade Count: {shadeCount}
                        </label>
                        <Slider
                            id="shade-slider"
                            min={2}
                            max={15}
                            step={1}
                            value={shadeCount}  // Pass a single number
                            onChange={setShadeCount}  // Update to match Slider's onChange type
                            className="w-full"
                            />
                    </div>

                    <div className="flex mb-6" id="shades-container">
                        {shades.map((shade, index) => (
                            <div
                                key={index}
                                className="flex-1 h-10 shade"
                                style={{ backgroundColor: shade.hex }}
                                onClick={() => setSelectedShade(shade)}
                            ></div>
                        ))}
                    </div>

                    {selectedShade && (
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold text-gray-200">Selected Shade:</h2>
                            <div className="flex mt-2">
                                <div 
                                    className="w-1/3 h-32 rounded-md"
                                    style={{ backgroundColor: selectedShade.hex }}
                                ></div>
                                <div className="w-2/3 ml-4 text-gray-300">
                                    <div className="mb-2"><strong>HEX:</strong> {selectedShade.hex}</div>
                                    <div className="mb-2"><strong>RGB:</strong> rgb({selectedShade.rgb.join(', ')})</div>
                                    <div className="mb-2"><strong>HSL:</strong> hsl({selectedShade.hsl.join(', ')})</div>
                                    <div className="mb-2"><strong>HSV:</strong> hsv({selectedShade.hsv.join(', ')})</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto mt-4">
                    <div className="mt-8">
                        <section className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-2">About Color Shades Generator</h2>
                        <p className="text-white">
                            The Color Shades Generator helps you create different shades of a base color. You can generate a range of lighter or darker shades by adjusting the shade count, making it a perfect tool for designers and developers who need flexible color options.
                        </p>
                        </section>

                        <section className="mb-6">
                        <h2 className="text-xl font-semibold text-white mb-2">How to Use</h2>
                        <p className="text-white">
                            1. Choose a base color using the color picker or enter its hex code.<br />
                            2. Adjust the number of shades using the slider to generate a desired range of color variations.<br />
                            3. Each shade will be displayed with its hex code, which you can use in your design projects.
                        </p>
                        </section>

                        <section>
                        <h2 className="text-xl font-semibold text-white mb-2">Tips</h2>
                        <p className="text-white">
                            - The base color is the starting point for generating shades.<br />
                            - Increasing the shade count will provide more nuanced color variations.<br />
                            - You can use the generated hex codes directly in your CSS to enhance visual consistency across your designs.
                        </p>
                        </section>
                    </div>
                </div>

            </main>
            <Footer />
        </div>
    );
}