# Agile Poker - Planning Poker & Project Triangle App

A responsive web application for agile software development teams featuring collaborative story pointing and project priority visualization.

## Features

### 🃏 Planning Poker (Story Pointing)

- **Room System**: Create or join rooms via unique room codes
- **Real-time Voting**: Fibonacci sequence cards (0, 0.5, 1, 2, 3, 5, 8, 13, 21, ?, ☕)
- **Story Labeling**: Admin can set story names/ticket numbers
- **Vote Revealing**: Admin controls when to reveal all votes
- **Consensus Display**: Shows most common vote and full distribution
- **History Tracking**: Bottom history bar shows all completed stories
- **Next Story Workflow**: Save results and reset for next story

### 📐 Project Management Triangle

- **Triangle Visualization**: Interactive equilateral triangle
- **Customizable Labels**: Rename corners (default: Fast, Quality, Cheap)
- **Selection Logic**: Choose 2 corners (can't have all 3!)
- **Visual Feedback**: Green for selected, Red for unselected
- **PNG Export**: Download triangle with your selection

### 👥 Persistent Sidebar (All Pages)

- **Participant List**: See all room members with avatars
- **Real-time Status**: Vote indicators and active status
- **Admin Badge**: Crown icon for room host
- **Room Code Display**: Easy copy-to-clipboard
- **Invite Function**: Share room link
- **Responsive Design**: Collapsible on mobile, fixed on desktop

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library
- **Image Export**: html2canvas

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd AgilePoker
   ```

2. Install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
cd client
npm run build
```

The built files will be in the `client/dist` directory.

### Running Tests

```bash
cd client

# Run tests in watch mode (development)
npm test

# Run tests once (CI/CD)
npm run test:run

# Run with UI interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

**Test Coverage:**
- ✅ 36 tests passing
- ✅ State management (Zustand store)
- ✅ Component rendering and behavior
- ✅ User interactions and workflows

See [TESTING.md](client/TESTING.md) for detailed testing guide.

## Usage

### Creating a Room

1. On the home page, click "Create Room"
2. Enter your name when prompted
3. You'll be assigned as the admin
4. Share the room code with your team

### Joining a Room

1. Get the room code from your team admin
2. Click "Join Room" and enter the code
3. Enter your name when prompted

### Planning Poker Session

1. **Admin**: Enter the story name/ticket number in the input field
2. **All participants**: Select your vote from the cards
3. **Admin**: Click "Reveal Votes" when everyone has voted
4. View consensus and vote distribution
5. **Admin**: Click "Next Story" to save and move on
6. Previous stories appear in the history bar at the bottom

### Project Triangle

1. Navigate to "Project Triangle" from the top menu
2. Customize corner labels if desired
3. Click on 2 corners to select your priorities
4. Export as PNG when ready

## Features in Detail

### Vote Status Indicators

- Checkmark (✓) next to participants who have voted
- Vote counter shows "X/Y voted"
- Visual dots showing voting progress

### History Bar

- Horizontal scrollable row at bottom
- Shows all completed stories
- Click any story card to see detailed breakdown
- Persists during room session

### Responsive Design

- **Desktop (>768px)**: Fixed sidebar, full layout
- **Mobile (<768px)**: Collapsible sidebar, optimized cards
- Touch-friendly button sizes (44x44px minimum)

## Current Implementation Notes

This version uses **client-side state management** with Zustand. For multi-user collaboration, you would need to:

1. Set up a WebSocket server (Socket.io recommended)
2. Implement real-time event broadcasting
3. Add room persistence (database or in-memory store)
4. Handle reconnection and presence detection

The current implementation is perfect for:
- Single-user planning and visualization
- Prototyping and design validation
- Local team sessions (share screen)

## Future Enhancements

### Phase 2
- Triangle voting mode
- Real-time multi-user sync via WebSocket
- Enhanced history with charts
- Export history as CSV/JSON

### Phase 3
- Custom triangle styling/colors
- Vote history analytics
- Admin transfer functionality
- Room persistence (24h)
- Password-protected rooms

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Sidebar, Layout)
│   │   ├── poker/           # Planning poker components
│   │   ├── triangle/        # Triangle components
│   │   └── common/          # Shared components
│   ├── pages/               # Main pages (Home, PlanningPoker, ProjectTriangle)
│   ├── stores/              # Zustand stores
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
└── index.html              # HTML entry point
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this for your team!
