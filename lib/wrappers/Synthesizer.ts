import type ISynthesizer from "../interfaces/synthesizers/ISynthesizer";
import type IMembership from "../interfaces/synthesizers/IMembership";
import type { Coordinates } from "~/types/utils/Coordinates";
import { intersect } from "~/utils/functions/modules";
import type { AudioModule } from "~/types/modules/AudioModule";

/**
 * A synthesizer is the main object of the application. It is materialized
 * as an interface on which all nodes and links are drawn.
 * @author Vincent Courtois <courtois.vincent@outlook.com>
 */
export default class Synthesizer implements ISynthesizer {
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

  public voices: number = 1;

  public modules: AudioModule[] = [];

  public members: IMembership[] = [];

  public constructor(infos: ISynthesizer) {
    this.id = infos.id;
    this.name = infos.name;
    this.x = infos.x;
    this.y = infos.y;
    this.scale = infos.scale;
    this.voices = infos.voices;
    this.members = infos.members;
  }

  public setModules(mods: AudioModule[]) {
    this.modules = mods;
  }

  public hasRoom(rack: number, slot: number, slots: number, id: string): boolean {
    for (let mod of this.modules) {
      if (intersect(mod, { rack, slot, slots, id: id })) return false;
    }
    return true;
  }

  public place(rack: number, slot: number, mod: AudioModule) {
    mod.rack = rack;
    mod.slot = slot;
  }

  public firstFreeSlot(size: number): number {
    let slot = 0;
    while(!this.hasRoom(0, slot, size, '')) {
      slot += 1
    }
    return slot;
  }

  public toString(): string {
    return "[" + this.id + " " + this.name + "]";
  }

  public get coordinates(): Coordinates {
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