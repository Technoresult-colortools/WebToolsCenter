import React from 'react';

const ShareIcon = ({ className }) => (
  <svg 
    aria-label="Share Post" 
    fill="currentColor" 
    role="img" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    className={className}
  >
    <line 
      fill="none" 
      stroke="currentColor" 
      stroke-linejoin="round" 
      stroke-width="2" 
      x1="22" 
      x2="9.218" 
      y1="3" 
      y2="10.083"
    />
    <polygon 
      fill="none" 
      points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" 
      stroke="currentColor" 
      stroke-linejoin="round" 
      stroke-width="2"
    />
  </svg>
);

export default ShareIcon;