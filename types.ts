export enum PlayerColor {
  RED = 'RED',
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE'
}

export enum GamePhase {
  SPLASH = 'SPLASH',
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  WON = 'WON'
}

export interface Token {
  id: number; // 0-3
  position: number; // -1 = base, 0-51 = track, 52-57 = home stretch, 99 = finished
  color: PlayerColor;
}

export interface PlayerState {
  color: PlayerColor;
  tokens: Token[];
  hasWon: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Record<PlayerColor, PlayerState>;
  turn: PlayerColor;
  diceValue: number | null;
  isRolling: boolean;
  canMove: boolean;
  winner: PlayerColor | null;
  soundEnabled: boolean;
}

// Coordinates for the 15x15 grid
export interface GridPos {
  row: number;
  col: number;
}