import ILink from "../interfaces/ILink";
import IPort from "../interfaces/IPort";
import { equals } from "../interfaces/common/Identifiable";
import Port from "./Port";

export default class Link implements ILink {
  public readonly from: string;
  public readonly to: string;
  public readonly color: string;
  public id: string;

  public readonly origin!: Port;
  public readonly destination!: Port;

  constructor({ id, from, to, color }: ILink) {
    const ports: IPort[] = usePorts().ports;

    this.from = from;
    this.to = to;

    this.origin = ports.find(port => equals(port, { id: from })) as Port;
    this.destination = ports.find(port => equals(port, { id: to })) as Port;

    this.color = color;
    this.id = id;

    this.connect();
  }

  public connect() {
    this.destination.connect(this.origin, this);
  }

  public disconnect() {
    this.destination.disconnect(this.origin);
  }
}