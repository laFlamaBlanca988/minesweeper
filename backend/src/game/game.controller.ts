import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CellAction, GameResponse } from './types/game.types';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createNewGame(): Promise<GameResponse> {
    try {
      return await this.gameService.createNewGame();
    } catch {
      throw new HttpException(
        'Failed to create new game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getGame(@Param('id') gameId: string): Promise<GameResponse> {
    try {
      return await this.gameService.getGame(gameId);
    } catch {
      throw new HttpException('Game not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post(':id/action')
  async performAction(
    @Param('id') gameId: string,
    @Body() action: CellAction,
  ): Promise<GameResponse> {
    try {
      return await this.gameService.performAction(gameId, action);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Game not found') {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        if (error.message === 'Game is already finished') {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
      throw new HttpException(
        'Failed to perform action',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
