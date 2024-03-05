import Port, { InputPort, OutputPort } from "./Port";
import Parameter from "./Parameter";
import { find, flatten, some } from 'lodash';
import Link from "./Link";
import { IControl } from "../interfaces/IControl";
import IPort from "../interfaces/IPort";
import Channel from "./Channel";
import IParameter from "../interfaces/IParameter";
import InnerAudioNode from "./InnerAudioNode";
import { inRange } from 'lodash';

export default class Mod {
  public readonly id: string;
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;
  public readonly ports: Port[] = [];
  public readonly parameters: Parameter[];
  public readonly category: string;
  public readonly controls: IControl[] = [];
  public readonly channels: Channel[];

  constructor({ id, rack, slot, slots, type, ports, parameters, category, controls, channels }: any) {
    this.id = id;
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.category = category;
    this.controls = controls;
    this.channels = channels;
    
    this.ports = ports.map((iport: IPort) => {
      return iport.kind === "input" ? new InputPort(iport, this) : new OutputPort(iport, this);
    });

    this.parameters = parameters.map((p: IParameter) => new Parameter(p, this));

    usePorts().addPorts(this.ports);
  }

  public get inputs(): IPort[] {
    return this.ports.filter((p: Port) => p.kind === "input");
  }

  public get outputs(): IPort[] {
    return this.ports.filter((p: Port) => p.kind === "output");
  }

  public param(name: string): Parameter {
    return this.parameters.find((p: Parameter) => p.name === name) as Parameter;
  }

  public get connections(): Link[] {
    return flatten(this.ports.map((port: Port) => port.links))
  }

  public channel(index: number): Channel {
    return this.channels[index];
  }

  public freeChannel(): Channel {
    if (some(this.channels, {used: false})) {
      return find(this.channels, {used: false}) as Channel;
    }
    return this.channels[0];
  }

  public stop() {
    this.channels.forEach((ch: Channel) => {
      ch.nodes
        .filter((nd: InnerAudioNode) => (nd.node instanceof OscillatorNode))
        .forEach((nd: InnerAudioNode) => {
          (nd.node as OscillatorNode).stop();
        })
    })
  }

  public watch(name: string, callback: (v: number) => void) {
    this.param(name).watch(callback);
  }

  public crosses(rack: number, slot: number, { id, slots}: Mod) {
    if (this.rack !== rack) return false;
    if (this.id === id) return false;
    const [ begin, end ]: [ number, number ] = [ slot, slot + slots ];
    if (this.rack !== rack) return false;
    if (end <= this.slot) return false;
    if (begin >= this.slot + this.slots) return false;
    return true;

    // console.log(mod);
    // console.log("self : " + begin + " " + end + " and other : " + slot + " " + (slot + slots));
    // console.log(inRange(begin, slot, slot + slots) || inRange(end, slot, slot + slots))
    // return inRange(begin, slot, slot + slots) || inRange(end, slot, slot + slots);
  }

  // public crosses(rack: number, slot: number, slots: number): boolean {
  //   if (rack !== this.rack) return false;
  //   const [ begin, end] = [this.slot, this.slot + this.slots];
  //   return !(inRange(begin, slot, slot + slots) | inRange(end, slot, slot + slots));
  // }
}