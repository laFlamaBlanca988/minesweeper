import axios from "axios";
import type {
  GameResponse,
  CellAction,
  LeaderboardEntry,
  AddScoreRequest,
  IsTopScoreResponse,
} from "../types/game.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const gameApi = {
  // Create a new game
  createGame: async (): Promise<GameResponse> => {
    const response = await api.post<GameResponse>("/game");
    return response.data;
  },

  // Get game state
  getGame: async (gameId: string): Promise<GameResponse> => {
    const response = await api.get<GameResponse>(`/game/${gameId}`);
    return response.data;
  },

  // Perform game action
  performAction: async (
    gameId: string,
    action: CellAction
  ): Promise<GameResponse> => {
    const response = await api.post<GameResponse>(
      `/game/${gameId}/action`,
      action
    );
    return response.data;
  },
};

export const leaderboardApi = {
  // Get top scores
  getTopScores: async (): Promise<LeaderboardEntry[]> => {
    const response = await api.get<LeaderboardEntry[]>("/leaderboard");
    return response.data;
  },

  // Add new score
  addScore: async (score: AddScoreRequest): Promise<LeaderboardEntry> => {
    const response = await api.post<LeaderboardEntry>("/leaderboard", score);
    return response.data;
  },

  // Check if score is top score
  isTopScore: async (duration: number): Promise<IsTopScoreResponse> => {
    const response = await api.get<IsTopScoreResponse>(
      `/leaderboard/check-top-score?duration=${duration}`
    );
    return response.data;
  },
};
