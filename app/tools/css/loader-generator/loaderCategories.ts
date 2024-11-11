// loaderCategories.ts

export interface LoaderData {
    css: string;
    html: string;
  }
  
  export type LoaderCategories = {
    [category: string]: {
      [type: string]: LoaderData;
    };
  }

  // Validation utility functions
export const isValidCategory = (categories: LoaderCategories, category: string): boolean => {
    return Boolean(categories[category]);
  };
  
  export const isValidLoader = (
    categories: LoaderCategories, 
    category: string, 
    loaderType: string
  ): boolean => {
    return Boolean(categories[category]?.[loaderType]);
  };
  
  // Helper to get default category
  export const getDefaultCategory = (categories: LoaderCategories): string => {
    const firstCategory = Object.keys(categories)[0];
    if (!firstCategory) {
      throw new Error('No loader categories available');
    }
    return firstCategory;
  };

  
  
  // Helper to get default loader for a category
  export const getDefaultLoader = (categories: LoaderCategories, category: string): string => {
    if (!categories[category]) {
      throw new Error(`Category "${category}" not found`);
    }
    const firstLoader = Object.keys(categories[category])[0];
    if (!firstLoader) {
      throw new Error(`No loaders found in category "${category}"`);
    }
    return firstLoader;
  };
  
  
  export const loaderCategories: LoaderCategories = {
    Spinners: {
      'Simple Spinner': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border: 5px solid #3b82f6;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
          }
          
          @keyframes rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `,
        html: '<span class="loader"></span>',
      },
      'Orbit Spinner': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            position: relative;
            display: inline-block;
          }
          .loader::before, .loader::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background-color: #3b82f6;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: orbit 1s linear infinite;
          }
          .loader::after {
            animation-delay: -0.5s;
          }
          @keyframes orbit {
            0% { transform: translate(-50%, -50%) rotate(0deg) translate(20px); }
            100% { transform: translate(-50%, -50%) rotate(360deg) translate(20px); }
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Square Flip Spinner': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            position: relative;
            display: inline-block;
            animation: flip 1s infinite ease;
            transform-style: preserve-3d;
          }
          .loader::before,
          .loader::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #3b82f6;
          }
          .loader::before {
            transform: rotateX(0deg) translateZ(20px);
          }
          .loader::after {
            transform: rotateX(90deg) translateZ(20px);
            opacity: 0.5;
          }
          @keyframes flip {
            0% { transform: rotateX(0deg); }
            50% { transform: rotateX(180deg); }
            100% { transform: rotateX(360deg); }
          }
        `,
        html: '<div class="loader"></div>',
      },

      'Circle Orbit Spinner': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            position: relative;
            display: inline-block;
          }
          .loader::before,
          .loader::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: #3b82f6;
          }
          .loader::before {
            animation: spin 1s linear infinite;
          }
          .loader::after {
            border-top-color: #93c5fd;
            animation: spin 1s linear infinite reverse;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `,
        html: '<div class="loader"></div>',
      },
          
      'Gradient Ring Spinner': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            display: inline-block;
            position: relative;
            border-radius: 50%;
            background: conic-gradient(from 0deg, transparent 0%, #3b82f6 100%);
            animation: rotate 1s linear infinite;
          }
          .loader::after {
            content: '';
            position: absolute;
            inset: 5px;
            border-radius: 50%;
            background: white;
          }
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Spinning Border': {
        css: `
          .spinner {
            width: 56px;
            height: 56px;
            border: 11.2px #3b82f6 double;
            border-left-style: solid;
            border-radius: 50%;
            animation: spinner-aib1d7 1s infinite linear;
          }
          @keyframes spinner-aib1d7 {
            to {
              transform: rotate(360deg);
            }
          }
        `,
        html: '<div class="spinner"></div>',
    },
    
    'Radial Gradient Spinner': {
        css: `
          .spinner {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: radial-gradient(farthest-side, #3b82f6 94%, #0000) top/9px 9px no-repeat,
                        conic-gradient(#0000 30%, #3b82f6);
            -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0);
            animation: spinner-c7wet2 1s infinite linear;
          }
          @keyframes spinner-c7wet2 {
            100% {
              transform: rotate(1turn);
            }
          }
        `,
        html: '<div class="spinner"></div>',
    },
    'Double Ring': {
        css: `
          .loader {
            position: relative;
            width: 56px;
            height: 56px;
          }
          .loader:before, .loader:after {
            content: '';
            border-radius: 50%;
            position: absolute;
            inset: 0;
            box-shadow: 0 0 0 3px #3b82f6;
            animation: rotate 1s linear infinite;
          }
          .loader:after {
            box-shadow: 0 0 0 3px #93c5fd;
            animation: rotate 1s linear infinite reverse;
          }
          @keyframes rotate {
            0% { transform: rotate(0) }
            100% { transform: rotate(360deg) }
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Comet-Spinner': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: conic-gradient(#0000 10%, #3b82f6);
            -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0);
            animation: spinner-zp9dbg 1s infinite linear;
          }
  
          @keyframes spinner-zp9dbg {
            to {
              transform: rotate(1turn);
            }
          }
        `,
        html: '<div class="loader"></div>',
    },
    'Circular Burst': {
        css: `
          .loader {
            width: 11.2px;
            height: 11.2px;
            border-radius: 50%;
            animation: spinner-z355kx 1s infinite linear;
            box-shadow: 28px 0px 0 0 #3b82f6, 17.4px 21.8px 0 0 #3b82f6, -6.2px 27.2px 0 0 #3b82f6, 
                        -25.2px 12px 0 0 #3b82f6, -25.2px -12px 0 0 #3b82f6, -6.2px -27.2px 0 0 #3b82f6, 
                        17.4px -21.8px 0 0 #3b82f6;
          }
    
          @keyframes spinner-z355kx {
            to {
              transform: rotate(360deg);
            }
          }
        `,
        html: '<div class="loader"></div>',
    },
    'Dual Gradient Spinner': {
      css: `
        .loader {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: 
            radial-gradient(circle at 50% 50%, #3b82f6 45%, transparent 50%) 50% 0 / 10px 10px no-repeat,
            conic-gradient(#3b82f6 0deg, transparent 180deg, #3b82f6 180deg);
          animation: dualGradientSpin 1s infinite linear;
        }
        
        @keyframes dualGradientSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Radial Spin': {
      css: `
        .loader {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          padding: 3px;
          background: 
            radial-gradient(farthest-side, #3b82f6 95%, #0000) 50% 0/12px 12px no-repeat,
            radial-gradient(farthest-side, #0000 calc(100% - 5px), #3b82f6 calc(100% - 4px)) content-box;
          animation: radialSpin 1s infinite linear;
        }
    
        @keyframes radialSpin {
          to {
            transform: rotate(1turn);
          }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Quad Dot Spin': {
      css: `
        .loader {
          width: 56px;
          height: 56px;
          --c: radial-gradient(farthest-side, #3b82f6 92%, #0000);
          background: 
            var(--c) 50% 0,
            var(--c) 50% 100%,
            var(--c) 100% 50%,
            var(--c) 0 50%;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          animation: quadDotSpin 1s infinite linear;
        }
        @keyframes quadDotSpin {
          to { transform: rotate(.5turn) }
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Cross Dot Spin': {
      css: `
        .loader {
          width: 56px;
          height: 56px;
          --c: radial-gradient(farthest-side, #3b82f6 92%, #0000);
          background: 
            var(--c) 50% 0 / 12px 12px,
            var(--c) 50% 100% / 12px 12px,
            var(--c) 100% 50% / 12px 12px,
            var(--c) 0 50% / 12px 12px,
            var(--c) 50% 50% / 12px 12px,
            linear-gradient(#3b82f6 0 0) 50% 50% / 4px 100%,
            linear-gradient(#3b82f6 0 0) 50% 50% / 100% 4px;
          background-repeat: no-repeat;
          animation: crossDotSpin 1s infinite linear;
        }
        @keyframes crossDotSpin {
          to { transform: rotate(.5turn) }
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Orbital Spin': {
      css: `
        .loader {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: 
            radial-gradient(farthest-side, #3b82f6 95%, #0000) 50% 1px / 12px 12px no-repeat,
            radial-gradient(farthest-side, #0000 calc(100% - 14px), #E4E4ED 0);
          animation: orbitalSpin 1s infinite linear;
        }
        @keyframes orbitalSpin {
          to { transform: rotate(1turn) }
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Wheel Spin': {
      css: `
        .loader {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: 
            linear-gradient(#3b82f6 0 0) center / 100% 4px,
            linear-gradient(#3b82f6 0 0) center / 4px 100%,
            radial-gradient(farthest-side, #0000 calc(100% - 6px), #3b82f6 calc(100% - 5px)),
            radial-gradient(circle 6px, #3b82f6 94%, #0000 0);
          background-repeat: no-repeat;
          animation: WheelSpin 1s infinite linear;
          position: relative;
        }
        .loader::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: inherit;
          transform: rotate(45deg);
        }
        @keyframes WheelSpin {
          to { transform: rotate(.5turn) }
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Pac Spin': {
      css: `
        .loader {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          padding: 6px;
          background:
            conic-gradient(from 135deg at top, #3b82f6 90deg, #0000 0) 0 calc(50% - 4px) / 17px 8.5px,
            radial-gradient(farthest-side at bottom left, #0000 calc(100% - 6px), #3b82f6 calc(100% - 5px) 99%, #0000) top right / 50% 50% content-box content-box,
            radial-gradient(farthest-side at top, #0000 calc(100% - 6px), #3b82f6 calc(100% - 5px) 99%, #0000) bottom / 100% 50% content-box content-box;
          background-repeat: no-repeat;
          animation: pacSpin 1s infinite linear;
        }
        @keyframes pacSpin { 
          100% { transform: rotate(1turn) }
        }
      `,
      html: '<div class="loader"></div>',
    },
  
  
    'Half-Rotate Spinner': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: 4px solid;
            border-color: #3b82f6 #0000;
            animation: halfRotate 1s infinite;
          }
          @keyframes halfRotate {
            to { transform: rotate(180deg); }
          }
        `,
        html: '<div class="loader"></div>',
      },

      'Dual Orbit': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            display: grid;
          }
          .loader::before,
          .loader::after {    
            content: "";
            grid-area: 1/1;
            --c: radial-gradient(farthest-side, #3b82f6 92%, #0000);
            background: 
              var(--c) 50%  0, 
              var(--c) 50%  100%, 
              var(--c) 100% 50%, 
              var(--c) 0    50%;
            background-size: 13px 13px;
            background-repeat: no-repeat;
            animation: dualOrbit 1s infinite;
          }
          .loader::before {
            margin: 4px;
            filter: hue-rotate(45deg);
            background-size: 9px 9px;
            animation-timing-function: linear
          }
          @keyframes dualOrbit { 
            100% { transform: rotate(.5turn) }
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Dual Ring': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            display: grid;
            animation: dualRing 4s infinite;
          }
          .loader::before,
          .loader::after {    
            content: "";
            grid-area: 1/1;
            border: 9px solid;
            border-radius: 50%;
            border-color: #3b82f6 #3b82f6 #0000 #0000;
            mix-blend-mode: darken;
            animation: dualRing 1s infinite linear;
          }
          .loader::after {
            border-color: #0000 #0000 #E4E4ED #E4E4ED;
            animation-direction: reverse;
          }
          @keyframes dualRing { 
            100% { transform: rotate(1turn) }
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Triple Ring': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            display: grid;
            border: 4px solid #0000;
            border-radius: 50%;
            border-right-color: #3b82f6;
            animation: tripleRing 1s infinite linear;
          }
          .loader::before,
          .loader::after {    
            content: "";
            grid-area: 1/1;
            margin: 2px;
            border: inherit;
            border-radius: 50%;
            animation: tripleRing 2s infinite;
          }
          .loader::after {
            margin: 8px;
            animation-duration: 3s;
          }
          @keyframes tripleRing { 
            100% { transform: rotate(1turn) }
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Bouncing Orbit': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            background:
              radial-gradient(farthest-side, #3b82f6 90%, #0000) center/18px 18px,
              radial-gradient(farthest-side, #6F6D91 90%, #0000) bottom/13px 13px;
            background-repeat: no-repeat;
            animation: bouncingOrbit 1s infinite linear;
            position: relative;
          }
          .loader::before {    
            content: "";
            position: absolute;
            width: 9px;
            height: 9px;
            inset: auto 0 18px;
            margin: auto;
            background: #E4E4ED;
            border-radius: 50%;
            transform-origin: 50% calc(100% + 11px);
            animation: inherit;
            animation-duration: 0.5s;
          }
          @keyframes bouncingOrbit { 
            100% { transform: rotate(1turn) }
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Atom Spin': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            --c: radial-gradient(farthest-side, #3b82f6 92%, #0000);
            background: 
              var(--c) 50%  0, 
              var(--c) 50%  100%, 
              var(--c) 100% 50%, 
              var(--c) 0    50%;
            background-size: 11px 11px;
            background-repeat: no-repeat;
            animation: atomSpin 1s infinite;
            position: relative;
          }
          .loader::before {    
            content: "";
            position: absolute;
            inset: 0;
            margin: 3px;
            background: repeating-conic-gradient(#0000 0 35deg, #3b82f6 0 90deg);
            -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 3px), #000 0);
            border-radius: 50%;
          }
          @keyframes atomSpin { 
            100% { transform: rotate(.5turn) }
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Quantum Spin': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            display: grid;
            color: #3b82f6;
            background: radial-gradient(farthest-side, currentColor calc(100% - 7px), #0000 calc(100% - 6px) 0);
            -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 15px), #000 calc(100% - 13px));
            border-radius: 50%;
            animation: quantumSpin 1s infinite linear;
          }
          .loader::before,
          .loader::after {    
            content: "";
            grid-area: 1/1;
            background:
              linear-gradient(currentColor 0 0) center,
              linear-gradient(currentColor 0 0) center;
            background-size: 100% 11px, 11px 100%;
            background-repeat: no-repeat;
          }
          .loader::after {
            transform: rotate(45deg);
          }
          @keyframes quantumSpin { 
            100% { transform: rotate(1turn) }
          }
        `,
        html: '<div class="loader"></div>',
      },

      'Morphing Circle': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: 9px solid #3b82f6;
            animation:
              morphCircle1 0.8s infinite linear alternate,
              morphCircle2 1.6s infinite linear;
          }
          @keyframes morphCircle1 {
            0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
            12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
            25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
            50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
            62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
            75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
            100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
          }
          @keyframes morphCircle2 { 
            0%    {transform:scaleY(1)  rotate(0deg)}
            49.99%{transform:scaleY(1)  rotate(135deg)}
            50%   {transform:scaleY(-1) rotate(0deg)}
            100%  {transform:scaleY(-1) rotate(-135deg)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Half-Half Spin': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: repeating-conic-gradient(#3b82f6 0 90deg, #E4E4ED 0 180deg);
            animation: halfHalfSpin 1s infinite linear;
          }
          @keyframes halfHalfSpin {
            100% {transform: rotate(.5turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Triple Layer Spin': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            display: grid;
            border-radius: 50%;
            background: conic-gradient(#3b82f6 25%, #E4E4ED 0 50%, #6F6D91 0 75%, #3b82f6 0);
            animation: tripleLayerSpin 1s infinite linear;
          }
          .loader::before,
          .loader::after {
            content: "";
            grid-area: 1/1;
            margin: 15%;
            border-radius: 50%;
            background: inherit;
            animation: inherit;
          }
          .loader::after {
            margin: 25%;
            animation-duration: 1.5s;
          }
          @keyframes tripleLayerSpin {
            100% {transform: rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Radial Spinner': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            display: grid;
            border-radius: 50%;
            -webkit-mask: radial-gradient(farthest-side, #0000 40%, #000 41%);
            background:
              linear-gradient(0deg, #3b82f680 50%, #3b82f6FF 0) center/4px 100%,
              linear-gradient(90deg, #3b82f640 50%, #3b82f6BF 0) center/100% 4px;
            background-repeat: no-repeat;
            animation: radialSpin 1s infinite steps(12);
          }
          .loader::before,
          .loader::after {
            content: "";
            grid-area: 1/1;
            border-radius: 50%;
            background: inherit;
            opacity: 0.915;
            transform: rotate(30deg);
          }
          .loader::after {
            opacity: 0.83;
            transform: rotate(60deg);
          }
          @keyframes radialSpin {
            100% {transform: rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Triple Border Spin': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            border: 9px solid #0000;
            border-right-color: #3b82f697;
            position: relative;
            animation: tripleBorderSpin 1s infinite linear;
          }
          .loader:before,
          .loader:after {
            content: "";
            position: absolute;
            inset: -9px;
            border-radius: 50%;
            border: inherit;
            animation: inherit;
            animation-duration: 2s;
          }
          .loader:after {
            animation-duration: 4s;
          }
          @keyframes tripleBorderSpin {
            100% {transform: rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Pac-Spin': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #3b82f6;
            -webkit-mask: radial-gradient(circle closest-side at 50% 40%, #0000 94%, #000);
            transform-origin: 50% 40%;
            animation: pacSpin 1s infinite linear;
          }
          @keyframes pacSpin {
            100% {transform: rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Orbital Dots': {
        css: `
          .loader {
            --d: 24px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            color: #3b82f6;
            box-shadow: 
              calc(1*var(--d))      calc(0*var(--d))     0 0,
              calc(0.707*var(--d))  calc(0.707*var(--d)) 0 1px,
              calc(0*var(--d))      calc(1*var(--d))     0 2px,
              calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 3px,
              calc(-1*var(--d))     calc(0*var(--d))     0 4px,
              calc(-0.707*var(--d)) calc(-0.707*var(--d))0 5px,
              calc(0*var(--d))      calc(-1*var(--d))    0 6px;
            animation: orbitalDots 1s infinite steps(8);
          }
          @keyframes orbitalDots {
            100% {transform: rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      
      'Triple Dot Swing': {
        css: `
          .loader {
            width: 56px;
            height: 14px;
            color: #3b82f6;
            background:
              radial-gradient(farthest-side, currentColor 90%, #0000) left  /14px 14px,
              radial-gradient(farthest-side, currentColor 90%, #0000) center/14px 14px,
              radial-gradient(farthest-side, currentColor 90%, #0000) right /14px 14px,
              linear-gradient(currentColor 0 0) center/100% 4px; 
            background-repeat: no-repeat;
            position: relative;
            animation: dotSwing 1s infinite linear;
          }
          .loader:before,
          .loader:after {
            content: "";
            position: absolute;
            inset: 0;
            background: inherit;
            animation: inherit;
            --s: calc(50% - 7px);
            animation-direction: reverse;
          }
          .loader:after {
            --s: calc(7px - 50%);
          }
          @keyframes dotSwing {
            0%   {transform: translate(var(--s, 0)) rotate(0)}
            100% {transform: translate(var(--s, 0)) rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
    
      
    },
  
    Dots: {
        'Triple Dots': {
            css: `
              .loader {
                width: 56px;
                display: flex;
                justify-content: space-between;
              }
              .loader::after,
              .loader::before,
              .loader div {
                content: '';
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #3b82f6;
                animation: bounce 1s ease-in-out infinite;
              }
              .loader::before {
                animation-delay: -0.16s;
              }
              .loader div {
                animation-delay: 0s;
              }
              .loader::after {
                animation-delay: 0.16s;
              }
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-15px); }
              }
            `,
            html: '<div class="loader"><div></div></div>'
          },
      'Pulsing Dots': {
        css: `
          .loader {
            display: flex;
            gap: 8px;
          }
          .loader div {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3b82f6;
            animation: pulse 0.6s infinite alternate;
          }
          .loader div:nth-child(2) {
            animation-delay: 0.2s;
          }
          .loader div:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes pulse {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0.3; transform: scale(0.8); }
          }
        `,
        html: '<div class="loader"><div></div><div></div><div></div></div>',
      },
      'Pulse Spinner': {
        css: `
          .loader {
            width: 40px;
            height: 40px;
            background-color: #3b82f6;
            border-radius: 50%;
            display: inline-block;
            animation: pulse 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
          }
          @keyframes pulse {
            0% { transform: scale(0); opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Rotating Dots': {
        css: `
          .loader {
            display: flex;
            justify-content: center;
            gap: 8px;
          }
          .loader div {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3b82f6;
            animation: rotate 1s linear infinite;
          }
          .loader div:nth-child(2) {
            animation-delay: 0.2s;
          }
          .loader div:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `,
        html: '<div class="loader"><div></div><div></div><div></div></div>',
    },
    'Fading Dots': {
        css: `
          .loader {
            display: flex;
            gap: 10px;
          }
          .loader div {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #3b82f6;
            animation: fade 1s infinite both;
          }
          .loader div:nth-child(2) {
            animation-delay: 0.2s;
          }
          .loader div:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes fade {
            0%, 39%, 100% { opacity: 0.3; }
            40% { opacity: 1; }
          }
        `,
        html: '<div class="loader"><div></div><div></div><div></div></div>',
    },
    'Growing Dots': {
        css: `
          .loader {
            display: flex;
            gap: 6px;
          }
          .loader div {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3b82f6;
            animation: grow 1s infinite alternate;
          }
          .loader div:nth-child(2) {
            animation-delay: 0.2s;
          }
          .loader div:nth-child(3) {
            animation-delay: 0.4s;
          }
          @keyframes grow {
            from { transform: scale(1); }
            to { transform: scale(1.5); }
          }
        `,
        html: '<div class="loader"><div></div><div></div><div></div></div>',
    },
    },
  
    Bars: {
        'Progress Bar': {
          css: `
            .loader {
              width: 100px;
              height: 10px;
              background: #e5e7eb;
              border-radius: 5px;
              overflow: hidden;
            }
            .loader::before {
              content: '';
              display: block;
              width: 50%;
              height: 100%;
              background: #3b82f6;
              animation: load 1s infinite;
            }
            @keyframes load {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Equalizer Bars': {
          css: `
            .loader {
              display: flex;
              align-items: flex-end;
              gap: 4px;
              width: 60px;
              height: 20px;
            }
            .loader div {
              width: 8px;
              height: 100%;
              background: #3b82f6;
              animation: equalizer 1s ease-in-out infinite alternate;
            }
            .loader div:nth-child(2) { animation-delay: 0.2s; }
            .loader div:nth-child(3) { animation-delay: 0.4s; }
            @keyframes equalizer {
              from { transform: scaleY(0.2); }
              to { transform: scaleY(1); }
            }
          `,
          html: '<div class="loader"><div></div><div></div><div></div></div>',
        },
        'Sliding Bar': {
          css: `
            .loader {
              width: 100px;
              height: 10px;
              background: #e5e7eb;
              border-radius: 5px;
              overflow: hidden;
              position: relative;
            }
            .loader::after {
              content: '';
              width: 30%;
              height: 100%;
              background: #3b82f6;
              position: absolute;
              top: 0;
              left: 0;
              animation: slide 1s infinite ease-in-out alternate;
            }
            @keyframes slide {
              to { transform: translateX(233%); }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Stacked Bars': {
          css: `
            .loader {
              width: 50px;
              height: 40px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .loader div {
              width: 100%;
              height: 8px;
              background: #3b82f6;
              animation: stack 1s ease-in-out infinite alternate;
            }
            .loader div:nth-child(2) { animation-delay: 0.2s; }
            .loader div:nth-child(3) { animation-delay: 0.4s; }
            @keyframes stack {
              0% { transform: scaleX(0.2); }
              100% { transform: scaleX(1); }
            }
          `,
          html: '<div class="loader"><div></div><div></div><div></div></div>',
        },
        'Gradient Bar': {
          css: `
            .loader {
              width: 100px;
              height: 10px;
              background: linear-gradient(90deg, #3b82f6 0%, #93c5fd 100%);
              border-radius: 5px;
              position: relative;
              overflow: hidden;
            }
            .loader::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
              transform: translateX(-100%);
              animation: shimmer 1.5s infinite;
            }
            @keyframes shimmer {
              100% { transform: translateX(100%); }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Stepped Bar': {
          css: `
            .loader {
              width: 100px;
              height: 10px;
              background: #e5e7eb;
              border-radius: 5px;
              overflow: hidden;
            }
            .loader::before {
              content: '';
              display: block;
              width: 0;
              height: 100%;
              background: #3b82f6;
              animation: step 5s steps(5, end) infinite;
            }
            @keyframes step {
              0% { width: 0; }
              100% { width: 100%; }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Pulsating Bar': {
          css: `
            .loader {
              width: 100px;
              height: 10px;
              background: #e5e7eb;
              border-radius: 5px;
              overflow: hidden;
            }
            .loader::before {
              content: '';
              display: block;
              width: 100%;
              height: 100%;
              background: #3b82f6;
              animation: pulse 1.5s ease-in-out infinite;
            }
            @keyframes pulse {
              0%, 100% { transform: scaleX(0.1); }
              50% { transform: scaleX(1); }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Bouncing Bar': {
          css: `
            .loader {
              width: 100px;
              height: 10px;
              background: #e5e7eb;
              border-radius: 5px;
              overflow: hidden;
              position: relative;
            }
            .loader::before {
              content: '';
              position: absolute;
              width: 20px;
              height: 10px;
              background: #3b82f6;
              border-radius: 5px;
              animation: bounce 1s infinite alternate;
            }
            @keyframes bounce {
              from { left: 0; }
              to { left: calc(100% - 20px); }
            }
          `,
          html: '<div class="loader"></div>',
        },
      },
  
      Pulses: {
        'Pulse Circle': {
          css: `
            .loader {
              width: 50px;
              height: 50px;
              background: #3b82f6;
              border-radius: 50%;
              animation: pulse-circle 1s ease-in-out infinite alternate;
            }
            @keyframes pulse-circle {
              from { transform: scale(1); opacity: 1; }
              to { transform: scale(1.5); opacity: 0; }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Expanding Ring': {
          css: `
            .loader {
              width: 50px;
              height: 50px;
              border: 5px solid #3b82f6;
              border-radius: 50%;
              animation: expanding 1.5s infinite;
            }
            @keyframes expanding {
              0% { transform: scale(0.5); opacity: 1; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Ripple Effect': {
          css: `
            .loader {
              width: 50px;
              height: 50px;
              position: relative;
            }
            .loader::before,
            .loader::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              border: 3px solid #3b82f6;
              border-radius: 50%;
              animation: ripple 2s linear infinite;
            }
            .loader::after {
              animation-delay: 1s;
            }
            @keyframes ripple {
              0% { transform: scale(0.1); opacity: 1; }
              100% { transform: scale(1); opacity: 0; }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Heartbeat': {
          css: `
            .loader {
              width: 50px;
              height: 50px;
              background: #3b82f6;
              border-radius: 50%;
              animation: heartbeat 1.2s ease-in-out infinite;
            }
            @keyframes heartbeat {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.3); }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Radar': {
          css: `
            .loader {
              width: 50px;
              height: 50px;
              border-radius: 50%;
              border: 2px solid #3b82f6;
              position: relative;
            }
            .loader::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 50%;
              height: 100%;
              background: #3b82f6;
              border-radius: 100% 0 0 100% / 50% 0 0 50%;
              transform-origin: right center;
              animation: radar 2s linear infinite;
            }
            @keyframes radar {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Pulsating Dots': {
          css: `
            .loader {
              display: flex;
              justify-content: space-between;
              width: 60px;
            }
            .loader div {
              width: 12px;
              height: 12px;
              background: #3b82f6;
              border-radius: 50%;
              animation: pulse 1.5s ease-in-out infinite;
            }
            .loader div:nth-child(2) {
              animation-delay: 0.3s;
            }
            .loader div:nth-child(3) {
              animation-delay: 0.6s;
            }
            @keyframes pulse {
              0%, 100% { transform: scale(0.8); opacity: 0.5; }
              50% { transform: scale(1.2); opacity: 1; }
            }
          `,
          html: '<div class="loader"><div></div><div></div><div></div></div>',
        },
        'Glowing Pulse': {
          css: `
            .loader {
              width: 50px;
              height: 50px;
              background: #3b82f6;
              border-radius: 50%;
              box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
              animation: glowing-pulse 1.5s infinite;
            }
            @keyframes glowing-pulse {
              0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
              }
              70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
              }
              100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
              }
            }
          `,
          html: '<div class="loader"></div>',
        },
        'Concentric Circles': {
          css: `
            .loader {
              width: 50px;
              height: 50px;
              position: relative;
            }
            .loader div {
              position: absolute;
              border: 2px solid #3b82f6;
              border-radius: 50%;
              animation: concentric 1.5s ease-out infinite;
            }
            .loader div:nth-child(1) {
              width: 50px;
              height: 50px;
              animation-delay: 0s;
            }
            .loader div:nth-child(2) {
              width: 40px;
              height: 40px;
              top: 5px;
              left: 5px;
              animation-delay: 0.2s;
            }
            .loader div:nth-child(3) {
              width: 30px;
              height: 30px;
              top: 10px;
              left: 10px;
              animation-delay: 0.4s;
            }
            @keyframes concentric {
              0% { transform: scale(0.5); opacity: 0; }
              50% { transform: scale(1); opacity: 1; }
              100% { transform: scale(1.5); opacity: 0; }
            }
          `,
          html: '<div class="loader"><div></div><div></div><div></div></div>',
        },
      },
      
  };
  // Utility to safely get loader data
export const getLoaderData = (
    categories: LoaderCategories,
    category: string,
    loaderType: string
  ): LoaderData | null => {
    try {
      if (!isValidCategory(categories, category)) {
        console.error(`Invalid category: ${category}`);
        return null;
      }
      if (!isValidLoader(categories, category, loaderType)) {
        console.error(`Invalid loader type: ${loaderType} in category: ${category}`);
        return null;
      }
      return categories[category][loaderType];
    } catch (error) {
      console.error('Error getting loader data:', error);
      return null;
    }
}; 

  
  