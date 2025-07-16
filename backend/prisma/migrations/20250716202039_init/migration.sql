-- CreateEnum
CREATE TYPE "GameState" AS ENUM ('PLAYING', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "board" JSONB NOT NULL,
    "gameState" "GameState" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leaderboard_entries" (
    "id" TEXT NOT NULL,
    "initials" VARCHAR(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "gameDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "leaderboard_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leaderboard_entries_gameId_key" ON "leaderboard_entries"("gameId");

-- CreateIndex
CREATE INDEX "leaderboard_entries_duration_idx" ON "leaderboard_entries"("duration");

-- AddForeignKey
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
