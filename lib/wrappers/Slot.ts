export default class Slot {
  public readonly index: number;

  public free: boolean = true;

  public constructor(index: number) {
    this.index = index;
  }
}