import React, { useEffect, useState } from 'react';

interface SplashProps {
  onFinish: () => void;
}

const Splash: React.FC<SplashProps> = ({ onFinish }) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(onFinish, 500); // Wait for fade out
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className="absolute inset-0 z-[60] bg-masala-dark flex items-center justify-center transition-opacity duration-500"
      style={{ opacity }}
    >
      <div className="text-center">
        <div className="w-32 h-32 mx-auto bg-masala-yellow rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,179,0,0.6)] animate-pulse">
           <span className="text-6xl">🎲</span>
        </div>
        <h1 className="text-white text-3xl font-bold mt-6 tracking-widest">MANDY MAKERS</h1>
        <p className="text-masala-bg/50 mt-2 text-sm">Presents</p>
      </div>
    </div>
  );
};

export default Splash;