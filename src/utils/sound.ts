class SoundEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  click() {
    this.playTone(540, 0.07, 'triangle', 0.06);
  }

  tick(urgent = false) {
    this.playTone(urgent ? 880 : 660, 0.05, 'sine', urgent ? 0.06 : 0.03);
  }

  correct() {
    this.playTone(523.25, 0.14, 'triangle', 0.09, 0);
    this.playTone(659.25, 0.14, 'triangle', 0.09, 0.08);
    this.playTone(783.99, 0.22, 'triangle', 0.1, 0.16);
  }

  wrong() {
    this.playTone(240, 0.18, 'sawtooth', 0.06, 0);
    this.playTone(185, 0.26, 'sawtooth', 0.06, 0.12);
  }

  spark() {
    this.playTone(740, 0.09, 'sine', 0.08, 0);
    this.playTone(1046.5, 0.12, 'triangle', 0.08, 0.05);
  }

  fanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, idx === 3 ? 0.45 : 0.15, 'triangle', 0.09, idx * 0.1);
    });
  }
}

export const soundFX = new SoundEngine();
