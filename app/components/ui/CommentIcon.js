import React from 'react';

const CommentIcon = ({ className }) => (
  <svg 
    aria-label="Comment" 
    fill="currentColor" 
    role="img" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    className={className}
  >
    <path 
      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" 
      fill="none" 
      stroke="currentColor" 
      stroke-linejoin="round" 
      stroke-width="2"
    />
  </svg>
);

export default CommentIcon;