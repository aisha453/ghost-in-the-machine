/**
 * Ghost in the Machine - Procedural Web Audio Synthesizer
 * 100% Offline, Zero external audio assets required.
 * Synthesizes: Spectral drone hum, EVP static pulses, candle crackle, typewriter clicks, and altar chimes.
 */

class SpectralAudioEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = true; // start muted until user interaction
        this.droneGain = null;
        this.droneOsc1 = null;
        this.droneOsc2 = null;
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
            // Ethereal low-frequency ambient drone (48Hz and 51Hz binaural beat)
            this.droneGain = this.ctx.createGain();
            this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime);
            this.droneGain.connect(this.ctx.destination);

            this.droneOsc1 = this.ctx.createOscillator();
            this.droneOsc1.type = 'sine';
            this.droneOsc1.frequency.setValueAtTime(48.0, this.ctx.currentTime);

            this.droneOsc2 = this.ctx.createOscillator();
            this.droneOsc2.type = 'triangle';
            this.droneOsc2.frequency.setValueAtTime(51.5, this.ctx.currentTime);

            // Subtle lowpass filter for atmospheric darkness
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(140, this.ctx.currentTime);

            this.droneOsc1.connect(filter);
            this.droneOsc2.connect(filter);
            filter.connect(this.droneGain);

            this.droneOsc1.start();
            this.droneOsc2.start();
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
            this.droneGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime, 0.2);
        }
        return !this.isMuted;
    }

    playKeyClick() {
        if (this.isMuted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(700 + Math.random() * 300, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.04);
        } catch (e) {}
    }

    playEVPStatic() {
        if (this.isMuted || !this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 0.25; // 250ms of static
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800 + Math.random() * 600, this.ctx.currentTime);
            filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
        } catch (e) {}
    }

    playAltarChime() {
        if (this.isMuted || !this.ctx) return;
        try {
            // Resonant meditative tubular bell (Día de los Muertos chime)
            const freqs = [392, 587.33, 783.99]; // G4, D5, G5 harmonic chord
            freqs.forEach(f => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, this.ctx.currentTime);

                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.4);

                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 2.5);
            });
        } catch (e) {}
    }

    playGhostWhisperChime() {
        if (this.isMuted || !this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.8);

            gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.8);
        } catch (e) {}
    }
}

window.spectralAudio = new SpectralAudioEngine();
