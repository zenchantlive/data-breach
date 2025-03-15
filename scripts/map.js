// Among Us 2D - Map Rendering and Collision

export class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.walls = [];
        this.vents = [];
        this.taskLocations = [];
        this.spawnPoints = [];
    }
    
    async init() {
        // Create a simple map layout
        this.createSimpleMap();
        
        // Add task locations
        this.addTaskLocations();
        
        // Add vents
        this.addVents();
        
        // Add spawn points
        this.addSpawnPoints();
        
        return true;
    }
    
    createSimpleMap() {
        // Create outer walls (boundary)
        const wallThickness = 20;
        
        // Top wall
        this.walls.push({
            x: 0,
            y: 0,
            width: this.width,
            height: wallThickness
        });
        
        // Bottom wall
        this.walls.push({
            x: 0,
            y: this.height - wallThickness,
            width: this.width,
            height: wallThickness
        });
        
        // Left wall
        this.walls.push({
            x: 0,
            y: 0,
            width: wallThickness,
            height: this.height
        });
        
        // Right wall
        this.walls.push({
            x: this.width - wallThickness,
            y: 0,
            width: wallThickness,
            height: this.height
        });
        
        // Create rooms and corridors
        
        // Central room
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const roomSize = 200;
        
        // Top room
        this.walls.push({
            x: centerX - roomSize / 2,
            y: centerY - roomSize - 50,
            width: roomSize,
            height: wallThickness
        });
        
        this.walls.push({
            x: centerX - roomSize / 2,
            y: centerY - roomSize - 50,
            width: wallThickness,
            height: roomSize
        });
        
        this.walls.push({
            x: centerX + roomSize / 2 - wallThickness,
            y: centerY - roomSize - 50,
            width: wallThickness,
            height: roomSize
        });
        
        // Left room
        this.walls.push({
            x: centerX - roomSize - 50,
            y: centerY - roomSize / 2,
            width: roomSize,
            height: wallThickness
        });
        
        this.walls.push({
            x: centerX - roomSize - 50,
            y: centerY - roomSize / 2,
            width: wallThickness,
            height: roomSize
        });
        
        this.walls.push({
            x: centerX - roomSize - 50,
            y: centerY + roomSize / 2 - wallThickness,
            width: roomSize,
            height: wallThickness
        });
        
        // Right room
        this.walls.push({
            x: centerX + 50,
            y: centerY - roomSize / 2,
            width: roomSize,
            height: wallThickness
        });
        
        this.walls.push({
            x: centerX + 50 + roomSize - wallThickness,
            y: centerY - roomSize / 2,
            width: wallThickness,
            height: roomSize
        });
        
        this.walls.push({
            x: centerX + 50,
            y: centerY + roomSize / 2 - wallThickness,
            width: roomSize,
            height: wallThickness
        });
        
        // Bottom room
        this.walls.push({
            x: centerX - roomSize / 2,
            y: centerY + 50 + roomSize - wallThickness,
            width: roomSize,
            height: wallThickness
        });
        
        this.walls.push({
            x: centerX - roomSize / 2,
            y: centerY + 50,
            width: wallThickness,
            height: roomSize
        });
        
        this.walls.push({
            x: centerX + roomSize / 2 - wallThickness,
            y: centerY + 50,
            width: wallThickness,
            height: roomSize
        });
    }
    
    addTaskLocations() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const roomSize = 200;
        
        // Add task locations in each room
        
        // Top room
        this.taskLocations.push({
            id: 1,
            x: centerX,
            y: centerY - roomSize,
            radius: 20,
            name: 'Fix Wiring'
        });
        
        // Left room
        this.taskLocations.push({
            id: 2,
            x: centerX - roomSize,
            y: centerY,
            radius: 20,
            name: 'Download Data'
        });
        
        // Right room
        this.taskLocations.push({
            id: 3,
            x: centerX + roomSize,
            y: centerY,
            radius: 20,
            name: 'Clear Asteroids'
        });
        
        // Bottom room
        this.taskLocations.push({
            id: 4,
            x: centerX,
            y: centerY + roomSize,
            radius: 20,
            name: 'Empty Garbage'
        });
        
        // Center room
        this.taskLocations.push({
            id: 5,
            x: centerX,
            y: centerY,
            radius: 20,
            name: 'Scan ID Card'
        });
    }
    
    addVents() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const roomSize = 200;
        
        // Add vents in each room
        
        // Top room
        this.vents.push({
            id: 1,
            x: centerX - 50,
            y: centerY - roomSize + 50,
            width: 30,
            height: 30,
            connectsTo: [2, 5]
        });
        
        // Left room
        this.vents.push({
            id: 2,
            x: centerX - roomSize + 50,
            y: centerY - 50,
            width: 30,
            height: 30,
            connectsTo: [1, 3]
        });
        
        // Right room
        this.vents.push({
            id: 3,
            x: centerX + roomSize - 50,
            y: centerY - 50,
            width: 30,
            height: 30,
            connectsTo: [2, 4]
        });
        
        // Bottom room
        this.vents.push({
            id: 4,
            x: centerX - 50,
            y: centerY + roomSize - 50,
            width: 30,
            height: 30,
            connectsTo: [3, 5]
        });
        
        // Center room
        this.vents.push({
            id: 5,
            x: centerX + 50,
            y: centerY + 50,
            width: 30,
            height: 30,
            connectsTo: [1, 4]
        });
    }
    
    addSpawnPoints() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        // Add spawn points in the center room
        for (let i = 0; i < 10; i++) {
            this.spawnPoints.push({
                x: centerX + Math.random() * 100 - 50,
                y: centerY + Math.random() * 100 - 50
            });
        }
    }
    
    render(ctx) {
        // Draw floor
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw walls
        ctx.fillStyle = '#666666';
        this.walls.forEach(wall => {
            ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        });
        
        // Draw vents
        ctx.fillStyle = '#444444';
        this.vents.forEach(vent => {
            ctx.fillRect(vent.x, vent.y, vent.width, vent.height);
            
            // Draw vent grill lines
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 2;
            
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(vent.x, vent.y + i * 10 + 5);
                ctx.lineTo(vent.x + vent.width, vent.y + i * 10 + 5);
                ctx.stroke();
            }
        });
        
        // Draw task locations
        ctx.fillStyle = '#FFFF00';
        this.taskLocations.forEach(task => {
            ctx.beginPath();
            ctx.arc(task.x, task.y, task.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw task name
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(task.name, task.x, task.y - task.radius - 5);
        });
    }
    
    checkCollision(x, y, radius) {
        // Check collision with walls
        for (const wall of this.walls) {
            // Find the closest point on the rectangle to the circle
            const closestX = Math.max(wall.x, Math.min(x, wall.x + wall.width));
            const closestY = Math.max(wall.y, Math.min(y, wall.y + wall.height));
            
            // Calculate the distance between the circle's center and the closest point
            const distanceX = x - closestX;
            const distanceY = y - closestY;
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;
            
            // If the distance is less than the circle's radius, there is a collision
            if (distanceSquared < radius * radius) {
                return true;
            }
        }
        
        return false;
    }
    
    getRandomSpawnPoint() {
        const index = Math.floor(Math.random() * this.spawnPoints.length);
        return this.spawnPoints[index];
    }
    
    getNearbyVent(x, y, radius) {
        for (const vent of this.vents) {
            // Find the closest point on the rectangle to the circle
            const closestX = Math.max(vent.x, Math.min(x, vent.x + vent.width));
            const closestY = Math.max(vent.y, Math.min(y, vent.y + vent.height));
            
            // Calculate the distance between the circle's center and the closest point
            const distanceX = x - closestX;
            const distanceY = y - closestY;
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;
            
            // If the distance is less than the circle's radius, the player is near the vent
            if (distanceSquared < radius * radius) {
                return vent;
            }
        }
        
        return null;
    }
}
