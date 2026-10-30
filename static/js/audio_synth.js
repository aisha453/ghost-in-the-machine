/**
 * Ghost in the Machine - Procedural Web Audio Synthesizer
 * 100% Offline, Zero external audio assets required.
 * Synthesizes: Spectral drone hum, EVP static pulses, candle crackle, typewriter clicks, 
 * creepy heartbeat, ghostly breath sweeps, and Día de los Muertos altar chimes.
 */

class SpectralAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.droneGain = null;
        this.droneOsc1 = null;
        this.droneOsc2 = null;
        this.heartbeatTimer = null;
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
            this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.06, this.ctx.currentTime);
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
            filter.frequency.setValueAtTime(110, this.ctx.currentTime);
            filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

            this.droneOsc1.connect(filter);
            this.droneOsc2.connect(filter);
            filter.connect(this.droneGain);

            this.droneOsc1.start();
            this.droneOsc2.start();

            this.startHeartbeatLoop();
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
            this.droneGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.06, this.ctx.currentTime, 0.2);
        }
        return !this.isMuted;
    }

    startHeartbeatLoop() {
        if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => {
            if (!this.isMuted && Math.random() < 0.45) {
                this.playHeartbeat();
            }
        }, 3200);
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
            osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
            gain1.gain.setValueAtTime(0.12, now);
            gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
            osc1.connect(gain1);
            gain1.connect(this.ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.16);

            // Dub (180ms later)
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(55, now + 0.18);
            osc2.frequency.exponentialRampToValueAtTime(30, now + 0.32);
            gain2.gain.setValueAtTime(0.09, now + 0.18);
            gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            osc2.connect(gain2);
            gain2.connect(this.ctx.destination);
            osc2.start(now + 0.18);
            osc2.stop(now + 0.36);
        } catch (e) {}
    }

    playGhostBreath() {
        if (this.isMuted || !this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 0.8;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.4;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(300, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.4);
            filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.8);
            filter.Q.setValueAtTime(5.0, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

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
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.8;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(750 + Math.random() * 700, this.ctx.currentTime);
            filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
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

                gain.gain.setValueAtTime(0.07 / (idx + 1), this.ctx.currentTime);
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

            gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.9);
        } catch (e) {}
    }
}

window.spectralAudio = new SpectralAudioEngine();
