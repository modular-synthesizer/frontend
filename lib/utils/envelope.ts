export default class Envelope {

  private ctx: AudioContext = useAudioContext().context as AudioContext;

  source?: ConstantSourceNode;

  trigger() {
    if (this.source === undefined) return;
    this.source.offset.cancelScheduledValues(this.ctx.currentTime);
    this.source.offset.setValueAtTime(1, this.ctx.currentTime);
  }
  
  release() {
    if (this.source === undefined) return;
    this.source.offset.cancelScheduledValues(this.ctx.currentTime);
    this.source.offset.setValueAtTime(0, this.ctx.currentTime);
  }

  bind(source: ConstantSourceNode) {
    this.source = source;
  }
}