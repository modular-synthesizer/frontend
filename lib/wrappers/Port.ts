import type IPort from "../interfaces/IPort";
import Link from "./Link";
import Mod from "./Mod";
import type { IControl } from "../interfaces/IControl";
import { RACK_HEIGHT, SLOT_SIZE } from "../utils/constants";
import type { Channel } from "~/types/modules/Channel";

export default class Port implements IPort {
  id: string;
  index: number;
  name: string;
  target: string;
  mod: Mod;
  kind: string;

  public link: Link|null = null;

  constructor({id, index, name, target, kind}: IPort, mod: Mod) {
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
  public connect(origin: Port, via: Link) {
    this.link = via;
    origin.link = via;

    this.mod.channels.forEach((channel: Channel) => {
      const fromNode: AudioNode = origin.mod.channel(channel.index).nodes[origin.target]
      const toNode: AudioNode = channel.nodes[this.target];
      fromNode.connect(toNode, origin.index, this.index);
    });
  }

  public get free(): boolean {
    return this.link === null;
  }

  public disconnect(origin: Port) {
    this.link = null;
    origin.link = null;

    this.mod.channels.forEach((channel: Channel) => {
      const fromNode: AudioNode = origin.mod.channel(channel.index).nodes[origin.target];
      const toNode: AudioNode = channel.nodes[this.target];

      fromNode.disconnect(toNode);
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
  public override isInput(): boolean {
    return true;
  }
}

export class OutputPort extends Port {
  public override isInput(): boolean {
    return false;
  }
}