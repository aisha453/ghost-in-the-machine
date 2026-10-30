/**
 * Ghost in the Machine - Advanced Procedural Web Audio Synthesizer
 * 100% Offline, Zero external audio assets required.
 * Synthesizes: 
 * - Banshee Howl / Screech
 * - Jumpscare Metallic Stinger
 * - Deep Thunderclap & Rumble
 * - Coffin / Floorboard Creak
 * - Ghost Whisper Murmurs
 * - Heartbeat (Lub-Dub)
 * - EMF Ghost Meter Clicks
 * - Ambient Dissonant Drones (43Hz)
 * - EVP Radio Static
 * - Altar Temple Bells
 */

class SpectralAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.droneGain = null;
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.heartbeatTimer = null;
        this.ambientSpookTimer = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
    }

    startDrone() {
        if (!this.ctx) this.init();
        if (this.droneOsc1) return;

        try {
            // Ethereal low-frequency ambient drone (43Hz and 47Hz binaural beat with eerie dissonance)
            this.droneGain = this.ctx.createGain();
            this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.07, this.ctx.currentTime);
            this.droneGain.connect(this.ctx.destination);

            this.droneOsc1 = this.ctx.createOscillator();
            this.droneOsc1.type = 'sawtooth';
            this.droneOsc1.frequency.setValueAtTime(43.0, this.ctx.currentTime);

            this.droneOsc2 = this.ctx.createOscillator();
            this.droneOsc2.type = 'sine';
            this.droneOsc2.frequency.setValueAtTime(47.2, this.ctx.currentTime);

            // Subtle eerie resonance filter
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(120, this.ctx.currentTime);
            filter.Q.setValueAtTime(4.5, this.ctx.currentTime);

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

    toggleMute() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.isMuted = !this.isMuted;
        if (!this.isMuted && !this.droneOsc1) {
            this.startDrone();
        }
        if (this.droneGain) {
            this.droneGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.07, this.ctx.currentTime, 0.2);
        }
        return !this.isMuted;
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
            if (roll < 0.2) {
                this.playGhostBreath();
            } else if (roll < 0.35) {
                this.playCreak();
            } else if (roll < 0.48) {
                this.playGhostWhispers();
            } else if (roll < 0.55) {
                this.playEMFBeep(4);
            }
        }, 9000);
    }

    // 1. Terrifying Banshee Screech / Howl
    playBansheeScreech() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);
            osc.frequency.exponentialRampToValueAtTime(280, now + 1.2);

            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800, now);
            filter.frequency.exponentialRampToValueAtTime(2200, now + 0.4);
            filter.frequency.exponentialRampToValueAtTime(400, now + 1.2);
            filter.Q.setValueAtTime(6.0, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.18, now + 0.25);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 1.35);
        } catch (e) {}
    }

    // 2. Jumpscare Stinger (Sharp metallic dissonant impact)
    playJumpscareStinger() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            
            // White noise burst
            const bufferSize = this.ctx.sampleRate * 0.4;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.3, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            noise.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now);

            // Dissonant minor cluster chords (C4, C#4, F#4, G4)
            const freqs = [261.63, 277.18, 369.99, 392.00, 554.37];
            freqs.forEach(f => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, now);
                osc.frequency.exponentialRampToValueAtTime(f * 0.7, now + 0.6);

                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.85);
            });
        } catch (e) {}
    }

    // 3. Deep Thunderclap & Rolling Rumble
    playThunder() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 2.2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(350, now);
            filter.frequency.exponentialRampToValueAtTime(70, now + 2.0);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.28, now + 0.06); // sharp crack
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2); // long rumble

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch (e) {}
    }

    // 4. Coffin / Floorboard Creak
    playCreak() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(110, now);
            osc.frequency.linearRampToValueAtTime(180, now + 0.2);
            osc.frequency.linearRampToValueAtTime(90, now + 0.5);
            osc.frequency.linearRampToValueAtTime(220, now + 0.75);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(320, now);
            filter.Q.setValueAtTime(5.0, now);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.85);
        } catch (e) {}
    }

    // 5. Ghost Whispering Murmurs
    playGhostWhispers() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 1.5;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            // Formant bandpass mimics human whispering frequencies (vowels)
            const filter1 = this.ctx.createBiquadFilter();
            filter1.type = 'bandpass';
            filter1.frequency.setValueAtTime(500, now);
            filter1.frequency.linearRampToValueAtTime(1200, now + 0.7);
            filter1.frequency.linearRampToValueAtTime(600, now + 1.4);
            filter1.Q.setValueAtTime(8.0, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.06, now + 0.4);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

            noise.connect(filter1);
            filter1.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch (e) {}
    }

    // 6. EMF Meter Clicks (Geiger-counter clicks)
    playEMFBeep(level = 3) {
        if (this.isMuted || !this.ctx) return;
        try {
            const count = Math.min(level * 2, 8);
            for (let i = 0; i < count; i++) {
                const clickTime = this.ctx.currentTime + (i * 0.05) + (Math.random() * 0.03);
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'square';
                osc.frequency.setValueAtTime(1800 + Math.random() * 600, clickTime);

                gain.gain.setValueAtTime(0.03, clickTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.015);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(clickTime);
                osc.stop(clickTime + 0.02);
            }
        } catch (e) {}
    }

    playHeartbeat() {
        if (this.isMuted || !this.ctx) return;
        try {
            const now = this.ctx.currentTime;
            
            // Lub
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(65, now);
            osc1.frequency.exponentialRampToValueAtTime(32, now + 0.13);
            gain1.gain.setValueAtTime(0.14, now);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.17);

            // Dub (190ms later)
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(55, now + 0.19);
            osc2.frequency.exponentialRampToValueAtTime(28, now + 0.34);
            gain2.gain.setValueAtTime(0.10, now + 0.19);
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now + 0.19);
            osc2.stop(now + 0.38);
        } catch (e) {}
    }

    playGhostBreath() {
        if (this.isMuted || !this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 0.9;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.45;

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(280, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.45);
            filter.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.9);
            filter.Q.setValueAtTime(5.5, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.07, this.ctx.currentTime + 0.35);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
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

            gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.035);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.035);
        } catch (e) {}
    }

    playEVPStatic() {
        if (this.isMuted || !this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 0.35;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.8;

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(750 + Math.random() * 700, this.ctx.currentTime);
            filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch (e) {}
    }

    playAltarChime() {
        if (this.isMuted || !this.ctx) return;
        try {
            const freqs = [293.66, 349.23, 415.30, 587.33];
            freqs.forEach((f, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, this.ctx.currentTime);

                gain.gain.setValueAtTime(0.08 / (idx + 1), this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.0);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 3.1);
            });
        } catch (e) {}
    }

    playGhostWhisperChime() {
        if (this.isMuted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(260, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.9);

            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.9);
        } catch (e) {}
    }
}

window.spectralAudio = new SpectralAudioEngine();
