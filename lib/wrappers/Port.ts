import IPort from "../interfaces/IPort";
import Link from "./Link";
import Mod from "./Mod";
import { IControl } from "../interfaces/IControl";
import { RACK_HEIGHT, SLOT_SIZE } from "../utils/constants";
import Channel from "./Channel";
import InnerAudioNode from "./InnerAudioNode";

export default abstract class Port implements IPort {
  id: string;
  index: number;
  name: string;
  target: string;
  mod: Mod;
  kind: string;
  analyser!: AnalyserNode;
  analysers: AnalyserNode[] = [];

  public link: Link|null = null;

  constructor({id, index, name, target, kind}: IPort, mod: Mod) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.target = target;
    this.mod = mod;
    this.kind = kind;
    if (this.kind === "output") this.createAnalyser();

  }

  public createAnalyser() {
    this.mod.channels.forEach(() => {
      const context: AudioContext = useAudioContext().context as AudioContext;
      if (context !== undefined) this.analysers.push(context.createAnalyser());
    })
  }

  public getValue(): number {
    const results: number[] = this.analysers.map((analyser: AnalyserNode) => {
      const data: Float32Array = new Float32Array(1);
      analyser.getFloatTimeDomainData(data);
      return data[0]
    })
    return Math.max(...results);
  }

  abstract isInput(): boolean;

  public connectableTo(port: Port) {
    return this.isInput() === !port.isInput();
  }

  /**
   * We make the connection on the right end of the link (destination), binding the origin to it
   * for a simple reason : if all output ports (origins) are the same, there are several types of
   * input ports (destinations), eg parameters ports and module input ports.
   * @param inputPort 
   */
  public connect(origin: Port, via: Link) {
    this.link = via;
    origin.link = via;

    this.mod.channels.forEach((channel: Channel) => {
      const fromNode: InnerAudioNode = origin.mod.channel(channel.index).getNode(origin.target) as InnerAudioNode
      const toNode: InnerAudioNode = channel.getNode(this.target) as InnerAudioNode;
      fromNode.node.connect(toNode.node, origin.index, this.index);

      const analyser: AnalyserNode = origin.analysers[channel.index];

      console.log(fromNode.node, analyser, fromNode.name)
      fromNode.node.connect(analyser, origin.index, 0);
    });
  }

  public get free(): boolean {
    return this.link === null;
  }

  public disconnect(origin: Port) {
    this.link = null;
    origin.link = null;

    this.mod.channels.forEach((channel: Channel) => {
      const fromNode: AudioNode = origin.mod.channel(channel.index).getNode(origin.target)?.node as AudioNode;
      const toNode: AudioNode = channel.getNode(this.target)?.node as AudioNode;

      const analyser: AnalyserNode = origin.analysers[channel.index];
      fromNode.disconnect(toNode);
      fromNode.disconnect(analyser);
    });
  }

  public get control(): IControl {
    return this.mod.controls.find(c => c.payload.target === this.name && c.component === 'Port') as IControl;
  }

  public get ax() {
    return this.control.payload.x + this.mod.slot * SLOT_SIZE;
  }
  public get ay() {
    return this.control.payload.y + this.mod.rack * RACK_HEIGHT;
  }

  public get links(): Link[] {
    return !this.link ? [] : [this.link];
  }
}

export class InputPort extends Port {
  public isInput(): boolean {
    return true;
  }
}

export class OutputPort extends Port {
  public isInput(): boolean {
    return false;
  }
}