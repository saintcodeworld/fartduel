# FARTDUEL - Terminal Duel Game

> Enter the terminal. Duel with numbers. Winner takes all.

A competitive multiplayer number guessing game built on Solana blockchain using the Bolt framework, featuring a retro terminal aesthetic.

## Features

- **Terminal Interface**: Authentic retro terminal theme with green monospace text and CRT effects
- **Head-to-Head Duels**: 2 players compete to guess closest to a random number
- **Solana Integration**: Secure on-chain game logic and prize distribution
- **Entry Fees**: Flexible entry fees from 0.015 to 100 SOL
- **Winner Takes All**: Winner receives 98% of prize pool, 2% platform fee
- **Game Modes**: Public matchmaking and private invite codes
- **25-Second Timer**: Fast-paced number selection
- **Tie Handling**: Automatic rematch system

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: TailwindCSS with custom terminal theme
- **Font**: Space Mono (monospace)
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Icons**: Lucide React
- **Game Framework**: Bolt SDK

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Solana wallet (Phantom or Solflare)

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the game.

### Build for Production

```bash
npm run build
npm start
```

## How to Play

1. **Connect Wallet**: Click "Connect Wallet" and select your Solana wallet
2. **Create or Join Duel**: 
   - Create a new duel session with your desired entry fee
   - Choose public or private mode
   - Or join an existing public session
3. **Select Number**: Pick a number between 1-100 within 25 seconds
4. **Pay Entry Fee**: Confirm transaction to pay entry fee
5. **Winner Revealed**: System reveals random target number and determines winner
6. **Prize Distribution**: Winner automatically receives 98% of prize pool

## Game Rules

- Numbers must be between 1 and 100
- Winner is determined by closest distance to random target
- In case of tie, automatic rematch with 10-second delay
- Selected numbers are hidden until game completion
- 25-second selection window per game

## Smart Contract Integration

The frontend connects to Bolt smart contracts that handle:
- Game session management
- Player state tracking
- Random number generation
- Prize pool escrow
- Winner calculation and distribution

## Development

### Project Structure

```
fartduel/
├── app/                    # Next.js app directory
│   ├── globals.css        # Terminal theme styles
│   ├── layout.tsx         # Root layout with Space Mono font
│   └── page.tsx           # Home page with terminal UI
├── components/            # React components
│   ├── WalletProvider.tsx # Solana wallet integration
│   ├── GameLobby.tsx      # Duel creation and lobby
│   └── ActiveGame.tsx     # Active duel interface
├── lib/                   # Utility functions
├── utils/                 # Helper utilities
└── public/               # Static assets
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

## License

MIT
