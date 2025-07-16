import React from "react";
import Cell from "./Cell";
import type { Cell as CellType } from "../types/game.types";

interface GameBoardProps {
  board: CellType[][];
  onReveal: (x: number, y: number) => void;
  onFlag: (x: number, y: number) => void;
  gameOver: boolean;
}

const GameBoard = ({ board, onReveal, onFlag, gameOver }: GameBoardProps) => {
  return (
    <div className="inline-block border-2 border-gray-600 bg-gray-200 p-2">
      <div className="grid grid-cols-16 gap-0">
        {board.map((row, y) =>
          row.map((cell, x) => (
            <Cell
              key={`${x}-${y}`}
              cell={cell}
              onReveal={onReveal}
              onFlag={onFlag}
              gameOver={gameOver}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default GameBoard;
