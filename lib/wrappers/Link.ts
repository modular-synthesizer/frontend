import ILink from "../interfaces/ILink";
import Port from "./Port";

export default class Link {
  public readonly from: Port;
  public readonly to: Port;
  public readonly color: string;
  public readonly id: string;

  constructor({ id, from, to, color }: ILink) {
    const ports: Port[] = usePorts().ports;

    this.from = ports.find(port => {
      return port.id === from
    });
    this.to = ports.find(port => port.id === to);

    this.color = color;
    this.id = id;

    this.connect();
  }

  public connect() {
    try {
      this.to.connect(this.from, this);
    }
    catch(exception) {
      console.log(this.from, this.to)
    }
  }

  public disconnect() {
    this.to.disconnect(this.from, this);
  }
}