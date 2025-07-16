import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GameState } from "./types/game.types";
import { gameApi, leaderboardApi } from "./services/api";
import GameBoard from "./components/GameBoard";
import Leaderboard from "./components/Leaderboard";
import ScoreModal from "./components/ScoreModal";
import type { GameResponse } from "./types/game.types";

function App() {
  const [currentGame, setCurrentGame] = useState<GameResponse | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isGameActive, setIsGameActive] = useState(false);
  const queryClient = useQueryClient();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isGameActive && currentGame?.gameState === GameState.PLAYING) {
      interval = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, currentGame?.gameState]);

  // Fetch leaderboard
  const { data: leaderboard = [], isLoading: isLoadingLeaderboard } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: leaderboardApi.getTopScores,
  });

  // Create new game mutation
  const createGameMutation = useMutation({
    mutationFn: gameApi.createGame,
    onSuccess: (data) => {
      setCurrentGame(data);
      setGameTime(0);
      setIsGameActive(true);
      setShowScoreModal(false);
    },
  });

  // Perform game action mutation
  const performActionMutation = useMutation({
    mutationFn: ({
      gameId,
      action,
    }: {
      gameId: string;
      action: { x: number; y: number; action: "reveal" | "flag" };
    }) => gameApi.performAction(gameId, action),
    onSuccess: async (data) => {
      setCurrentGame(data);

      if (data.gameState === GameState.WON) {
        setIsGameActive(false);
        const finalTime = data.duration || gameTime;
        setGameTime(finalTime);

        // Check if score qualifies for leaderboard
        const isTopScoreResult = await leaderboardApi.isTopScore(finalTime);
        if (isTopScoreResult.isTopScore) {
          setShowScoreModal(true);
        }
      } else if (data.gameState === GameState.LOST) {
        setIsGameActive(false);
      }
    },
  });

  // Add score mutation
  const addScoreMutation = useMutation({
    mutationFn: leaderboardApi.addScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      setShowScoreModal(false);
    },
  });

  const handleNewGame = () => {
    createGameMutation.mutate();
  };

  const handleCellReveal = (x: number, y: number) => {
    if (currentGame && currentGame.gameState === GameState.PLAYING) {
      performActionMutation.mutate({
        gameId: currentGame.id,
        action: { x, y, action: "reveal" },
      });
    }
  };

  const handleCellFlag = (x: number, y: number) => {
    if (currentGame && currentGame.gameState === GameState.PLAYING) {
      performActionMutation.mutate({
        gameId: currentGame.id,
        action: { x, y, action: "flag" },
      });
    }
  };

  const handleScoreSubmit = (initials: string) => {
    if (currentGame) {
      addScoreMutation.mutate({
        gameId: currentGame.id,
        initials,
        duration: gameTime,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getGameStatusMessage = () => {
    if (!currentGame) return "Ready to play!";

    switch (currentGame.gameState) {
      case GameState.PLAYING:
        return "Good luck! 🎯";
      case GameState.WON:
        return "🎉 You won! Congratulations!";
      case GameState.LOST:
        return "💥 Game over! Better luck next time!";
      default:
        return "";
    }
  };

  const getGameStatusColor = () => {
    if (!currentGame) return "text-gray-600";

    switch (currentGame.gameState) {
      case GameState.PLAYING:
        return "text-blue-600";
      case GameState.WON:
        return "text-green-600";
      case GameState.LOST:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💣 Minesweeper
          </h1>
          <p className="text-gray-600">
            Find all mines in this 16x16 grid. Left click to reveal, right click
            to flag.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Section */}
          <div className="flex flex-col items-center">
            {/* Game Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 min-w-[400px]">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold">
                    {formatTime(gameTime)}
                  </div>
                  <div className="text-sm text-gray-500">Time</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-lg font-semibold ${getGameStatusColor()}`}
                  >
                    {getGameStatusMessage()}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-mono font-bold">
                    {currentGame
                      ? currentGame.mineCount - currentGame.flaggedCount
                      : 40}
                  </div>
                  <div className="text-sm text-gray-500">Mines</div>
                </div>
              </div>

              <button
                onClick={handleNewGame}
                disabled={createGameMutation.isPending}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                {createGameMutation.isPending ? "Starting..." : "New Game"}
              </button>
            </div>

            {/* Game Board */}
            {currentGame && (
              <GameBoard
                board={currentGame.board}
                onReveal={handleCellReveal}
                onFlag={handleCellFlag}
                gameOver={currentGame.gameState !== GameState.PLAYING}
              />
            )}
          </div>

          {/* Leaderboard */}
          <div className="min-w-[300px]">
            <Leaderboard
              entries={leaderboard}
              isLoading={isLoadingLeaderboard}
            />
          </div>
        </div>

        {/* Score Modal */}
        <ScoreModal
          isOpen={showScoreModal}
          gameTime={gameTime}
          onSubmit={handleScoreSubmit}
          onClose={() => setShowScoreModal(false)}
          isSubmitting={addScoreMutation.isPending}
        />
      </div>
    </div>
  );
}

export default App;
