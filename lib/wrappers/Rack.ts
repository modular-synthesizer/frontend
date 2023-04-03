import Mod from "./Mod";
import { find, remove } from "lodash"

function replaceAt(content: string, index: number, replacement: string) {
  return content.substring(0, index) + replacement+ content.substring(index + replacement.length);
}

export default class Rack {

  public readonly  index: number;

  public slots: number;

  public readonly mods: Mod[] = [];

  public constructor(index: number, slots: number) {
    this.index = index;
    this.slots = slots;
  }

  public remove(mod: Mod) {
    remove(this.mods, {id: mod.id});
  }

  public add(mod: Mod) {
    if (!find(this.mods, {id: mod.id})) this.mods.push(mod);
  }

  public freeSpace(size: number) {
    return this.toString().indexOf('0'.repeat(size));
  }

  public toString(): string {
    let results = '0'.repeat(this.slots);
    for (let mod of this.mods) {
      results = replaceAt(results, mod.slot, '1'.repeat(mod.slots));
    }
    return results;
  }
}