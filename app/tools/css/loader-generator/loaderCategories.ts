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

      'Cross Spin': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            display: grid;
            color: #3b82f6;
            background: 
              linear-gradient(currentColor 0 0) center/100% 3px,
              linear-gradient(currentColor 0 0) center/3px 100%;
            background-repeat: no-repeat;
            animation: crossSpin 1s infinite;
          }
          .loader::before,
          .loader::after {
            content: "";
            grid-area: 1/1;
            background: repeating-conic-gradient(#0000 0 35deg,currentColor 0 90deg);
            -webkit-mask: radial-gradient(farthest-side,#0000 calc(100% - 3px),#000 0);
            border-radius: 50%;
          }
          .loader::after {
            margin:20%;
          }
          @keyframes crossSpin {
            100% {transform: rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Star Spin': {
        css: `
          .loader {
            --s: 8px;
            width: 56px;
            height: 56px;
            background: #3b82f6;
            border-radius: 50%;
            animation: starSpin 1s infinite linear;
            clip-path: polygon(0 0,calc(50% - var(--s)) 0,50% var(--s),calc(50% + var(--s)) 0,100% 0,100% calc(50% - var(--s)),calc(100% - var(--s)) 50%,100% calc(50% + var(--s)),100% 100%,calc(50% + var(--s)) 100%, 50% calc(100% - var(--s)),calc(50% - var(--s)) 100%,0 100%,0 calc(50% + var(--s)), var(--s) 50%, 0 calc(50% - var(--s)));
          }
          @keyframes starSpin {
            100% {transform: rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Yin Yang': {
        css: `
          .loader {
            --R: 30px;
            --g1: #3b82f6 96%, #0000;
            --g2: #93c5fd 96%, #0000;
            width: calc(2*var(--R));
            height: calc(2*var(--R));
            border-radius: 50%;
            display: grid;
            -webkit-mask: linear-gradient(#000 0 0);
            animation: yinYangSpin 1s infinite linear;
          }
          .loader::before,
          .loader::after {
            content: "";
            grid-area: 1/1;
            width: 50%;
            background:
              radial-gradient(farthest-side,var(--g1)) calc(var(--R) + 0.866*var(--R) - var(--R)) calc(var(--R) - 0.5*var(--R)   - var(--R)),
              radial-gradient(farthest-side,var(--g1)) calc(var(--R) + 0.866*var(--R) - var(--R)) calc(var(--R) - 0.5*var(--R)   - var(--R)),
              radial-gradient(farthest-side,var(--g2)) calc(var(--R) + 0.5*var(--R)   - var(--R)) calc(var(--R) - 0.866*var(--R) - var(--R)),
              radial-gradient(farthest-side,var(--g1)) 0 calc(-1*var(--R)),
              radial-gradient(farthest-side,var(--g2)) calc(var(--R) - 0.5*var(--R)   - var(--R)) calc(var(--R) - 0.866*var(--R) - var(--R)),
              radial-gradient(farthest-side,var(--g1)) calc(var(--R) - 0.866*var(--R) - var(--R)) calc(var(--R) - 0.5*var(--R)   - var(--R)),
              radial-gradient(farthest-side,var(--g2)) calc(-1*var(--R))  0,
              radial-gradient(farthest-side,var(--g1)) calc(var(--R) - 0.866*var(--R) - var(--R)) calc(var(--R) + 0.5*var(--R)   - var(--R));
            background-size: calc(2*var(--R)) calc(2*var(--R));
            background-repeat: no-repeat;
          }
          .loader::after {
            transform: rotate(180deg);
            transform-origin: right;
          }
          @keyframes yinYangSpin {
            100% {transform: rotate(-1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Conic Spin': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            padding: 1px;
            background: conic-gradient(#0000 10%, #3b82f6) content-box;
            -webkit-mask:
              repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
              radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 8px));
            -webkit-mask-composite: destination-in;
            mask-composite: intersect;
            animation: conicSpin 1s infinite steps(10);
          }
          @keyframes conicSpin {
            to {transform: rotate(1turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Half Conic': {
        css: `
          .loader {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #3b82f6;
            -webkit-mask:
              repeating-conic-gradient(#0000 0deg, #000 1deg 70deg, #0000 71deg 90deg),
              radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 8px));
            -webkit-mask-composite: destination-in;
            mask-composite: intersect;
            animation: halfConic 1s infinite;
          }
          @keyframes halfConic {
            to {transform: rotate(.5turn)}
          }
        `,
        html: '<div class="loader"></div>',
      },
      'Orbit Spin': {
        css: `
          .loader {
            width: 9px;
            height: 9px;
            position: relative;
          }
          .loader div {
            position: absolute;
            width: 50%;
            height: 150%;
            background: #3b82f6;
            transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
            animation: orbitSpin 1s calc(var(--delay) * 1s) infinite ease;
          }
          .loader div:nth-child(1) { --delay: 0.1; --rotation: 36; --translation: 150; }
          .loader div:nth-child(2) { --delay: 0.2; --rotation: 72; --translation: 150; }
          .loader div:nth-child(3) { --delay: 0.3; --rotation: 108; --translation: 150; }
          .loader div:nth-child(4) { --delay: 0.4; --rotation: 144; --translation: 150; }
          .loader div:nth-child(5) { --delay: 0.5; --rotation: 180; --translation: 150; }
          .loader div:nth-child(6) { --delay: 0.6; --rotation: 216; --translation: 150; }
          .loader div:nth-child(7) { --delay: 0.7; --rotation: 252; --translation: 150; }
          .loader div:nth-child(8) { --delay: 0.8; --rotation: 288; --translation: 150; }
          .loader div:nth-child(9) { --delay: 0.9; --rotation: 324; --translation: 150; }
          .loader div:nth-child(10) { --delay: 1; --rotation: 360; --translation: 150; }
          @keyframes orbitSpin {
            0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
              transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
            }
            50% {
              transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
            }
          }
        `,
        html: `
          <div class="loader">
            <div></div><div></div><div></div><div></div><div></div>
            <div></div><div></div><div></div><div></div><div></div>
          </div>
        `,
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
    'Sliding Dots': {
      css: `
        .loader {
          width: 56px;
          height: 13px;
          background: radial-gradient(circle closest-side, #3b82f6 90%, #0000) 0 0/33% 100% space;
          clip-path: inset(0 100% 0 0);
          animation: slidingDots 1s steps(4) infinite;
        }
        @keyframes slidingDots {
          to { clip-path: inset(0 -34% 0 0) }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Sliding Bar': {
      css: `
        .loader {
          width: 56px;
          height: 13px;
          background: radial-gradient(circle closest-side, #3b82f6 90%, #0000) 0 0/33% 100% no-repeat;
          animation: slidingBar 1s steps(3) infinite;
        }
        @keyframes slidingBar {
          to { background-position: 150% 0 }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Triple Bounce': {
      css: `
        .loader {
          width: 56px;
          height: 26px;
          background: 
            radial-gradient(circle closest-side, #3b82f6 90%, #0000) 0%   50%,
            radial-gradient(circle closest-side, #3b82f6 90%, #0000) 50%  50%,
            radial-gradient(circle closest-side, #3b82f6 90%, #0000) 100% 50%;
          background-size: calc(100%/3) 13px;
          background-repeat: no-repeat;
          animation: tripleBounce 1s infinite linear;
        }
        @keyframes tripleBounce {
          20% { background-position: 0%   0%, 50%  50%, 100%  50% }
          40% { background-position: 0% 100%, 50%   0%, 100%  50% }
          60% { background-position: 0%  50%, 50% 100%, 100%   0% }
          80% { background-position: 0%  50%, 50%  50%, 100% 100% }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Squeeze': {
      css: `
        .loader {
          width: 56px;
          height: 13px;
          background: 
            radial-gradient(circle closest-side at left  6px top 50%, #3b82f6 90%, #0000),
            radial-gradient(circle closest-side                    , #3b82f6 90%, #0000),
            radial-gradient(circle closest-side at right 6px top 50%, #3b82f6 90%, #0000);
          background-size: 100% 100%;
          background-repeat: no-repeat;
          animation: squeeze 1s infinite alternate;
        }
        @keyframes squeeze {
          to { width: 22px; height: 26px; }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Sliding Dots 2': {
      css: `
        .loader {
          width: 13px;
          height: 13px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 13px 0 #3b82f6, -26px 0 #3b82f6;
          animation: slidingDots2 1s infinite linear alternate;
        }
        @keyframes slidingDots2 {
          50% { box-shadow: 13px 0 #3b82f6, -13px 0 #3b82f6 }
          100% { box-shadow: 26px 0 #3b82f6, -13px 0 #3b82f6 }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Growing Bars': {
      css: `
        .loader {
          width: 56px;
          height: 13px;
          background: 
            radial-gradient(circle closest-side, #3b82f6 90%, #0000) 0%   50%,
            radial-gradient(circle closest-side, #3b82f6 90%, #0000) 50%  50%,
            radial-gradient(circle closest-side, #3b82f6 90%, #0000) 100% 50%;
          background-size: calc(100%/3) 100%;
          background-repeat: no-repeat;
          animation: growingBars 1s infinite linear;
        }
        @keyframes growingBars {
          33% { background-size: calc(100%/3) 0%  , calc(100%/3) 100%, calc(100%/3) 100% }
          50% { background-size: calc(100%/3) 100%, calc(100%/3) 0%  , calc(100%/3) 100% }
          66% { background-size: calc(100%/3) 100%, calc(100%/3) 100%, calc(100%/3) 0%   }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Newton Cradle': {
      css: `
        .loader {
          width: 13px;
          height: 13px;
          position: relative;
        }
        .loader::before,
        .loader::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #3b82f6;
        }
        .loader::before {
          box-shadow: -26px 0 #3b82f6;
          animation: newtonLeft 1s infinite linear;
        }
        .loader::after {
          transform: rotate(0deg) translateX(26px);
          animation: newtonRight 1s infinite linear;
        }
        @keyframes newtonLeft {
          100% { transform: translateX(26px) }
        }
        @keyframes newtonRight {
          100% { transform: rotate(-180deg) translateX(26px) }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Ping Pong': {
      css: `
        .loader {
          width: 13px;
          height: 13px;
          position: relative;
          animation: loaderScale 2s infinite steps(2);
        }
        .loader::before,
        .loader::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #3b82f6;
        }
        .loader::before {
          box-shadow: 26px 0 #3b82f6;
          transform: translateX(-26px);
          animation: moveLeft 1s infinite linear alternate;
        }
        .loader::after {
          transform: translateX(13px) rotate(0deg) translateX(13px);
          animation: moveRight 1s infinite linear alternate;
        }
        @keyframes loaderScale {
          0% , 49.9% { transform: scale(1) }
          50%, 100% { transform: scale(-1) }
        }
        @keyframes moveLeft {
          100% { box-shadow: 52px 0 #3b82f6 }
        }
        @keyframes moveRight {
          100% { transform: translateX(13px) rotate(-180deg) translateX(13px) }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Orbital': {
      css: `
        .loader {
          width: 13px;
          height: 13px;
          position: relative;
        }
        .loader::before,
        .loader::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: #3b82f6;
        }
        .loader::before {
          box-shadow: -26px 0 #3b82f6;
          animation: orbitalLeft 2s infinite linear;
        }
        .loader::after {
          transform: rotate(0deg) translateX(26px);
          animation: orbitalRight 2s infinite linear;
        }
        @keyframes orbitalLeft {
          50% { transform: translateX(26px) }
        }
        @keyframes orbitalRight {
          100% { transform: rotate(-360deg) translateX(26px) }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Triangle Path': {
      css: `
        .loader {
          width: 35px;
          height: 35px;
          --c: radial-gradient(circle closest-side, #3b82f6 90%, #0000);
          background: 
            var(--c) 0    0,
            var(--c) 0    100%,
            var(--c) 100% 100%;
          background-size: 13px 13px;
          background-repeat: no-repeat;
          animation: trianglePath 1s infinite linear;
        }
        @keyframes trianglePath {
          25% { background-position: 100% 0   , 0 100%, 100% 100% }
          50% { background-position: 100% 0   , 0 0   , 100% 100% }
          75% { background-position: 100% 0   , 0 0   , 0    100% }
          100% { background-position: 100% 100%, 0 0   , 0    100% }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Wave': {
      css: `
        .loader {
          width: 56px;
          height: 30px;
          --c: radial-gradient(farthest-side, #3b82f6 90%, #0000);
          background: 
            var(--c) 0    50%,
            var(--c) 50%  50%,
            var(--c) 100% 50%;
          background-size: 13px 13px;
          background-repeat: no-repeat;
          animation: waveLoader 1s infinite linear;
        }
        @keyframes waveLoader {
          33%  { background-position: 0   0  , 50% 100%, 100% 50% }
          66%  { background-position: 50% 0  , 0   100%, 100% 50% }
          100% { background-position: 50% 50%, 0   50% , 100% 50% }
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Jumping Dots': {
      css: `
        .loader {
          width: 56px;
          height: 30px;
          background: 
            radial-gradient(farthest-side at bottom, #3b82f6 90%, #0000) 0    calc(50% - 3px),
            radial-gradient(farthest-side at top   , #3b82f6 90%, #0000) 0    calc(50% + 3px),
            radial-gradient(farthest-side at bottom, #3b82f6 90%, #0000) 50%  calc(50% - 3px),
            radial-gradient(farthest-side at top   , #3b82f6 90%, #0000) 50%  calc(50% + 3px),
            radial-gradient(farthest-side at bottom, #3b82f6 90%, #0000) 100% calc(50% - 3px),
            radial-gradient(farthest-side at top   , #3b82f6 90%, #0000) 100% calc(50% + 3px);
          background-size: 13px 6px;
          background-repeat: no-repeat;
          animation: jumpingDots 1s infinite linear;
        }
        @keyframes jumpingDots {
          16.67% { background-position: 0 0, 0 100%, 50% calc(50% - 3px), 50% calc(50% + 3px), 100% calc(50% - 3px), 100% calc(50% + 3px) }
          33.33% { background-position: 0 0, 0 100%, 50% 0, 50% 100%, 100% calc(50% - 3px), 100% calc(50% + 3px) }
          50%    { background-position: 0 0, 0 100%, 50% 0, 50% 100%, 100% 0, 100% 100% }
          66.67% { background-position: 0 calc(50% - 3px), 0 calc(50% + 3px), 50% 0, 50% 100%, 100% 0, 100% 100% }
          83.33% { background-position: 0 calc(50% - 3px), 0 calc(50% + 3px), 50% calc(50% - 3px), 50% calc(50% + 3px), 100% 0, 100% 100% }
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Sliding Dots3': {
      css: `
        .loader {
          width: 56px;
          height: 28px;
          background: 
            radial-gradient(farthest-side,#3b82f6 90%,#0000) 0   50%/12px 12px,
            radial-gradient(farthest-side at bottom,#3b82f6 90%,#0000) 50%  calc(50% - 3px)/12px 6px,
            radial-gradient(farthest-side at top   ,#3b82f6 90%,#0000) 50%  calc(50% + 3px)/12px 6px,
            radial-gradient(farthest-side at bottom,#3b82f6 90%,#0000) 100% calc(50% - 3px)/12px 6px,
            radial-gradient(farthest-side at top   ,#3b82f6 90%,#0000) 100% calc(50% + 3px)/12px 6px;
          background-repeat: no-repeat;
          animation: slidingDots3 1s infinite;
        }
        @keyframes slidingDots3 {
          25%  {background-position:0    50%,50% 0,50% 100%,100% 0,100% 100%}
          50%  {background-position:100% 50%,0   0,0   100%,50%  0,50%  100%}
          75%,
          100% {background-position:100% 50%,0 calc(50% - 3px),0 calc(50% + 3px),50% calc(50% - 3px),50% calc(50% + 3px)}
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Rotating Dots': {
      css: `
        .loader {
          width: 50px;
          height: 12px;
          background: 
            radial-gradient(farthest-side,#3b82f6 90%,#0000) left,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) right;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          position: relative;
          animation: rotatingDots1 1s infinite linear;
        }
        .loader::before {
          content: "";
          position: absolute;
          background: #3b82f6;
          border-radius: 50%;
          inset: 0 calc(50% - 6px);
          transform-origin: -13px 50%;
          animation: rotatingDots2 0.5s infinite linear;
        }
        @keyframes rotatingDots1 { 
          0%,49.99% {transform: scale(1)}
          50%,100%  {transform: scale(-1)} 
        }
        @keyframes rotatingDots2 { 
          80%,100% {transform: rotate(1turn)} 
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Triangular Dots': {
      css: `
        .loader {
          width: 50px;
          height: 27.6px;
          --c: radial-gradient(farthest-side,#3b82f6 90%,#0000);
          background: 
            var(--c) 50%  0,
            var(--c) 0    100%,
            var(--c) 100% 100%;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          position: relative;
          animation: triangularDots 1s infinite;
        }
        @keyframes triangularDots { 
          50%,100% {background-position: 100% 100%,50% 0,0 100%} 
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Falling Dots': {
      css: `
        .loader {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          color: #3b82f6;
          clip-path: inset(-25px -100px);
          box-shadow: 19px -40px,38px -40px,57px -40px;
          transform: translateX(-38px);
          animation: fallingDots 1s infinite;
        }
        @keyframes fallingDots { 
          16.67% {box-shadow: 19px  0px,38px -40px,57px -40px}
          33.33% {box-shadow: 19px  0px,38px   0px,57px -40px}
          45%,55%{box-shadow: 19px  0px,38px   0px,57px   0px}
          66.67% {box-shadow: 19px 40px,38px   0px,57px   0px}
          83.33% {box-shadow: 19px 40px,38px  40px,57px   0px}
          100%   {box-shadow: 19px 40px,38px  40px,57px  40px}
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Orbiting Dots': {
      css: `
        .loader {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3b82f6;
          color: #3b82f6;
          box-shadow: -19px 0px,19px 0px;
          animation: orbitingDots 1s infinite;
        }
        @keyframes orbitingDots { 
          25%  {box-shadow: -19px -19px, 19px 19px}
          50%  {box-shadow:   0px -19px,  0px 19px}
          75%  {box-shadow:  19px -19px,-19px 19px}
          100% {box-shadow:  19px   0px,-19px  0px}
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Sliding Dots2': {
      css: `
        .loader {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          clip-path: inset(-45px);
          color: #3b82f6;
          box-shadow: -60px 15px,-60px 15px,-60px 15px;
          transform: translateY(-15px);
          animation: slidingDots2 1s infinite linear;
        }
        @keyframes slidingDots2 { 
          16.67% {box-shadow:-60px 15px,-60px 15px,19px 15px}
          33.33% {box-shadow:-60px 15px,  0px 15px,19px 15px}
          40%,60%{box-shadow:-19px 15px,  0px 15px,19px 15px}
          66.67% {box-shadow:-19px 15px,  0px 15px,60px 15px}
          83.33% {box-shadow:-19px 15px, 60px 15px,60px 15px}
          100%   {box-shadow: 60px 15px, 60px 15px,60px 15px}
        }
      `,
      html: '<div class="loader"></div>',
    },
    'Flipping Dots': {
      css: `
        .loader {
          width: 76px;
          height: 12px;
          display: flex;
        }
        .loader:before,
        .loader:after {
          content: "";
          flex: 1;
          background:
            radial-gradient(farthest-side         ,#3b82f6 90%,#0000) center/12px 100%,
            radial-gradient(farthest-side at right,#3b82f6 90%,#0000) right /6px  100%;
          background-repeat: no-repeat;
          transform: scale(var(--s,1)) translate(0px) rotate(0);
          animation: flippingDots 2s infinite;
        }
        .loader:after {
          --s: -1;
        }
        @keyframes flippingDots {
          25%      {transform: scale(var(--s,1)) translate(-10px) rotate(0);}
          50%      {transform: scale(var(--s,1)) translate(-10px) rotate(1turn);}
          75%,100% {transform: scale(var(--s,1)) translate(0px)   rotate(1turn);}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Shrinking Dots': {
      css: `
        .loader {
          width: 4px;
          height: 4px;
          color: #3b82f6;
          border-radius: 50%;
          box-shadow: 19px 0 0 7px, 38px 0 0 3px, 57px 0 0 0;
          transform: translateX(-38px);
          animation: shrinkingDots 0.5s infinite alternate linear;
        }
        @keyframes shrinkingDots {
          50%  {box-shadow: 19px 0 0 3px, 38px 0 0 7px, 57px 0 0 3px}
          100% {box-shadow: 19px 0 0 0  , 38px 0 0 3px, 57px 0 0 7px}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Orbiting Circles': {
      css: `
        .loader {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background:#3b82f6;
          color: #3b82f6;
          box-shadow: 0 0 0 3px;
          position: relative;
          animation: orbitingCircles0 2s infinite linear;
        }
        .loader:before,
        .loader:after {
          content: "";
          position: absolute;
          border-radius: 50%;
          inset:0;
          background:#3b82f6;
          transform: rotate(0deg) translate(18px);
          animation: orbitingCircles 1s infinite;
        }
        .loader:after {
          animation-delay: -0.5s
        }
        @keyframes orbitingCircles0 {
          100% {transform: rotate(1turn)}
        }
        @keyframes orbitingCircles {
          100% {transform: rotate(1turn) translate(20px)}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Bouncing Ball': {
      css: `
        .loader {
          width: 50px;
          height: 28px;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) 50%  0,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) 100% 0;
          background-size:12px 12px;
          background-repeat: no-repeat;
          position: relative;
          animation: bouncingBall0 1.5s linear infinite;
        }
        .loader:before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background:#3b82f6;
          left:0;
          top:0;
          animation: 
            bouncingBall1 1.5s linear infinite,
            bouncingBall2 0.5s cubic-bezier(0,200,.8,200) infinite;
        }
        @keyframes bouncingBall0 {
          0%,31%  {background-position: 50% 0   ,100% 0}
          33%     {background-position: 50% 100%,100% 0}
          43%,64% {background-position: 50% 0   ,100% 0}
          66%     {background-position: 50% 0   ,100% 100%}
          79%     {background-position: 50% 0   ,100% 0}
          100%    {transform:translateX(calc(-100%/3))}
        }
        @keyframes bouncingBall1 {
          100% {left:calc(100% + 7px)}
        }
        @keyframes bouncingBall2 {
          100% {top:-0.1px}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Sliding Dots4': {
      css: `
        .loader {
          width: 88px;
          height: 12px;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) 25% 0,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) 75% 0;
          background-size:12px 12px;
          background-repeat: no-repeat;
          position: relative;
          animation: slidingDots0 1s linear infinite;
        }
        .loader:before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background:#3b82f6;
          inset:0;
          margin:auto;
          animation: slidingDots1 1s cubic-bezier(0.5,300,0.5,-300) infinite;
        }
        @keyframes slidingDots0 {
          0%,24%  {background-position: 25% 0,75% 0}
          40%     {background-position: 25% 0,85% 0}
          50%,72% {background-position: 25% 0,75% 0}
          90%     {background-position: 15% 0,75% 0}
          100%    {background-position: 25% 0,75% 0}
        }
        @keyframes slidingDots1 {
          100% {transform:translate(0.1px)}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Bouncing Center Dot': {
      css: `
        .loader {
          width: 50px;
          height: 12px;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) left,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) right;
          background-size:12px 12px;
          background-repeat: no-repeat;
          position: relative;
        }
        .loader:before {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background:#3b82f6;
          inset:0;
          margin:auto;
          animation: bouncingCenterDot1 1s, bouncingCenterDot2 0.5s;
          animation-timing-function:cubic-bezier(.5,-900,.5,900);
          animation-iteration-count:infinite;
        }
        @keyframes bouncingCenterDot1 {
          100% {transform:translate(0.12px)}
        }
        @keyframes bouncingCenterDot2 {
          100% {inset:-0.15px 0 0;}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Rotating Dots1': {
      css: `
        .loader {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          color: #3b82f6;
          box-shadow: 
            19px -19px 0 0px, 38px -19px 0 0px, 57px -19px 0 0px,
            19px 0     0 5px, 38px 0     0 5px, 57px 0     0 5px,
            19px 19px  0 0px, 38px 19px  0 0px, 57px 19px  0 0px;
          transform: translateX(-38px);
          animation: rotatingDots 2s infinite linear;
        }
        @keyframes rotatingDots {
          12.5% {box-shadow: 
            19px -19px 0 0px, 38px -19px 0 0px, 57px -19px 0 5px,
            19px 0     0 5px, 38px 0     0 0px, 57px 0     0 5px,
            19px 19px  0 0px, 38px 19px  0 0px, 57px 19px  0 0px}
          25%   {box-shadow: 
            19px -19px 0 5px, 38px -19px 0 0px, 57px -19px 0 5px,
            19px 0     0 0px, 38px 0     0 0px, 57px 0     0 0px,
            19px 19px  0 0px, 38px 19px  0 5px, 57px 19px  0 0px}
          50%   {box-shadow: 
            19px -19px 0 5px, 38px -19px 0 5px, 57px -19px 0 0px,
            19px 0     0 0px, 38px 0     0 0px, 57px 0     0 0px,
            19px 19px  0 0px, 38px 19px  0 0px, 57px 19px  0 5px}
          62.5% {box-shadow: 
            19px -19px 0 0px, 38px -19px 0 0px, 57px -19px 0 0px,
            19px 0     0 5px, 38px 0     0 0px, 57px 0     0 0px,
            19px 19px  0 0px, 38px 19px  0 5px, 57px 19px  0 5px}
          75%   {box-shadow: 
            19px -19px 0 0px, 38px -19px 0 5px, 57px -19px 0 0px,
            19px 0     0 0px, 38px 0     0 0px, 57px 0     0 5px,
            19px 19px  0 0px, 38px 19px  0 0px, 57px 19px  0 5px}
          87.5% {box-shadow: 
            19px -19px 0 0px, 38px -19px 0 5px, 57px -19px 0 0px,
            19px 0     0 0px, 38px 0     0 5px, 57px 0     0 0px,
            19px 19px  0 5px, 38px 19px  0 0px, 57px 19px  0 0px}
        }
      `,
      html: '<div class="loader"></div>',
    },

    //cont
    'Flipping Half-Circles': {
      css: `
        .loader {
          width: 50px;
          height: 12px;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) left,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) right;
          background-size:12px 12px;
          background-repeat: no-repeat;
          position: relative;
        }
        .loader:before,
        .loader:after {
          content: "";
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background:#3b82f6;
          clip-path: inset(0 0 50%);
          inset:0;
          margin:auto;
          transform-origin: -13px 50%;
          animation: flippingHalfCircles 0.5s infinite alternate;
        }
        .loader:after {
          --s:-1;
          transform-origin: calc(100% + 13px) 50%;
        }
        @keyframes flippingHalfCircles {
          0%,40% {transform:scaleY(var(--s,1)) rotate(0)}
          100%   {transform:scaleY(var(--s,1)) rotate(calc(var(--s,1)*-90deg))}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Expanding Dot': {
      css: `
        .loader {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background:#3b82f6;
          color: #3b82f6;
          clip-path: inset(-26px);
          animation: expandingDot 2s infinite linear;
        }
        @keyframes expandingDot {
          0%  {box-shadow:0 0 0 0   , 40px 0,-40px 0,0 40px,0 -40px}
          10% {box-shadow:0 0 0 0   , 12px 0,-40px 0,0 40px,0 -40px}
          20% {box-shadow:0 0 0 4px , 0px  0,-40px 0,0 40px,0 -40px}
          30% {box-shadow:0 0 0 4px , 0px  0,-12px 0,0 40px,0 -40px}
          40% {box-shadow:0 0 0 8px , 0px  0,  0px 0,0 40px,0 -40px}
          50% {box-shadow:0 0 0 8px , 0px  0,  0px 0,0 12px,0 -40px}
          60% {box-shadow:0 0 0 12px, 0px  0,  0px 0,0  0px,0 -40px}
          70% {box-shadow:0 0 0 12px, 0px  0,  0px 0,0  0px,0 -12px}
          80% {box-shadow:0 0 0 16px, 0px  0,  0px 0,0  0px,0  0px }
          90%,
          100%{box-shadow:0 0 0 0   , 40px 0,-40px 0,0 40px,0 -40px}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Bouncing Dots': {
      css: `
        .loader {
          width: 31px;
          height: 31px;
          display: flex;
          justify-content: space-between;
          animation: bouncingDots0 1s infinite;
        }
        .loader::before,
        .loader::after {
          content: "";
          width:12px;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) top,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) bottom;
          background-size:12px 12px;
          background-repeat: no-repeat;
          transform-origin:50% calc(100% - 6px);
          animation:inherit;
          animation-name: bouncingDots1;
        }
        .loader::after {
          --s:-1;
        }
        @keyframes bouncingDots0 {
          100% {transform:translateY(calc(12px - 100%))}
        }
        @keyframes bouncingDots1 {
          100% {transform:rotate(calc(var(--s,1)*-180deg))}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Rotating Dots2': {
      css: `
        .loader {
          width: 31px;
          height: 31px;
          display: flex;
          justify-content: space-between;
        }
        .loader::before,
        .loader::after {
          content: "";
          width:12px;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) top,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) bottom;
          background-size:12px 12px;
          background-repeat: no-repeat;
          transform-origin:50% calc(100% - 6px);
          animation: rotatingDots 1s infinite;
        }
        .loader::after {
          transform-origin:50% 6px;
        }
        @keyframes rotatingDots {
          70%,100% {transform:rotate(-270deg)}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Sliding Dots5': {
      css: `
        .loader {
          width: 50px;
          height: 12px;
          display: grid;
          animation: slidingDots0 1s infinite; 
        }
        .loader:before,
        .loader:after {
          content: "";
          grid-area: 1/1;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) left,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) right;
          background-size: 12px 12px;
          background-repeat: no-repeat;
        }
        .loader:after {
          transform:rotate(0) translate(19px) rotate(0);
          animation:inherit;
          animation-name: slidingDots1; 
        }
        @keyframes slidingDots0 {
          100% {transform:translate(19px)}
        }
        @keyframes slidingDots1 {
          100% {transform:rotate(-.5turn) translate(19px) rotate(.5turn)}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Flipping Dots1': {
      css: `
        .loader {
          width: 69px;
          height: 12px;
          display: grid;
        }
        .loader:before,
        .loader:after {
          content: "";
          grid-area: 1/1;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) left,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) right;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          animation: flippingDots 1s infinite; 
        }
        .loader:after {
          margin:0 19px;
          animation-direction: reverse;
        }
        @keyframes flippingDots {
          80%,100% {transform:rotate(.5turn)}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Rotating Pair': {
      css: `
        .loader {
          width: 69px;
          height: 12px;
          display: flex;
          justify-content: space-between;
        }
        .loader:before,
        .loader:after {
          content: "";
          width:31px;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) left,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) right;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          transform-origin: 6px 50%;
          transform:translate(0) rotate(0);
          animation: rotatingPair 1s infinite linear; 
        }
        .loader:after {
          --s:-1;
          transform-origin: calc(100% - 6px) 50%;
        }
        @keyframes rotatingPair {
          100% {transform:translate(calc(var(--s,1)*19px)) rotate(calc(var(--s,1)*.5turn))}
        }
      `,
      html: '<div class="loader"></div>',
    },
    
    'Flipping Pair': {
      css: `
        .loader {
          width: 50px;
          height: 12px;
          display: grid;
        }
        .loader:before,
        .loader:after {
          content: "";
          grid-area: 1/1;
          background:
            radial-gradient(farthest-side,#3b82f6 90%,#0000) left,
            radial-gradient(farthest-side,#3b82f6 90%,#0000) right;
          background-size: 12px 12px;
          background-repeat: no-repeat;
          animation: flippingPair 1s infinite; 
          transform:translate(var(--d,0)) rotate(0);
        }
        .loader:after {
          --d:19px;
          animation-delay: .5s;
        }
        @keyframes flippingPair {
          50%,100% {transform:translate(var(--d,0)) rotate(.5turn)}
        }
      `,
      html: '<div class="loader"></div>',
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

  
  