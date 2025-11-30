// A simple sound synthesizer using Web Audio API to avoid external assets
class SoundManager {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (!this.enabled || !this.audioCtx) return;
    
    // Resume context if suspended (browser policy)
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  public playDiceRoll() {
    // Rapid random tones
    if (!this.enabled) return;
    for(let i=0; i<5; i++) {
      setTimeout(() => this.playTone(200 + Math.random() * 200, 'square', 0.05, 0.05), i * 40);
    }
  }

  public playMove() {
    this.playTone(600, 'sine', 0.1, 0.1);
  }

  public playKill() {
    this.playTone(150, 'sawtooth', 0.3, 0.2);
    setTimeout(() => this.playTone(100, 'sawtooth', 0.3, 0.2), 100);
  }

  public playWin() {
    [440, 554, 659, 880].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.2), i * 150);
    });
  }

  public playClick() {
    this.playTone(800, 'sine', 0.05, 0.02);
  }
}

export const soundManager = new SoundManager();