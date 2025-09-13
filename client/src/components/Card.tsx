import React from 'react';

interface CardProps {
  number: number;
  isSelected?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  className?: string;
}

const CARD_COLORS = {
  1: 'bg-red-500',
  2: 'bg-blue-500',
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-purple-500',
  6: 'bg-pink-500',
  7: 'bg-orange-500',
  8: 'bg-teal-500',
  9: 'bg-indigo-500'
};

export const Card: React.FC<CardProps> = ({
  number,
  isSelected = false,
  isClickable = false,
  onClick,
  className = ''
}) => {
  return (
    <div
      className={`
        w-16 h-24 rounded-lg border-2 border-white shadow-lg
        flex items-center justify-center text-white font-bold text-2xl
        transition-all duration-200 cursor-pointer
        ${CARD_COLORS[number as keyof typeof CARD_COLORS]}
        ${isSelected ? 'ring-4 ring-yellow-400 transform -translate-y-2' : ''}
        ${isClickable ? 'hover:transform hover:-translate-y-1 hover:shadow-xl' : ''}
        ${className}
      `}
      onClick={isClickable ? onClick : undefined}
    >
      {number}
    </div>
  );
};

export const CardBack: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`
      w-16 h-24 rounded-lg border-2 border-white shadow-lg
      bg-gray-800 flex items-center justify-center
      ${className}
    `}>
      <div className="w-8 h-8 bg-white rounded-full opacity-20"></div>
    </div>
  );
};
