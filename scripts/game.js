// Among Us 2D - Core Game Loop and State

import { Player } from './player.js';
import { Map } from './map.js';
import { TaskManager } from './tasks.js';
import { MeetingManager } from './meetings.js';

// Game states
const GameState = {
    LOBBY: 'lobby',
    PLAYING: 'playing',
    MEETING: 'meeting',
    GAME_OVER: 'gameOver'
};

// Game roles
const GameRole = {
    CREWMATE: 'crewmate',
    IMPOSTOR: 'impostor'
};

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.state = GameState.LOBBY;
        this.players = [];
        this.localPlayer = null;
        this.map = null;
        this.taskManager = null;
        this.meetingManager = null;
        this.lastFrameTime = 0;
        this.animationFrameId = null;
        
        // Game settings
        this.settings = {
            playerSpeed: 3,
            impostorRatio: 0.3, // 30% chance of being impostor
            maxPlayers: 10,
            minPlayers: 4,
            eliminationCooldown: 30, // seconds
            meetingCooldown: 15, // seconds
            votingTime: 45, // seconds
            numTasks: 5
        };
        
        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        // Input state
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            action: false
        };
    }
    
    async init() {
        // Set canvas size
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        
        // Initialize map
        this.map = new Map(this.canvas.width, this.canvas.height);
        await this.map.init();
        
        // Initialize task manager
        this.taskManager = new TaskManager(this.settings.numTasks);
        
        // Initialize meeting manager
        this.meetingManager = new MeetingManager();
        
        // Create local player
        this.localPlayer = new Player('Player 1', '#FF0000', true);
        this.players.push(this.localPlayer);
        
        // Create AI players
        const numAIPlayers = Math.max(this.settings.minPlayers - 1, 0);
        for (let i = 0; i < numAIPlayers; i++) {
            const aiPlayer = new Player(`AI Player ${i + 1}`, this.getRandomColor(), false);
            this.players.push(aiPlayer);
        }
        
        // Position players
        this.positionPlayers();
        
        // Assign roles
        this.assignRoles();
        
        // Set up event listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        
        // Initialize UI
        this.updateUI();
    }
    
    start() {
        this.state = GameState.PLAYING;
        this.lastFrameTime = performance.now();
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
    
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Remove event listeners
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }
    
    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;
        
        // Update game state
        this.update(deltaTime / 1000); // Convert to seconds
        
        // Render game
        this.render();
        
        // Request next frame
        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
    
    update(deltaTime) {
        switch (this.state) {
            case GameState.PLAYING:
                // Update players
                this.players.forEach(player => {
                    if (player === this.localPlayer) {
                        // Update local player based on input
                        const moveX = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);
                        const moveY = (this.keys.down ? 1 : 0) - (this.keys.up ? 1 : 0);
                        
                        if (moveX !== 0 || moveY !== 0) {
                            player.move(
                                moveX * this.settings.playerSpeed, 
                                moveY * this.settings.playerSpeed,
                                this.map,
                                deltaTime
                            );
                        }
                        
                        // Check for action key
                        if (this.keys.action) {
                            this.handleActionKey();
                            this.keys.action = false; // Reset action key
                        }
                    } else {
                        // Update AI players
                        player.updateAI(deltaTime, this.map, this.players);
                    }
                });
                
                // Check for game over conditions
                this.checkGameOver();
                break;
                
            case GameState.MEETING:
                // Update meeting timer
                this.meetingManager.update(deltaTime);
                
                // Check if meeting is over
                if (this.meetingManager.isComplete()) {
                    this.endMeeting();
                }
                break;
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        switch (this.state) {
            case GameState.PLAYING:
                // Render map
                this.map.render(this.ctx);
                
                // Render players
                this.players.forEach(player => {
                    player.render(this.ctx);
                });
                break;
                
            case GameState.MEETING:
                // Render meeting background
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Meeting UI is handled by HTML elements
                break;
                
            case GameState.GAME_OVER:
                // Render game over screen
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '36px Arial';
                this.ctx.textAlign = 'center';
                
                const winnerText = this.winner === GameRole.CREWMATE 
                    ? 'Crewmates Win!' 
                    : 'Impostors Win!';
                    
                this.ctx.fillText(winnerText, this.canvas.width / 2, this.canvas.height / 2);
                
                this.ctx.font = '24px Arial';
                this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 50);
                break;
        }
    }
    
    handleKeyDown(event) {
        switch (event.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.keys.up = true;
                break;
            case 's':
            case 'arrowdown':
                this.keys.down = true;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.left = true;
                break;
            case 'd':
            case 'arrowright':
                this.keys.right = true;
                break;
            case ' ':
            case 'e':
                this.keys.action = true;
                break;
            case 'r':
                if (this.state === GameState.GAME_OVER) {
                    this.restart();
                }
                break;
        }
    }
    
    handleKeyUp(event) {
        switch (event.key.toLowerCase()) {
            case 'w':
            case 'arrowup':
                this.keys.up = false;
                break;
            case 's':
            case 'arrowdown':
                this.keys.down = false;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.left = false;
                break;
            case 'd':
            case 'arrowright':
                this.keys.right = false;
                break;
        }
    }
    
    handleActionKey() {
        if (this.state !== GameState.PLAYING) return;
        
        const player = this.localPlayer;
        
        // Check if player can call a meeting
        if (player.canCallMeeting()) {
            this.startMeeting(player);
            return;
        }
        
        // Check if player is near a task
        const nearbyTask = this.taskManager.getNearbyTask(player.x, player.y);
        if (nearbyTask && !nearbyTask.completed) {
            this.taskManager.completeTask(nearbyTask.id);
            this.updateUI();
            return;
        }
        
        // Check if player is an impostor and can eliminate someone
        if (player.role === GameRole.IMPOSTOR && player.canEliminate()) {
            const target = this.findNearbyPlayer(player);
            if (target && target.role !== GameRole.IMPOSTOR && target.isAlive) {
                player.eliminate(target);
                this.checkGameOver();
                return;
            }
        }
    }
    
    findNearbyPlayer(player) {
        const eliminationRange = 50; // pixels
        
        return this.players.find(other => {
            if (other === player || !other.isAlive || other.role === GameRole.IMPOSTOR) {
                return false;
            }
            
            const dx = other.x - player.x;
            const dy = other.y - player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            return distance < eliminationRange;
        });
    }
    
    startMeeting(caller) {
        this.state = GameState.MEETING;
        this.meetingManager.startMeeting(caller, this.players);
        
        // Show meeting UI
        const meetingContainer = document.getElementById('meeting-container');
        meetingContainer.classList.remove('hidden');
    }
    
    endMeeting() {
        // Process votes
        const ejectedPlayer = this.meetingManager.getEjectedPlayer();
        if (ejectedPlayer) {
            ejectedPlayer.isAlive = false;
        }
        
        // Hide meeting UI
        const meetingContainer = document.getElementById('meeting-container');
        meetingContainer.classList.add('hidden');
        
        // Reset meeting manager
        this.meetingManager.reset();
        
        // Check game over conditions
        if (this.checkGameOver()) {
            return;
        }
        
        // Return to playing state
        this.state = GameState.PLAYING;
    }
    
    checkGameOver() {
        // Count alive impostors and crewmates
        let aliveImpostors = 0;
        let aliveCrewmates = 0;
        
        this.players.forEach(player => {
            if (player.isAlive) {
                if (player.role === GameRole.IMPOSTOR) {
                    aliveImpostors++;
                } else {
                    aliveCrewmates++;
                }
            }
        });
        
        // Check if all tasks are completed
        const allTasksCompleted = this.taskManager.areAllTasksCompleted();
        
        // Check win conditions
        if (aliveImpostors === 0 || allTasksCompleted) {
            // Crewmates win
            this.endGame(GameRole.CREWMATE);
            return true;
        } else if (aliveImpostors >= aliveCrewmates) {
            // Impostors win
            this.endGame(GameRole.IMPOSTOR);
            return true;
        }
        
        return false;
    }
    
    endGame(winner) {
        this.state = GameState.GAME_OVER;
        this.winner = winner;
    }
    
    restart() {
        // Reset players
        this.players.forEach(player => {
            player.reset();
        });
        
        // Reposition players
        this.positionPlayers();
        
        // Reassign roles
        this.assignRoles();
        
        // Reset task manager
        this.taskManager.reset();
        
        // Reset meeting manager
        this.meetingManager.reset();
        
        // Update UI
        this.updateUI();
        
        // Start game
        this.state = GameState.PLAYING;
    }
    
    positionPlayers() {
        // Position players randomly on the map
        this.players.forEach(player => {
            const spawnPoint = this.map.getRandomSpawnPoint();
            player.x = spawnPoint.x;
            player.y = spawnPoint.y;
        });
    }
    
    assignRoles() {
        // Shuffle players
        const shuffledPlayers = [...this.players].sort(() => Math.random() - 0.5);
        
        // Calculate number of impostors
        const numImpostors = Math.max(1, Math.floor(this.players.length * this.settings.impostorRatio));
        
        // Assign roles
        shuffledPlayers.forEach((player, index) => {
            if (index < numImpostors) {
                player.role = GameRole.IMPOSTOR;
            } else {
                player.role = GameRole.CREWMATE;
            }
        });
        
        // Update UI
        this.updateUI();
    }
    
    updateUI() {
        // Update role indicator
        const roleElement = document.getElementById('role');
        roleElement.textContent = this.localPlayer.role;
        roleElement.className = this.localPlayer.role.toLowerCase();
        
        // Update task list
        const tasksElement = document.getElementById('tasks');
        tasksElement.innerHTML = '';
        
        this.taskManager.tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.name;
            
            if (task.completed) {
                li.classList.add('completed');
            }
            
            tasksElement.appendChild(li);
        });
    }
    
    getRandomColor() {
        const colors = [
            '#FF0000', // Red
            '#00FF00', // Green
            '#0000FF', // Blue
            '#FFFF00', // Yellow
            '#FF00FF', // Magenta
            '#00FFFF', // Cyan
            '#FF8800', // Orange
            '#8800FF', // Purple
            '#FFFFFF', // White
            '#000000'  // Black
        ];
        
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
