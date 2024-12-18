import { equals } from "~/lib/interfaces/common/Identifiable";
import type Port from "~/lib/wrappers/Port";
import type { Cable } from "~/types/Cable";
import type { ToolPort } from "~/types/tools/Port";

export function createCable(id: string, from: string, to: string, color: string, ports: Array<ToolPort>): Cable {
  const cable: Cable = { id, color, from: searchPort(ports, from), to: searchPort(ports, to) };
  return cable.to.connect(cable.from, cable);
}

export function searchPort(ports: Array<ToolPort>, id: string): Port {
  return ports.find(port => equals(port, { id })) as Port
}