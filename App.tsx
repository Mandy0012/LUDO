import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GamePhase, PlayerColor, PlayerState, Token } from './types';
import LudoBoard from './components/LudoBoard';
import Dice from './components/Dice';
import Menu from './components/Menu';
import Splash from './components/Splash';
import AdPlaceholder from './components/AdPlaceholder';
import { soundManager } from './services/soundManager';

// Initial Helper
const createInitialPlayer = (color: PlayerColor): PlayerState => ({
  color,
  hasWon: false,
  tokens: [
    { id: 0, position: -1, color },
    { id: 1, position: -1, color },
    { id: 2, position: -1, color },
    { id: 3, position: -1, color },
  ]
});

const TURN_ORDER = [PlayerColor.GREEN, PlayerColor.RED, PlayerColor.BLUE, PlayerColor.YELLOW];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SPLASH,
    players: {
      [PlayerColor.RED]: createInitialPlayer(PlayerColor.RED),
      [PlayerColor.GREEN]: createInitialPlayer(PlayerColor.GREEN),
      [PlayerColor.YELLOW]: createInitialPlayer(PlayerColor.YELLOW),
      [PlayerColor.BLUE]: createInitialPlayer(PlayerColor.BLUE),
    },
    turn: PlayerColor.GREEN, // Green starts
    diceValue: null,
    isRolling: false,
    canMove: false,
    winner: null,
    soundEnabled: true
  });

  // Sound Effect Wrapper
  const toggleSound = () => {
    const newState = !gameState.soundEnabled;
    soundManager.setEnabled(newState);
    setGameState(prev => ({ ...prev, soundEnabled: newState }));
  };

  // Dice Logic
  const handleRollDice = () => {
    if (gameState.isRolling || gameState.diceValue !== null) return;
    
    soundManager.playDiceRoll();
    setGameState(prev => ({ ...prev, isRolling: true }));

    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      // const roll = 6; // DEBUG: Force 6
      setGameState(prev => {
        // Check if any move is possible
        const currentPlayer = prev.players[prev.turn];
        const hasMovableTokens = currentPlayer.tokens.some(t => {
           if (t.position === -1) return roll === 6;
           if (t.position === 99) return false;
           return (t.position + roll) <= 57; // 57 is home
        });

        // Auto-switch turn if no move possible
        if (!hasMovableTokens) {
            setTimeout(() => nextTurn(prev.turn), 1000);
            return {
                ...prev,
                isRolling: false,
                diceValue: roll,
                canMove: false
            };
        }

        return {
          ...prev,
          isRolling: false,
          diceValue: roll,
          canMove: true
        };
      });
    }, 600);
  };

  const nextTurn = (currentTurn: PlayerColor) => {
    const idx = TURN_ORDER.indexOf(currentTurn);
    const nextIdx = (idx + 1) % 4;
    setGameState(prev => ({
      ...prev,
      turn: TURN_ORDER[nextIdx],
      diceValue: null,
      canMove: false
    }));
  };

  const handleTokenClick = (token: Token) => {
    if (!gameState.canMove || gameState.diceValue === null || gameState.isRolling) return;
    if (token.color !== gameState.turn) return;

    const roll = gameState.diceValue;
    const newPos = token.position === -1 ? (roll === 6 ? 0 : -1) : token.position + roll;

    // Validation
    if (token.position === -1 && roll !== 6) return;
    if (newPos > 57) return; // Cannot overshoot home

    soundManager.playMove();

    // Logic to move token
    setGameState(prev => {
      const updatedPlayers = { ...prev.players };
      const player = { ...updatedPlayers[prev.turn] };
      const tokens = [...player.tokens];
      const tokenIndex = tokens.findIndex(t => t.id === token.id);
      
      tokens[tokenIndex] = { ...tokens[tokenIndex], position: newPos === 57 ? 99 : newPos };
      player.tokens = tokens;
      updatedPlayers[prev.turn] = player;

      // Check Collision / Kill
      // Note: This requires complex global index mapping. 
      // For this simplified demo, we will skip "Killing" logic to keep code concise,
      // or implement basic "Same Spot" logic if mapped correctly. 
      // Since mapping 0-51 varies per player, 'Kill' logic requires normalization.
      // Skipping specific 'Kill' logic for robustness in this snippet, focusing on movement flow.
      
      // Check Win
      if (tokens.every(t => t.position === 99)) {
          soundManager.playWin();
          return { ...prev, players: updatedPlayers, phase: GamePhase.WON, winner: prev.turn };
      }

      // Turn Logic: Roll 6 gets another turn
      const shouldSwitch = roll !== 6;

      if (shouldSwitch) {
         setTimeout(() => nextTurn(prev.turn), 500);
      } else {
         // Reset for next roll same player
         return { ...prev, players: updatedPlayers, diceValue: null, canMove: false };
      }

      return {
        ...prev,
        players: updatedPlayers,
        canMove: false // Disable until next state update
      };
    });
  };

  const resetGame = () => {
     setGameState({
        phase: GamePhase.PLAYING,
        players: {
            [PlayerColor.RED]: createInitialPlayer(PlayerColor.RED),
            [PlayerColor.GREEN]: createInitialPlayer(PlayerColor.GREEN),
            [PlayerColor.YELLOW]: createInitialPlayer(PlayerColor.YELLOW),
            [PlayerColor.BLUE]: createInitialPlayer(PlayerColor.BLUE),
        },
        turn: PlayerColor.GREEN,
        diceValue: null,
        isRolling: false,
        canMove: false,
        winner: null,
        soundEnabled: gameState.soundEnabled
     });
  };

  return (
    <div className="w-full h-screen bg-masala-bg flex flex-col items-center overflow-hidden">
      
      {/* Splash Overlay */}
      {gameState.phase === GamePhase.SPLASH && (
        <Splash onFinish={() => setGameState(prev => ({ ...prev, phase: GamePhase.MENU }))} />
      )}

      {/* Menu Overlay */}
      {gameState.phase === GamePhase.MENU && (
        <Menu 
          onPlay={() => setGameState(prev => ({ ...prev, phase: GamePhase.PLAYING }))} 
          soundEnabled={gameState.soundEnabled}
          onToggleSound={toggleSound}
        />
      )}

      {/* Game Content */}
      <div className="w-full max-w-md flex-1 flex flex-col p-4 relative">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
            <button onClick={() => setGameState(prev => ({ ...prev, phase: GamePhase.MENU }))} className="bg-masala-dark text-white px-3 py-1 rounded shadow text-sm">MENU</button>
            <div className="font-bold text-masala-dark">LUDO MASALA</div>
            <button onClick={resetGame} className="bg-masala-red text-white px-3 py-1 rounded shadow text-sm">RESTART</button>
        </div>

        {/* Top Ad */}
        <div className="mb-2">
            <AdPlaceholder type="BANNER" />
        </div>

        {/* Board */}
        <LudoBoard gameState={gameState} onTokenClick={handleTokenClick} />

        {/* Controls Area */}
        <div className="mt-6 flex flex-row items-center justify-between bg-white p-4 rounded-xl shadow-lg border border-gray-100">
            
            {/* Player Indicator */}
            <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-gray-400 mb-1">TURN</span>
                <div className={`
                    w-12 h-12 rounded-full border-4 shadow-inner transition-colors duration-300
                    ${gameState.turn === PlayerColor.RED ? 'bg-masala-red border-red-300' : ''}
                    ${gameState.turn === PlayerColor.GREEN ? 'bg-masala-green border-green-300' : ''}
                    ${gameState.turn === PlayerColor.YELLOW ? 'bg-masala-yellow border-yellow-300' : ''}
                    ${gameState.turn === PlayerColor.BLUE ? 'bg-masala-blue border-blue-300' : ''}
                `}></div>
            </div>

            {/* Dice Section */}
            <div className="flex flex-col items-center">
                <Dice 
                    value={gameState.diceValue} 
                    isRolling={gameState.isRolling} 
                    onRoll={handleRollDice} 
                    color={gameState.turn}
                    disabled={gameState.diceValue !== null}
                />
                {gameState.diceValue === 6 && <span className="text-xs text-masala-red font-bold animate-pulse mt-1">Roll Again!</span>}
            </div>

            {/* Status Text */}
            <div className="w-20 text-center text-sm font-semibold text-gray-600">
                {gameState.diceValue === null ? "Roll Dice" : (gameState.canMove ? "Move Token" : "Thinking...")}
            </div>
        </div>

        {/* Game Over Modal */}
        {gameState.phase === GamePhase.WON && (
            <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center rounded-xl">
                <h2 className="text-white text-4xl font-bold mb-4 animate-bounce">WINNER!</h2>
                <div className={`text-2xl font-bold mb-8 text-white px-6 py-2 rounded ${
                    gameState.winner === PlayerColor.RED ? 'bg-masala-red' :
                    gameState.winner === PlayerColor.GREEN ? 'bg-masala-green' :
                    gameState.winner === PlayerColor.BLUE ? 'bg-masala-blue' : 'bg-masala-yellow'
                }`}>
                    {gameState.winner}
                </div>
                <button onClick={resetGame} className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg">PLAY AGAIN</button>
                <div className="mt-8 w-64">
                    <AdPlaceholder type="RECTANGLE" label="Winner Ad" />
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default App;