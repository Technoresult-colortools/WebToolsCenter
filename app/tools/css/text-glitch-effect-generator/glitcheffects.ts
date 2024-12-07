export type GlitchEffect = 'rgb-split' | 'color' | 'noise' | 'transformation' | 'glitch-clip' | 'distortion' | 'pixelate' | 'wave' | 'custom'

export const glitchEffects: Record<GlitchEffect, (text: string, color1: string, color2: string, intensity: number, speed: number) => string> = {
  'rgb-split': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
  animation: glitch-skew ${speed * 2}s infinite linear alternate-reverse;
}
.glitch::before,
.glitch::after {
  content: '${text}';
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  opacity: 0.8;
}
.glitch::before {
  color: ${color1};
  animation: glitch-effect ${speed}s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
}
.glitch::after {
  color: ${color2};
  animation: glitch-effect ${speed * 1.1}s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
}
@keyframes glitch-effect {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-${intensity * 0.5}px, ${intensity * 0.5}px);
  }
  40% {
    transform: translate(-${intensity}px, -${intensity * 0.5}px);
  }
  60% {
    transform: translate(${intensity * 0.5}px, ${intensity}px);
  }
  80% {
    transform: translate(${intensity}px, -${intensity * 0.5}px);
  }
  100% {
    transform: translate(0);
  }
}
@keyframes glitch-skew {
  0% {
    transform: skew(0deg);
  }
  20% {
    transform: skew(${intensity * 0.2}deg);
  }
  40% {
    transform: skew(-${intensity * 0.1}deg);
  }
  60% {
    transform: skew(${intensity * 0.3}deg);
  }
  80% {
    transform: skew(-${intensity * 0.2}deg);
  }
  100% {
    transform: skew(0deg);
  }
}
  `,
  'color': (text, color1, color2, intensity, speed) => `
.glitch {
  animation: glitch-color ${speed}s infinite linear alternate-reverse;
}
@keyframes glitch-color {
  0% { text-shadow: ${intensity * 0.2}px ${intensity * 0.2}px ${color1}, -${intensity * 0.2}px -${intensity * 0.2}px ${color2}; }
  25% { text-shadow: -${intensity * 0.2}px ${intensity * 0.2}px ${color2}, ${intensity * 0.2}px -${intensity * 0.2}px ${color1}; }
  50% { text-shadow: ${intensity * 0.2}px -${intensity * 0.2}px ${color1}, -${intensity * 0.2}px ${intensity * 0.2}px ${color2}; }
  75% { text-shadow: -${intensity * 0.2}px -${intensity * 0.2}px ${color2}, ${intensity * 0.2}px ${intensity * 0.2}px ${color1}; }
  100% { text-shadow: ${intensity * 0.2}px ${intensity * 0.2}px ${color1}, -${intensity * 0.2}px -${intensity * 0.2}px ${color2}; }
}
  `,
  'noise': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
}
.glitch::before {
  content: '${text}';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABN0lEQVRoQ+2Y0Q6DIAxF6f//tBONMWZsA7pxN+ni8oC9pz1tYQr5Jn/lJjwsImWlvYjA7IjIIgJzAKa3iIAJwNRFpNZ6vgBwBmMuFb0bMzNaa8Xzr4GIyLGUcnwCxxhzqbV+9RBHEZELgKOUcuz7ftRa39cLEJHDGHOWUr4rpRwRsYvIEhFr7dlaey6lvMKfMeZsrX2dxVNrfRtjfDzfIgITXERABGAKIgIiAFMQERABmIKIgAjAFEQERABXcPgcubPWvkII9+0Td9OtR3rnXI/ILiKcc9Zae1prz2gfHZHRgqPnvXNuFBH9JGOMuYwx5+jZnUVGN/eej0YEZrCIwATX7+4wDZiCiIAIwBREBEQApiAiIAIwBREBEYApiAiIAExBREAEYAoiAiIAUxAREAGYwg9EvUE3nEfJPwAAAABJRU5ErkJggg==');
  opacity: ${intensity * 0.05};
  animation: glitch-noise ${speed}s infinite;
}
@keyframes glitch-noise {
  0% { transform: translate(0); }
  20% { transform: translate(-${intensity}px, ${intensity}px); }
  40% { transform: translate(-${intensity}px, -${intensity}px); }
  60% { transform: translate(${intensity}px, ${intensity}px); }
  80% { transform: translate(${intensity}px, -${intensity}px); }
  100% { transform: translate(0); }
}
  `,
  'transformation': (text, color1, color2, intensity, speed) => `
.glitch {
  animation: glitch-transform ${speed}s infinite;
}
@keyframes glitch-transform {
  0% { transform: translate(0); }
  20% { transform: translate(-${intensity}px, ${intensity}px); }
  40% { transform: skew(${intensity}deg); }
  60% { transform: scale(1.${intensity}); }
  80% { transform: rotate(${intensity}deg); }
  100% { transform: translate(0); }
}
  `,
  'glitch-clip': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
}
.glitch::before,
.glitch::after {
  content: '${text}';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  clip: rect(0, 0, 0, 0);
}
.glitch::before {
  left: ${intensity * 0.2}px;
  text-shadow: -1px 0 ${color1};
  animation: glitch-clip-1 ${speed}s infinite linear alternate-reverse;
}
.glitch::after {
  left: -${intensity * 0.2}px;
  text-shadow: 1px 0 ${color2};
  animation: glitch-clip-2 ${speed * 1.5}s infinite linear alternate-reverse;
}
@keyframes glitch-clip-1 {
  0% { clip: rect(${intensity * 5}px, 9999px, ${intensity * 10}px, 0); }
  20% { clip: rect(${intensity * 15}px, 9999px, ${intensity * 20}px, 0); }
  40% { clip: rect(${intensity * 25}px, 9999px, ${intensity * 30}px, 0); }
  60% { clip: rect(${intensity * 35}px, 9999px, ${intensity * 40}px, 0); }
  80% { clip: rect(${intensity * 45}px, 9999px, ${intensity * 50}px, 0); }
  100% { clip: rect(${intensity * 55}px, 9999px, ${intensity * 60}px, 0); }
}
@keyframes glitch-clip-2 {
  0% { clip: rect(${intensity * 10}px, 9999px, ${intensity * 15}px, 0); }
  20% { clip: rect(${intensity * 20}px, 9999px, ${intensity * 25}px, 0); }
  40% { clip: rect(${intensity * 30}px, 9999px, ${intensity * 35}px, 0); }
  60% { clip: rect(${intensity * 40}px, 9999px, ${intensity * 45}px, 0); }
  80% { clip: rect(${intensity * 50}px, 9999px, ${intensity * 55}px, 0); }
  100% { clip: rect(${intensity * 60}px, 9999px, ${intensity * 65}px, 0); }
}
  `,
  'distortion': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
  animation: glitch-distort ${speed * 2}s infinite;
}
.glitch::before,
.glitch::after {
  content: '${text}';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
.glitch::before {
  color: ${color1};
  animation: glitch-distort ${speed}s infinite;
  clip-path: polygon(0 ${intensity * 2}%, 100% 0%, 100% ${100 - intensity * 2}%, 0% 100%);
}
.glitch::after {
  color: ${color2};
  animation: glitch-distort ${speed * 1.5}s infinite reverse;
  clip-path: polygon(0 ${intensity}%, 100% ${intensity * 2}%, 100% ${100 - intensity}%, 0% ${100 - intensity * 2}%);
}
@keyframes glitch-distort {
  0% {
    transform: translate(0) skew(0deg);
  }
  25% {
    transform: translate(${intensity * 0.5}px, -${intensity * 0.5}px) skew(${intensity * 0.2}deg);
  }
  50% {
    transform: translate(-${intensity * 0.5}px, ${intensity * 0.5}px) skew(-${intensity * 0.2}deg);
  }
  75% {
    transform: translate(${intensity * 0.5}px, ${intensity * 0.5}px) skew(${intensity * 0.2}deg);
  }
  100% {
    transform: translate(0) skew(0deg);
  }
}
  `,
  'pixelate': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
  animation: glitch-pixelate ${speed}s infinite;
}
@keyframes glitch-pixelate {
  0% {
    transform: scale(1);
    filter: none;
  }
  25% {
    transform: scale(1.${intensity});
    filter: pixelate(${intensity}px);
  }
  50% {
    transform: scale(1);
    filter: none;
  }
  75% {
    transform: scale(0.${100 - intensity});
    filter: pixelate(${intensity * 2}px);
  }
  100% {
    transform: scale(1);
    filter: none;
  }
}
  `,
  'wave': (text, color1, color2, intensity, speed) => `
.glitch {
  position: relative;
  animation: glitch-wave ${speed}s ease infinite;
}
@keyframes glitch-wave {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-${intensity}px) skew(${intensity * 0.5}deg);
  }
  50% {
    transform: translateY(0) skew(-${intensity * 0.5}deg);
  }
  75% {
    transform: translateY(${intensity}px) skew(${intensity * 0.5}deg);
  }
  100% {
    transform: translateY(0);
  }
}
  `,
  'custom': () => '',
}