export type PatternType =
  | 'circles'
  | 'squares'
  | 'triangles'
  | 'hexagons'
  | 'zigzag'
  | 'polkaDots'
  | 'stripes'
  | 'chevron'
  | 'brikwall1'
  | 'modernCircles'
  | 'concentricCircles'
  | 'nestedSquares'
  | 'triangleGrid'
  | 'waves'
  | 'dots3D'
  | 'crosshatch'
  | 'spiral'
  | 'flowerOfLife'
  | 'customImage'
  | 'mandala'
  | 'geometricMosaic'
  | 'celticKnot'
  | 'fractalTree'
  | 'opArt'
  | 'voronoiDiagram';

interface PatternProps {
  size: number;
  spacing: number;
  patternColor: string;
  secondaryColor: string;
  strokeWidth: number;
  complexity: number;
  customImage: string | null;
}

export const generatePattern = (type: PatternType, props: PatternProps): string => {
    const { size, spacing, patternColor, secondaryColor, strokeWidth, complexity, customImage } = props;
    const svgSize = size + spacing;
    const complexityFactor = complexity / 100;

  switch (type) {
    case 'circles':
      return `<circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${size / 2}" fill="${patternColor}" />`;
    case 'squares':
      return `<rect x="0" y="0" width="${size}" height="${size}" fill="${patternColor}" />`;
    case 'triangles':
      return `<polygon points="0,${size} ${size / 2},0 ${size},${size}" fill="${patternColor}" />`;
    case 'hexagons':
      const hexPoints = [
        [size / 2, 0],
        [size, size / 4],
        [size, size * 3 / 4],
        [size / 2, size],
        [0, size * 3 / 4],
        [0, size / 4],
      ].map(([x, y]) => `${x},${y}`).join(' ');
      return `<polygon points="${hexPoints}" fill="${patternColor}" />`;
    case 'zigzag':
      return `<polyline points="0,0 ${size / 2},${size} ${size},0 ${size * 1.5},${size} ${size * 2},0" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />`;
    case 'polkaDots':
      return `
        <circle cx="${svgSize / 4}" cy="${svgSize / 4}" r="${size / 8}" fill="${patternColor}" />
        <circle cx="${svgSize * 3 / 4}" cy="${svgSize * 3 / 4}" r="${size / 8}" fill="${patternColor}" />
      `;
    case 'stripes':
      return `
        <line x1="0" y1="0" x2="${svgSize}" y2="0" stroke="${patternColor}" stroke-width="${size / 2}" />
        <line x1="0" y1="${svgSize}" x2="${svgSize}" y2="${svgSize}" stroke="${patternColor}" stroke-width="${size / 2}" />
      `;
    case 'chevron':
      return `
        <polyline points="0,${size} ${size / 2},0 ${size},${size}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />
        <polyline points="0,${size * 2} ${size / 2},${size} ${size},${size * 2}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />
      `;
    case 'brikwall1':
        return `
        <defs>
            <pattern id="customPattern" patternUnits="userSpaceOnUse" width="${svgSize}" height="${svgSize / 2}" patternTransform="scale(2)">
            <rect x="0" y="0" width="100%" height="100%" fill="${secondaryColor}" />
            <path d="M1-6.5v13h28v-13H1zm15 15v13h28v-13H16zm-15 15v13h28v-13H1z" 
                    stroke-width="${strokeWidth}" 
                    stroke="none" 
                    fill="${patternColor}" />
            <path d="M31-6.5v13h28v-13H31zm-45 15v13h28v-13h-28zm60 0v13h28v-13H46zm-15 15v13h28v-13H31z" 
                    stroke-width="${strokeWidth}" 
                    stroke="none" 
                    fill="${secondaryColor}" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#customPattern)" />
        `;
    case 'modernCircles':
      return `
        <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/2}" fill="${patternColor}" />
        <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/3}" fill="${secondaryColor}" />
        <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/4}" fill="${patternColor}" />
      `;
    case 'concentricCircles':
      return Array.from({ length: Math.floor(4 * complexityFactor) })
        .map((_, i) => {
          const radius = (size/2) * (1 - i/(4 * complexityFactor));
          return `<circle cx="${svgSize/2}" cy="${svgSize/2}" r="${radius}" 
            fill="none" stroke="${i % 2 ? patternColor : secondaryColor}" 
            stroke-width="${strokeWidth}" />`;
        })
        .join('');
    case 'nestedSquares':
      return Array.from({ length: Math.floor(3 * complexityFactor) })
        .map((_, i) => {
          const sizeReduction = (i * size) / (3 * complexityFactor);
          return `<rect x="${sizeReduction/2}" y="${sizeReduction/2}" 
            width="${size - sizeReduction}" height="${size - sizeReduction}"
            fill="none" stroke="${i % 2 ? patternColor : secondaryColor}"
            stroke-width="${strokeWidth}" />`;
        })
        .join('');
    case 'triangleGrid':
      return `
        <path d="M0,0 L${size},0 L${size/2},${size*Math.sqrt(3)/2} Z" 
          fill="${patternColor}" />
        <path d="M0,${size*Math.sqrt(3)/2} L${size},${size*Math.sqrt(3)/2} 
          L${size/2},0 Z" fill="${secondaryColor}" />
      `;
    case 'waves':
      const wavePoints = Array.from({ length: 10 })
        .map((_, i) => {
          const x = (i * size) / 10;
          const y = (size/2) + Math.sin(i * Math.PI / 5) * (size/4);
          return `${x},${y}`;
        })
        .join(' ');
      return `<polyline points="${wavePoints}" 
        stroke="${patternColor}" fill="none" 
        stroke-width="${strokeWidth}" />`;
    case 'dots3D':
      return `
        <circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/3}"
          fill="${patternColor}">
          <animate attributeName="r" values="${size/3};${size/4};${size/3}"
            dur="2s" repeatCount="indefinite" />
        </circle>
        <ellipse cx="${svgSize/2}" cy="${svgSize/2 + size/4}" rx="${size/3}" 
          ry="${size/6}" fill="${secondaryColor}" opacity="0.3" />
      `;
    case 'crosshatch':
      return `
        <path d="M0,0 L${size},${size}" stroke="${patternColor}" 
          stroke-width="${strokeWidth}" />
        <path d="M0,${size} L${size},0" stroke="${secondaryColor}" 
          stroke-width="${strokeWidth}" />
      `;
    case 'spiral':
      const spiralPoints = Array.from({ length: 100 })
        .map((_, i) => {
          const angle = 0.1 * i;
          const x = svgSize / 2 + (angle * Math.cos(angle) * size) / (2 * Math.PI);
          const y = svgSize / 2 + (angle * Math.sin(angle) * size) / (2 * Math.PI);
          return `${x},${y}`;
        })
        .join(' ');
      return `<polyline points="${spiralPoints}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />`;
    case 'flowerOfLife':
      const circles = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const cx = svgSize / 2 + (size / 2) * Math.cos(angle);
        const cy = svgSize / 2 + (size / 2) * Math.sin(angle);
        circles.push(`<circle cx="${cx}" cy="${cy}" r="${size / 2}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />`);
      }
      return `
        <circle cx="${svgSize / 2}" cy="${svgSize / 2}" r="${size / 2}" fill="none" stroke="${patternColor}" stroke-width="${strokeWidth}" />
        ${circles.join('')}
      `;
      
    case 'customImage':
      if (customImage) {
        return `<image href="${customImage}" x="0" y="0" width="${size}" height="${size}" />`;
      }
      return '';
    default:
      return `<circle cx="${svgSize/2}" cy="${svgSize/2}" r="${size/2}" fill="${patternColor}" />`;
  }
};