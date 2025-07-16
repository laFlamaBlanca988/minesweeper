export interface Cell {
  x: number;
  y: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

export const GameState = {
  PLAYING: "PLAYING",
  WON: "WON",
  LOST: "LOST",
} as const;

export type GameState = (typeof GameState)[keyof typeof GameState];

export interface GameResponse {
  id: string;
  board: Cell[][];
  gameState: GameState;
  startTime: string;
  endTime?: string;
  duration?: number;
  mineCount: number;
  flaggedCount: number;
  revealedCount: number;
}

export interface CellAction {
  x: number;
  y: number;
  action: "reveal" | "flag";
}

export interface LeaderboardEntry {
  id: string;
  initials: string;
  duration: number;
  gameDate: string;
}

export interface AddScoreRequest {
  gameId: string;
  initials: string;
  duration: number;
}

export interface IsTopScoreResponse {
  isTopScore: boolean;
}
