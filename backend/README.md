# Minesweeper Backend

A NestJS backend for the Minesweeper game with TypeScript, Prisma, and PostgreSQL.

## Features

- 16x16 Minesweeper game logic
- Game state management
- Leaderboard system
- RESTful API endpoints
- TypeScript throughout
- Prisma ORM for database operations

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up your environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```
DATABASE_URL="postgresql://username:password@localhost:5432/minesweeper_db?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Set up the database:

```bash
# Generate Prisma client
npx prisma generate

# Create database and run migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

## Running the Application

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

The server will run on `http://localhost:3001`

## API Endpoints

### Game Endpoints

- `POST /game` - Create a new game
- `GET /game/:id` - Get game state
- `POST /game/:id/action` - Perform game action (reveal/flag)

### Leaderboard Endpoints

- `GET /leaderboard` - Get top scores
- `POST /leaderboard` - Add new score
- `GET /leaderboard/check-top-score?duration=X` - Check if score qualifies for leaderboard

## Game Logic

- Fixed 16x16 board with 40 mines
- Standard minesweeper rules
- Win condition: Reveal all non-mine cells
- Lose condition: Reveal a mine
- Flagging system for marking suspected mines

## Database Schema

### Game Table

- `id` - Unique game identifier
- `board` - JSON representation of game board
- `gameState` - Current game state (PLAYING, WON, LOST)
- `startTime` - Game start timestamp
- `endTime` - Game end timestamp (if finished)
- `duration` - Game duration in seconds

### LeaderboardEntry Table

- `id` - Unique entry identifier
- `initials` - Player initials (max 3 characters)
- `duration` - Completion time in seconds
- `gameDate` - Date of the game
- `gameId` - Reference to the game

## Development Notes

This project was developed using LLM assistance as specified in the technical requirements.

### Recent Improvements

- Fixed eslint error for floating promises in `main.ts`
- Added proper error handling in bootstrap function
- All linting and build checks passing
- Code follows TypeScript best practices
