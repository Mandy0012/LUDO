import React, { useMemo } from 'react';
import { GameState, PlayerColor, Token } from '../types';
import { MAIN_PATH_COORDS, PATH_START_INDEX } from '../constants';

interface BoardProps {
  gameState: GameState;
  onTokenClick: (token: Token) => void;
}

const LudoBoard: React.FC<BoardProps> = ({ gameState, onTokenClick }) => {
  
  // Calculate visual position for a token
  const getTokenPosition = (token: Token, playerColor: PlayerColor) => {
    // 1. Base State (-1)
    if (token.position === -1) {
      // Base positions are hardcoded based on color quadrant
      const offsets = [
        { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 } // 2x2 grid inside base
      ];
      const offset = offsets[token.id];
      
      switch(playerColor) {
        case PlayerColor.GREEN: return { r: 2 + offset.r, c: 2 + offset.c }; // Top Left Base
        case PlayerColor.RED: return { r: 2 + offset.r, c: 11 + offset.c }; // Top Right Base
        case PlayerColor.YELLOW: return { r: 11 + offset.r, c: 2 + offset.c }; // Bottom Left Base
        case PlayerColor.BLUE: return { r: 11 + offset.r, c: 11 + offset.c }; // Bottom Right Base
      }
    }

    // 2. Main Track (0-51)
    if (token.position >= 0 && token.position < 51) {
       // We need to shift the visual index based on the player's starting point
       const startIndex = PATH_START_INDEX[playerColor];
       // Map token's relative step to the global path array.
       const globalIndex = (startIndex + token.position) % 52;
       
       const pos = MAIN_PATH_COORDS[globalIndex];
       if (pos) return { r: pos.row, c: pos.col };
    }

    // 3. Home Stretch (52+)
    if (token.position >= 51) {
      // Offset into the colored home column
      const depth = token.position - 51; // 1 to 5
      if (depth > 5) return { r: 8, c: 8 }; // Center (Winner)
      
      switch(playerColor) {
        case PlayerColor.GREEN: return { r: 8, c: 1 + depth };
        case PlayerColor.RED: return { r: 1 + depth, c: 8 };
        case PlayerColor.BLUE: return { r: 15 - depth, c: 8 };
        case PlayerColor.YELLOW: return { r: 8, c: 15 - depth }; // Yellow enters from bottom left relative to center, actually row 8, col 15-depth is RIGHT side.
        // Wait, standard Ludo home runs:
        // Green (Left) -> goes right into center.
        // Red (Top) -> goes down into center.
        // Blue (Right) -> goes left into center.
        // Yellow (Bottom) -> goes up into center.
      }
      // Correction for Yellow/Blue based on visual grid:
      // Green Home: Row 8, Cols 2-6
      // Red Home: Col 8, Rows 2-6
      // Blue Home: Row 8, Cols 10-14 (Direction: 14->10)
      // Yellow Home: Col 8, Rows 10-14 (Direction: 14->10)
      
      // Let's re-map strictly to visual grid
       switch(playerColor) {
        case PlayerColor.GREEN: return { r: 8, c: 1 + depth };
        case PlayerColor.RED: return { r: 1 + depth, c: 8 };
        case PlayerColor.BLUE: return { r: 8, c: 15 - depth }; 
        case PlayerColor.YELLOW: return { r: 15 - depth, c: 8 }; 
      }
    }

    return { r: 8, c: 8 }; // Fallback
  };

  // Render tokens
  const renderTokens = () => {
    const tokens: React.ReactNode[] = [];
    
    Object.values(gameState.players).forEach(player => {
      player.tokens.forEach(token => {
        if (token.position === 99) return; // Finished

        const pos = getTokenPosition(token, player.color);
        
        const isClickable = gameState.turn === player.color && 
                            gameState.diceValue !== null && 
                            !gameState.isRolling &&
                            gameState.canMove;

        // Visual styles
        const bgColors = {
            [PlayerColor.RED]: 'bg-masala-red',
            [PlayerColor.GREEN]: 'bg-masala-green',
            [PlayerColor.YELLOW]: 'bg-masala-yellow',
            [PlayerColor.BLUE]: 'bg-masala-blue'
        };

        tokens.push(
          <div
            key={`${player.color}-${token.id}`}
            onClick={() => isClickable ? onTokenClick(token) : null}
            style={{
              gridRowStart: pos.r,
              gridColumnStart: pos.c,
              zIndex: 10 + token.id
            }}
            className={`
              w-[80%] h-[80%] m-auto rounded-full border-2 border-white shadow-md
              flex items-center justify-center transition-all duration-300
              ${bgColors[player.color]}
              ${isClickable ? 'cursor-pointer animate-bounce ring-2 ring-white' : ''}
            `}
          >
            {/* Inner detail for "Masala" look - a small star or dot */}
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        );
      });
    });
    return tokens;
  };

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto bg-masala-bg shadow-2xl rounded-lg overflow-hidden border-4 border-masala-dark">
      {/* The 15x15 Grid Container */}
      <div className="w-full h-full grid grid-cols-15 grid-rows-15">
        
        {/* Bases */}
        {/* Green Base (Top Left) */}
        <div className="col-start-1 col-end-7 row-start-1 row-end-7 bg-masala-green border border-masala-dark p-4">
            <div className="w-full h-full bg-white rounded-xl flex flex-wrap p-2">
                 <div className="w-1/2 h-1/2 border border-green-100 rounded-full bg-green-50"></div>
                 <div className="w-1/2 h-1/2 border border-green-100 rounded-full bg-green-50"></div>
                 <div className="w-1/2 h-1/2 border border-green-100 rounded-full bg-green-50"></div>
                 <div className="w-1/2 h-1/2 border border-green-100 rounded-full bg-green-50"></div>
            </div>
        </div>
        
        {/* Red Base (Top Right) */}
        <div className="col-start-10 col-end-16 row-start-1 row-end-7 bg-masala-red border border-masala-dark p-4">
             <div className="w-full h-full bg-white rounded-xl flex flex-wrap p-2">
                 <div className="w-1/2 h-1/2 border border-red-100 rounded-full bg-red-50"></div>
                 <div className="w-1/2 h-1/2 border border-red-100 rounded-full bg-red-50"></div>
                 <div className="w-1/2 h-1/2 border border-red-100 rounded-full bg-red-50"></div>
                 <div className="w-1/2 h-1/2 border border-red-100 rounded-full bg-red-50"></div>
            </div>
        </div>

        {/* Yellow Base (Bottom Left) */}
        <div className="col-start-1 col-end-7 row-start-10 row-end-16 bg-masala-yellow border border-masala-dark p-4">
             <div className="w-full h-full bg-white rounded-xl flex flex-wrap p-2">
                 <div className="w-1/2 h-1/2 border border-yellow-100 rounded-full bg-yellow-50"></div>
                 <div className="w-1/2 h-1/2 border border-yellow-100 rounded-full bg-yellow-50"></div>
                 <div className="w-1/2 h-1/2 border border-yellow-100 rounded-full bg-yellow-50"></div>
                 <div className="w-1/2 h-1/2 border border-yellow-100 rounded-full bg-yellow-50"></div>
            </div>
        </div>

        {/* Blue Base (Bottom Right) */}
        <div className="col-start-10 col-end-16 row-start-10 row-end-16 bg-masala-blue border border-masala-dark p-4">
             <div className="w-full h-full bg-white rounded-xl flex flex-wrap p-2">
                 <div className="w-1/2 h-1/2 border border-blue-100 rounded-full bg-blue-50"></div>
                 <div className="w-1/2 h-1/2 border border-blue-100 rounded-full bg-blue-50"></div>
                 <div className="w-1/2 h-1/2 border border-blue-100 rounded-full bg-blue-50"></div>
                 <div className="w-1/2 h-1/2 border border-blue-100 rounded-full bg-blue-50"></div>
            </div>
        </div>

        {/* Center / Home */}
        <div className="col-start-7 col-end-10 row-start-7 row-end-10 bg-masala-dark overflow-hidden relative">
            {/* Triangles for home - using inline clip-path for cross-browser support */}
            <div className="absolute inset-0 bg-masala-green opacity-30" style={{ clipPath: 'polygon(0 0, 0 100%, 50% 50%)' }}></div>
            <div className="absolute inset-0 bg-masala-red opacity-30" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }}></div>
            <div className="absolute inset-0 bg-masala-blue opacity-30" style={{ clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)' }}></div>
            <div className="absolute inset-0 bg-masala-yellow opacity-30" style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)' }}></div>
        </div>
        
        {/* Tracks - Colored Home Paths */}
        
        {/* Green Home Path (Left) */}
        <div className="col-start-2 col-end-7 row-start-8 row-end-9 bg-masala-green/30"></div>
        {/* Red Home Path (Top) */}
        <div className="col-start-8 col-end-9 row-start-2 row-end-7 bg-masala-red/30"></div>
        {/* Yellow Home Path (Bottom) */}
        <div className="col-start-8 col-end-9 row-start-10 row-end-16 bg-masala-yellow/30"></div>
        {/* Blue Home Path (Right) */}
        <div className="col-start-10 col-end-16 row-start-8 row-end-9 bg-masala-blue/30"></div>

        {/* START SPOTS (Darker Colored Squares) */}
        {/* Green Start (Row 7, Col 2) */}
        <div className="col-start-2 col-end-3 row-start-7 row-end-8 bg-masala-green border-masala-dark border"></div>
        {/* Red Start (Row 2, Col 9) */}
        <div className="col-start-9 col-end-10 row-start-2 row-end-3 bg-masala-red border-masala-dark border"></div>
        {/* Blue Start (Row 9, Col 14) */}
        <div className="col-start-14 col-end-15 row-start-9 row-end-10 bg-masala-blue border-masala-dark border"></div>
        {/* Yellow Start (Row 14, Col 7) */}
        <div className="col-start-7 col-end-8 row-start-14 row-end-15 bg-masala-yellow border-masala-dark border"></div>

        {/* The Grid Overlay for debugging or style - simplified visual lines */}
        <div className="pointer-events-none absolute inset-0 grid grid-cols-15 grid-rows-15">
            {[...Array(225)].map((_, i) => (
               <div key={i} className="border-[0.5px] border-masala-dark/10"></div>
            ))}
        </div>

        {/* Render Tokens on top */}
        {renderTokens()}

      </div>
    </div>
  );
};

export default LudoBoard;