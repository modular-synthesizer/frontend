import ILink from "../interfaces/ILink";
import Port from "./Port";

export default class Link {
  public readonly from: Port;
  public readonly to: Port;
  public readonly color: string;
  public readonly id: string;

  constructor({ id, from, to, color }: ILink) {
    const ports: Port[] = usePorts().ports as Port[];

    this.from = ports.find(port => port.id === from) as Port;
    this.to = ports.find(port => port.id === to) as Port;

    this.color = color;
    this.id = id;

    this.connect();
  }

  public connect() {
    this.to.connect(this.from, this);
  }

  public disconnect() {
    this.to.disconnect(this.from, this);
  }
}