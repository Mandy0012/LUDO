import React from 'react';
import { PlayerColor } from '../types';

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onRoll: () => void;
  color: PlayerColor;
  disabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling, onRoll, color, disabled }) => {
  
  // Tailwind color mappings for the dice container border/glow
  const colorMap = {
    [PlayerColor.RED]: 'border-masala-red shadow-masala-red/50',
    [PlayerColor.GREEN]: 'border-masala-green shadow-masala-green/50',
    [PlayerColor.YELLOW]: 'border-masala-yellow shadow-masala-yellow/50',
    [PlayerColor.BLUE]: 'border-masala-blue shadow-masala-blue/50',
  };

  const getDots = (num: number) => {
    switch(num) {
      case 1: return <div className="w-3 h-3 bg-black rounded-full" />;
      case 2: return <div className="flex justify-between w-full px-1"><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full self-end" /></div>;
      case 3: return <div className="flex flex-col justify-between h-full py-1"><div className="w-3 h-3 bg-black rounded-full self-start" /><div className="w-3 h-3 bg-black rounded-full self-center" /><div className="w-3 h-3 bg-black rounded-full self-end" /></div>;
      case 4: return <div className="grid grid-cols-2 gap-2"><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /></div>;
      case 5: return <div className="relative w-full h-full flex items-center justify-center"><div className="absolute top-1 left-1 w-3 h-3 bg-black rounded-full" /><div className="absolute top-1 right-1 w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /><div className="absolute bottom-1 left-1 w-3 h-3 bg-black rounded-full" /><div className="absolute bottom-1 right-1 w-3 h-3 bg-black rounded-full" /></div>;
      case 6: return <div className="grid grid-cols-2 gap-x-3 gap-y-1"><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /><div className="w-3 h-3 bg-black rounded-full" /></div>;
      default: return null;
    }
  };

  return (
    <button 
      onClick={onRoll}
      disabled={disabled || isRolling}
      className={`
        relative w-16 h-16 bg-white rounded-xl flex items-center justify-center 
        border-4 shadow-lg transition-transform active:scale-95
        ${colorMap[color]}
        ${isRolling ? 'animate-spin-fast' : ''}
        ${!disabled && !isRolling ? 'animate-bounce-short cursor-pointer' : 'opacity-80 cursor-default'}
      `}
    >
      {value ? getDots(value) : <span className="text-xs font-bold text-gray-400">ROLL</span>}
    </button>
  );
};

export default Dice;