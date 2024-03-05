import ISynthesizer from "../interfaces/ISynthesizer";
import { times } from "lodash";
import Rack from "./Rack";
import Mod from "./Mod";
import ICoordinates from "../interfaces/ICoordinates";
import IMembership from "../interfaces/IMembership";

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

  public racks: number;

  // The list of racks available in the synthesizer.
  public created_racks: Rack[] = [];

  public slots: number;

  public voices: number = 1;

  public modules: Mod[] = [];

  public members: IMembership[] = [];

  public constructor(infos: ISynthesizer) {
    this.id = infos.id;
    this.name = infos.name;
    this.x = infos.x;
    this.y = infos.y;
    this.scale = infos.scale;
    this.slots = infos.slots;
    this.racks = infos.racks;
    this.voices = infos.voices;
    this.members = infos.members;

    times(infos.racks, (index: number) => {
      this.created_racks.push(new Rack(index, infos.slots));
    })
  }

  public setModules(mods: Mod[]) {
    this.modules = mods;
  }

  public hasRoom(rack: number, slot: number, modToPlace: Mod): boolean {
    console.log(modToPlace);
    for (let mod of this.modules) {
      if (mod.crosses(rack, slot, modToPlace)) return false;
    }
    return true;
  }

  public place(rack: number, slot: number, mod: Mod) {
    mod.rack = rack;
    mod.slot = slot;
  }

  public remove(mod: Mod) {
    this.created_racks[mod.rack].remove(mod);
  }

  public get maxSlot(): number {
    return this.slots;
  }

  public firstFreeSlot(size: number): {rack: number, slot: number} {
    for (let rack of this.created_racks) {
      const results: number = rack.freeSpace(size);
      if (results > -1) return {rack: rack.index, slot: results};
    }
    return {rack: -1, slot: -1}
  }

  public toString(): string {
    return "[" + this.id + " " + this.name + "]";
  }

  public get coordinates(): ICoordinates {
    return { x: this.x, y: this.y };
  }

  public get creator(): IMembership {
    return this.members.find((m: IMembership) => m.type === 'creator') as IMembership;
  }

  public membershipType(username: string) {
    return this.members.find((m: IMembership) => m.username === username)?.type || "read";
  }

  public isReadonly(username: string) {
    return this.membershipType(username) === "read";
  }

  public isEditor(username: string) {
    return this.membershipType(username) === "write";
  }

  public isCreator(username: string) {
    return this.membershipType(username) === "creator";
  }
}