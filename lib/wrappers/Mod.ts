import Port from "./Port";
import type IPort from "../interfaces/IPort";
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { Channel } from "~/types/modules/Channel";
import type { Parameter } from "~/types/modules/Parameter";
import type { Control } from "~/types/tools/Control";
import type { Parameters, PlacedModule } from "~/types/modules/AudioModule";
import { setValue } from "~/utils/functions/parameters";

export default class Mod implements PlacedModule {
  public readonly id: string;
  public rack: number;
  public slot: number;
  public readonly slots: number;
  public readonly type: string;
  public readonly ports: Port[] = [];
  public readonly parameters: Parameters;
  public readonly controls: Control[] = [];
  public readonly channels: Channel[];
  public readonly links: InnerLink[] = [];
  public readonly nodes: InnerNode[] = [];
  

  constructor({ id, rack, slot, slots, type, ports, parameters, controls, channels }: PlacedModule) {
    this.id = id;
    this.rack = rack;
    this.slot = slot;
    this.slots = slots;
    this.type = type;
    this.controls = controls;
    this.channels = channels;
    
    this.ports = ports.map((iport: IPort) => {
      return new Port(iport, this);
    });

    this.parameters = parameters;
    Object.values(this.parameters).forEach((p: Parameter) => {
      p.mod = this
      setValue(p, p.value)
    })

    usePorts().addPorts(this.ports);
  }

  public param(name: string): Parameter {
    return this.parameters[name];
  }
}
