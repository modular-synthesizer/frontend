import IPort from "../interfaces/IPort";
import Link from "./Link";
import Mod from "./Mod";
import { find, remove } from 'lodash';
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
  public readonly links: Link[] = [];

  constructor({id, index, name, target, kind}: IPort, mod: Mod) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.target = target;
    this.mod = mod;
    this.kind = kind;
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

    this.mod.channels.forEach((channel: Channel) => {
      const fromNode: InnerAudioNode = origin.mod.channel(channel.index).getNode(origin.target) as InnerAudioNode
      const toNode: InnerAudioNode = channel.getNode(this.target) as InnerAudioNode;

      console.log(fromNode, toNode);

      fromNode.node.connect(toNode.node, origin.index, this.index);
    })

    // origin.audioNode.connect(this.audioNode, origin.index, this.index)
  }

  public disconnect(origin: Port, via: Link) {
    remove(this.links, {id: via.id});
    remove(origin.links, {id: via.id});


    this.mod.channels.forEach((channel: Channel) => {
      const fromNode: AudioNode = origin.mod.channel(channel.index).getNode(origin.target)?.node as AudioNode;
      const toNode: AudioNode = channel.getNode(this.target)?.node as AudioNode;

      fromNode.disconnect(toNode);
    });

    // origin.audioNode.disconnect(this.audioNode);
  }

  public get audioNode(): AudioNode {
    return this.mod.audioNodes.find(n => n.name === this.target)?.node as AudioNode;
  }

  public get control(): IControl {
    return this.mod.controls.find(c => c.payload.target === this.name) as IControl;
  }

  public get ax() {
    return this.control.payload.x + this.mod.slot * SLOT_SIZE;
  }
  public get ay() {
    return this.control.payload.y + this.mod.rack * RACK_HEIGHT;
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