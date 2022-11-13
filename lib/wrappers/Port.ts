import IPort from "../interfaces/IPort";

export default class Port implements IPort {
  id: string;
  index: number;
  name: string;
  target: string;

  constructor({id, index, name, target}: IPort) {
    this.id = id;
    this.index = index;
    this.name = name;
    this.target = target;
  }
}