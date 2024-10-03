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

const Slider: React.FC<SliderProps> = ({ id, min, max, step, value, onChange = () => {}, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = useCallback(
    (clientX: number) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const clampedPercentage = Math.min(Math.max(x / rect.width, 0), 1);
        const newValue = Math.round((clampedPercentage * (max - min) + min) / step) * step;
        onChange(newValue);
      }
    },
    [max, min, step, onChange]
  );

  const handleStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    setIsDragging(true);
    updateValue('touches' in event ? event.touches[0].clientX : event.clientX);
  }, [updateValue]);

  const handleMove = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isDragging) {
        updateValue('touches' in event ? event.touches[0].clientX : event.clientX);
      }
    },
    [isDragging, updateValue]
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    } else {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, handleMove, handleEnd]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    let newValue = value;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(value - step, min);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(value + step, max);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }
    onChange(newValue);
  };

  return (
    <div
      ref={sliderRef}
      className={`relative h-2 bg-gray-700 rounded-full cursor-pointer ${className}`}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      role="slider"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      id={id}
    >
      <div
        className="absolute h-full bg-blue-600 rounded-full"
        style={{ width: `${percentage}%` }}
      />
      <div
        className="absolute w-4 h-4 bg-white rounded-full shadow -mt-1 -ml-2"
        style={{ left: `${percentage}%` }}
      />
    </div>
  );
};

export default Slider;