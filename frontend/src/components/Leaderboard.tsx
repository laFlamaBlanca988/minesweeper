import React from "react";
import type { LeaderboardEntry } from "../types/game.types";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
}

const Leaderboard = ({ entries, isLoading }: LeaderboardProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">🏆 Leaderboard</h2>
      {entries.length === 0 ? (
        <div className="text-gray-500">No scores yet. Be the first to win!</div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-lg ${
                index === 0
                  ? "bg-yellow-100 border-2 border-yellow-400"
                  : index === 1
                  ? "bg-gray-100 border-2 border-gray-400"
                  : index === 2
                  ? "bg-orange-100 border-2 border-orange-400"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="font-bold text-lg">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `${index + 1}.`}
                </span>
                <span className="font-semibold">{entry.initials}</span>
              </div>
              <div className="text-right">
                <div className="font-mono text-lg font-bold">
                  {formatTime(entry.duration)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatDate(entry.gameDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
