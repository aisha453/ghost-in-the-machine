/**
 * Ghost in the Machine - Advanced Procedural Web Audio Synthesizer
 * 100% Offline, Zero external audio assets required.
 * Synthesizes: 
 * - Ghostly Gothic Background Music (Halloween / Music Box Arpeggios & Organ Drone)
 * - Thunderclap & Low Rolling Rumble
 * - Terrifying Banshee Howl / Screech
 * - Heavy Sub-Bass Heartbeat Pulse (Lub-Dub)
 * - Ancient Coffin / Floorboard Creak
 * - EVP Ghost Whispering Murmurs
 * - Jumpscare Metallic Stinger
 * - Electro-Magnetic Field (EMF) Geiger Clicks
 * - Ambient Dissonant Drone (43Hz)
 */

class SpectralAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.isMusicPlaying = false;
        this.droneGain = null;
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.musicGain = null;
        this.heartbeatTimer = null;
        this.ambientSpookTimer = null;
        this.musicInterval = null;
        this.melodyStep = 0;

        // Gothic Horror Melody (D Minor & C# Diminished - classic Halloween / Rosemary's Baby style)
        this.melodyNotes = [
            // Measure 1 & 2: D minor chilling pulse
            587.33, 440.00, 440.00, 587.33, 440.00, 440.00, 466.16, 440.00,
            587.33, 440.00, 440.00, 587.33, 440.00, 440.00, 659.25, 587.33,
            // Measure 3 & 4: C# diminished dread & bell descent
            554.37, 440.00, 440.00, 554.37, 440.00, 440.00, 466.16, 440.00,
            554.37, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63, 293.66
        ];
    }

    ensureContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        return this.ctx;
    }

    startDrone() {
        const ctx = this.ensureContext();
        if (this.droneOsc1) return;

        try {
            this.droneGain = ctx.createGain();
            this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, ctx.currentTime);
            this.droneGain.connect(ctx.destination);

            this.droneOsc1 = ctx.createOscillator();
            this.droneOsc1.type = 'sawtooth';
            this.droneOsc1.frequency.setValueAtTime(43.0, ctx.currentTime);

            this.droneOsc2 = ctx.createOscillator();
            this.droneOsc2.type = 'sine';
            this.droneOsc2.frequency.setValueAtTime(47.2, ctx.currentTime);

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(130, ctx.currentTime);
            filter.Q.setValueAtTime(4.0, ctx.currentTime);

            this.droneOsc1.connect(filter);
            this.droneOsc2.connect(filter);
            filter.connect(this.droneGain);

            this.droneOsc1.start();
            this.droneOsc2.start();

            this.startHeartbeatLoop();
            this.startAmbientSpooks();
        } catch (e) {
            console.warn("Drone audio could not start:", e);
        }
    }

    // ==================== GHOSTLY BACKGROUND MUSIC ====================
    startGhostMusic() {
        const ctx = this.ensureContext();
        this.isMusicPlaying = true;

        if (!this.musicGain) {
            this.musicGain = ctx.createGain();
            this.musicGain.gain.setValueAtTime(0.18, ctx.currentTime);
            this.musicGain.connect(ctx.destination);
        } else {
            this.musicGain.gain.setTargetAtTime(0.18, ctx.currentTime, 0.2);
        }

        if (this.musicInterval) clearInterval(this.musicInterval);

        // Play each 16th note at ~240ms (creepy hypnotic tempo)
        this.musicInterval = setInterval(() => {
            if (!this.isMusicPlaying) return;
            const freq = this.melodyNotes[this.melodyStep % this.melodyNotes.length];
            this.playMusicBoxNote(freq);

            // Every 8 steps, swell a deep haunted cathedral bass organ note
            if (this.melodyStep % 8 === 0) {
                const bassFreq = (this.melodyStep % 16 === 0) ? 73.42 : 58.27; // D2 or Bb1
                this.playCathedralBass(bassFreq);
            }

            this.melodyStep++;
        }, 240);
    }

    stopGhostMusic() {
        this.isMusicPlaying = false;
        if (this.musicInterval) {
            clearInterval(this.musicInterval);
            this.musicInterval = null;
        }
        if (this.musicGain && this.ctx) {
            this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
        }
    }

    toggleGhostMusic() {
        if (this.isMusicPlaying) {
            this.stopGhostMusic();
            return false;
        } else {
            this.startGhostMusic();
            return true;
        }
    }

    // Single delicate, chilling music box / bell chime
    playMusicBoxNote(freq) {
        if (!this.ctx || !this.isMusicPlaying) return;
        try {
            const now = this.ctx.currentTime;
            
            // Fundamental sine (pure music box tine)
            const osc = this.ctx.createOscillator();
            const oscGain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            // High metallic inharmonic harmonic (bell ping)
            const harm = this.ctx.createOscillator();
            const harmGain = this.ctx.createGain();
            harm.type = 'sine';
            harm.frequency.setValueAtTime(freq * 2.756, now);

            // Reverb-like decaying envelope
            oscGain.gain.setValueAtTime(0.01, now);
            oscGain.gain.linearRampToValueAtTime(0.16, now + 0.008);
            oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

            harmGain.gain.setValueAtTime(0.06, now);
            harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

            osc.connect(oscGain);
            harm.connect(harmGain);

            oscGain.connect(this.musicGain);
            harmGain.connect(this.musicGain);

            osc.start(now);
            harm.start(now);
            osc.stop(now + 0.6);
            harm.stop(now + 0.25);
        } catch (e) {}
    }

    // Low Cathedral Organ Bass Swell
    playCathedralBass(freq) {
        if (!this.ctx || !this.isMusicPlaying) return;
        try {
            const now = this.ctx.currentTime;
            const bass = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            bass.type = 'triangle';
            bass.frequency.setValueAtTime(freq, now);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(180, now);
            filter.frequency.linearRampToValueAtTime(90, now + 1.8);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.24, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);

            bass.connect(filter);
            filter.connect(gain);
            gain.connect(this.musicGain);

            bass.start(now);
            bass.stop(now + 2.0);
        } catch (e) {}
    }

    toggleMute() {
        const ctx = this.ensureContext();
        this.isMuted = !this.isMuted;
        
        if (!this.isMuted && !this.droneOsc1) {
            this.startDrone();
        }
        if (this.droneGain) {
            this.droneGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.08, ctx.currentTime, 0.15);
        }

        // Toggle music with main audio
        if (!this.isMuted && !this.isMusicPlaying) {
            this.startGhostMusic();
        } else if (this.isMuted && this.isMusicPlaying) {
            this.stopGhostMusic();
        }

        return !this.isMuted;
    }

    unmute() {
        const ctx = this.ensureContext();
        this.isMuted = false;
        if (!this.droneOsc1) {
            this.startDrone();
        }
        if (this.droneGain) {
            this.droneGain.gain.setTargetAtTime(0.08, ctx.currentTime, 0.15);
        }
        if (!this.isMusicPlaying) {
            this.startGhostMusic();
        }
    }

    startHeartbeatLoop() {
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => {
            if (!this.isMuted && Math.random() < 0.45) {
                this.playHeartbeat();
            }
        }, 3400);
    }

    startAmbientSpooks() {
        if (this.ambientSpookTimer) clearInterval(this.ambientSpookTimer);
        this.ambientSpookTimer = setInterval(() => {
            if (this.isMuted) return;
            const roll = Math.random();
            if (roll < 0.25) {
                this.playGhostBreath();
            } else if (roll < 0.45) {
                this.playCreak();
            } else if (roll < 0.65) {
                this.playGhostWhispers();
            }
        }, 9500);
    }

    // 1. Deep Thunderclap & Rolling Rumble
    playThunder() {
        const ctx = this.ensureContext();
        try {
            const now = ctx.currentTime;
            
            // Sharp lightning crack (high-pass noise)
            const bufferSize = ctx.sampleRate * 2.8;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(450, now);
            filter.frequency.exponentialRampToValueAtTime(60, now + 2.5);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.45, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(now);

            // Sub-bass boom
            const sub = ctx.createOscillator();
            const subGain = ctx.createGain();
            sub.type = 'sine';
            sub.frequency.setValueAtTime(110, now);
            sub.frequency.exponentialRampToValueAtTime(32, now + 1.2);

            subGain.gain.setValueAtTime(0.4, now);
            subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

            sub.connect(subGain);
            subGain.connect(ctx.destination);
            sub.start(now);
            sub.stop(now + 1.85);
        } catch (e) {
            console.error("Thunder sound error:", e);
        }
    }

    // 2. Terrifying Banshee Screech / Howl
    playBansheeScreech() {
        const ctx = this.ensureContext();
        try {
            const now = ctx.currentTime;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(420, now);
            osc.frequency.exponentialRampToValueAtTime(1600, now + 0.35);
            osc.frequency.exponentialRampToValueAtTime(280, now + 1.3);

            // Vibrato LFO
            const lfo = ctx.createOscillator();
            const lfoGain = ctx.createGain();
            lfo.frequency.setValueAtTime(14, now);
            lfoGain.gain.setValueAtTime(120, now);
            lfo.connect(osc.frequency);
            lfo.start(now);
            lfo.stop(now + 1.4);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(900, now);
            filter.frequency.exponentialRampToValueAtTime(2400, now + 0.4);
            filter.frequency.exponentialRampToValueAtTime(350, now + 1.3);
            filter.Q.setValueAtTime(5.0, now);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 1.45);
        } catch (e) {
            console.error("Banshee sound error:", e);
        }
    }

    // 3. Heavy Sub-Bass Heartbeat Pulse (Lub-Dub)
    playHeartbeat() {
        const ctx = this.ensureContext();
        try {
            const now = ctx.currentTime;
            
            // Lub
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(75, now);
            osc1.frequency.exponentialRampToValueAtTime(32, now + 0.14);
            
            gain1.gain.setValueAtTime(0.45, now);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
            
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.18);

            // Dub (180ms later)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(62, now + 0.18);
            osc2.frequency.exponentialRampToValueAtTime(28, now + 0.35);
            
            gain2.gain.setValueAtTime(0.35, now + 0.18);
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
            
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.18);
            osc2.stop(now + 0.4);
        } catch (e) {
            console.error("Heartbeat error:", e);
        }
    }

    // 4. Coffin / Floorboard Creak
    playCreak() {
        const ctx = this.ensureContext();
        try {
            const now = ctx.currentTime;
            
            const carrier = ctx.createOscillator();
            const modulator = ctx.createOscillator();
            const modGain = ctx.createGain();
            const masterGain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            carrier.type = 'sawtooth';
            carrier.frequency.setValueAtTime(120, now);
            carrier.frequency.linearRampToValueAtTime(210, now + 0.3);
            carrier.frequency.linearRampToValueAtTime(95, now + 0.6);
            carrier.frequency.linearRampToValueAtTime(260, now + 0.9);

            modulator.type = 'square';
            modulator.frequency.setValueAtTime(24, now);
            modGain.gain.setValueAtTime(70, now);
            modulator.connect(modGain);
            modGain.connect(carrier.frequency);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(360, now);
            filter.Q.setValueAtTime(6.0, now);

            masterGain.gain.setValueAtTime(0.01, now);
            masterGain.gain.linearRampToValueAtTime(0.22, now + 0.15);
            masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

            carrier.connect(filter);
            filter.connect(masterGain);
            masterGain.connect(ctx.destination);

            modulator.start(now);
            carrier.start(now);
            modulator.stop(now + 1.0);
            carrier.stop(now + 1.0);
        } catch (e) {
            console.error("Creak sound error:", e);
        }
    }

    // 5. Ghost Whispering Murmurs
    playGhostWhispers() {
        const ctx = this.ensureContext();
        try {
            const now = ctx.currentTime;
            const bufferSize = ctx.sampleRate * 1.8;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(450, now);
            filter.frequency.linearRampToValueAtTime(1400, now + 0.6);
            filter.frequency.linearRampToValueAtTime(550, now + 1.2);
            filter.frequency.linearRampToValueAtTime(1100, now + 1.7);
            filter.Q.setValueAtTime(7.0, now);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start(now);
        } catch (e) {
            console.error("Whisper sound error:", e);
        }
    }

    // 6. Jumpscare Stinger
    playJumpscareStinger() {
        const ctx = this.ensureContext();
        try {
            const now = ctx.currentTime;
            
            const bufferSize = ctx.sampleRate * 0.45;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.4, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.start(now);

            // Dissonant minor cluster chords
            const freqs = [261.63, 277.18, 369.99, 392.00, 493.88];
            freqs.forEach(f => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, now);
                osc.frequency.exponentialRampToValueAtTime(f * 0.65, now + 0.7);

                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.9);
            });
        } catch (e) {
            console.error("Jumpscare stinger error:", e);
        }
    }

    // 7. EMF Meter Clicks
    playEMFBeep(level = 3) {
        const ctx = this.ensureContext();
        try {
            const count = Math.min(level * 2, 8);
            for (let i = 0; i < count; i++) {
                const clickTime = ctx.currentTime + (i * 0.04) + (Math.random() * 0.02);
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'square';
                osc.frequency.setValueAtTime(1900 + Math.random() * 600, clickTime);

                gain.gain.setValueAtTime(0.06, clickTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.02);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(clickTime);
                osc.stop(clickTime + 0.025);
            }
        } catch (e) {}
    }

    playGhostBreath() {
        const ctx = this.ensureContext();
        try {
            const bufferSize = ctx.sampleRate * 0.9;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(300, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.45);
            filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.9);
            filter.Q.setValueAtTime(6.0, ctx.currentTime);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.01, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start();
        } catch (e) {}
    }

    playKeyClick() {
        if (this.isMuted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(600 + Math.random() * 400, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.035);
        } catch (e) {}
    }

    playEVPStatic() {
        const ctx = this.ensureContext();
        try {
            const bufferSize = ctx.sampleRate * 0.4;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.9;

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800 + Math.random() * 700, ctx.currentTime);
            filter.Q.setValueAtTime(4.0, ctx.currentTime);

            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            noise.start();
        } catch (e) {}
    }

    playAltarChime() {
        const ctx = this.ensureContext();
        try {
            const freqs = [293.66, 349.23, 415.30, 587.33];
            freqs.forEach((f, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, ctx.currentTime);

                gain.gain.setValueAtTime(0.12 / (idx + 1), ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 3.3);
            });
        } catch (e) {}
    }

    playGhostWhisperChime() {
        const ctx = this.ensureContext();
        try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.9);

            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.9);
        } catch (e) {}
    }
}

window.spectralAudio = new SpectralAudioEngine();
