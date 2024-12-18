import type IPort from "../interfaces/IPort";
import { RACK_HEIGHT, SLOT_SIZE } from "../utils/constants";
import type { Channel } from "~/types/modules/Channel";
import type { Cable } from "~/types/Cable";
import type { Control } from "~/types/tools/Control";
import type { PlacedModule } from "~/types/modules/AudioModule";

export default class Port implements IPort {
  id: string;
  index: number;
  name: string;
  target: string;
  mod: PlacedModule;
  kind: string;

  public link: Cable|null = null;

  constructor({id, index, name, target, kind}: IPort, mod: PlacedModule) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.target = target;
    this.mod = mod;
    this.kind = kind;
  }

  public isInput(): boolean {
    return this.kind === 'input';
  }

  public connectableTo(port: Port) {
    return this.isInput() === !port.isInput();
  }

  /**
   * We make the connection on the right end of the link (destination), cinding the origin to it
   * for a simple reason : if all output ports (origins) are the same, there are several types of
   * input ports (destinations), eg parameters ports and module input ports.
   * @param inputPort 
   */
  public connect(origin: Port, via: Cable): Cable {
    this.link = via;
    origin.link = via;

    this.mod.channels.forEach((channel: Channel) => {
      const fromNode: AudioNode = origin.mod.channels[channel.index].nodes[origin.target];
      const toNode: AudioNode = channel.nodes[this.target];
      fromNode.connect(toNode, origin.index, this.index);
    });
    return via;
  }

  public get free(): boolean {
    return this.link === null;
  }

  public disconnect(origin: Port) {
    this.link = null;
    origin.link = null;

    this.mod.channels.forEach((channel: Channel) => {
      const fromNode: AudioNode = channel.nodes[this.target];
      const toNode: AudioNode = origin.mod.channels[channel.index].nodes[origin.target];

      fromNode.disconnect(toNode);
    });
  }

  public get control(): Control {
    return this.mod.controls.find(c => c.payload.target === this.name && c.component === 'Port') as Control;
  }

  public get ax() {
    return +this.control.payload.x + this.mod.slot * SLOT_SIZE;
  }
  public get ay() {
    return +this.control.payload.y + this.mod.rack * RACK_HEIGHT;
  }

  public get links(): Cable[] {
    return !this.link ? [] : [this.link];
  }
}