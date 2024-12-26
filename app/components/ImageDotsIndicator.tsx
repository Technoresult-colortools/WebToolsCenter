interface ImageDotsIndicatorProps {
  total: number;
  current: number;
  theme: 'light' | 'dark';
}

export default function ImageDotsIndicator({ total, current, theme }: ImageDotsIndicatorProps) {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-1">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full transition-all duration-200 ${
            i === current
              ? 'bg-white scale-125' // Active dot
              : theme === 'light'
              ? 'bg-[#cccccc]' // Inactive dot for light theme
              : 'bg-[#666666]' // Inactive dot for dark theme
          }`}
          style={{
            opacity: i === current ? 1 : 0.6, // Slight transparency for inactive dots
          }}
        />
      ))}
    </div>
  );
}

  