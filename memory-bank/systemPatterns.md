# System Patterns - Among Us 2D Recreation

## Architecture Overview
The Among Us 2D recreation will follow a client-side architecture for the MVP, with the potential to add server-side components in future iterations. The system will be structured using the following patterns:

### Core Architecture Patterns
1. **Module Pattern**
   - Separate game functionality into distinct modules
   - Use ES6 modules for code organization
   - Maintain clear separation of concerns

2. **Game Loop Pattern**
   - Implement a standard game loop (update, render)
   - Handle input, update game state, and render at appropriate intervals
   - Use requestAnimationFrame for smooth animation

3. **State Management**
   - Centralized game state object
   - State transitions for different game phases (lobby, gameplay, meetings)
   - Event-driven updates to maintain consistency

## Key Components

### Rendering System
- Canvas-based 2D rendering
- Layered approach (background, game objects, UI)
- Sprite-based character and environment rendering

### Input Handling
- Keyboard controls for movement (WASD/arrow keys)
- Mouse interaction for tasks and meetings
- Touch support planned for future iterations

### Game Mechanics
- **Player System**
  - Player state management
  - Role-specific abilities
  - Collision detection

- **Task System**
  - Task assignment and tracking
  - Mini-game implementation
  - Progress monitoring

- **Meeting System**
  - Voting mechanism
  - Timer management
  - Results calculation

## Technical Decisions

### Client-Side Focus
For the MVP, all game logic will run client-side to simplify development. This means:
- Single-player mode with AI opponents initially
- Local multiplayer as a stretch goal
- Full multiplayer requiring server implementation post-MVP

### Vanilla JavaScript Approach
- Minimize dependencies for the MVP
- Focus on core JavaScript capabilities
- Consider frameworks for future iterations if needed

### Asset Management
- Simple sprite system for characters
- Minimal animations initially
- Placeholder assets during development

## Code Organization
```
/
├── index.html          # Main entry point
├── styles/             # CSS files
│   └── main.css        # Main stylesheet
├── scripts/            # JavaScript files
│   ├── main.js         # Application entry point
│   ├── game.js         # Core game loop and state
│   ├── player.js       # Player functionality
│   ├── map.js          # Map rendering and collision
│   ├── tasks.js        # Task implementation
│   └── meetings.js     # Meeting and voting system
└── assets/             # Game assets
    ├── sprites/        # Character and object sprites
    └── maps/           # Map layouts
```

## Future Considerations
- Transition to client-server architecture for multiplayer
- Potential use of WebSockets for real-time communication
- Database integration for persistent game data
- Responsive design for mobile support
