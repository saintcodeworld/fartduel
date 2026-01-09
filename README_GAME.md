# Number Guessing Challenge - Solana Blockchain Game

A fully on-chain competitive number guessing game built with the Bolt framework on Solana.

## 🎮 Game Overview

**Number Guessing Challenge** is a head-to-head competitive game where two players compete to guess the number closest to a randomly generated target. The winner takes 98% of the prize pool, with 2% going to the platform.

### Core Mechanics

- **Players**: 2 players per game
- **Entry Fee**: 0.015 - 100 SOL (configurable)
- **Number Range**: 1-100
- **Selection Time**: 25 seconds
- **Winner Determination**: Closest number to random target
- **Prize Distribution**: 98% winner, 2% platform

### Game Flow

1. Player 1 creates a game (public or private)
2. Player 2 joins the game
3. Both players select their numbers (1-100) within 25 seconds
4. Players pay entry fees (held in escrow)
5. Random target number is revealed
6. Winner is determined by closest distance
7. Prize automatically distributed to winner

### Special Features

- **Tie Handling**: Automatic rematch with 10-second delay
- **Hidden Numbers**: Selections remain hidden until game completion
- **Game Modes**: Public matchmaking or private invite codes
- **On-Chain Randomness**: Fair and verifiable random number generation

## 🏗️ Architecture

### Smart Contracts (Rust + Bolt)

#### Components

1. **GameSession Component** (`examples/component-game-session`)
   - Game state management
   - Entry fees and prize pool
   - Random target number (hidden)
   - Game status and timing
   - Game mode (public/private)

2. **PlayerState Component** (`examples/component-player-state`)
   - Player selections
   - Payment status
   - Distance calculations
   - Winner status

#### Systems

1. **Create Game System** (`examples/system-create-game`)
   - Initialize new game session
   - Generate random target number
   - Set entry fee and game mode
   - Validate fee range (0.015-100 SOL)

2. **Join Game System** (`examples/system-join-game`)
   - Player 2 joins game
   - Validate invite codes for private games
   - Check game availability

3. **Select Number System** (`examples/system-select-number`)
   - Record player number selection
   - Handle entry fee payment
   - Validate selection within time limit
   - Update prize pool

4. **Reveal Winner System** (`examples/system-reveal-winner`)
   - Calculate distances from target
   - Determine winner
   - Distribute prizes (98% winner, 2% platform)
   - Handle tie scenarios

### Web Frontend (Next.js + TypeScript)

- **Modern UI**: Built with React, TailwindCSS, and Lucide icons
- **Wallet Integration**: Solana Wallet Adapter (Phantom, Solflare)
- **Real-time Updates**: Live game state and timer
- **Responsive Design**: Works on desktop and mobile

## 🚀 Getting Started

### Prerequisites

- Rust (latest stable)
- Solana CLI
- Anchor Framework
- Node.js 18+
- Bolt CLI

### Installation

1. **Install Bolt CLI**
```bash
cargo install bolt-cli
```

2. **Build Smart Contracts**
```bash
cd /Users/saintcodeworld/Downloads/bolt-main
anchor build
```

3. **Deploy to Localnet**
```bash
anchor test
```

4. **Install Web Dependencies**
```bash
cd number-guessing-game-web
npm install
```

5. **Run Web App**
```bash
npm run dev
```

## 📁 Project Structure

```
bolt-main/
├── examples/
│   ├── component-game-session/      # Game session component
│   ├── component-player-state/      # Player state component
│   ├── system-create-game/          # Game creation system
│   ├── system-join-game/            # Join game system
│   ├── system-select-number/        # Number selection system
│   └── system-reveal-winner/        # Winner reveal system
├── number-guessing-game-web/        # Web frontend
│   ├── app/                         # Next.js pages
│   ├── components/                  # React components
│   └── package.json
├── Anchor.toml                      # Anchor configuration
└── Cargo.toml                       # Rust workspace
```

## 🔧 Configuration

### Smart Contract Program IDs

```toml
[programs.localnet]
game-session = "GaMeSession11111111111111111111111111111111"
player-state = "PLaYerState11111111111111111111111111111111"
system-create-game = "CrEateGame111111111111111111111111111111111"
system-join-game = "JoInGame11111111111111111111111111111111111"
system-select-number = "SeLectNumber1111111111111111111111111111111"
system-reveal-winner = "ReVealWinner111111111111111111111111111111"
```

## 🎯 Game Rules

### Entry Fee Validation
- Minimum: 0.015 SOL (15,000,000 lamports)
- Maximum: 100 SOL (100,000,000,000 lamports)

### Number Selection
- Range: 1-100 (inclusive)
- Time limit: 25 seconds
- Hidden until game completion

### Winner Determination
- Distance calculation: `|selected_number - target_number|`
- Closest number wins
- Tie: Both players have equal distance

### Prize Distribution
- Winner: 98% of total prize pool
- Platform: 2% of total prize pool
- Automatic distribution via smart contract

## 🔐 Security Features

- **Escrow System**: Entry fees held securely on-chain
- **Verifiable Randomness**: On-chain random number generation
- **Immutable Logic**: Game rules enforced by smart contracts
- **Transparent Results**: All game data visible on blockchain

## 🧪 Testing

```bash
# Test smart contracts
anchor test

# Test individual systems
anchor test --skip-deploy
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please follow the Bolt framework guidelines.

## 📞 Support

For issues or questions:
- GitHub Issues: [bolt repository]
- Discord: [Bolt community]
- Documentation: https://book.boltengine.gg
