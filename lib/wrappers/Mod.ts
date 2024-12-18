import Port from "./Port";
import type IPort from "../interfaces/IPort";
import type IModule from "../interfaces/modules/IModule";
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { Channel } from "~/types/modules/Channel";
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
}
