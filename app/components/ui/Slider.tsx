import React, { useState, useRef, useEffect, useCallback } from 'react';

interface SliderProps {
  id?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange?: (value: number) => void;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ min, max, step, value, onChange = () => {}, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate the percentage position for the thumb
  const percentage = ((value - min) / (max - min)) * 100;

  // Function to update the slider's value
  const updateValue = useCallback(
    (clientX: number) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left; // Get mouse position relative to slider
        const clampedPercentage = Math.min(Math.max(x / rect.width, 0), 1); // Clamp value between 0 and 1
        const newValue = Math.round((clampedPercentage * (max - min) + min) / step) * step;
        onChange(newValue); // Update the value
      }
    },
    [max, min, step, onChange]
  );

  // Handle mouse down (start dragging)
  const handleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
    updateValue(event.clientX); // Update value immediately on click
  };

  // Handle mouse move (dragging)
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        updateValue(event.clientX); // Update value while dragging
      }
    },
    [isDragging, updateValue]
  );

  // Stop dragging on mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove global mousemove and mouseup listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    // Clean up event listeners when unmounting
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove]);

  return (
    <div
      ref={sliderRef}
      className={`relative h-2 bg-gray-700 rounded-full cursor-pointer ${className}`}
      onMouseDown={handleMouseDown}
    >
      {/* Track */}
      <div
        className="absolute h-full bg-blue-600 rounded-full"
        style={{ width: `${percentage}%` }}
      />
      {/* Thumb */}
      <div
        className="absolute w-4 h-4 bg-white rounded-full shadow -mt-1 -ml-2"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
};

export default Slider;
