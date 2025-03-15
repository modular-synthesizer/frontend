import { times } from "lodash";
import type { Port } from '~/types/modules/Port';
import type { Cable } from "~/types/Cable";
import { equals } from "../functions/equals";

export function createCable(id: string, from: string, to: string, color: string, ports: Array<Port>): Cable {
  const cable: Cable = { id, color, from: searchPort(ports, from), to: searchPort(ports, to) };
  return connectCable(cable);
}

export function searchPort(ports: Array<Port>, id: string): Port {
  return ports.find(port => equals(port, { id })) as Port
}

export function connectCable(cable: Cable): Cable {
  cable.from.link = cable;
  cable.to.link = cable;
  times(cable.from.mod.channels.length, (index: number) => {
    if (cable.from.kind === 'input') {
      getNode(cable.to, index).connect(getNode(cable.from, index), cable.to.index, cable.from.index);
    }
    else {
      getNode(cable.from, index).connect(getNode(cable.to, index), cable.from.index, cable.to.index);
    }
  });
  return cable;
}

function getNode(port: Port, index: number): AudioNode {
  return port.mod.channels[index].nodes[port.target];
}

export function disconnectCable(cable: Cable, _: string = "unknown"): Cable {
  cable.from.link = cable;
  cable.to.link = cable;
  times(cable.from.mod.channels.length, (index: number) => {
    if (cable.from.kind === 'input') {
      getNode(cable.to, index).disconnect(getNode(cable.from, index), cable.to.index, cable.from.index);
    }
    else {
      getNode(cable.from, index).disconnect(getNode(cable.to, index), cable.from.index, cable.to.index);
    }
  });
  return cable;
}