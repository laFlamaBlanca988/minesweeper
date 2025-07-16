import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Cell,
  GameBoard,
  GameState,
  GameResponse,
  CellAction,
} from './types/game.types';
import { GameState as PrismaGameState, Game } from '@prisma/client';

@Injectable()
export class GameService {
  private readonly BOARD_SIZE = 16;
  private readonly MINE_COUNT = 1;

  constructor(private prisma: PrismaService) {}

  async createNewGame(): Promise<GameResponse> {
    const board = this.generateBoard();

    const game = await this.prisma.game.create({
      data: {
        board: JSON.stringify(board.cells),
        gameState: PrismaGameState.PLAYING,
      },
    });

    return this.formatGameResponse(game, board.cells);
  }

  async getGame(gameId: string): Promise<GameResponse> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new Error('Game not found');
    }

    const board = JSON.parse(game.board as string) as Cell[][];
    return this.formatGameResponse(game, board);
  }

  async performAction(
    gameId: string,
    action: CellAction,
  ): Promise<GameResponse> {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.gameState !== PrismaGameState.PLAYING) {
      throw new Error('Game is already finished');
    }

    const board = JSON.parse(game.board as string) as Cell[][];
    let newGameState: PrismaGameState = PrismaGameState.PLAYING;
    let endTime: Date | undefined;
    let duration: number | undefined;

    if (action.action === 'reveal') {
      const result = this.revealCell(board, action.x, action.y);
      if (result.gameState !== GameState.PLAYING) {
        newGameState =
          result.gameState === GameState.WON
            ? PrismaGameState.WON
            : PrismaGameState.LOST;
        endTime = new Date();
        duration = Math.floor(
          (endTime.getTime() - game.startTime.getTime()) / 1000,
        );
      }
    } else if (action.action === 'flag') {
      this.toggleFlag(board, action.x, action.y);
    }

    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        board: JSON.stringify(board),
        gameState: newGameState,
        endTime,
        duration,
      },
    });

    return this.formatGameResponse(updatedGame, board);
  }

  private generateBoard(): GameBoard {
    const cells: Cell[][] = [];

    // Initialize empty board
    for (let y = 0; y < this.BOARD_SIZE; y++) {
      cells[y] = [];
      for (let x = 0; x < this.BOARD_SIZE; x++) {
        cells[y][x] = {
          x,
          y,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < this.MINE_COUNT) {
      const x = Math.floor(Math.random() * this.BOARD_SIZE);
      const y = Math.floor(Math.random() * this.BOARD_SIZE);

      if (!cells[y][x].isMine) {
        cells[y][x].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mine counts
    for (let y = 0; y < this.BOARD_SIZE; y++) {
      for (let x = 0; x < this.BOARD_SIZE; x++) {
        if (!cells[y][x].isMine) {
          cells[y][x].neighborMines = this.countNeighborMines(cells, x, y);
        }
      }
    }

    return {
      cells,
      width: this.BOARD_SIZE,
      height: this.BOARD_SIZE,
      mineCount: this.MINE_COUNT,
    };
  }

  private countNeighborMines(cells: Cell[][], x: number, y: number): number {
    let count = 0;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const nx = x + dx;
        const ny = y + dy;

        if (
          nx >= 0 &&
          nx < this.BOARD_SIZE &&
          ny >= 0 &&
          ny < this.BOARD_SIZE
        ) {
          if (cells[ny][nx].isMine) {
            count++;
          }
        }
      }
    }

    return count;
  }

  private revealCell(
    board: Cell[][],
    x: number,
    y: number,
  ): { gameState: GameState } {
    if (x < 0 || x >= this.BOARD_SIZE || y < 0 || y >= this.BOARD_SIZE) {
      return { gameState: GameState.PLAYING };
    }

    const cell = board[y][x];

    if (cell.isRevealed || cell.isFlagged) {
      return { gameState: GameState.PLAYING };
    }

    cell.isRevealed = true;

    // If it's a mine, game over
    if (cell.isMine) {
      // Reveal all mines
      for (const row of board) {
        for (const c of row) {
          if (c.isMine) {
            c.isRevealed = true;
          }
        }
      }
      return { gameState: GameState.LOST };
    }

    // If it's an empty cell (no neighboring mines), reveal neighbors
    if (cell.neighborMines === 0) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          this.revealCell(board, x + dx, y + dy);
        }
      }
    }

    // Check for win condition
    if (this.checkWinCondition(board)) {
      return { gameState: GameState.WON };
    }

    return { gameState: GameState.PLAYING };
  }

  private toggleFlag(board: Cell[][], x: number, y: number): void {
    if (x < 0 || x >= this.BOARD_SIZE || y < 0 || y >= this.BOARD_SIZE) {
      return;
    }

    const cell = board[y][x];

    if (!cell.isRevealed) {
      cell.isFlagged = !cell.isFlagged;
    }
  }

  private checkWinCondition(board: Cell[][]): boolean {
    for (const row of board) {
      for (const cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  }

  private formatGameResponse(game: Game, board: Cell[][]): GameResponse {
    const flaggedCount = board.flat().filter((cell) => cell.isFlagged).length;
    const revealedCount = board.flat().filter((cell) => cell.isRevealed).length;

    return {
      id: game.id,
      board,
      gameState: game.gameState as GameState,
      startTime: game.startTime,
      endTime: game.endTime || undefined,
      duration: game.duration || undefined,
      mineCount: this.MINE_COUNT,
      flaggedCount,
      revealedCount,
    };
  }
}
