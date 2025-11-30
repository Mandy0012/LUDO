import React from 'react';
import AdPlaceholder from './AdPlaceholder';
import { soundManager } from '../services/soundManager';

interface MenuProps {
  onPlay: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const Menu: React.FC<MenuProps> = ({ onPlay, soundEnabled, onToggleSound }) => {
  return (
    <div className="absolute inset-0 z-50 bg-masala-bg flex flex-col items-center justify-between p-6">
      <div className="mt-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-masala-red drop-shadow-md mb-2 tracking-tighter">LUDO</h1>
        <h2 className="text-4xl font-serif italic text-masala-yellow drop-shadow-sm -mt-4">Masala</h2>
        <div className="mt-6 animate-bounce-short">
          <div className="w-24 h-24 bg-gradient-to-tr from-masala-red to-masala-yellow rounded-2xl rotate-12 shadow-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full m-1"></div>
            <div className="w-6 h-6 bg-white rounded-full m-1"></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        <button 
          onClick={() => { soundManager.playClick(); onPlay(); }}
          className="w-full bg-masala-green text-white py-4 rounded-xl font-bold text-xl shadow-lg active:scale-95 transition-transform"
        >
          PLAY NOW
        </button>
        
        <button 
          onClick={() => { soundManager.playClick(); onToggleSound(); }}
          className="w-full bg-white text-masala-dark border-2 border-masala-dark py-3 rounded-xl font-semibold shadow active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
           {soundEnabled ? 'Sound: ON 🔊' : 'Sound: OFF 🔇'}
        </button>
      </div>

      <div className="w-full mt-4">
        <AdPlaceholder type="BANNER" label="AdMob Banner" />
      </div>
    </div>
  );
};

export default Menu;