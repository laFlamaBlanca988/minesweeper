import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardEntry } from '../game/types/game.types';

interface AddScoreDto {
  gameId: string;
  initials: string;
  duration: number;
}

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getTopScores(
    @Query('limit') limit?: string,
  ): Promise<LeaderboardEntry[]> {
    try {
      const parsedLimit = limit ? parseInt(limit, 10) : 10;
      return await this.leaderboardService.getTopScores(parsedLimit);
    } catch {
      throw new HttpException(
        'Failed to fetch leaderboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async addScore(@Body() scoreData: AddScoreDto): Promise<LeaderboardEntry> {
    try {
      if (!scoreData.gameId || !scoreData.initials || !scoreData.duration) {
        throw new HttpException(
          'Missing required fields',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (scoreData.initials.length > 3) {
        throw new HttpException(
          'Initials must be 3 characters or less',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.leaderboardService.addScore(
        scoreData.gameId,
        scoreData.initials,
        scoreData.duration,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to add score',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('check-top-score')
  async checkTopScore(
    @Query('duration') duration: string,
  ): Promise<{ isTopScore: boolean }> {
    try {
      const parsedDuration = parseInt(duration, 10);
      if (isNaN(parsedDuration)) {
        throw new HttpException('Invalid duration', HttpStatus.BAD_REQUEST);
      }

      const isTopScore =
        await this.leaderboardService.isTopScore(parsedDuration);
      return { isTopScore };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to check top score',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
