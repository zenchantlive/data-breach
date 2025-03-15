// Among Us 2D - Player Functionality

// Game roles (must match those in game.js)
const GameRole = {
    CREWMATE: 'crewmate',
    IMPOSTOR: 'impostor'
};

export class Player {
    constructor(name, color, isLocal) {
        this.name = name;
        this.color = color;
        this.isLocal = isLocal;
        this.x = 0;
        this.y = 0;
        this.radius = 20;
        this.speed = 3;
        this.role = GameRole.CREWMATE; // Default role
        this.isAlive = true;
        
        // Cooldown timers
        this.eliminationCooldown = 0;
        this.meetingCooldown = 0;
        
        // AI movement
        this.aiTargetX = 0;
        this.aiTargetY = 0;
        this.aiWanderTimer = 0;
    }
    
    move(dx, dy, map, deltaTime) {
        if (!this.isAlive) return;
        
        // Normalize diagonal movement
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx = dx / length * this.speed;
            dy = dy / length * this.speed;
        }
        
        // Calculate new position
        const newX = this.x + dx;
        const newY = this.y + dy;
        
        // Check collision with map boundaries
        if (newX - this.radius < 0 || newX + this.radius > map.width) {
            dx = 0;
        }
        
        if (newY - this.radius < 0 || newY + this.radius > map.height) {
            dy = 0;
        }
        
        // Check collision with walls
        if (!map.checkCollision(newX, newY, this.radius)) {
            this.x += dx;
            this.y += dy;
        }
        
        // Update cooldowns
        if (this.eliminationCooldown > 0) {
            this.eliminationCooldown -= deltaTime;
        }
        
        if (this.meetingCooldown > 0) {
            this.meetingCooldown -= deltaTime;
        }
    }
    
    updateAI(deltaTime, map, players) {
        if (!this.isAlive) return;
        
        // Update cooldowns
        if (this.eliminationCooldown > 0) {
            this.eliminationCooldown -= deltaTime;
        }
        
        if (this.meetingCooldown > 0) {
            this.meetingCooldown -= deltaTime;
        }
        
        // AI wandering behavior
        this.aiWanderTimer -= deltaTime;
        
        if (this.aiWanderTimer <= 0) {
            // Set new random target
            this.aiTargetX = Math.random() * map.width;
            this.aiTargetY = Math.random() * map.height;
            this.aiWanderTimer = 2 + Math.random() * 3; // 2-5 seconds
        }
        
        // If impostor, potentially target nearby crewmates
        if (this.role === GameRole.IMPOSTOR && this.canEliminate()) {
            const target = this.findNearbyTarget(players);
            if (target) {
                this.aiTargetX = target.x;
                this.aiTargetY = target.y;
                
                // If close enough, eliminate
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.radius + target.radius + 10) {
                    this.eliminate(target);
                    this.aiWanderTimer = 0; // Set new target immediately
                    return;
                }
            }
        }
        
        // Move towards target
        const dx = this.aiTargetX - this.x;
        const dy = this.aiTargetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) { // Only move if not already at target
            const moveX = dx / distance * this.speed;
            const moveY = dy / distance * this.speed;
            
            this.move(moveX, moveY, map, deltaTime);
        }
    }
    
    findNearbyTarget(players) {
        const detectionRange = 150; // pixels
        let closestTarget = null;
        let closestDistance = detectionRange;
        
        players.forEach(player => {
            if (player === this || !player.isAlive || player.role === GameRole.IMPOSTOR) {
                return;
            }
            
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTarget = player;
            }
        });
        
        return closestTarget;
    }
    
    render(ctx) {
        if (!this.isAlive) return;
        
        // Draw player circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw player name
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y - this.radius - 5);
    }
    
    eliminate(target) {
        if (this.role !== GameRole.IMPOSTOR || !this.canEliminate()) {
            return false;
        }
        
        target.isAlive = false;
        this.eliminationCooldown = 30; // 30 seconds cooldown
        return true;
    }
    
    canEliminate() {
        return this.role === GameRole.IMPOSTOR && this.eliminationCooldown <= 0 && this.isAlive;
    }
    
    canCallMeeting() {
        return this.meetingCooldown <= 0 && this.isAlive;
    }
    
    callMeeting() {
        if (!this.canCallMeeting()) {
            return false;
        }
        
        this.meetingCooldown = 15; // 15 seconds cooldown
        return true;
    }
    
    reset() {
        this.isAlive = true;
        this.eliminationCooldown = 0;
        this.meetingCooldown = 0;
    }
}
