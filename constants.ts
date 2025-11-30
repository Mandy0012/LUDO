import { PlayerColor, GridPos } from './types';

// The main walking path coordinates (15x15 grid)
// This maps the linear path (0-51) to visual grid coordinates
// ORDER: Start from Green's start position (index 0) and go clockwise.
// Green Start is at Row 7, Col 2 (1-based index: Row 7, Col 2) -> (6,1 in 0-based)
// Actually standard Ludo start is usually just outside the base.
// Based on LudoBoard.tsx visual layout:
// Green path moves right from (7,2) to (7,6), then up... wait.
// Let's standard Ludo path:
// 1. Start Green (6,1) -> Move Right to (6,5) -> Move Up to (5,6) -> Up to (0,6) -> Right to (0,8) -> Down to (5,8) -> Right to (6,10) -> Right to (6,14) -> Down to (8,14) -> Left to (8,10) -> Down to (14,10) -> Left to (14,8) -> Up to (9,8) -> Left to (8,6) -> Left to (8,0) -> Up to (6,0) -> Right to (6,1).

// Visual Grid is 1-based in CSS Grid.
export const MAIN_PATH_COORDS: GridPos[] = [
  // 0-4: Green Home Straight (horizontal right)
  { row: 7, col: 2 }, { row: 7, col: 3 }, { row: 7, col: 4 }, { row: 7, col: 5 }, { row: 7, col: 6 },
  // 5-10: Up towards Red Base
  { row: 6, col: 7 }, { row: 5, col: 7 }, { row: 4, col: 7 }, { row: 3, col: 7 }, { row: 2, col: 7 }, { row: 1, col: 7 },
  // 11-12: Top turn
  { row: 1, col: 8 }, { row: 1, col: 9 },
  // 13-17: Down past Red Base
  { row: 2, col: 9 }, { row: 3, col: 9 }, { row: 4, col: 9 }, { row: 5, col: 9 }, { row: 6, col: 9 },
  // 18-23: Right towards Blue Base
  { row: 7, col: 10 }, { row: 7, col: 11 }, { row: 7, col: 12 }, { row: 7, col: 13 }, { row: 7, col: 14 }, { row: 7, col: 15 },
  // 24-25: Right turn
  { row: 8, col: 15 }, { row: 9, col: 15 },
  // 26-30: Left towards center
  { row: 9, col: 14 }, { row: 9, col: 13 }, { row: 9, col: 12 }, { row: 9, col: 11 }, { row: 9, col: 10 },
  // 31-36: Down towards Yellow Base
  { row: 10, col: 9 }, { row: 11, col: 9 }, { row: 12, col: 9 }, { row: 13, col: 9 }, { row: 14, col: 9 }, { row: 15, col: 9 },
  // 37-38: Bottom turn
  { row: 15, col: 8 }, { row: 15, col: 7 },
  // 39-43: Up past Yellow Base
  { row: 14, col: 7 }, { row: 13, col: 7 }, { row: 12, col: 7 }, { row: 11, col: 7 }, { row: 10, col: 7 },
  // 44-49: Left towards Green Base
  { row: 9, col: 6 }, { row: 9, col: 5 }, { row: 9, col: 4 }, { row: 9, col: 3 }, { row: 9, col: 2 }, { row: 9, col: 1 },
  // 50-51: Left turn back to start area
  { row: 8, col: 1 }, { row: 7, col: 1 }
];

// Starting offset indices for each player in the main path array
// Green starts at index 0.
// Red starts at index 13.
// Blue starts at index 26.
// Yellow starts at index 39.
export const PATH_START_INDEX: Record<PlayerColor, number> = {
  [PlayerColor.GREEN]: 0,
  [PlayerColor.RED]: 13,
  [PlayerColor.BLUE]: 26,
  [PlayerColor.YELLOW]: 39
};

export const AD_IDS = {
  BANNER: "ca-app-pub-TEST/BANNER",
  INTERSTITIAL: "ca-app-pub-TEST/INTERSTITIAL"
};