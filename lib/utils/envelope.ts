export default class Envelope {

  private ctx: AudioContext = useAudioContext().context as AudioContext;

  source: ConstantSourceNode|null = null;

  trigger() {
    if (this.source !== null) {
      this.source.offset.cancelScheduledValues(this.ctx.currentTime);
      this.source.offset.setValueAtTime(1, this.ctx.currentTime);
    }
  }
  release() {
    if (this.source !== null) {
      this.source.offset.cancelScheduledValues(this.ctx.currentTime);
      this.source.offset.setValueAtTime(0, this.ctx.currentTime);
    }
  }
  bind(source: ConstantSourceNode) {
    this.source = source;
  }
}