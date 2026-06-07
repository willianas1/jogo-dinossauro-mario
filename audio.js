// Audio state variables
let audioCtx = null;
let masterGain = null;

const audioSettings = {
    muted: false,
    volume: 0.7 // Default volume 70%
};

let starMusicInterval = null;
let bossMusicInterval = null;

// Initialize Web Audio API on first user gesture
function initAudio() {
    if (audioCtx) return;
    
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            console.warn("Web Audio API não é suportado neste navegador.");
            return;
        }
        
        audioCtx = new AudioContextClass();
        masterGain = audioCtx.createGain();
        updateMasterVolume();
        masterGain.connect(audioCtx.destination);
    } catch (e) {
        console.error("Falha ao inicializar o AudioContext:", e);
    }
}

// Update the output gain based on volume and mute settings
function updateMasterVolume() {
    if (!masterGain || !audioCtx) return;
    const targetGain = audioSettings.muted ? 0 : audioSettings.volume;
    masterGain.gain.setValueAtTime(targetGain, audioCtx.currentTime);
}

// Set volume value (0.0 to 1.0)
function setVolume(value) {
    audioSettings.volume = Math.max(0, Math.min(1, value));
    updateMasterVolume();
}

// Toggle mute state
function toggleMute() {
    audioSettings.muted = !audioSettings.muted;
    updateMasterVolume();
    return audioSettings.muted;
}

// Helper to play a single synth tone
function playTone(freq, type, duration, startTime, vol = 1.0) {
    if (!audioCtx) return;
    
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gainNode.gain.setValueAtTime(vol * 0.15, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
}

// 1. Jump Sound: Quick rising pitch sweep
function playJumpSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.18);

    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.18);
}

// 2. Coin Sound: Dual chime (B6 then E7)
function playCoinSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    playTone(1975, 'square', 0.08, now, 0.2);
    playTone(2637, 'square', 0.35, now + 0.08, 0.2);
}

// 3. Power-Up Sound: Classic NES ascending chime arpeggio
function playPowerUpSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const notes = [330, 392, 659, 523, 659, 784];
    const duration = 0.07;

    notes.forEach((freq, idx) => {
        playTone(freq, 'square', 0.12, now + idx * duration, 0.15);
    });
}

// 4. Power-Down Sound: Series of descending slides
function playPowerDownSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const duration = 0.08;
    const sweeps = [
        { start: 600, end: 150 },
        { start: 500, end: 120 },
        { start: 400, end: 90 }
    ];

    sweeps.forEach((sweep, idx) => {
        const t = now + idx * (duration + 0.02);
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(sweep.start, t);
        osc.frequency.exponentialRampToValueAtTime(sweep.end, t + duration);

        gainNode.gain.setValueAtTime(0.15, t);
        gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(t);
        osc.stop(t + duration);
    });
}

// 5. Stomp / Damage Enemy: Hard noise sweep simulating punch/kick
function playStompSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.12);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.12);
}

// 6. Game Over Sound: Nostalgic descending death notes
function playGameOverSound() {
    initAudio();
    if (!audioCtx) return;
    
    stopStarMusic();
    stopBossMusic();

    const now = audioCtx.currentTime;
    const notes = [
        { f: 523, d: 0.15 }, // C5
        { f: 494, d: 0.15 }, // B4
        { f: 440, d: 0.15 }, // A4
        { f: 392, d: 0.15 }, // G4
        { f: 349, d: 0.15 }, // F4
        { f: 330, d: 0.40 }  // E4
    ];

    let currentStart = now;
    notes.forEach((note) => {
        playTone(note.f, 'square', note.d, currentStart, 0.2);
        currentStart += note.d + 0.02;
    });
}

// 7. Level Up Sound: Cheerful ascending synth chime arpeggio
function playLevelUpSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    playTone(1046, 'triangle', 0.10, now, 0.25);
    playTone(1318, 'triangle', 0.10, now + 0.08, 0.25);
    playTone(1568, 'triangle', 0.10, now + 0.16, 0.25);
    playTone(2093, 'square', 0.25, now + 0.24, 0.2);
}

// 8. Yoshi Eat Sound: Quick high tongue tick ("mlem") followed by throat gulp
function playYoshiEatSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(600, now);
    osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.06);
    gain1.gain.setValueAtTime(0.18, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc1.connect(gain1);
    gain1.connect(masterGain);
    osc1.start(now);
    osc1.stop(now + 0.06);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(350, now + 0.06);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.18);
    gain2.gain.setValueAtTime(0.3, now + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc2.start(now + 0.06);
    osc2.stop(now + 0.18);
}

// 9. Egg Hatch Sound: pop and crack
function playEggHatchSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    playTone(400, 'triangle', 0.05, now, 0.2);
    playTone(700, 'sawtooth', 0.03, now + 0.03, 0.1);
}

// 10. Starman Theme Music: Loops upbeat melodies using oscillators
function startStarMusic() {
    initAudio();
    if (!audioCtx) return;
    
    stopStarMusic(); // Stop previous loops

    const tempo = 1.92;
    
    function playMelodyLoop() {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        const t = audioCtx.currentTime;
        
        const melody = [
            { f: 523, o: 0.00 },
            { f: 523, o: 0.16 },
            { f: 523, o: 0.32 },
            { f: 392, o: 0.48 },
            { f: 440, o: 0.64 },
            { f: 392, o: 0.80 },
            
            { f: 523, o: 0.96 },
            { f: 523, o: 1.12 },
            { f: 523, o: 1.28 },
            { f: 392, o: 1.44 },
            { f: 440, o: 1.60 },
            { f: 392, o: 1.76 }
        ];

        melody.forEach(n => {
            playTone(n.f, 'square', 0.09, t + n.o, 0.10);
        });
    }

    playMelodyLoop();
    starMusicInterval = setInterval(() => {
        playMelodyLoop();
    }, tempo * 1000);
}

// Stop the looping star music
function stopStarMusic() {
    if (starMusicInterval) {
        clearInterval(starMusicInterval);
        starMusicInterval = null;
    }
}

// ==========================================
// NEW BOSS AUDIO SYNTHESIZERS (Version 3)
// ==========================================

// Warning Siren Alert
function playWarningAlarm() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    
    // Play a repeating alarm siren: high-low sweep 3 times
    for (let i = 0; i < 3; i++) {
        const startTime = now + i * 0.45;
        playTone(660, 'sawtooth', 0.20, startTime, 0.25);
        playTone(440, 'sawtooth', 0.20, startTime + 0.22, 0.25);
    }
}

// Boss damage hit sound
function playBossHurtSound() {
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;
    // Low frequency crunch + pitch slide down
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.linearRampToValueAtTime(60, now + 0.25);

    gainNode.gain.setValueAtTime(0.35, now);
    gainNode.gain.linearRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + 0.25);
}

// Defeat Explosion + victory short tune
function playBossDefeatSound() {
    initAudio();
    if (!audioCtx) return;
    
    stopBossMusic();

    const now = audioCtx.currentTime;

    // 1. Explosion sound
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(10, now + 0.5);
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.linearRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gainNode);
    gainNode.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.5);

    // 2. Victory Tune arpeggio (after explosion starts fading)
    const melody = [
        { f: 523, o: 0.4 }, // C5
        { f: 659, o: 0.5 }, // E5
        { f: 784, o: 0.6 }, // G5
        { f: 1046, o: 0.7 },// C6
        { f: 784, o: 0.85 },// G5
        { f: 1046, o: 1.0 } // C6 (long hold)
    ];

    melody.forEach(n => {
        playTone(n.f, 'square', n.f === 1046 && n.o > 0.9 ? 0.45 : 0.12, now + n.o, 0.2);
    });
}

// Boss Music Theme loop: Heavy retro combat synth bassline
function startBossMusic() {
    initAudio();
    if (!audioCtx) return;

    stopBossMusic();

    const tempo = 1.6; // 1.6 seconds per loop

    function playBossBeat() {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        const t = audioCtx.currentTime;
        
        // Heavy, rhythmic sawtooth bassline: A2, C3, D3, G3, A2...
        const notes = [
            { f: 110, o: 0.00 }, // A2
            { f: 110, o: 0.20 }, // A2
            { f: 130, o: 0.40 }, // C3
            { f: 146, o: 0.60 }, // D3
            { f: 110, o: 0.80 }, // A2
            { f: 110, o: 1.00 }, // A2
            { f: 196, o: 1.20 }, // G3
            { f: 146, o: 1.40 }  // D3
        ];

        notes.forEach(n => {
            playTone(n.f, 'sawtooth', 0.15, t + n.o, 0.18);
        });
    }

    playBossBeat();
    bossMusicInterval = setInterval(() => {
        playBossBeat();
    }, tempo * 1000);
}

// Stop boss loop
function stopBossMusic() {
    if (bossMusicInterval) {
        clearInterval(bossMusicInterval);
        bossMusicInterval = null;
    }
}
