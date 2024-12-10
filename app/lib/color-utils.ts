import OpenAI from 'openai';

// Color utility functions
export const ColorUtils = {
  generateRandomColor,
  hexToRgb,
  rgbToHex,
  hexToHsl,
  getContrastColor,
  calculateLuminance,
  blendColors
}

// Generate a random hex color
function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Convert hex to RGB
function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Convert hex to HSL
function hexToHsl(hex: string): { h: number, s: number, l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
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

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Get contrast color (black or white)
function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  const brightness = calculateLuminance(rgb);
  return brightness > 0.5 ? '#000000' : '#FFFFFF';
}

// Calculate color luminance
function calculateLuminance(rgb: { r: number, g: number, b: number }): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Blend two colors
function blendColors(color1: string, color2: string, ratio: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return color1;

  const blended = {
    r: Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio),
    g: Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio),
    b: Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio)
  };

  return rgbToHex(blended.r, blended.g, blended.b);
}

// Generate palette from color harmony types
export async function generatePaletteFromAPI(
  baseColor: string, 
  harmonyType: string = 'analogous'
): Promise<string[]> {
  const baseRgb = hexToRgb(baseColor);
  if (!baseRgb) return [baseColor];

  const baseHsl = hexToHsl(baseColor);
  if (!baseHsl) return [baseColor];

  const generateHarmonyColors = () => {
    switch (harmonyType) {
      case 'complementary':
        return [
          baseColor, 
          rgbToHex(255 - baseRgb.r, 255 - baseRgb.g, 255 - baseRgb.b)
        ];
      
      case 'analogous':
        return [
          baseColor,
          rgbToHex(
            Math.min(baseRgb.r + 20, 255),
            Math.min(baseRgb.g + 20, 255),
            Math.min(baseRgb.b + 20, 255)
          ),
          rgbToHex(
            Math.max(baseRgb.r - 20, 0),
            Math.max(baseRgb.g - 20, 0),
            Math.max(baseRgb.b - 20, 0)
          )
        ];
      
      case 'triadic':
        const hue = (baseHsl.h + 120) % 360;
        const hue2 = (baseHsl.h + 240) % 360;
        return [
          baseColor,
          hslToHex({ h: hue, s: baseHsl.s, l: baseHsl.l }),
          hslToHex({ h: hue2, s: baseHsl.s, l: baseHsl.l })
        ];
      
      case 'tetradic':
        const complementary = rgbToHex(255 - baseRgb.r, 255 - baseRgb.g, 255 - baseRgb.b);
        const split1 = blendColors(baseColor, complementary, 0.33);
        const split2 = blendColors(baseColor, complementary, 0.67);
        return [baseColor, complementary, split1, split2];
      
      case 'monochromatic':
        return [
          baseColor,
          blendColors(baseColor, '#FFFFFF', 0.2),
          blendColors(baseColor, '#000000', 0.2),
          blendColors(baseColor, '#FFFFFF', 0.4),
          blendColors(baseColor, '#000000', 0.4)
        ];
      
      default:
        return [baseColor];
    }
  };

  return generateHarmonyColors().slice(0, 5);
}

// Helper function to convert HSL to Hex
function hslToHex(hsl: { h: number, s: number, l: number }): string {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1/3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1/3);
  }

  return rgbToHex(
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  );
}

// Helper for HSL to RGB conversion
function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1/6) return p + (q - p) * 6 * t;
  if (t < 1/2) return q;
  if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
  return p;
}

// AI-powered palette generation
export async function generatePaletteFromAI(prompt: string): Promise<string[]> {
  // Ensure OpenAI is initialized
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not set');
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true // Use with caution, prefer backend for production
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "You are a color palette generator. Provide 5 hex color codes that match the given description."
        },
        {
          role: "user", 
          content: `Generate a color palette for: ${prompt}. 
          Provide 5 unique hex color codes separated by commas. 
          Ensure colors work well together and match the description.`
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    const generatedText = response.choices[0].message.content?.trim() || '';
    
    // Extract hex colors using regex
    const hexColors = generatedText.match(/#[0-9A-Fa-f]{6}/g);
    
    if (!hexColors || hexColors.length < 5) {
      throw new Error('Could not generate a valid color palette');
    }

    return hexColors.slice(0, 5);
  } catch (error) {
    console.error('Error generating AI palette:', error);
    throw new Error('Failed to generate AI color palette');
  }
}

// Color name fetching (placeholder - would typically use an external API)
export async function fetchColorName(hexCode: string): Promise<string | null> {
  // Implement color name API or use a predefined color dictionary
  const colorNames: { [key: string]: string } = {
    '#FF0000': 'Red',
    '#00FF00': 'Green',
    '#0000FF': 'Blue',
    '#FFFFFF': 'White',
    '#000000': 'Black',
    // Add more color mappings as needed
  };

  return colorNames[hexCode.toUpperCase()] || null;
}