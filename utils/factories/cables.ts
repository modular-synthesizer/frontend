import { equals } from "~/lib/interfaces/common/Identifiable";
import type IPort from "~/lib/interfaces/IPort";
import type Port from "~/lib/wrappers/Port";
import type { Cable } from "~/types/Cable";

export function createCable(id: string, origin: string, dest: string, color: string): Cable {
  const ports: IPort[] = usePorts().ports;
  
  const from = ports.find(port => equals(port, { id: origin })) as Port;
  const to = ports.find(port => equals(port, { id: dest })) as Port;

  return { id, color, from, to }
}