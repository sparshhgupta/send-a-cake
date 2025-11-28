export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.micStream = null;
    this.animationFrame = null;
  }

  async startListening() {
    try {
      this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.micStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);
      return true;
    } catch (err) {
      console.error('Microphone access denied:', err);
      return false;
    }
  }

  stopListening() {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  detectBlow(callback) {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    
    const analyze = () => {
      this.analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const strength = Math.min(average / 30, 3);
      callback(strength);
      this.animationFrame = requestAnimationFrame(analyze);
    };
    
    analyze();
  }
}