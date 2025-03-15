// Among Us 2D - Meeting and Voting System

export class MeetingManager {
    constructor() {
        this.isActive = false;
        this.caller = null;
        this.players = [];
        this.votes = new Map();
        this.timer = 0;
        this.votingTime = 45; // seconds
        
        // Bind event handlers
        this.handleVote = this.handleVote.bind(this);
        this.handleSkipVote = this.handleSkipVote.bind(this);
    }
    
    startMeeting(caller, players) {
        this.isActive = true;
        this.caller = caller;
        this.players = players.filter(player => player.isAlive);
        this.votes = new Map();
        this.timer = this.votingTime;
        
        // Set up voting UI
        this.setupVotingUI();
        
        // Add event listeners
        document.getElementById('skip-vote').addEventListener('click', this.handleSkipVote);
    }
    
    setupVotingUI() {
        const votingArea = document.getElementById('voting-area');
        votingArea.innerHTML = '';
        
        // Create player vote buttons
        this.players.forEach(player => {
            const playerVote = document.createElement('div');
            playerVote.className = 'player-vote';
            playerVote.style.backgroundColor = player.color;
            playerVote.textContent = player.name;
            playerVote.dataset.playerId = this.players.indexOf(player);
            
            playerVote.addEventListener('click', () => this.handleVote(player));
            
            votingArea.appendChild(playerVote);
        });
    }
    
    handleVote(votedPlayer) {
        // Get local player
        const localPlayer = this.players.find(p => p.isLocal);
        
        if (!localPlayer) return;
        
        // Record vote
        this.votes.set(localPlayer, votedPlayer);
        
        // Update UI
        this.updateVotingUI();
        
        // Simulate AI votes
        this.simulateAIVotes();
    }
    
    handleSkipVote() {
        // Get local player
        const localPlayer = this.players.find(p => p.isLocal);
        
        if (!localPlayer) return;
        
        // Record skip vote
        this.votes.set(localPlayer, null);
        
        // Update UI
        this.updateVotingUI();
        
        // Simulate AI votes
        this.simulateAIVotes();
    }
    
    updateVotingUI() {
        // Clear selected state
        const playerVotes = document.querySelectorAll('.player-vote');
        playerVotes.forEach(el => el.classList.remove('selected'));
        
        // Get local player
        const localPlayer = this.players.find(p => p.isLocal);
        
        if (!localPlayer) return;
        
        // Get voted player
        const votedPlayer = this.votes.get(localPlayer);
        
        if (votedPlayer) {
            // Find and highlight voted player
            const votedPlayerIndex = this.players.indexOf(votedPlayer);
            const votedPlayerElement = document.querySelector(`.player-vote[data-player-id="${votedPlayerIndex}"]`);
            
            if (votedPlayerElement) {
                votedPlayerElement.classList.add('selected');
            }
        }
    }
    
    simulateAIVotes() {
        // Simulate AI players voting
        this.players.forEach(player => {
            if (!player.isLocal && !this.votes.has(player)) {
                // 20% chance to skip vote
                if (Math.random() < 0.2) {
                    this.votes.set(player, null);
                } else {
                    // Vote for a random player
                    const validTargets = this.players.filter(p => p !== player);
                    const randomTarget = validTargets[Math.floor(Math.random() * validTargets.length)];
                    this.votes.set(player, randomTarget);
                }
            }
        });
    }
    
    update(deltaTime) {
        if (!this.isActive) return;
        
        // Update timer
        this.timer -= deltaTime;
        
        // Check if all players have voted
        const allVoted = this.players.every(player => this.votes.has(player));
        
        // End meeting if timer expires or all players have voted
        if (this.timer <= 0 || allVoted) {
            this.timer = 0;
        }
    }
    
    isComplete() {
        return this.isActive && this.timer <= 0;
    }
    
    getEjectedPlayer() {
        // Count votes
        const voteCounts = new Map();
        let skipVotes = 0;
        
        this.votes.forEach((votedPlayer, voter) => {
            if (votedPlayer === null) {
                skipVotes++;
            } else {
                const currentCount = voteCounts.get(votedPlayer) || 0;
                voteCounts.set(votedPlayer, currentCount + 1);
            }
        });
        
        // Find player with most votes
        let maxVotes = 0;
        let ejectedPlayer = null;
        let tie = false;
        
        voteCounts.forEach((count, player) => {
            if (count > maxVotes) {
                maxVotes = count;
                ejectedPlayer = player;
                tie = false;
            } else if (count === maxVotes) {
                tie = true;
            }
        });
        
        // If tie or skip votes are highest, no one is ejected
        if (tie || skipVotes >= maxVotes) {
            return null;
        }
        
        return ejectedPlayer;
    }
    
    reset() {
        this.isActive = false;
        this.caller = null;
        this.players = [];
        this.votes = new Map();
        this.timer = 0;
        
        // Remove event listeners
        const skipVoteButton = document.getElementById('skip-vote');
        if (skipVoteButton) {
            skipVoteButton.removeEventListener('click', this.handleSkipVote);
        }
        
        const playerVotes = document.querySelectorAll('.player-vote');
        playerVotes.forEach(el => {
            const clonedEl = el.cloneNode(true);
            el.parentNode.replaceChild(clonedEl, el);
        });
    }
}
