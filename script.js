const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

const bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    gravity: 0.5,
    lift: -10,
    velocity: 0,
    draw() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    },
    jump() {
        this.velocity = this.lift;
    }
};

const pipes = [];
let frame = 0;

function createPipe() {
    let pipeHeight = Math.floor(Math.random() * 150) + 100;
    pipes.push({
        x: canvas.width,
        width: 40,
        height: pipeHeight,
        gap: 100
    });
}

function updatePipes() {
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;

        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
            i--;
        }
    }

    if (frame % 90 === 0) {
        createPipe();
    }
}

function drawPipes() {
    for (let pipe of pipes) {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + pipe.gap, pipe.width, canvas.height);
    }
}

function checkCollision() {
    for (let pipe of pipes) {
        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipe.gap)
        ) {
            alert("Game Over! Refresh to Restart.");
            document.location.reload();
        }
    }
}

// Handle keyboard input
document.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
        bird.jump();
    }
});

// Handle touch input
canvas.addEventListener("touchstart", function() {
    bird.jump();
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    bird.update();
    bird.draw();
    
    updatePipes();
    drawPipes();
    
    checkCollision();
    
    frame++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
