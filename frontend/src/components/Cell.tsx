import React from "react";
import type { Cell as CellType } from "../types/game.types";

interface CellProps {
  cell: CellType;
  onReveal: (x: number, y: number) => void;
  onFlag: (x: number, y: number) => void;
  gameOver: boolean;
}

const Cell = ({ cell, onReveal, onFlag, gameOver }: CellProps) => {
  const handleLeftClick = () => {
    if (!gameOver && !cell.isRevealed && !cell.isFlagged) {
      onReveal(cell.x, cell.y);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!gameOver && !cell.isRevealed) {
      onFlag(cell.x, cell.y);
    }
  };

  const getCellContent = () => {
    if (cell.isFlagged) {
      return "🚩";
    }
    if (!cell.isRevealed) {
      return "";
    }
    if (cell.isMine) {
      return "💣";
    }
    if (cell.neighborMines > 0) {
      return cell.neighborMines.toString();
    }
    return "";
  };

  const getCellClasses = () => {
    const baseClasses =
      "w-6 h-6 text-xs font-bold border border-gray-400 flex items-center justify-center cursor-pointer select-none";

    if (!cell.isRevealed) {
      return `${baseClasses} bg-gray-300 hover:bg-gray-200`;
    }

    if (cell.isMine) {
      return `${baseClasses} bg-red-500 text-white`;
    }

    const numberColors = {
      1: "text-blue-600",
      2: "text-green-600",
      3: "text-red-600",
      4: "text-purple-600",
      5: "text-yellow-600",
      6: "text-pink-600",
      7: "text-black",
      8: "text-gray-600",
    };

    const colorClass =
      numberColors[cell.neighborMines as keyof typeof numberColors] || "";
    return `${baseClasses} bg-gray-100 ${colorClass}`;
  };

  return (
    <div
      className={getCellClasses()}
      onClick={handleLeftClick}
      onContextMenu={handleRightClick}
    >
      {getCellContent()}
    </div>
  );
};

export default Cell;
