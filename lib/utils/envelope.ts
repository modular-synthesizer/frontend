export default class Envelope {

  private ctx: AudioContext = useAudioContext().context as AudioContext;

  sources: ConstantSourceNode[] = []

  trigger(channel: number = -1) {
    console.log(channel, this.sources[channel]);
    if (channel === -1) return;
    const source = this.sources[channel];
    source.offset.cancelScheduledValues(this.ctx.currentTime);
    source.offset.setValueAtTime(1, this.ctx.currentTime);
  }
  release(channel: number = -1) {
    console.log(channel, this.sources[channel]);
    if (channel === -1) return;
    const source = this.sources[channel];
    source.offset.cancelScheduledValues(this.ctx.currentTime);
    source.offset.setValueAtTime(0, this.ctx.currentTime);
  }
  bind(source: ConstantSourceNode) {
    this.sources.push(source);
  }
}