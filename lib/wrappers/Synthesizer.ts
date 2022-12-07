import ISynthesizer from "../interfaces/ISynthesizer";
import { times } from "lodash";
import Rack from "./Rack";
import Mod from "./Mod";
import ICoordinates from "../interfaces/ICoordinates";

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

  public slots: number;

  public modules: Mod[] = [];

  public constructor(infos: ISynthesizer) {
    this.id = infos.id;
    this.name = infos.name;
    this.x = infos.x;
    this.y = infos.y;
    this.scale = infos.scale;
    this.slots = infos.slots;

    times(infos.racks, (index: number) => {
      this.racks.push(new Rack(index, infos.slots));
    })
  }

  public hasRoom(rack: number, slot: number, slots: number): boolean {
    const results = this.racks[rack].toString().substring(slot, slot + slots);
    return results === '0'.repeat(slots);
  }

  public place(rack: number, slot: number, mod: Mod) {
    this.racks[rack].add(mod);
    mod.rack = rack;
    mod.slot = slot;
  }

  public remove(mod: Mod) {
    this.racks[mod.rack].remove(mod);
  }

  public get maxSlot(): number {
    return this.slots;
  }

  public firstFreeSlot(size: number): {rack: number, slot: number} {
    for (let rack of this.racks) {
      const results: number = rack.freeSpace(size);
      if (results > -1) return {rack: rack.index, slot: results};
    }
    return {rack: -1, slot: -1}
  }

  public toString(): string {
    return this.racks.map(rack => rack.toString()).join("\n");
  }

  public get coordinates(): ICoordinates {
    return { x: this.x, y: this.y };
  }
}