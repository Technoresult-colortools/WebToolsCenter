function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  }
  
  function rgbToHex(r: number, g: number, b: number): string {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
  
  function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;
  
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
  
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
  
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  
  function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255;
    g /= 255;
    b /= 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s
    const l = (max + min) / 2;  // Initialize `h` to 0
  
    if (max === min) {
      s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
  
      h /= 6;
    }
  
    return [h, s, l];
  }
  
  
  export function generateComplementaryColors(baseColor: string): string[] {
    const [r, g, b] = hexToRgb(baseColor);
    const [h, s, l] = rgbToHsl(r, g, b);
    const complementaryHue = (h + 0.5) % 1;
    const [cr, cg, cb] = hslToRgb(complementaryHue, s, l);
    return [baseColor, rgbToHex(cr, cg, cb)];
  }
  
  export function generateAnalogousColors(baseColor: string): string[] {
    const [r, g, b] = hexToRgb(baseColor);
    const [h, s, l] = rgbToHsl(r, g, b);
    const hue1 = (h + 1 / 12) % 1;
    const hue2 = (h - 1 / 12 + 1) % 1;
    const [r1, g1, b1] = hslToRgb(hue1, s, l);
    const [r2, g2, b2] = hslToRgb(hue2, s, l);
    return [rgbToHex(r1, g1, b1), baseColor, rgbToHex(r2, g2, b2)];
  }
  
  export function generateTriadicColors(baseColor: string): string[] {
    const [r, g, b] = hexToRgb(baseColor);
    const [h, s, l] = rgbToHsl(r, g, b);
    const hue1 = (h + 1 / 3) % 1;
    const hue2 = (h + 2 / 3) % 1;
    const [r1, g1, b1] = hslToRgb(hue1, s, l);
    const [r2, g2, b2] = hslToRgb(hue2, s, l);
    return [baseColor, rgbToHex(r1, g1, b1), rgbToHex(r2, g2, b2)];
  }
  
  