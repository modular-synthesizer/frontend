import type { Cable } from "~/types/Cable";
import type { Coordinates } from "~/types/utils/Coordinates";
import { createCable } from "~/utils/factories/cables";
import { getAbsoluteCoordinates, isInput } from "~/utils/functions/ports";
import type ISynthesizer from "~~/lib/interfaces/synthesizers/ISynthesizer";
import { repositories } from "~~/lib/repositories";
import type { Port } from '~/types/modules/Port';

type StateType = {
  start?: Coordinates,
  end?: Coordinates,
  display?: boolean,
  startPort?: Port,
  endPort?: Port,
}
export const linkCreationState = useState<StateType>('linkCreation', () => ({}));

function setStartPort(port: Port) {
  linkCreationState.value.startPort = port;
  linkCreationState.value.start = getAbsoluteCoordinates(port)
}

function setEndCoordinates({ x, y }: Coordinates) {
  const { scale, x: sx, y: sy}: ISynthesizer = useSynthesizer().synthesizer.value;
  linkCreationState.value.end = { x: (x - sx) / scale, y: (y - sy) / scale }
}

function move(x: number, y: number) {
  if (linkCreationState.value.endPort !== undefined) return;
  setEndCoordinates({ x, y });
}

function end() {
  if (!linkCreationState.value.endPort) {
    linkCreationState.value.display = false;
  }
  createLink();
  linkCreationState.value.startPort = undefined;
}

async function createLink() {
  const { startPort: from, endPort: to } = linkCreationState.value;
  if (!from || !to) return
  const insertion: Cable = createCable('', from.id, to.id, 'red', usePorts().ports);
  useSynthesizer().links.value.push(insertion);
  const payload = {
    id: '',
    from: isInput(to) ? from.id : to.id,
    to: isInput(from) ? from.id : to.id,
    synthesizer_id: useSynthesizer().synthesizer.value.id,
    color: 'red'
  }
  linkCreationState.value.display = false;
  insertion.id = (await repositories.links.create(payload)).id;
}

function canLinkTo(port: Port): boolean {
  return linkCreationState.value.startPort?.kind !== port.kind
}

export function magnetize(port: Port) {
  console.log(!linkCreationState.value.startPort, !canLinkTo(port))
  if (!linkCreationState.value.startPort || !canLinkTo(port)) return;
  linkCreationState.value.endPort = port;
  linkCreationState.value.end = getAbsoluteCoordinates(port);
}

export function unmagnetize() {
  if (!linkCreationState.value.startPort) return;
  linkCreationState.value.endPort = undefined;
}

export function startLinkCreation(port: Port, $event: MouseEvent) {
  setStartPort(port);
  setEndCoordinates({ x: $event.clientX, y: $event.clientY});
  startDragEvent($event, { move, end })
  linkCreationState.value.display = true;
}