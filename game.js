// Game Configuration
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const GROUND_Y = 360; // Top of the ground tiles
const PIXEL_SCALE = 2.5; // Sprite scaling multiplier

// Core Game States
const STATES = {
    START: 'START',
    PLAYING: 'PLAYING',
    PAUSED: 'PAUSED',
    GAMEOVER: 'GAMEOVER'
};

let gameState = STATES.START;

// DOM Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false; // Keep retro pixels crisp

const hudCoins = document.getElementById('hudCoins');
const hudScore = document.getElementById('hudScore');
const hudHighScore = document.getElementById('hudHighScore');
const gameOverlay = document.getElementById('gameOverlay');
const overlayContent = document.getElementById('overlayContent');

const statState = document.getElementById('statState');
const statLevel = document.getElementById('statLevel');
const statPower = document.getElementById('statPower');
const statYoshi = document.getElementById('statYoshi');

const btnMute = document.getElementById('btnMute');
const volumeSlider = document.getElementById('volumeSlider');
const volumeValue = document.getElementById('volumeValue');
const btnStartPause = document.getElementById('btnStartPause');
const btnRestart = document.getElementById('btnRestart');

const vBtnJump = document.getElementById('vBtnJump');
const vBtnDuck = document.getElementById('vBtnDuck');

// V3 Mobile arrows for Boss Battle
const vBtnLeft = document.getElementById('vBtnLeft');
const vBtnRight = document.getElementById('vBtnRight');
const bossArrowsPanel = document.getElementById('bossArrows');

// Game Parameters & State Variables
let gameSpeed = 6.0;
const baseSpeed = 6.0;
const maxSpeed = 14.0;
let score = 0;
let coins = 0;
let highScore = parseInt(localStorage.getItem('mario_dino_highscore')) || 0;
let level = 1;
let levelUpBannerTimer = 0;
let customBannerText = '';

let lastTime = 0;
let obstacleTimer = 0;
let nextSpawnTime = 1400;
let activePowerUp = 'small'; // 'small' or 'super'

// V3 Boss Battle variables
let bossActive = false;
let bossType = ''; // 'bowser', 'sonic', 'kamek'
let bossHp = 3;
let bossX = 900;
let bossY = GROUND_Y;
let bossWidth = 32 * PIXEL_SCALE;
let bossHeight = 32 * PIXEL_SCALE;
let bossDirection = -1;
let bossSpeed = 2.0;
let bossState = 'entering'; // 'entering', 'fighting', 'charging', 'returning', 'defeated'
let bossAttackTimer = 0;
let bossFlashTimer = 0;
let bossProjectiles = [];
let nextBossScore = 5000; // triggers boss at 5000, 10000, 15000, etc.
let bossVy = 0; // vertical velocity when falling defeated

// Sky Color Interpolation (Day / Sunset / Night / Sunrise)
const SKY_COLORS = [
    { top: '#5c94fc', bottom: '#b8e8fc' }, // Phase 1: Dia (Blue)
    { top: '#c84c0c', bottom: '#ffc080' }, // Phase 2: Entardecer (Orange/Red)
    { top: '#070718', bottom: '#281048' }, // Phase 3: Noite (Dark Blue/Purple)
    { top: '#6a4a8a', bottom: '#ffa890' }  // Phase 4: Amanhecer (Lavender/Pink)
];
let currentSkyTop = '#5c94fc';
let currentSkyBottom = '#b8e8fc';

// Helper to interpolate between Hex colors
function lerpColor(c1, c2, factor) {
    let r1 = parseInt(c1.substring(1,3), 16);
    let g1 = parseInt(c1.substring(3,5), 16);
    let b1 = parseInt(c1.substring(5,7), 16);

    let r2 = parseInt(c2.substring(1,3), 16);
    let g2 = parseInt(c2.substring(3,5), 16);
    let b2 = parseInt(c2.substring(5,7), 16);

    let r = Math.round(r1 + (r2 - r1) * factor);
    let g = Math.round(g1 + (g2 - g1) * factor);
    let b = Math.round(b1 + (b2 - b1) * factor);

    return "#" + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
}

// Input States
const keys = {
    jump: false,
    duck: false,
    left: false,
    right: false
};

// Player Object
const player = {
    x: 80,
    y: GROUND_Y - (16 * PIXEL_SCALE), // Start standing
    width: 12 * PIXEL_SCALE,
    height: 16 * PIXEL_SCALE,
    vy: 0,
    gravity: 0.75,
    jumpForce: -13.5,
    isJumping: false,
    isDucking: false,
    jumpHoldTimer: 0,
    maxJumpHold: 14, // frames allowed to add upward boost
    runFrame: 0,
    runTimer: 0,
    
    // Recovery Invincibility
    invincible: false,
    invincibleTimer: 0,

    // Yoshi Riding & Starman Invincibility
    ridingYoshi: false,
    starInvincible: false,
    starTimer: 0,

    // Tongue state
    tongueActive: false,
    tongueProgress: 0, // 0 to 1
    tongueState: 'out', // 'out' (extending) or 'in' (retracting)
    
    reset() {
        this.x = 80;
        this.y = GROUND_Y - (16 * PIXEL_SCALE);
        this.vy = 0;
        this.isJumping = false;
        this.isDucking = false;
        this.jumpHoldTimer = 0;
        this.runFrame = 0;
        this.runTimer = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.ridingYoshi = false;
        this.starInvincible = false;
        this.starTimer = 0;
        this.tongueActive = false;
        this.tongueProgress = 0;
        this.tongueState = 'out';
        activePowerUp = 'small';
        stopStarMusic();
        updateStats();
    },

    update(dt) {
        // 1. Starman timer update
        if (this.starInvincible) {
            this.starTimer -= dt;
            if (this.starTimer <= 0) {
                this.starInvincible = false;
                this.starTimer = 0;
                stopStarMusic();
                updateStats();
            }
        }

        // 2. Invincibility flash update
        if (this.invincible) {
            this.invincibleTimer -= dt;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }

        // 3. Ducking check
        this.isDucking = keys.duck && !this.isJumping;

        // 4. Tongue update (if on Yoshi)
        if (this.ridingYoshi && this.tongueActive) {
            if (this.tongueState === 'out') {
                this.tongueProgress += 0.08 * (dt / 16.67);
                if (this.tongueProgress >= 1.0) {
                    this.tongueProgress = 1.0;
                    this.tongueState = 'in';
                }
            } else {
                this.tongueProgress -= 0.08 * (dt / 16.67);
                if (this.tongueProgress <= 0) {
                    this.tongueProgress = 0;
                    this.tongueActive = false;
                }
            }
        }

        // 5. Adjust Hitboxes based on State
        if (this.ridingYoshi) {
            this.width = 14 * PIXEL_SCALE;
            if (activePowerUp === 'super') {
                this.height = 34 * PIXEL_SCALE; // yoshi_super sprites are 34 rows
            } else {
                this.height = 29 * PIXEL_SCALE; // yoshi_small sprites effective height (32 - 3 blank rows)
            }
        } else {
            if (activePowerUp === 'super') {
                if (this.isDucking) {
                    this.width = 14 * PIXEL_SCALE;
                    this.height = 18 * PIXEL_SCALE;
                } else {
                    this.width = 14 * PIXEL_SCALE;
                    this.height = 28 * PIXEL_SCALE;
                }
            } else {
                // Small Mario
                if (this.isDucking) {
                    this.width = 12 * PIXEL_SCALE;
                    this.height = 10 * PIXEL_SCALE;
                } else {
                    this.width = 12 * PIXEL_SCALE;
                    this.height = 16 * PIXEL_SCALE;
                }
            }
        }

        // 6. Horizontal walking movements unlocked during Boss Battles
        if (bossActive) {
            if (keys.left) {
                this.x = Math.max(20, this.x - 4.5 * (dt / 16.67));
            }
            if (keys.right) {
                this.x = Math.min(CANVAS_WIDTH - this.width - 20, this.x + 4.5 * (dt / 16.67));
            }
        } else {
            // Smoothly walk player back to default position (X = 80)
            if (this.x < 80) {
                this.x = Math.min(80, this.x + 2.0 * (dt / 16.67));
            } else if (this.x > 80) {
                this.x = Math.max(80, this.x - 2.0 * (dt / 16.67));
            }
        }

        // 7. Physics: Jump & Variable Jump Height
        if (keys.jump && !this.isJumping && !(this.isDucking && !this.ridingYoshi)) {
            this.vy = this.jumpForce;
            this.isJumping = true;
            this.jumpHoldTimer = this.maxJumpHold;
            playJumpSound();
        } else if (keys.jump && this.isJumping && this.jumpHoldTimer > 0) {
            this.vy -= 0.22;
            this.jumpHoldTimer--;
        }

        if (!keys.jump) {
            this.jumpHoldTimer = 0;
        }

        // Apply gravity
        this.vy += this.gravity;
        
        // Fast drop if ducking (does not apply on Yoshi)
        if (keys.duck && this.isJumping && !this.ridingYoshi) {
            this.vy += 0.8;
        }

        this.y += this.vy;

        // Ground Collision
        const currentGround = GROUND_Y - this.height;
        if (this.y >= currentGround) {
            this.y = currentGround;
            this.vy = 0;
            this.isJumping = false;
        }

        // 8. Run Animation Timer
        // Animate standing/running, or keep static when game is at scrolling stop (unless player is actively walking)
        const isWalking = bossActive && (keys.left || keys.right);
        if (!this.isJumping && !this.isDucking && (gameSpeed > 0 || isWalking)) {
            this.runTimer += dt;
            const currentSpeed = gameSpeed > 0 ? gameSpeed : 5.0;
            const animationSpeed = Math.max(50, 150 - (currentSpeed * 7));
            if (this.runTimer > animationSpeed) {
                this.runFrame = this.runFrame === 0 ? 1 : 0;
                this.runTimer = 0;
            }
        }
    },

    draw() {
        if (this.invincible && Math.floor(Date.now() / 80) % 2 === 0) {
            return;
        }

        // Generate Rainbow Palette Override if Starman is active
        let paletteOverride = null;
        if (this.starInvincible) {
            const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
            let cycle = Math.floor(Date.now() / 70) % colors.length;
            paletteOverride = {
                'R': colors[cycle],
                'U': colors[(cycle + 2) % colors.length],
                'S': colors[(cycle + 4) % colors.length]
            };
        }

        let spriteKey = '';
        let drawWidth = 16 * PIXEL_SCALE;
        let drawHeight = 16 * PIXEL_SCALE;
        let drawY = this.y;

        const isWalkingLeft = bossActive && keys.left;
        const facing = isWalkingLeft ? false : true;

        if (this.ridingYoshi) {
            drawWidth = 24 * PIXEL_SCALE;
            if (activePowerUp === 'super') {
                // yoshi_super sprites are 34 rows — no offset needed
                drawHeight = 34 * PIXEL_SCALE;
                if (this.isJumping) {
                    spriteKey = 'yoshi_super_jump';
                } else {
                    spriteKey = this.runFrame === 0 ? 'yoshi_super_run1' : 'yoshi_super_run2';
                }
            } else {
                // yoshi_small sprites are 32 rows but last 3 are blank; draw 32 but shift up 3px*PIXEL_SCALE so feet stay at ground
                drawHeight = 32 * PIXEL_SCALE;
                drawY = this.y - (3 * PIXEL_SCALE);
                if (this.isJumping) {
                    spriteKey = 'yoshi_small_jump';
                } else {
                    spriteKey = this.runFrame === 0 ? 'yoshi_small_run1' : 'yoshi_small_run2';
                }
            }
        } else {
            if (activePowerUp === 'super') {
                if (this.isDucking) {
                    // mario_super_duck is 18 rows
                    drawHeight = 18 * PIXEL_SCALE;
                    spriteKey = 'mario_super_duck';
                } else if (this.isJumping) {
                    // mario_super_jump is 28 rows
                    drawHeight = 28 * PIXEL_SCALE;
                    spriteKey = 'mario_super_jump';
                } else {
                    // mario_super_stand/run are 28 rows
                    drawHeight = 28 * PIXEL_SCALE;
                    spriteKey = this.runFrame === 0 ? 'mario_super_run1' : 'mario_super_run2';
                }
            } else {
                drawHeight = 16 * PIXEL_SCALE;
                if (this.isJumping) {
                    spriteKey = 'mario_small_jump';
                } else if (this.isDucking) {
                    spriteKey = 'mario_small_duck';
                } else {
                    spriteKey = this.runFrame === 0 ? 'mario_small_run1' : 'mario_small_run2';
                }
            }
        }

        drawSprite(ctx, spriteKey, this.x, drawY, drawWidth, drawHeight, facing, paletteOverride);
    },

    getHitbox() {
        const paddingX = 3 * PIXEL_SCALE;
        const paddingY = 2 * PIXEL_SCALE;
        return {
            x: this.x + paddingX,
            y: this.y + paddingY,
            width: this.width - (paddingX * 2),
            height: this.height - paddingY
        };
    },

    triggerTongue() {
        if (!this.ridingYoshi || this.tongueActive) return;
        this.tongueActive = true;
        this.tongueProgress = 0;
        this.tongueState = 'out';
        playYoshiEatSound();
    },

    getTongueHitbox() {
        if (!this.tongueActive) return null;
        
        const startX = this.x + (16 * PIXEL_SCALE);
        const startY = this.y + (activePowerUp === 'super' ? 21 * PIXEL_SCALE : 13 * PIXEL_SCALE);
        const tongueRange = 120 * this.tongueProgress;

        return {
            x: startX,
            y: startY - (4 * PIXEL_SCALE),
            width: tongueRange,
            height: 8 * PIXEL_SCALE
        };
    }
};

// Parallax Layers
const clouds = [];
const hills = [];
const bushes = [];
const groundTiles = [];

// Game Elements (Enemies, Coins, Items)
let gameElements = [];

// Initialize Environment Parallax Layouts
function initEnvironment() {
    clouds.length = 0;
    hills.length = 0;
    bushes.length = 0;
    groundTiles.length = 0;

    // Clouds
    for (let i = 0; i < 4; i++) {
        clouds.push({
            x: Math.random() * CANVAS_WIDTH + (i * 250),
            y: 30 + Math.random() * 80,
            width: 24 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            speedMultiplier: 0.15
        });
    }

    // Hills
    for (let i = 0; i < 3; i++) {
        hills.push({
            x: i * 350 + Math.random() * 100,
            y: GROUND_Y - (14 * PIXEL_SCALE),
            width: 26 * PIXEL_SCALE,
            height: 14 * PIXEL_SCALE,
            speedMultiplier: 0.4
        });
    }

    // Bushes
    for (let i = 0; i < 3; i++) {
        bushes.push({
            x: i * 280 + Math.random() * 150,
            y: GROUND_Y - (12 * PIXEL_SCALE),
            width: 24 * PIXEL_SCALE,
            height: 12 * PIXEL_SCALE,
            speedMultiplier: 0.7
        });
    }

    // Ground tiles
    const groundWidth = 16 * PIXEL_SCALE; // 40px
    const count = Math.ceil(CANVAS_WIDTH / groundWidth) + 2;
    for (let i = 0; i < count; i++) {
        groundTiles.push({
            x: i * groundWidth,
            y: GROUND_Y,
            width: groundWidth,
            height: groundWidth
        });
    }
}

// Spawning Logic
function spawnRandomElement() {
    // Blocks spawning during boss battles
    if (bossActive) return;

    const r = Math.random();
    
    if (r < 0.22) {
        // Goomba
        gameElements.push({
            type: 'goomba',
            x: CANVAS_WIDTH,
            y: GROUND_Y - (16 * PIXEL_SCALE),
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            vx: -gameSpeed,
            walkFrame: 0,
            walkTimer: 0,
            stomped: false,
            stompTimer: 0,
            getHitbox() {
                return { x: this.x + 3*PIXEL_SCALE, y: this.y + 4*PIXEL_SCALE, width: this.width - 6*PIXEL_SCALE, height: this.height - 4*PIXEL_SCALE };
            }
        });
    } else if (r < 0.40) {
        // Koopa Shell
        gameElements.push({
            type: 'koopa_shell',
            x: CANVAS_WIDTH,
            y: GROUND_Y - (12 * PIXEL_SCALE),
            width: 16 * PIXEL_SCALE,
            height: 12 * PIXEL_SCALE,
            vx: -(gameSpeed + 1.5),
            spinFrame: 0,
            spinTimer: 0,
            kicked: false,
            getHitbox() {
                return { x: this.x + 2*PIXEL_SCALE, y: this.y + 2*PIXEL_SCALE, width: this.width - 4*PIXEL_SCALE, height: this.height - 2*PIXEL_SCALE };
            }
        });
    } else if (r < 0.55) {
        // Bullet Bill
        const heights = [GROUND_Y - (16 * PIXEL_SCALE) - 30, GROUND_Y - (16 * PIXEL_SCALE) - 60];
        const flyY = heights[Math.floor(Math.random() * heights.length)];
        
        gameElements.push({
            type: 'bullet_bill',
            x: CANVAS_WIDTH,
            y: flyY,
            width: 24 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            vx: -(gameSpeed + 3.0),
            getHitbox() {
                return { x: this.x + 2*PIXEL_SCALE, y: this.y + 2*PIXEL_SCALE, width: this.width - 4*PIXEL_SCALE, height: this.height - 4*PIXEL_SCALE };
            }
        });
    } else if (r < 0.76) {
        // Mystery Block
        gameElements.push({
            type: 'mystery_block',
            x: CANVAS_WIDTH,
            y: GROUND_Y - (16 * PIXEL_SCALE) - 60,
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            vx: -gameSpeed,
            hit: false,
            animFrame: 0,
            animTimer: 0,
            getHitbox() {
                return { x: this.x, y: this.y, width: this.width, height: this.height };
            }
        });
    } else {
        // Coin Arc
        const startX = CANVAS_WIDTH;
        const baseY = GROUND_Y - (16 * PIXEL_SCALE) - 50;
        
        for (let i = 0; i < 3; i++) {
            const offsetHeight = i === 1 ? 25 : 0;
            gameElements.push({
                type: 'coin',
                x: startX + (i * 45),
                y: baseY - offsetHeight,
                width: 12 * PIXEL_SCALE,
                height: 12 * PIXEL_SCALE,
                vx: -gameSpeed,
                spinFrame: Math.floor(Math.random() * 4),
                spinTimer: 0,
                collected: false,
                getHitbox() {
                    return { x: this.x, y: this.y, width: this.width, height: this.height };
                }
            });
        }
    }
}

// Spawns power-up when Mystery Block is headbutted
// Power-up salta para a direita (à frente do Mario) para dar tempo de pegar
function spawnPowerUp(x, y) {
    const powerUpsList = ['mushroom', 'star', 'yoshi_egg'];
    const selectedPower = powerUpsList[Math.floor(Math.random() * powerUpsList.length)];

    // Velocidade de lançamento: força para frente (direita) + salto alto
    const LAUNCH_VX = 5.5;   // desloca bem para frente do Mario
    const LAUNCH_VY = -9;    // salto alto para dar tempo de reagir

    if (selectedPower === 'mushroom') {
        gameElements.push({
            type: 'mushroom',
            x: x,
            y: y,
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            vx: LAUNCH_VX,
            vy: LAUNCH_VY,
            gravity: 0.45,
            onGround: false,
            getHitbox() {
                return { x: this.x, y: this.y, width: this.width, height: this.height };
            }
        });
    } else if (selectedPower === 'star') {
        gameElements.push({
            type: 'star',
            x: x,
            y: y,
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            vx: LAUNCH_VX,
            vy: LAUNCH_VY - 1,  // estrela salta um pouco mais alto e quica
            gravity: 0.45,
            onGround: false,
            bounceForce: -5.5,
            getHitbox() {
                return { x: this.x, y: this.y, width: this.width, height: this.height };
            }
        });
    } else if (selectedPower === 'yoshi_egg') {
        gameElements.push({
            type: 'yoshi_egg',
            x: x,
            y: y,
            width: 16 * PIXEL_SCALE,
            height: 16 * PIXEL_SCALE,
            vx: LAUNCH_VX,
            vy: LAUNCH_VY,
            gravity: 0.45,
            onGround: false,
            getHitbox() {
                return { x: this.x, y: this.y, width: this.width, height: this.height };
            }
        });
    }
}

// Collisions check (AABB)
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update Game Loop Logic
function updateGame(dt) {
    if (gameState !== STATES.PLAYING) return;

    // ==========================================
    // V3 BOSS TRIGGER CYCLE
    // ==========================================
    if (score >= nextBossScore && !bossActive && bossState !== 'defeated') {
        // Start Boss Battle Challenge!
        bossActive = true;
        bossState = 'entering';
        bossHp = 3;
        bossX = CANVAS_WIDTH + 80;
        
        // Random Boss Selection: bowser, sonic, kamek
        const bossesList = ['bowser', 'sonic', 'kamek'];
        bossType = bossesList[Math.floor(Math.random() * bossesList.length)];
        
        // Setup Boss dimensions based on Type
        if (bossType === 'bowser') {
            bossWidth = 32 * PIXEL_SCALE;
            bossHeight = 32 * PIXEL_SCALE;
            bossY = GROUND_Y - bossHeight;
            bossSpeed = 2.0;
        } else if (bossType === 'sonic') {
            bossWidth = 24 * PIXEL_SCALE;
            bossHeight = 24 * PIXEL_SCALE;
            bossY = GROUND_Y - bossHeight;
            bossSpeed = 2.5;
        } else if (bossType === 'kamek') {
            bossWidth = 24 * PIXEL_SCALE;
            bossHeight = 24 * PIXEL_SCALE;
            bossY = GROUND_Y - bossHeight - 20; // floats slightly
            bossSpeed = 1.8;
        }

        // Clean screen of all normal obstacles
        gameElements = [];
        bossProjectiles = [];

        playWarningAlarm();
        setTimeout(() => {
            if (bossActive && gameState === STATES.PLAYING) {
                startBossMusic();
            }
        }, 1300);

        // Display Left/Right arrow overlay controls on mobile
        if (bossArrowsPanel) {
            bossArrowsPanel.style.display = 'flex';
        }
    }

    // 1. Update Game Speed and Score over time
    if (bossActive) {
        // Slow down ground scrolling to a complete halt
        gameSpeed = Math.max(0, gameSpeed - 0.12 * (dt / 16.67));
    } else {
        // Speed increases dynamically per level + minor smooth boost
        const levelSpeedBonus = (level - 1) * 1.25;
        const smoothBonus = (score % 1000) / 1000 * 1.25;
        gameSpeed = Math.min(maxSpeed, baseSpeed + levelSpeedBonus + smoothBonus);
        score += Math.floor(dt * 0.08);
    }

    // Level progression check (every 1000 points increases Level)
    const targetLevel = Math.floor(score / 1000) + 1;
    if (targetLevel > level && !bossActive) {
        level = targetLevel;
        playLevelUpSound();
        levelUpBannerTimer = 2000; // Display Level Up text for 2s
        customBannerText = `FASE ${level} UP!`;
    }

    if (levelUpBannerTimer > 0) {
        levelUpBannerTimer -= dt;
    }

    // Interpolate Sky Colors smoothly towards current phase values
    const colorIndex = (level - 1) % SKY_COLORS.length;
    const currentTarget = SKY_COLORS[colorIndex];
    currentSkyTop = lerpColor(currentSkyTop, currentTarget.top, 0.015 * (dt / 16.67));
    currentSkyBottom = lerpColor(currentSkyBottom, currentTarget.bottom, 0.015 * (dt / 16.67));

    updateHUD();

    // 2. Update player physics
    player.update(dt);

    // ==========================================
    // V3 BOSS BEHAVIOR PATTERNS
    // ==========================================
    if (bossActive) {
        if (bossFlashTimer > 0) {
            bossFlashTimer -= dt;
        }

        // Boss Entry Animation
        if (bossState === 'entering') {
            bossX -= 2.5 * (dt / 16.67);
            if (bossX <= 580 && gameSpeed <= 0) {
                bossX = 580;
                bossState = 'fighting';
                bossAttackTimer = 1000; // Attack in 1 second
            }
        }
        
        // Active Boss Combat
        else if (bossState === 'fighting') {
            // Move back and forth in their half of screen
            bossX += bossSpeed * bossDirection * (dt / 16.67);
            if (bossX < 350) {
                bossX = 350;
                bossDirection = 1;
            } else if (bossX > 680) {
                bossX = 680;
                bossDirection = -1;
            }

            // Floats up and down slightly if Kamek
            if (bossType === 'kamek') {
                bossY = GROUND_Y - bossHeight - 20 + Math.sin(Date.now() / 200) * 15;
            }

            // Attack cooldown updates
            bossAttackTimer -= dt;
            if (bossAttackTimer <= 0) {
                // Perform Attack
                if (bossType === 'bowser') {
                    // Spits fireball projectile moving left
                    bossProjectiles.push({
                        type: 'fire',
                        x: bossX - 20,
                        y: bossY + 12 * PIXEL_SCALE,
                        vx: -4.5,
                        vy: 0,
                        width: 12 * PIXEL_SCALE,
                        height: 12 * PIXEL_SCALE
                    });
                    bossAttackTimer = 1600 + Math.random() * 1000;
                } else if (bossType === 'sonic') {
                    // Dash Charge Attack! Sonic transforms into spinball
                    bossState = 'charging';
                    bossSpeed = 9.0;
                    bossDirection = -1;
                    bossAttackTimer = 2200 + Math.random() * 1000;
                } else if (bossType === 'kamek') {
                    // Cast magic spell projectile (wavy path)
                    bossProjectiles.push({
                        type: 'magic',
                        x: bossX - 20,
                        y: bossY + 10 * PIXEL_SCALE,
                        startY: bossY + 10 * PIXEL_SCALE,
                        vx: -3.8,
                        vy: 0,
                        width: 12 * PIXEL_SCALE,
                        height: 12 * PIXEL_SCALE
                    });
                    bossAttackTimer = 1800 + Math.random() * 1200;
                }
            }
        }

        // Sonic Spinball Charging Loop
        else if (bossState === 'charging') {
            bossX += bossSpeed * bossDirection * (dt / 16.67);
            if (bossX < -60) {
                // Charged off screen left, stop and prepare to return
                bossX = -60;
                bossDirection = 1; // move right
                bossState = 'returning';
                bossSpeed = 4.0;
            }
        }

        // Sonic walking back to his spot
        else if (bossState === 'returning') {
            bossX += bossSpeed * bossDirection * (dt / 16.67);
            if (bossX >= 580) {
                bossX = 580;
                bossDirection = -1;
                bossState = 'fighting';
                bossSpeed = 2.5;
            }
        }

        // Update Boss Projectiles
        const keptProjectiles = [];
        bossProjectiles.forEach(p => {
            p.x += p.vx * (dt / 16.67);
            
            // Magical wavy movement for Kamek magic
            if (p.type === 'magic') {
                p.y = p.startY + Math.sin(p.x / 40) * 45;
            } else {
                p.y += p.vy * (dt / 16.67);
            }

            // Collision checks with Player
            const pBox = { x: p.x, y: p.y, width: p.width, height: p.height };
            if (checkCollision(player.getHitbox(), pBox)) {
                playerHit();
                // delete projectile on hit
                return;
            }

            // Keep if on screen
            if (p.x > -50) {
                keptProjectiles.push(p);
            }
        });
        bossProjectiles = keptProjectiles;

        // Boss Stomp Check: Landing on the boss's head
        const bossHitbox = { x: bossX, y: bossY, width: bossWidth, height: bossHeight };
        if (checkCollision(player.getHitbox(), bossHitbox)) {
            // Check if Mario is falling down, and his bottom was above the boss's head
            const isFalling = player.vy > 0;
            const wasAbove = (player.y + player.height - player.vy <= bossY + 24);

            if (isFalling && wasAbove && bossState !== 'defeated') {
                // STOMP DAMAGE!
                bossHp--;
                bossFlashTimer = 600; // flash white for 600ms
                player.vy = -9.0; // Bounce Mario up
                playBossHurtSound();

                if (bossHp <= 0) {
                    // BOSS DEFEATED!
                    bossState = 'defeated';
                    bossVy = -6.5; // bounce boss upwards slightly as they die
                    playBossDefeatSound();
                    bossProjectiles = [];
                    
                    if (bossArrowsPanel) {
                        bossArrowsPanel.style.display = 'none';
                    }

                    // Schedule banner overlay
                    levelUpBannerTimer = 2200;
                    customBannerText = "CHEFE DERROTADO!";
                }
            } else {
                // Sideways collision: Mario takes damage
                if (bossState !== 'defeated') {
                    playerHit();
                }
            }
        }
    }

    // Update Defeated Boss animation (falling spinning off screen)
    if (bossState === 'defeated') {
        bossVy += 0.45 * (dt / 16.67);
        bossY += bossVy * (dt / 16.67);
        bossX += 1.8 * (dt / 16.67); // spins rightward

        if (bossY > CANVAS_HEIGHT + 100) {
            // Boss Battle fully cleared! Return to runner
            bossActive = false;
            bossState = ''; // reset state
            nextBossScore = score + 5000; // next boss triggers in 5000 score
            obstacleTimer = 0;
            nextSpawnTime = 1200;
            updateStats();
        }
    }

    // 3. Update scrolling backgrounds
    if (gameSpeed > 0) {
        clouds.forEach(cloud => {
            cloud.x -= gameSpeed * cloud.speedMultiplier;
            if (cloud.x < -cloud.width) {
                cloud.x = CANVAS_WIDTH + Math.random() * 150;
                cloud.y = 30 + Math.random() * 80;
            }
        });

        hills.forEach(hill => {
            hill.x -= gameSpeed * hill.speedMultiplier;
            if (hill.x < -hill.width) {
                hill.x = CANVAS_WIDTH + Math.random() * 200;
            }
        });

        bushes.forEach(bush => {
            bush.x -= gameSpeed * bush.speedMultiplier;
            if (bush.x < -bush.width) {
                bush.x = CANVAS_WIDTH + Math.random() * 250;
            }
        });

        const groundWidth = 16 * PIXEL_SCALE;
        groundTiles.forEach(tile => {
            tile.x -= gameSpeed;
            if (tile.x < -groundWidth) {
                let maxX = 0;
                groundTiles.forEach(t => { maxX = Math.max(maxX, t.x); });
                tile.x = maxX + groundWidth - 1;
            }
        });
    }

    // 4. Obstacle Spawner (disabled during boss battles)
    if (!bossActive) {
        obstacleTimer += dt;
        if (obstacleTimer > nextSpawnTime) {
            let tooClose = false;
            gameElements.forEach(el => {
                if (el.x > CANVAS_WIDTH - 280) {
                    tooClose = true;
                }
            });

            if (!tooClose) {
                spawnRandomElement();
                obstacleTimer = 0;
                nextSpawnTime = Math.max(800, 1600 - (gameSpeed * 60) + Math.random() * 800);
            }
        }
    }

    // 5. Update and filter Game Elements (only runs for normal elements)
    const elementsToKeep = [];
    const tongueHitbox = player.getTongueHitbox();

    for (let el of gameElements) {
        if (el.type === 'escaped_yoshi') {
            el.x += el.vx;
            el.vy += el.gravity;
            el.y += el.vy;
            const yGround = GROUND_Y - el.height / 2;
            if (el.y >= yGround) {
                el.y = yGround;
                el.vy = 0;
                el.vx = 8.5;
            }
            if (el.x < CANVAS_WIDTH + 100) {
                elementsToKeep.push(el);
            }
            continue;
        }

        // Update velocity dynamically based on current gameSpeed so scrolling matches the ground speed
        if (el.type === 'goomba' && !el.stomped) {
            el.vx = -gameSpeed;
        } else if (el.type === 'koopa_shell' && el.vx <= 0) {
            el.vx = -(gameSpeed + 1.5);
        } else if (el.type === 'bullet_bill') {
            el.vx = -(gameSpeed + 3.0);
        } else if (el.type === 'mystery_block') {
            el.vx = -gameSpeed;
        } else if (el.type === 'coin') {
            el.vx = -gameSpeed;
        } else if (el.type === 'mushroom' && el.onGround) {
            el.vx = -gameSpeed + 2.5;
        } else if (el.type === 'star' && el.onGround) {
            el.vx = -gameSpeed + 2.5;
        } else if (el.type === 'yoshi_egg' && el.onGround) {
            el.vx = -gameSpeed + 2.0;
        }

        el.x += el.vx;

        // Custom individual updates
        if (el.type === 'goomba') {
            if (el.stomped) {
                el.stompTimer += dt;
                el.vx = -gameSpeed;
                if (el.stompTimer < 300) {
                    elementsToKeep.push(el);
                }
                continue;
            } else {
                el.walkTimer += dt;
                if (el.walkTimer > 150) {
                    el.walkFrame = el.walkFrame === 0 ? 1 : 0;
                    el.walkTimer = 0;
                }
            }
        }
        
        else if (el.type === 'koopa_shell') {
            el.spinTimer += dt;
            if (el.spinTimer > 80) {
                el.spinFrame = el.spinFrame === 0 ? 1 : 0;
                el.spinTimer = 0;
            }
        }
        
        else if (el.type === 'coin') {
            if (el.collected) continue;
            el.spinTimer += dt;
            if (el.spinTimer > 100) {
                el.spinFrame = (el.spinFrame + 1) % 4;
                el.spinTimer = 0;
            }
        }
        
        else if (el.type === 'mystery_block') {
            if (!el.hit) {
                el.animTimer += dt;
                if (el.animTimer > 200) {
                    el.animFrame = (el.animFrame + 1) % 2;
                    el.animTimer = 0;
                }
            } else if (el.bounceTimer > 0) {
                // Animação de bounce: bloco sobe e desce ao ser atingido
                el.bounceTimer -= dt;
                const progress = el.bounceTimer / 200;  // 1.0 → 0.0
                const bounceHeight = Math.sin(progress * Math.PI) * 10; // arco suave de 10px
                el.y = el.bounceY - bounceHeight;
                if (el.bounceTimer <= 0) {
                    el.y = el.bounceY; // volta à posição exata
                }
            }
        }
        
        else if (el.type === 'mushroom') {
            el.vy += el.gravity;
            el.y += el.vy;
            const mGround = GROUND_Y - el.height;
            if (el.y >= mGround) {
                el.y = mGround;
                el.vy = 0;
                el.onGround = true;
            }
            // Enquanto no ar: mantém o impulso de lançamento (vx positivo)
            // Após pousar: desliza suavemente para frente, desacelerando com atrito
            if (el.onGround) {
                el.vx = el.vx > 0
                    ? Math.max(-gameSpeed + 1.5, el.vx - 0.15) // desacelera gradualmente
                    : -gameSpeed + 1.5;                          // depois segue o cenário
            }
        }

        else if (el.type === 'star') {
            el.vy += el.gravity;
            el.y += el.vy;
            const sGround = GROUND_Y - el.height;
            if (el.y >= sGround) {
                el.y = sGround;
                el.vy = el.bounceForce; // quica ao pousar
                el.onGround = true;
            }
            // Enquanto no ar: mantém o impulso; após quicar: desacelera gradualmente
            if (el.onGround) {
                el.vx = el.vx > 0
                    ? Math.max(-gameSpeed + 1.5, el.vx - 0.1)
                    : -gameSpeed + 1.5;
            }
        }

        else if (el.type === 'yoshi_egg') {
            el.vy += el.gravity;
            el.y += el.vy;
            const eGround = GROUND_Y - el.height;
            if (el.y >= eGround) {
                el.y = eGround;
                el.vy = 0;
                el.onGround = true;
            }
            // Enquanto no ar: mantém o impulso; após pousar: desacelera gradualmente
            if (el.onGround) {
                el.vx = el.vx > 0
                    ? Math.max(-gameSpeed + 1.0, el.vx - 0.15)
                    : -gameSpeed + 1.0;
            }
        }

        // Yoshi tongue eating checks
        if (tongueHitbox && ['goomba', 'koopa_shell', 'bullet_bill'].includes(el.type) && !el.stomped) {
            if (checkCollision(tongueHitbox, el.getHitbox())) {
                score += 500;
                coins += 2;
                playYoshiEatSound();
                player.tongueState = 'in';
                continue;
            }
        }

        // Player standard item/obstacle collision checks
        if (checkCollision(player.getHitbox(), el.getHitbox())) {
            if (el.type === 'coin' && !el.collected) {
                el.collected = true;
                coins++;
                score += 100;
                playCoinSound();
                continue;
            }
            
            else if (el.type === 'mushroom') {
                if (activePowerUp === 'small') {
                    activePowerUp = 'super';
                    // Ajuste imediato da posição Y ao crescer (evita flutuação de 1 frame)
                    if (!player.isJumping) {
                        player.y = GROUND_Y - (28 * PIXEL_SCALE);
                    }
                    player.invincible = true;
                    player.invincibleTimer = 1500; // 1.5s de invulnerabilidade ao crescer (piscando)
                    playPowerUpSound();
                    updateStats();
                } else {
                    score += 1000;
                    playCoinSound();
                }
                continue;
            }

            else if (el.type === 'star') {
                player.starInvincible = true;
                player.starTimer = 7000;
                playPowerUpSound();
                startStarMusic();
                updateStats();
                continue;
            }

            else if (el.type === 'yoshi_egg') {
                player.ridingYoshi = true;
                playEggHatchSound();
                updateStats();
                continue;
            }
            
            else if (el.type === 'mystery_block') {
                // Headbutt: Mario está subindo E topo da cabeça do Mario está dentro do bloco
                if (player.vy < 0 && !el.hit) {
                    const playerTop = player.y;
                    const blockBottom = el.y + el.height;
                    // O topo do Mario precisa estar na metade inferior do bloco (batendo por baixo)
                    if (playerTop < blockBottom && playerTop > el.y) {
                        el.hit = true;
                        el.bounceY = el.y;      // posição original para animação de bounce
                        el.bounceTimer = 200;    // ms de animação do bloco subindo e descendo
                        playCoinSound();
                        spawnPowerUp(el.x, el.y - el.height); // power-up salta do topo do bloco
                        player.vy = 2; // empurra Mario levemente para baixo após bater
                    }
                }
            }
            
            else if (el.type === 'goomba' && !el.stomped) {
                if (player.starInvincible) {
                    el.stomped = true;
                    el.stompTimer = 0;
                    score += 200;
                    playStompSound();
                } else if (player.vy > 0 && (player.y + player.height - player.vy <= el.y + 12 * PIXEL_SCALE)) {
                    el.stomped = true;
                    el.stompTimer = 0;
                    player.vy = -8.0;
                    score += 200;
                    playStompSound();
                } else {
                    playerHit();
                }
            }
            
            else if (el.type === 'koopa_shell') {
                if (player.starInvincible) {
                    el.vx = 15.0;
                    score += 300;
                    playStompSound();
                } else if (player.vy > 0 && (player.y + player.height - player.vy <= el.y + 8 * PIXEL_SCALE)) {
                    el.vx = 14.0;
                    player.vy = -7.5;
                    score += 300;
                    playStompSound();
                } else {
                    if (el.vx < 0) {
                        playerHit();
                    }
                }
            }
            
            else if (el.type === 'bullet_bill') {
                if (player.starInvincible) {
                    el.vx = 10.0;
                    el.vy = 8.0;
                    score += 400;
                    playStompSound();
                } else {
                    playerHit();
                }
            }
        }

        if (el.x > -el.width - 50 && el.x < CANVAS_WIDTH + 150) {
            elementsToKeep.push(el);
        }
    }
    
    gameElements = elementsToKeep;
}

// Player hit damage handling
function playerHit() {
    if (player.starInvincible || player.invincible) return;

    if (player.ridingYoshi) {
        player.ridingYoshi = false;
        player.invincible = true;
        player.invincibleTimer = 1500;
        playPowerDownSound();
        updateStats();

        // Spawn escaping Yoshi particle running off-screen right
        gameElements.push({
            type: 'escaped_yoshi',
            x: player.x,
            y: player.y,
            width: 24 * PIXEL_SCALE,
            height: 32 * PIXEL_SCALE,
            vx: 7.0,
            vy: -4.0,
            gravity: 0.5,
            getHitbox() { return { x:0, y:0, width:0, height:0 }; }
        });
        return;
    }

    if (activePowerUp === 'super') {
        activePowerUp = 'small';
        player.invincible = true;
        player.invincibleTimer = 1500;
        playPowerDownSound();
        updateStats();
    } else {
        gameOver();
    }
}

// Game Over execution
function gameOver() {
    gameState = STATES.GAMEOVER;
    playGameOverSound();
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('mario_dino_highscore', highScore);
    }
    
    updateHUD();
    updateStats();
    
    gameOverlay.style.opacity = '1';
    gameOverlay.style.pointerEvents = 'auto';
    overlayContent.innerHTML = `
        <div class="pixel-text gameover-title animate-bounce">FIM DE JOGO</div>
        <div class="pixel-text instruction-text" style="color: #fff; margin-bottom: 20px;">Pontuação: ${score}</div>
        <div class="pixel-text blink" style="color: var(--neon-yellow); font-size: 0.65rem;">PRESSIONE ESPAÇO PARA TENTAR DE NOVO</div>
    `;
}

// Reset Game State to start playing
function resetGame() {
    gameState = STATES.PLAYING;
    score = 0;
    coins = 0;
    level = 1;
    levelUpBannerTimer = 0;
    gameSpeed = baseSpeed;
    obstacleTimer = 0;
    nextSpawnTime = 1400;
    
    // V3 Boss variables reset
    bossActive = false;
    bossState = '';
    bossProjectiles = [];
    nextBossScore = 5000;
    stopBossMusic();

    if (bossArrowsPanel) {
        bossArrowsPanel.style.display = 'none';
    }

    currentSkyTop = SKY_COLORS[0].top;
    currentSkyBottom = SKY_COLORS[0].bottom;

    player.reset();
    gameElements = [];
    initEnvironment();
    
    updateHUD();
    updateStats();
    
    gameOverlay.style.opacity = '0';
    gameOverlay.style.pointerEvents = 'none';
}

// Update screen details
function updateHUD() {
    hudCoins.textContent = String(coins).padStart(2, '0');
    hudScore.textContent = String(score).padStart(5, '0');
    hudHighScore.textContent = String(highScore).padStart(5, '0');
}

// Update control panel stats
function updateStats() {
    statState.textContent = gameState;
    
    if (gameState === STATES.PLAYING) {
        statState.className = 'stat-value pixel-text green';
    } else if (gameState === STATES.PAUSED) {
        statState.className = 'stat-value pixel-text yellow';
    } else if (gameState === STATES.GAMEOVER) {
        statState.className = 'stat-value pixel-text red';
    } else {
        statState.className = 'stat-value pixel-text yellow';
    }

    statLevel.textContent = level;

    // Power-Up Display
    statPower.textContent = activePowerUp.toUpperCase();
    if (activePowerUp === 'super') {
        statPower.className = 'stat-value pixel-text green';
    } else {
        statPower.className = 'stat-value pixel-text yellow';
    }

    // Yoshi / Star Display
    if (player.starInvincible) {
        statYoshi.textContent = "ESTRELA";
        statYoshi.className = 'stat-value pixel-text yellow blink';
    } else if (player.ridingYoshi) {
        statYoshi.textContent = "YOSHI";
        statYoshi.className = 'stat-value pixel-text green';
    } else {
        statYoshi.textContent = "NENHUM";
        statYoshi.className = 'stat-value pixel-text';
    }
}

// Toggle play/pause
function togglePause() {
    if (gameState === STATES.PLAYING) {
        gameState = STATES.PAUSED;
        btnStartPause.textContent = "RETOMAR";
        updateStats();
        
        gameOverlay.style.opacity = '1';
        gameOverlay.style.pointerEvents = 'auto';
        overlayContent.innerHTML = `
            <div class="pixel-text start-title">PAUSADO</div>
            <div class="pixel-text blink instruction-text">PRESSIONE P PARA RETOMAR</div>
        `;
    } else if (gameState === STATES.PAUSED) {
        gameState = STATES.PLAYING;
        btnStartPause.textContent = "PAUSAR";
        updateStats();
        
        gameOverlay.style.opacity = '0';
        gameOverlay.style.pointerEvents = 'none';
    } else if (gameState === STATES.START) {
        resetGame();
        btnStartPause.textContent = "PAUSAR";
    }
}

// Main Render Loop
function drawGame() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Sky Background
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    skyGrad.addColorStop(0, currentSkyTop);
    skyGrad.addColorStop(1, currentSkyBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);

    // Underground
    ctx.fillStyle = '#4a2700';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

    // Clouds
    clouds.forEach(c => {
        drawSprite(ctx, 'cloud', c.x, c.y, c.width, c.height, true);
    });

    // Hills
    hills.forEach(h => {
        drawSprite(ctx, 'hill', h.x, h.y, h.width, h.height, true);
    });

    // Bushes
    bushes.forEach(b => {
        drawSprite(ctx, 'bush', b.x, b.y, b.width, b.height, true);
    });

    // Ground
    groundTiles.forEach(tile => {
        drawSprite(ctx, 'ground', tile.x, tile.y, tile.width, tile.height, true);
    });

    // Game Elements
    gameElements.forEach(el => {
        let key = '';
        let w = el.width;
        let h = el.height;

        if (el.type === 'goomba') {
            key = el.stomped ? 'goomba_flat' : (el.walkFrame === 0 ? 'goomba_run1' : 'goomba_run2');
        } else if (el.type === 'koopa_shell') {
            key = el.spinFrame === 0 ? 'koopa_shell1' : 'koopa_shell2';
        } else if (el.type === 'bullet_bill') {
            key = 'bullet_bill';
        } else if (el.type === 'coin') {
            key = `coin_${el.spinFrame + 1}`;
        } else if (el.type === 'mystery_block') {
            key = el.hit ? 'mystery_empty' : (el.animFrame === 0 ? 'mystery_1' : 'mystery_2');
        } else if (el.type === 'mushroom') {
            key = 'mushroom';
        } else if (el.type === 'star') {
            key = 'star';
        } else if (el.type === 'yoshi_egg') {
            key = 'yoshi_egg';
        } else if (el.type === 'escaped_yoshi') {
            key = el.spriteKey;
        }

        drawSprite(ctx, key, el.x, el.y, w, h, el.vx <= 0 || el.type === 'escaped_yoshi');
    });

    // ==========================================
    // V3 DRAW BOSS & PROJECTILES & HP BAR
    // ==========================================
    if (bossActive || bossState === 'defeated') {
        let key = '';
        if (bossType === 'bowser') {
            key = 'boss_bowser';
        } else if (bossType === 'sonic') {
            key = bossState === 'charging' ? 'projectile_spin' : 'boss_sonic';
        } else if (bossType === 'kamek') {
            key = 'boss_kamek';
        }

        // White Flash Palette override on damage hit
        let flashOverride = null;
        if (bossFlashTimer > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
            flashOverride = {
                'R': '#FFFFFF',
                'U': '#FFFFFF',
                'S': '#FFFFFF',
                'B': '#FFFFFF',
                'Y': '#FFFFFF',
                'G': '#FFFFFF',
                'P': '#FFFFFF'
            };
        }

        // Draw Boss (flipped upside down if defeated)
        ctx.save();
        const drawFacing = (bossDirection < 0 && bossState !== 'returning') ? true : false;
        
        if (bossState === 'defeated') {
            // Defeated spin rotation
            ctx.translate(bossX + bossWidth/2, bossY + bossHeight/2);
            ctx.rotate(Math.PI); // upside down
            drawSprite(ctx, key, -bossWidth/2, -bossHeight/2, bossWidth, bossHeight, true, flashOverride);
        } else {
            drawSprite(ctx, key, bossX, bossY, bossWidth, bossHeight, drawFacing, flashOverride);
        }
        ctx.restore();

        // Draw Boss Projectiles
        bossProjectiles.forEach(p => {
            let pKey = '';
            let pW = p.width;
            let pH = p.height;
            
            if (p.type === 'fire') {
                pKey = 'projectile_fire';
            } else if (p.type === 'magic') {
                pKey = 'projectile_magic';
            }
            drawSprite(ctx, pKey, p.x, p.y, pW, pH, true);
        });

        // Draw Boss HP Segments Bar
        if (bossState !== 'defeated' && bossState !== 'entering') {
            const barWidth = 80;
            const barHeight = 8;
            const barX = bossX + (bossWidth / 2) - (barWidth / 2);
            const barY = bossY - 22;

            // Background border
            ctx.fillStyle = '#000';
            ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);

            // Segments
            const segWidth = barWidth / 3;
            for (let i = 0; i < 3; i++) {
                if (i < bossHp) {
                    ctx.fillStyle = '#ff0000'; // red health segment
                } else {
                    ctx.fillStyle = '#444'; // grey empty segment
                }
                ctx.fillRect(barX + (i * segWidth) + 1, barY + 1, segWidth - 2, barHeight - 2);
            }
        }
    }

    // Draw Player
    player.draw();

    // Draw Yoshi's tongue
    if (player.ridingYoshi && player.tongueActive) {
        const tongueHitbox = player.getTongueHitbox();
        if (tongueHitbox) {
            ctx.strokeStyle = '#e52521';
            ctx.lineWidth = 6 * PIXEL_SCALE;
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(tongueHitbox.x, tongueHitbox.y + tongueHitbox.height / 2);
            ctx.lineTo(tongueHitbox.x + tongueHitbox.width, tongueHitbox.y + tongueHitbox.height / 2);
            ctx.stroke();

            ctx.fillStyle = '#ff7858';
            ctx.beginPath();
            ctx.arc(tongueHitbox.x + tongueHitbox.width, tongueHitbox.y + tongueHitbox.height / 2, 4 * PIXEL_SCALE, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw Flashing Banner Screen Overlay (Level up or Boss Cleared)
    if (levelUpBannerTimer > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, 140, CANVAS_WIDTH, 70);

        ctx.font = '16px "Press Start 2P"';
        ctx.fillStyle = '#f8d800'; // gold
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (Math.floor(Date.now() / 150) % 2 === 0) {
            ctx.fillText(customBannerText, CANVAS_WIDTH / 2, 175);
        }
    }
}

// High performance requestAnimationFrame loop
function gameLoop(time) {
    if (!lastTime) lastTime = time;
    let dt = time - lastTime;
    
    if (dt > 100) dt = 16.67;
    lastTime = time;

    updateGame(dt);
    drawGame();

    requestAnimationFrame(gameLoop);
}

// ==========================================
// INPUT HANDLING & EVENT LISTENERS
// ==========================================

function handleKeyDown(e) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyA', 'KeyD'].includes(e.code)) {
        e.preventDefault();
    }

    if (gameState === STATES.PLAYING) {
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
            keys.jump = true;
        }
        if (e.code === 'ArrowDown' || e.code === 'KeyS') {
            keys.duck = true;
            if (player.ridingYoshi) {
                player.triggerTongue();
            }
        }
        if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
            keys.left = true;
        }
        if (e.code === 'ArrowRight' || e.code === 'KeyD') {
            keys.right = true;
        }
        if (e.code === 'KeyP') {
            togglePause();
        }
    } else if (gameState === STATES.START) {
        if (e.code === 'Space' || e.code === 'Enter') {
            resetGame();
        }
    } else if (gameState === STATES.GAMEOVER) {
        if (e.code === 'Space' || e.code === 'Enter') {
            resetGame();
        }
    } else if (gameState === STATES.PAUSED) {
        if (e.code === 'KeyP' || e.code === 'Space') {
            togglePause();
        }
    }
}

function handleKeyUp(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        keys.jump = false;
    }
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keys.duck = false;
    }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keys.left = false;
    }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keys.right = false;
    }
}

// Setup Listeners
window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', handleKeyUp);

canvas.addEventListener('click', () => {
    initAudio();
});

btnStartPause.addEventListener('click', () => {
    initAudio();
    if (gameState === STATES.START || gameState === STATES.GAMEOVER) {
        resetGame();
        btnStartPause.textContent = "PAUSAR";
    } else {
        togglePause();
    }
});

btnRestart.addEventListener('click', () => {
    initAudio();
    resetGame();
    btnStartPause.textContent = "PAUSAR";
});

// Mute button logic
btnMute.addEventListener('click', () => {
    initAudio();
    const isMuted = toggleMute();
    if (isMuted) {
        btnMute.classList.add('muted');
        btnMute.querySelector('span').textContent = "MUDO";
        document.getElementById('muteIcon').innerHTML = `<path d="M13.5 2c-.179 0-.358.046-.52.14L6.966 6H2c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h4.966l6.014 3.86c.162.094.341.14.52.14.552 0 1-.448 1-1V3c0-.552-.448-1-1-1zm6.207 7.793l2.5-2.5 1.414 1.414-2.5 2.5 2.5 2.5-1.414 1.414-2.5-2.5-2.5 2.5-1.414-1.414 2.5-2.5-2.5-2.5 1.414-1.414 2.5 2.5z"/>`;
    } else {
        btnMute.classList.remove('muted');
        btnMute.querySelector('span').textContent = "SOM";
        document.getElementById('muteIcon').innerHTML = `<path d="M5.889 16H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h3.889l5.294-4.235A1 1 0 0 1 12.8 4.56v14.88a1 1 0 0 1-1.617.8L5.89 16zM22.414 12l2.122-2.121-1.414-1.415L21 10.586l-2.121-2.122-1.415 1.415L19.586 12l-2.122 2.121 1.415 1.415L21 13.414l2.121 2.122 1.414-1.414L22.414 12z"/>`;
    }
});

// Slider logic
volumeSlider.addEventListener('input', (e) => {
    initAudio();
    const val = parseInt(e.target.value);
    volumeValue.textContent = `${val}%`;
    setVolume(val / 100);
});

// Virtual Touch Controllers for Mobile
vBtnDuck.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    if (gameState === STATES.PLAYING) {
        keys.duck = true;
        if (player.ridingYoshi) {
            player.triggerTongue();
        }
    }
});

vBtnDuck.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.duck = false;
});

vBtnJump.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    if (gameState === STATES.PLAYING) {
        keys.jump = true;
    } else if (gameState === STATES.START || gameState === STATES.GAMEOVER) {
        resetGame();
    }
});

vBtnJump.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.jump = false;
});

// V3 Mobile arrow listeners
vBtnLeft.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    if (gameState === STATES.PLAYING) keys.left = true;
});
vBtnLeft.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.left = false;
});

vBtnRight.addEventListener('touchstart', (e) => {
    e.preventDefault();
    initAudio();
    if (gameState === STATES.PLAYING) keys.right = true;
});
vBtnRight.addEventListener('touchend', (e) => {
    e.preventDefault();
    keys.right = false;
});

// Mouse triggers fallback
vBtnDuck.addEventListener('mousedown', () => {
    initAudio();
    if (gameState === STATES.PLAYING) {
        keys.duck = true;
        if (player.ridingYoshi) {
            player.triggerTongue();
        }
    }
});
vBtnDuck.addEventListener('mouseup', () => { keys.duck = false; });
vBtnDuck.addEventListener('mouseleave', () => { keys.duck = false; });

vBtnJump.addEventListener('mousedown', () => {
    initAudio();
    if (gameState === STATES.PLAYING) {
        keys.jump = true;
    } else if (gameState === STATES.START || gameState === STATES.GAMEOVER) {
        resetGame();
    }
});
vBtnJump.addEventListener('mouseup', () => { keys.jump = false; });
vBtnJump.addEventListener('mouseleave', () => { keys.jump = false; });

// V3 Mouse triggers fallback for left/right
vBtnLeft.addEventListener('mousedown', () => { if (gameState === STATES.PLAYING) keys.left = true; });
vBtnLeft.addEventListener('mouseup', () => { keys.left = false; });
vBtnLeft.addEventListener('mouseleave', () => { keys.left = false; });

vBtnRight.addEventListener('mousedown', () => { if (gameState === STATES.PLAYING) keys.right = true; });
vBtnRight.addEventListener('mouseup', () => { keys.right = false; });
vBtnRight.addEventListener('mouseleave', () => { keys.right = false; });

// Initial HUD & Stat prints
updateHUD();
updateStats();
initEnvironment();

// Start Animation Frame Loop
requestAnimationFrame(gameLoop);
