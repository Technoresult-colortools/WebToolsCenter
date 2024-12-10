import React from 'react'
import { Check } from 'lucide-react'

const COLOR_GRID = [
  ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'],
  ['#FCE4EC', '#F8BBD0', '#F48FB1', '#F06292', '#EC407A', '#E91E63', '#D81B60', '#C2185B', '#AD1457', '#880E4F'],
  ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A', '#4A148C'],
  ['#EDE7F6', '#D1C4E9', '#B39DDB', '#9575CD', '#7E57C2', '#673AB7', '#5E35B1', '#512DA8', '#4527A0', '#311B92'],
  ['#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB', '#5C6BC0', '#3F51B5', '#3949AB', '#303F9F', '#283593', '#1A237E'],
  ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
  ['#E1F5FE', '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4', '#039BE5', '#0288D1', '#0277BD', '#01579B'],
  ['#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA', '#00BCD4', '#00ACC1', '#0097A7', '#00838F', '#006064']
]

interface ColorGridProps {
  onColorSelect: (color: string) => void
  selectedColor: string
}

export function ColorGrid({ onColorSelect, selectedColor }: ColorGridProps) {
  return (
    <div className="grid grid-cols-10 gap-2">
      {COLOR_GRID.map((row, i) => (
        <React.Fragment key={i}>
          {row.map((color, j) => (
            <button
              key={`${i}-${j}`}
              className="w-full aspect-square rounded-lg transition-transform hover:scale-110 relative group"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
            >
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs rounded-lg transition-opacity">
                {color}
              </span>
              {color === selectedColor && (
                <Check className="absolute top-1 right-1 text-white" />
              )}
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>
  )
}
