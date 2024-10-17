import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && 
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg cursor-pointer transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-blue-500/25 group z-50"
          aria-label="Scroll to top"
        >
          <ChevronUp 
            className="w-6 h-6 text-white transform transition-transform duration-300 group-hover:-translate-y-1" 
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        </button>
      }
    </>
  );
};

export default ScrollToTop;