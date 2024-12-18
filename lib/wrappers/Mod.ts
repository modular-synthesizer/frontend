import Port from "./Port";
import { flatten } from 'lodash';
import type IPort from "../interfaces/IPort";
import type IModule from "../interfaces/modules/IModule";
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { Channel } from "~/types/modules/Channel";
import type { Cable } from "~/types/Cable";
import type { Parameter } from "~/types/modules/Parameter";
import { setValue } from "~/utils/functions/parameters";
import type { Control } from "~/types/tools/Control";
import { intersect } from "~/utils/functions/modules";
import type { ModuleCoordinates } from "~/types/modules/AudioModule";
import type { Identified } from "~/types/utils/Identified";

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
}
