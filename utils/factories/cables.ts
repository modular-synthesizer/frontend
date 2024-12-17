import { equals } from "~/lib/interfaces/common/Identifiable";
import type IPort from "~/lib/interfaces/IPort";
import type Port from "~/lib/wrappers/Port";
import type { Cable } from "~/types/Cable";

export function createCable(id: string, from: string, to: string, color: string, ports: Array<IPort>): Cable {
  const cable: Cable = { id, color, from: searchPort(ports, from), to: searchPort(ports, to) };
  return cable.to.connect(cable.from, cable);
}

export function searchPort(ports: Array<IPort>, id: string): Port {
  return ports.find(port => equals(port, { id })) as Port
}