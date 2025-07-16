export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export interface GameBoard {
  cells: Cell[][];
  width: number;
  height: number;
  mineCount: number;
}

export enum GameState {
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
}

export interface GameResponse {
  id: string;
  board: Cell[][];
  gameState: GameState;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  mineCount: number;
  flaggedCount: number;
  revealedCount: number;
}

export interface CellAction {
  x: number;
  y: number;
  action: 'reveal' | 'flag';
}

export interface LeaderboardEntry {
  id: string;
  initials: string;
  duration: number;
  gameDate: Date;
}
