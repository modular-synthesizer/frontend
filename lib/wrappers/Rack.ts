import { times } from "lodash";
import Slot from "./Slot";

export default class Rack {

  public readonly  index: number;

  public slots: Slot[] = [];

  public constructor(index: number, slots: number) {
    this.index = index;
    
    times(slots, (index: number) => {
      this.slots.push(new Slot(index));
    })
  }
}