import { times } from "lodash";
import Slot from "./Slot";

export default class Rack {

  private index: number;

  private slots: Slot[]

  public constructor(index: number, slots: number) {
    this.index = index;
    this.initSlots(slots);
  }

  private initSlots(slots: number) {
    this.slots = [] as Slot[];
    times(slots, (index: number) => {
      this.slots.push(new Slot(index));
    })
  }
}