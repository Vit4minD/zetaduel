# ZetaDuel - Multiplayer Arithmetic Arena

A fast-paced, real-time multiplayer web game that tests and improves mental math skills through direct competition. Built with Next.js and Socket.io.

## 🎯 Features

- **Real-time Multiplayer**: Compete against other players in live arithmetic battles
- **Fast-paced Gameplay**: 2-minute rounds with instant problem generation
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Auto-matching**: Quick-play system that matches you with opponents
- **Live Scoring**: See your opponent's score update in real-time
- **Multiple Operations**: Addition, subtraction, multiplication, and division

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zetaduel
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Backend:
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Frontend:
   ```bash
   cd frontend  
   cp env.local.example .env.local
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the frontend (http://localhost:3000) and backend (http://localhost:3001) servers concurrently.

### Alternative: Start servers separately

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 🎮 How to Play

1. **Join Queue**: Click "Quick Play" to enter the matchmaking queue
2. **Get Matched**: Wait to be paired with another player
3. **Solve Problems**: Answer arithmetic problems as quickly as possible
4. **Compete**: Race against your opponent for the highest score
5. **Win**: Player with the most correct answers after 2 minutes wins!

## 🏗️ Project Structure

```
zetaduel/
├── frontend/                 # Next.js React frontend
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts (Socket)
│   │   ├── hooks/           # Custom hooks (useGame)
│   │   └── ...
│   └── ...
├── backend/                  # Node.js Express backend
│   ├── src/
│   │   ├── index.ts         # Main server file
│   │   ├── gameManager.ts   # Game matchmaking logic
│   │   ├── game.ts          # Individual game logic
│   │   ├── problemGenerator.ts # Math problem generation
│   │   └── types.ts         # TypeScript type definitions
│   └── ...
└── package.json             # Root package.json with scripts
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **TypeScript** - Type safety for backend code

## 🎯 Game Mechanics

### Problem Generation
- **Addition**: Numbers 1-100
- **Subtraction**: Ensures positive results
- **Multiplication**: Numbers 2-25 for manageable results
- **Division**: Generated to ensure whole number answers

### Scoring System
- 1 point per correct answer
- No penalty for wrong answers
- 2-minute time limit per game
- Highest score wins

### Matchmaking
- Simple queue-based system
- First-come, first-served matching
- Automatic game cleanup on disconnect

## 🚧 Development

### Available Scripts

```bash
npm run dev          # Start both frontend and backend in development
npm run dev:frontend # Start only frontend
npm run dev:backend  # Start only backend
npm run install:all  # Install dependencies for all packages
npm run build        # Build frontend for production
npm run start        # Start backend in production mode
```

### Environment Variables

**Backend (.env)**
```
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

## 🎨 UI/UX Features

- **Gradient Backgrounds**: Beautiful blue-purple gradients
- **Real-time Feedback**: Visual feedback for correct/incorrect answers
- **Responsive Timer**: Color-coded timer that turns red in final 30 seconds
- **Connection Status**: Live connection indicator
- **Smooth Animations**: Hover effects and transitions
- **Auto-focus**: Input field automatically focused for quick typing

## 📋 Roadmap

### Phase 1 (MVP) ✅
- [x] Basic multiplayer functionality
- [x] Real-time problem solving
- [x] Score tracking and winner determination
- [x] Clean, responsive UI

### Phase 2 (Planned)
- [ ] User accounts and persistent stats
- [ ] Elo rating system
- [ ] Custom game settings (difficulty, operators)
- [ ] Battle royale mode (4+ players)

### Phase 3 (Future)
- [ ] Private rooms with shareable links
- [ ] Spectator mode
- [ ] Tournament system
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Inspired by Zetamac's arithmetic game
- Built with modern web technologies for real-time multiplayer gaming
- Designed for educational fun and mental math improvement

---

**Ready to test your mental math skills? Start playing ZetaDuel now!** 🧮⚡
