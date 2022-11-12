import { ISynthesizer } from "../interfaces/ISynthesizer";
import { times } from "lodash";
import Rack from "./Rack";
import { find, remove } from "lodash";
import IModule from "../interfaces/IModule";
import Mod from "./Mod";

/**
 * A synthesizer is the main object of the application. It is materialized
 * as an interface on which all nodes and links are drawn.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class Synthesizer {
  // The unique UUID of the synthesizer, identifying it for requests.
  public readonly id: string;
  // The name the user has given to this synthesizer.
  public readonly name: string;
  // The number of pixels from the left side to the left of the first slot.
  public x: number;
  // The number of pixels from the top to the top of the first slot.
  public y: number;
  // The scale of zoom the synthesizer is currently displayed at.
  public scale: number;
  // The list of racks available in the synthesizer.
  public racks: Rack[] = [];

  public modules: Mod[] = []

  public constructor(infos: ISynthesizer) {
    this.id = infos.id;
    this.name = infos.name;
    this.x = infos.x;
    this.y = infos.y;
    this.scale = infos.scale;

    times(infos.racks, (index: number) => {
      this.racks.push(new Rack(index, infos.slots));
    })
  }

  public hasRoom(rack: number, slot: number, mod: IModule): boolean {
    for (let i = slot; i < slot + mod.slots; ++i) {
      if (!this.racks[rack].slots[i].free) return false;
    }
    return true;
  }

  public place(rack: number, slot: number, mod: IModule) {
    if (find(this.modules, {id: mod.id}) === undefined) {
      this.modules.push(mod);
    }
    for (let i = slot; i < slot + mod.slots; ++i) {
      this.racks[rack].slots[i].free = false;
    }
    mod.rack = rack;
    mod.slot = slot;
  }

  public remove(mod: IModule) {
    remove(this.modules, {id: mod.id})
    for (let i = mod.slot; i < mod.slot + mod.slots; ++i) {
      this.racks[mod.rack].slots[i].free = true;
    }
  }

  public get maxSlot(): number {
    return this.racks[0].slots.length;
  }
}