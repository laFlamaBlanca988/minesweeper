import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [GameModule, LeaderboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
