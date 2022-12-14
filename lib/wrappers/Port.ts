import IPort from "../interfaces/IPort";
import { RACK_HEIGHT, SLOT_SIZE } from "../utils/constants";
import Link from "./Link";
import Mod from "./Mod";
import { remove } from 'lodash';

export default abstract class Port implements IPort {
  id: string;
  index: number;
  name: string;
  target: string;
  mod: Mod;
  public readonly x: number;
  public readonly y: number;
  public readonly links: Link[] = [];

  constructor({id, index, name, target, x, y}: IPort, mod: Mod) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.target = target;
    this.mod = mod
    this.x = x;
    this.y = y;
  }

  abstract isInput(): boolean;

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
    this.links.push(via);
    origin.links.push(via);

    origin.audioNode.connect(this.audioNode, origin.index, this.index)
  }

  public disconnect(origin: Port, via: Link) {
    remove(this.links, {id: via.id});
    remove(origin.links, {id: via.id});
    origin.audioNode.disconnect(this.audioNode);
  }

  public get audioNode(): AudioNode {
    return this.mod.audioNodes.find(n => n.name === this.target).node;
  }

  public get ax() {
    return this.x + this.mod.slot * SLOT_SIZE;
  }
  public get ay() {
    return this.y + this.mod.rack * RACK_HEIGHT;
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