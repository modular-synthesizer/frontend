import Port from "./Port";
import { find, flatten, some } from 'lodash';
import type IPort from "../interfaces/IPort";
import type IModule from "../interfaces/modules/IModule";
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { Channel } from "~/types/modules/Channel";
import type { Cable } from "~/types/Cable";
import type { Parameter } from "~/types/modules/Parameter";
import { setValue } from "~/utils/functions/parameters";
import type { Control } from "~/types/tools/Control";

type Payload = IModule & { channels: Channel[] }

export default class Mod implements IModule {
  public readonly id: string;
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;
  public readonly ports: Port[] = [];
  public readonly parameters: Parameter[];
  public readonly category: string;
  public readonly controls: Control[] = [];
  public readonly channels: Channel[];
  public readonly links: InnerLink[] = [];
  public readonly nodes: InnerNode[] = [];
  

  constructor({ id, rack, slot, slots, type, ports, parameters, category, controls, channels, links, nodes }: Payload) {
    this.id = id;
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.category = category;
    this.controls = controls;
    this.channels = channels;
    this.links = links;
    this.nodes = nodes;
    
    this.ports = ports.map((iport: IPort) => {
      return new Port(iport, this);
    });

    this.parameters = parameters.map((p: Parameter) => {
      p.mod = this;
      setValue(p, p.value);
      return p;
    });

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

  public get connections(): Cable[] {
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
      Object.values(ch.nodes)
        .filter((anode: AudioNode) => (anode instanceof OscillatorNode))
        .forEach((anode: AudioNode) => {
          (anode as OscillatorNode).stop();
        })
    })
  }

  public intersects({ slot, rack, slots, id }: { slot: number, rack: number, slots: number, id: string }) {
    const [ begin, end ]: [ number, number ] = [ slot, slot + slots ];
    if (this.rack !== rack) return false;
    if (id === this.id) return false;
    if (end <= this.slot) return false;
    if (begin >= this.slot + this.slots) return false;
    return true;
  }
}