import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeaderboardEntry } from '../game/types/game.types';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  async getTopScores(limit: number = 10): Promise<LeaderboardEntry[]> {
    const entries = await this.prisma.leaderboardEntry.findMany({
      orderBy: {
        duration: 'asc',
      },
      take: limit,
    });

    return entries.map((entry) => ({
      id: entry.id,
      initials: entry.initials,
      duration: entry.duration,
      gameDate: entry.gameDate,
    }));
  }

  async addScore(
    gameId: string,
    initials: string,
    duration: number,
  ): Promise<LeaderboardEntry> {
    const entry = await this.prisma.leaderboardEntry.create({
      data: {
        initials: initials.toUpperCase().substring(0, 3),
        duration,
        gameDate: new Date(),
        gameId,
      },
    });

    return {
      id: entry.id,
      initials: entry.initials,
      duration: entry.duration,
      gameDate: entry.gameDate,
    };
  }

  async isTopScore(duration: number): Promise<boolean> {
    const count = await this.prisma.leaderboardEntry.count({
      where: {
        duration: {
          lt: duration,
        },
      },
    });

    // Check if this score would be in top 10
    return count < 10;
  }
}
