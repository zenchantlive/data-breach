// Among Us 2D - Task Implementation

export class TaskManager {
    constructor(numTasks) {
        this.tasks = [];
        this.numTasks = numTasks;
        this.generateTasks();
    }
    
    generateTasks() {
        const taskTypes = [
            'Fix Wiring',
            'Download Data',
            'Clear Asteroids',
            'Empty Garbage',
            'Scan ID Card',
            'Align Engine Output',
            'Calibrate Distributor',
            'Prime Shields',
            'Submit Scan',
            'Swipe Card'
        ];
        
        // Shuffle task types
        const shuffledTasks = [...taskTypes].sort(() => Math.random() - 0.5);
        
        // Create tasks
        for (let i = 0; i < this.numTasks; i++) {
            this.tasks.push({
                id: i + 1,
                name: shuffledTasks[i % shuffledTasks.length],
                completed: false,
                location: {
                    x: 0,
                    y: 0,
                    radius: 20
                }
            });
        }
    }
    
    assignTaskLocations(mapTaskLocations) {
        // Assign task locations from the map
        const availableLocations = [...mapTaskLocations];
        
        this.tasks.forEach(task => {
            if (availableLocations.length > 0) {
                // Get a random location
                const randomIndex = Math.floor(Math.random() * availableLocations.length);
                const location = availableLocations[randomIndex];
                
                // Assign location to task
                task.location = {
                    x: location.x,
                    y: location.y,
                    radius: location.radius
                };
                
                // Remove location from available locations
                availableLocations.splice(randomIndex, 1);
            }
        });
    }
    
    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            return true;
        }
        return false;
    }
    
    areAllTasksCompleted() {
        return this.tasks.every(task => task.completed);
    }
    
    getCompletionPercentage() {
        const completedTasks = this.tasks.filter(task => task.completed).length;
        return (completedTasks / this.tasks.length) * 100;
    }
    
    getNearbyTask(x, y) {
        const interactionRadius = 50; // pixels
        
        return this.tasks.find(task => {
            const dx = task.location.x - x;
            const dy = task.location.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            return distance < interactionRadius;
        });
    }
    
    reset() {
        this.tasks.forEach(task => {
            task.completed = false;
        });
    }
}
