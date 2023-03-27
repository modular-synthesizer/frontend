import IParameter from "~~/lib/interfaces/IParameter"
import Mod from "./Mod";
import { clamp } from "lodash"
import Channel from "./Channel";

export default class Parameter {
  
  public readonly id: string;
  public readonly name: string;
  public value: number;
  public readonly minimum: number;
  public readonly maximum: number;
  public readonly step: number;
  public readonly precision: number;
  public readonly targets: string[] = []
  public readonly mod: Mod;
  private ctx: AudioContext;
  public readonly field: string;

  constructor(details: IParameter, mod: Mod) {
    this.id = details.id;
    this.name = details.name;
    this.value = details.value;
    this.minimum = details.constraints.minimum;
    this.maximum = details.constraints.maximum;
    this.step = details.constraints.step;
    this.precision = details.constraints.precision;
    this.targets = details.targets;
    this.mod = mod;
    this.ctx = useAudioContext().context;
    this.field = details.field;
    this.setValue(this.value);
  }

  public setValue(val: number) {
    this.value = clamp(val, this.minimum, this.maximum);
    this.targets.forEach((target: string) => {
      this.mod.channels.forEach((channel: Channel) => {
        const param: AudioParam = channel.getNode(target)?.node[this.field as keyof AudioNode] as unknown as AudioParam;
        if (param !== undefined) param.setValueAtTime(this.value, this.ctx.currentTime);
      })
    });
  }

  public moveValue(diff: number) {
    this.setValue(this.value + diff);
  }
}