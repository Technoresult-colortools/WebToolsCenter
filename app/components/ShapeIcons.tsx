import React from 'react'

export const CheckIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)', backgroundSize: '10px 10px' }} />
)

export const DiamondIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ background: 'repeating-conic-gradient(from 45deg, #000 0% 25%, #fff 0% 50%)', backgroundSize: '5px 5px' }} />
)

export const GridIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px)', backgroundSize: '5px 5px' }} />
)

export const DotIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '5px 5px' }} />
)

export const CrossDotIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, transparent 1px)', backgroundSize: '5px 5px', backgroundPosition: '0 0, 2.5px 2.5px' }} />
)

export const VerticalLinesIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'repeating-linear-gradient(to right, #000, #000 1px, transparent 1px, transparent)', backgroundSize: '5px 5px' }} />
)

export const HorizontalLinesIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'repeating-linear-gradient(#000, #000 1px, transparent 1px, transparent)', backgroundSize: '5px 5px' }} />
)

export const DiagonalLinesIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '5px 5px' }} />
)

export const VerticalStripesIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, #000 50%)', backgroundSize: '5px 5px' }} />
)

export const HorizontalStripesIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(0deg, transparent 50%, #000 50%)', backgroundSize: '5px 5px' }} />
)

export const DiagonalStripesIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2.5px, #000 2.5px, #000 5px)' }} />
)

export const Shape1Icon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
)

export const Shape2Icon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' }} />
)

export const Shape3Icon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
)

// Additional icons for the new shapes
export const CrossesIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
)

export const Design1Icon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #000 1px, transparent 1px)', backgroundSize: '3px 3px' }} />
)

export const PlusSignIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)', backgroundSize: '5px 5px', backgroundPosition: 'center' }} />
)

export const EquilateralTrianglesIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000), linear-gradient(-60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000)', backgroundSize: '5px 8.66px' }} />
)

export const RightTriangleIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(45deg, #000 50%, transparent 50%)', backgroundSize: '5px 5px' }} />
)

export const LeftTriangleIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(-45deg, #000 50%, transparent 50%)', backgroundSize: '5px 5px' }} />
)

export const Design2Icon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(-45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '4px 4px' }} />
)

// New icons for the added patterns
export const HexagonIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000), linear-gradient(-60deg, #000 25%, transparent 25.5%, transparent 75%, #000 75%, #000)', backgroundSize: '6px 10.39px' }} />
)

export const ZigzagIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(135deg, #000 25%, transparent 25%) -2px 0, linear-gradient(225deg, #000 25%, transparent 25%) -2px 0, linear-gradient(315deg, #000 25%, transparent 25%), linear-gradient(45deg, #000 25%, transparent 25%)', backgroundSize: '4px 4px' }} />
)

export const WaveIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'radial-gradient(circle at 100% 50%, transparent 20%, #000 21%, #000 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, #000 21%, #000 34%, transparent 35%, transparent) 0 -3px', backgroundSize: '4px 6px' }} />
)

export const CubeIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(30deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(150deg, #000 12%, transparent 12.5%, transparent 87%, #000 87.5%, #000), linear-gradient(60deg, #00000077 25%, transparent 25.5%, transparent 75%, #00000077 75%, #00000077), linear-gradient(60deg, #00000077 25%, transparent 25.5%, transparent 75%, #00000077 75%, #00000077)', backgroundSize: '5px 9px', backgroundPosition: '0 0, 0 0, 2.5px 4.5px, 2.5px 4.5px, 0 0, 2.5px 4.5px' }} />
)

export const ChevronIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(135deg, #000 25%, transparent 25%) -2px 0, linear-gradient(225deg, #000 25%, transparent 25%) -2px 0, linear-gradient(315deg, #000 25%, transparent 25%), linear-gradient(45deg, #000 25%, transparent 25%)', backgroundSize: '4px 4px' }} />
)

export const CircleIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'radial-gradient(#000 20%, transparent 20%), radial-gradient(#000 20%, transparent 20%)', backgroundPosition: '0 0, 2.5px 2.5px', backgroundSize: '5px 5px' }} />
)

export const StarIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px), radial-gradient(#000 1px, transparent 1px)', backgroundSize: '5px 5px', backgroundPosition: '0 0, 2.5px 2.5px' }} />
)

export const WeaveIcon: React.FC = () => (
  <div className="w-5 h-5 bg-gray-300" style={{ backgroundImage: 'linear-gradient(45deg, #000 12%, transparent 0, transparent 88%, #000 0), linear-gradient(135deg, transparent 37%, #fff 0, #fff 63%, transparent 0), linear-gradient(45deg, transparent 37%, #000 0, #000 63%, transparent 0)', backgroundSize: '5px 5px' }} />
)