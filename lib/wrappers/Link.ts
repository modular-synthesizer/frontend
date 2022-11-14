import ILink from "../interfaces/ILink";
import { usePorts } from "../stores/mods/ports";
import Port from "./Port";

export default class Link {
  public readonly from: Port;
  public readonly to: Port;
  public readonly color: string;

  constructor({ from, to, color }: ILink) {
    const ports: Port[] = usePorts().ports;

    this.from = ports.find(port => port.id === from);
    this.to = ports.find(port => port.id === to);

    this.color = color;
  }
}