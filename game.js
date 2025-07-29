const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameModeElement = document.getElementById('gameMode');
const menuElement = document.getElementById('menu');
const modeSelection = document.getElementById('modeSelection');
const difficultySelection = document.getElementById('difficultySelection');

canvas.width = 800;
canvas.height = 400;

const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 5;
const BALL_SPEED = 4;
const INITIAL_BALL_SPEED = 2;

let gameState = 'menu';
let gameMode = 'pvp';
let botDifficulty = 'medium';
let animationId;

const botSettings = {
    easy: { speed: 2, reactionDelay: 15, accuracy: 0.7, predictionError: 50 },
    medium: { speed: 3, reactionDelay: 10, accuracy: 0.8, predictionError: 30 },
    hard: { speed: 4, reactionDelay: 5, accuracy: 0.9, predictionError: 15 },
    insane: { speed: 5, reactionDelay: 2, accuracy: 0.95, predictionError: 5 }
};

let botState = {
    targetY: 0,
    reactionTimer: 0,
    lastBallX: 0
};

let powerUps = [];
let powerUpSpawnTimer = 0;
const POWER_UP_SPAWN_INTERVAL = 1000; // 15-25 seconds in frames (60fps)
let lastHitter = null; // Track which player last hit the ball

let activePowerUps = {
    player1: {
        giantPaddle: 0,
        doublePoints: false
    },
    player2: {
        giantPaddle: 0,
        doublePoints: false
    },
    ball: {
        fireball: false
    }
};

let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

function playPingSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playPongSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.12);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.12);
}

function createPowerUp(type) {
    // Spawn anywhere on the gameboard with some margin from edges
    const margin = 50;
    const x = margin + Math.random() * (canvas.width - 2 * margin - 30);
    const y = margin + Math.random() * (canvas.height - 2 * margin - 30);
    
    return {
        type: type,
        x: x,
        y: y,
        width: 30,
        height: 30,
        collected: false,
        glowTimer: 0
    };
}

function spawnPowerUp() {
    // Allow multiple power-ups to exist, with a reasonable limit
    if (powerUps.length < 3 && gameState === 'playing') {
        const powerUpTypes = ['giantPaddle', 'fireball', 'doublePoints'];
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        powerUps.push(createPowerUp(randomType));
    }
}

function updatePowerUps() {
    powerUpSpawnTimer++;
    if (powerUpSpawnTimer >= POWER_UP_SPAWN_INTERVAL + Math.random() * 600) {
        spawnPowerUp();
        powerUpSpawnTimer = 0;
    }
    
    // Update power-up glow effect
    powerUps.forEach(powerUp => {
        powerUp.glowTimer += 0.1;
    });
    
    // Check power-up collection
    powerUps.forEach((powerUp, index) => {
        if (checkPowerUpCollision(game.ball, powerUp)) {
            collectPowerUp(powerUp);
            powerUps.splice(index, 1);
        }
    });
    
    // Update active power-ups
    if (activePowerUps.player1.giantPaddle > 0) {
        activePowerUps.player1.giantPaddle--;
    }
    if (activePowerUps.player2.giantPaddle > 0) {
        activePowerUps.player2.giantPaddle--;
    }
}

function checkPowerUpCollision(ball, powerUp) {
    return ball.x - ball.size < powerUp.x + powerUp.width &&
           ball.x + ball.size > powerUp.x &&
           ball.y - ball.size < powerUp.y + powerUp.height &&
           ball.y + ball.size > powerUp.y;
}

function collectPowerUp(powerUp) {
    playPowerUpSound();
    
    // Give power-up to the player who last hit the ball, or default to ball direction
    const beneficiary = lastHitter || (game.ball.dx < 0 ? 1 : 2);
    
    switch(powerUp.type) {
        case 'giantPaddle':
            if (beneficiary === 1) {
                activePowerUps.player1.giantPaddle = 480; // 8 seconds at 60fps
            } else {
                activePowerUps.player2.giantPaddle = 480;
            }
            break;
        case 'fireball':
            activePowerUps.ball.fireball = true;
            game.ball.speed *= 1.5;
            game.ball.dx = game.ball.dx > 0 ? game.ball.speed : -game.ball.speed;
            break;
        case 'doublePoints':
            if (beneficiary === 1) {
                activePowerUps.player1.doublePoints = true;
            } else {
                activePowerUps.player2.doublePoints = true;
            }
            break;
    }
}

function playPowerUpSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

const game = {
    player1: {
        x: 30,
        y: canvas.height / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        score: 0,
        dy: 0
    },
    player2: {
        x: canvas.width - 30 - PADDLE_WIDTH,
        y: canvas.height / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        score: 0,
        dy: 0
    },
    ball: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: BALL_SIZE,
        dx: BALL_SPEED,
        dy: 0,
        speed: BALL_SPEED
    }
};

const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    
    if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'waiting') {
            startGame();
        } else if (gameState === 'playing') {
            pauseGame();
        } else if (gameState === 'paused') {
            resumeGame();
        }
    }
    
    if (e.key === 'Escape') {
        e.preventDefault();
        if (gameState !== 'menu') {
            showMenu();
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function drawCourt() {
    ctx.fillStyle = '#006400';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
    
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 10);
    ctx.lineTo(canvas.width / 2, canvas.height - 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
    
    const netWidth = 5;
    ctx.fillStyle = '#fff';
    for (let i = 20; i < canvas.height - 20; i += 15) {
        ctx.fillRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10);
    }
}

function drawPaddle(paddle, playerNum) {
    const isGiant = (playerNum === 1 && activePowerUps.player1.giantPaddle > 0) ||
                   (playerNum === 2 && activePowerUps.player2.giantPaddle > 0);
    
    if (isGiant) {
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        const giantHeight = PADDLE_HEIGHT * 1.5;
        const yOffset = (giantHeight - PADDLE_HEIGHT) / 2;
        ctx.fillRect(paddle.x, paddle.y - yOffset, paddle.width, giantHeight);
        ctx.shadowBlur = 0;
    } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
}

function drawBall() {
    if (activePowerUps.ball.fireball) {
        // Draw fireball effect
        ctx.fillStyle = '#ff4400';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(game.ball.x, game.ball.y, game.ball.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw fire trail
        ctx.fillStyle = '#ff8800';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(game.ball.x - game.ball.dx * 0.5, game.ball.y - game.ball.dy * 0.5, game.ball.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
    } else {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(game.ball.x, game.ball.y, game.ball.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updatePaddles() {
    if (keys['w'] || keys['W']) {
        game.player1.dy = -PADDLE_SPEED;
    } else if (keys['s'] || keys['S']) {
        game.player1.dy = PADDLE_SPEED;
    } else {
        game.player1.dy = 0;
    }
    
    if (gameMode === 'pvp') {
        if (keys['ArrowUp']) {
            game.player2.dy = -PADDLE_SPEED;
        } else if (keys['ArrowDown']) {
            game.player2.dy = PADDLE_SPEED;
        } else {
            game.player2.dy = 0;
        }
    } else {
        updateBot();
    }
    
    game.player1.y += game.player1.dy;
    game.player2.y += game.player2.dy;
    
    game.player1.y = Math.max(10, Math.min(canvas.height - game.player1.height - 10, game.player1.y));
    game.player2.y = Math.max(10, Math.min(canvas.height - game.player2.height - 10, game.player2.y));
}

function updateBall() {
    game.ball.x += game.ball.dx;
    game.ball.y += game.ball.dy;
    
    if (game.ball.y - game.ball.size <= 10 || game.ball.y + game.ball.size >= canvas.height - 10) {
        game.ball.dy = -game.ball.dy;
    }
    
    if (checkCollision(game.ball, game.player1, 1)) {
        if (game.ball.dx < 0) {
            playPingSound();
            lastHitter = 1; // Track that player 1 last hit the ball
            game.ball.dx = Math.abs(game.ball.dx);
            const relativeIntersectY = (game.player1.y + game.player1.height / 2) - game.ball.y;
            const normalizedIntersectY = relativeIntersectY / (game.player1.height / 2);
            game.ball.dy = -normalizedIntersectY * game.ball.speed * 0.75;
            game.ball.speed += 0.2;
            game.ball.dx = game.ball.speed;
            // Remove fireball effect after hit
            activePowerUps.ball.fireball = false;
        }
    }
    
    if (checkCollision(game.ball, game.player2, 2)) {
        if (game.ball.dx > 0) {
            playPongSound();
            lastHitter = 2; // Track that player 2 last hit the ball
            game.ball.dx = -Math.abs(game.ball.dx);
            const relativeIntersectY = (game.player2.y + game.player2.height / 2) - game.ball.y;
            const normalizedIntersectY = relativeIntersectY / (game.player2.height / 2);
            game.ball.dy = -normalizedIntersectY * game.ball.speed * 0.75;
            game.ball.speed += 0.2;
            game.ball.dx = -game.ball.speed;
            // Remove fireball effect after hit
            activePowerUps.ball.fireball = false;
        }
    }
    
    if (game.ball.x < 0) {
        // Player 2 scores
        const points = activePowerUps.player2.doublePoints ? 2 : 1;
        game.player2.score += points;
        activePowerUps.player2.doublePoints = false;
        resetBall();
        updateScore();
    } else if (game.ball.x > canvas.width) {
        // Player 1 scores
        const points = activePowerUps.player1.doublePoints ? 2 : 1;
        game.player1.score += points;
        activePowerUps.player1.doublePoints = false;
        resetBall();
        updateScore();
    }
}

function checkCollision(ball, paddle, playerNum) {
    const isGiant = (playerNum === 1 && activePowerUps.player1.giantPaddle > 0) ||
                   (playerNum === 2 && activePowerUps.player2.giantPaddle > 0);
    
    let paddleHeight = paddle.height;
    let paddleY = paddle.y;
    
    if (isGiant) {
        paddleHeight = PADDLE_HEIGHT * 1.5;
        paddleY = paddle.y - (paddleHeight - PADDLE_HEIGHT) / 2;
    }
    
    return ball.x - ball.size < paddle.x + paddle.width &&
           ball.x + ball.size > paddle.x &&
           ball.y - ball.size < paddleY + paddleHeight &&
           ball.y + ball.size > paddleY;
}

function resetBall() {
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.ball.speed = INITIAL_BALL_SPEED;
    game.ball.dx = (Math.random() > 0.5 ? 1 : -1) * INITIAL_BALL_SPEED;
    game.ball.dy = (Math.random() - 0.5) * INITIAL_BALL_SPEED;
    // Clear ball power-ups
    activePowerUps.ball.fireball = false;
    // Reset last hitter
    lastHitter = null;
}

function updateBot() {
    const settings = botSettings[botDifficulty];
    
    if (game.ball.dx > 0 && game.ball.x > canvas.width / 2) {
        if (botState.reactionTimer <= 0) {
            const ballCenterY = game.ball.y;
            const paddleCenterY = game.player2.y + game.player2.height / 2;
            
            let predictedY = ballCenterY;
            if (Math.random() < settings.accuracy) {
                const timeToReach = (game.player2.x - game.ball.x) / Math.abs(game.ball.dx);
                predictedY = game.ball.y + (game.ball.dy * timeToReach);
                predictedY += (Math.random() - 0.5) * settings.predictionError;
            }
            
            botState.targetY = predictedY - game.player2.height / 2;
            botState.reactionTimer = settings.reactionDelay;
        } else {
            botState.reactionTimer--;
        }
    }
    
    const targetDiff = botState.targetY - game.player2.y;
    if (Math.abs(targetDiff) > 5) {
        if (targetDiff > 0) {
            game.player2.dy = settings.speed;
        } else {
            game.player2.dy = -settings.speed;
        }
    } else {
        game.player2.dy = 0;
    }
    
    botState.lastBallX = game.ball.x;
}

function updateScore() {
    const player2Name = gameMode === 'pvp' ? 'Player 2' : 'Bot';
    scoreElement.textContent = `Player 1: ${game.player1.score} - ${player2Name}: ${game.player2.score}`;
    
    if (game.player1.score >= 11 || game.player2.score >= 11) {
        gameOver();
    }
}

function drawPowerUps() {
    powerUps.forEach(powerUp => {
        const glowIntensity = Math.sin(powerUp.glowTimer) * 0.3 + 0.7;
        
        ctx.save();
        ctx.globalAlpha = glowIntensity;
        
        switch(powerUp.type) {
            case 'giantPaddle':
                ctx.fillStyle = '#00ff88';
                ctx.shadowColor = '#00ff88';
                ctx.shadowBlur = 15;
                break;
            case 'fireball':
                ctx.fillStyle = '#ff4400';
                ctx.shadowColor = '#ff6600';
                ctx.shadowBlur = 15;
                break;
            case 'doublePoints':
                ctx.fillStyle = '#8800ff';
                ctx.shadowColor = '#aa44ff';
                ctx.shadowBlur = 15;
                break;
        }
        
        ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
        
        // Draw icon/symbol
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 0;
        
        let symbol = '';
        switch(powerUp.type) {
            case 'giantPaddle': symbol = '↕'; break;
            case 'fireball': symbol = '🔥'; break; 
            case 'doublePoints': symbol = '2X'; break;
        }
        
        ctx.fillText(symbol, powerUp.x + powerUp.width/2, powerUp.y + powerUp.height/2 + 6);
        ctx.restore();
    });
}

function drawPowerUpIndicators() {
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    
    // Player 1 indicators
    let p1y = 100;
    if (activePowerUps.player1.giantPaddle > 0) {
        ctx.fillStyle = '#00ff88';
        ctx.fillText(`Giant Paddle: ${Math.ceil(activePowerUps.player1.giantPaddle / 60)}s`, 20, p1y);
        p1y += 20;
    }
    if (activePowerUps.player1.doublePoints) {
        ctx.fillStyle = '#8800ff';
        ctx.fillText('Double Points Active!', 20, p1y);
    }
    
    // Player 2 indicators  
    ctx.textAlign = 'right';
    let p2y = 100;
    if (activePowerUps.player2.giantPaddle > 0) {
        ctx.fillStyle = '#00ff88';
        ctx.fillText(`Giant Paddle: ${Math.ceil(activePowerUps.player2.giantPaddle / 60)}s`, canvas.width - 20, p2y);
        p2y += 20;
    }
    if (activePowerUps.player2.doublePoints) {
        ctx.fillStyle = '#8800ff';
        ctx.fillText('Double Points Active!', canvas.width - 20, p2y);
    }
    
    // Ball indicators
    if (activePowerUps.ball.fireball) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff4400';
        ctx.fillText('FIREBALL!', canvas.width / 2, 130);
    }
}

function draw() {
    if (gameState === 'menu') {
        ctx.fillStyle = '#006400';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawCourt();
    drawPaddle(game.player1, 1);
    drawPaddle(game.player2, 2);
    drawBall();
    drawPowerUps();
    drawPowerUpIndicators();
    
    if (gameState === 'waiting') {
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2);
    } else if (gameState === 'paused') {
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    } else if (gameState === 'gameover') {
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        const winner = game.player1.score > game.player2.score ? 'Player 1' : (gameMode === 'pvp' ? 'Player 2' : 'Bot');
        ctx.fillText(`${winner} Wins!`, canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = '20px Arial';
        ctx.fillText('Press SPACE to Play Again', canvas.width / 2, canvas.height / 2 + 20);
    }
}

function gameLoop() {
    if (gameState === 'playing') {
        updatePaddles();
        updateBall();
        updatePowerUps();
    }
    
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function startGame() {
    initAudio();
    gameState = 'playing';
    resetBall();
    game.player1.score = 0;
    game.player2.score = 0;
    updateScore();
    updateGameModeDisplay();
}

function pauseGame() {
    gameState = 'paused';
}

function resumeGame() {
    gameState = 'playing';
}

function gameOver() {
    gameState = 'gameover';
    setTimeout(() => {
        gameState = 'waiting';
    }, 2000);
}

function showMenu() {
    gameState = 'menu';
    menuElement.classList.add('active');
    modeSelection.style.display = 'block';
    difficultySelection.style.display = 'none';
}

function hideMenu() {
    gameState = 'waiting';
    menuElement.classList.remove('active');
}

function updateGameModeDisplay() {
    if (gameMode === 'pvp') {
        gameModeElement.textContent = 'Player vs Player';
    } else {
        gameModeElement.textContent = `Player vs Bot (${botDifficulty.charAt(0).toUpperCase() + botDifficulty.slice(1)})`;
    }
}

document.getElementById('pvpMode').addEventListener('click', () => {
    gameMode = 'pvp';
    hideMenu();
});

document.getElementById('pvbMode').addEventListener('click', () => {
    gameMode = 'pvb';
    modeSelection.style.display = 'none';
    difficultySelection.style.display = 'block';
});

document.getElementById('easyDiff').addEventListener('click', () => {
    botDifficulty = 'easy';
    hideMenu();
});

document.getElementById('mediumDiff').addEventListener('click', () => {
    botDifficulty = 'medium';
    hideMenu();
});

document.getElementById('hardDiff').addEventListener('click', () => {
    botDifficulty = 'hard';
    hideMenu();
});

document.getElementById('insaneDiff').addEventListener('click', () => {
    botDifficulty = 'insane';
    hideMenu();
});

document.getElementById('backBtn').addEventListener('click', () => {
    modeSelection.style.display = 'block';
    difficultySelection.style.display = 'none';
});

gameLoop();