import IParameter from "~~/lib/interfaces/IParameter"
import Mod from "./Mod";
import { clamp } from "lodash"
import Channel from "./Channel";
import { IControl } from "../interfaces/IControl";
import { WatcherCallback } from "../types/Parameters";

export default class Parameter implements IParameter {
  
  public readonly id: string;
  public readonly name: string;
  public _value: number;
  public readonly minimum: number;
  public readonly maximum: number;
  public readonly step: number;
  public readonly precision: number;
  public readonly targets: string[] = []
  public readonly mod: Mod;
  private ctx: AudioContext;
  public readonly field: string;
  public callbacks: ((v: number) => void)[] = [];

  constructor(details: IParameter, mod: Mod) {
    this.id = details.id;
    this.name = details.name;
    this._value = details.value;
    this.minimum = details.minimum;
    this.maximum = details.maximum;
    this.step = details.step;
    this.precision = details.precision;
    this.targets = details.targets;
    this.mod = mod;
    this.ctx = useAudioContext().context as AudioContext;
    this.field = details.field;
    this.setValue(this.value);
  }

  public watch(callback: WatcherCallback) {
    this.callbacks.push(callback);
  }

  public get value(): number {
    return this._value;
  }

  public set value(v:number)  {
    console.log("passage dans le setter");
    this.setValue(v);
  }

  public setValue(val: number) {
    this._value = clamp(val, this.minimum, this.maximum);
    this.targets.forEach((target: string) => {
      this.mod.channels.forEach((channel: Channel) => {
        const node: AudioNode = channel.getNode(target)!.node;
        const param: AudioParam|undefined = this.audioParam(node);
        if (param !== undefined) param.setValueAtTime(this.value, this.ctx.currentTime);
      })
    });
    this.callbacks.forEach((callback: (v: number) => void) => {
      callback(this.value);
    })
  }

  public audioParam(node: AudioNode): AudioParam|undefined {
    if ('parameters' in node) {
      return (node as AudioWorkletNode).parameters.get(this.field);
    }
    else {
      return node[this.field as keyof AudioNode] as unknown as AudioParam;
    }
  }

  public moveValue(value: number): void {
    this.setValue(this.value + value);
  }

  public get controls(): IControl[] {
    return this.mod.controls.filter((control: IControl) => {
      return control.payload.target === this.name;
    });
  }
}