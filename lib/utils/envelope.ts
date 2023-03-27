export default class Envelope {

  private ctx: AudioContext = useAudioContext().context as AudioContext;

  sources: ConstantSourceNode[] = []

  trigger() {
    for(let source of this.sources) {
      source.offset.cancelScheduledValues(this.ctx.currentTime);
      source.offset.setValueAtTime(1, this.ctx.currentTime);
    }
  }
  release() {
    for(let source of this.sources) {
      source.offset.cancelScheduledValues(this.ctx.currentTime);
      source.offset.setValueAtTime(0, this.ctx.currentTime);
    }
  }
  bind(source: ConstantSourceNode) {
    this.sources.push(source);
  }
}