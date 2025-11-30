import React from 'react';

interface AdProps {
  type: 'BANNER' | 'RECTANGLE';
  label?: string;
}

const AdPlaceholder: React.FC<AdProps> = ({ type, label }) => {
  const hClass = type === 'BANNER' ? 'h-14' : 'h-64';
  
  return (
    <div className={`w-full ${hClass} bg-gray-200 border-2 border-dashed border-gray-400 flex flex-col items-center justify-center overflow-hidden my-2`}>
      <span className="text-xs font-bold text-gray-500 uppercase">ADVERTISEMENT</span>
      {label && <span className="text-xs text-gray-400">{label}</span>}
      <div className="text-[10px] text-gray-400 mt-1">Ludo Masala Ad Space</div>
    </div>
  );
};

export default AdPlaceholder;