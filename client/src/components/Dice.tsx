import React, { useState, useEffect } from 'react';
import { useAudio } from '../lib/stores/useAudio';

interface DiceProps {
  value: number | null;
  isRolling?: boolean;
  onRoll?: () => void;
  canRoll?: boolean;
}

const DiceFace: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const getDots = (value: number) => {
    const dotPositions = {
      1: ['center'],
      2: ['top-left', 'bottom-right'],
      3: ['top-left', 'center', 'bottom-right'],
      4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
      5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
      6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right']
    };

    return dotPositions[value as keyof typeof dotPositions] || [];
  };

  const dots = getDots(value);

  return (
    <div className={`
      w-20 h-20 bg-white border-2 border-gray-800 rounded-lg
      relative shadow-lg grid grid-cols-3 grid-rows-3 gap-1 p-2
      ${className}
    `}>
      {dots.map((position, index) => (
        <div
          key={index}
          className={`
            w-3 h-3 bg-gray-800 rounded-full
            ${position === 'top-left' ? 'row-start-1 col-start-1' : ''}
            ${position === 'top-right' ? 'row-start-1 col-start-3' : ''}
            ${position === 'middle-left' ? 'row-start-2 col-start-1' : ''}
            ${position === 'center' ? 'row-start-2 col-start-2' : ''}
            ${position === 'middle-right' ? 'row-start-2 col-start-3' : ''}
            ${position === 'bottom-left' ? 'row-start-3 col-start-1' : ''}
            ${position === 'bottom-right' ? 'row-start-3 col-start-3' : ''}
          `}
        />
      ))}
    </div>
  );
};

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling = false,
  onRoll,
  canRoll = false
}) => {
  const [displayValue, setDisplayValue] = useState(value || 1);
  const [rolling, setRolling] = useState(false);
  const { playDiceRoll } = useAudio();

  useEffect(() => {
    if (isRolling) {
      setRolling(true);
      const rollInterval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);

      setTimeout(() => {
        clearInterval(rollInterval);
        setRolling(false);
        setDisplayValue(value || 1);
      }, 1000);

      return () => clearInterval(rollInterval);
    } else if (value) {
      setDisplayValue(value);
    }
  }, [value, isRolling]);

  const handleClick = () => {
    if (canRoll && onRoll) {
      playDiceRoll();
      onRoll();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <DiceFace
        value={displayValue}
        className={`
          transition-transform duration-200
          ${rolling ? 'animate-spin' : ''}
          ${canRoll ? 'hover:scale-105 cursor-pointer' : ''}
        `}
      />
      {canRoll && (
        <button
          onClick={handleClick}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg
                   transform transition-transform hover:scale-105 shadow-lg"
        >
          Roll Dice
        </button>
      )}
    </div>
  );
};
