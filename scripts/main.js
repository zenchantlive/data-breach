// Among Us 2D - Main Entry Point

import { Game } from './game.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Among Us 2D - Initializing game...');
    
    // Initialize the game
    const gameCanvas = document.getElementById('game-canvas');
    const game = new Game(gameCanvas);
    
    // Start the game
    game.init()
        .then(() => {
            console.log('Game initialized successfully');
            game.start();
        })
        .catch(error => {
            console.error('Failed to initialize game:', error);
        });
});
