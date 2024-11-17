import ILink from "~~/lib/interfaces/ILink";
import ISynthesizer from "~~/lib/interfaces/synthesizers/ISynthesizer";
import { repositories } from "~~/lib/repositories";
import { Coordinates } from "~~/lib/types/Coordinates"
import Link from "~~/lib/wrappers/Link";
import Port from "~~/lib/wrappers/Port";

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
  linkCreationState.value.start = { x: port.ax, y: port.ay };
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
  const payload = {
    id: '',
    from: to.isInput() ? from.id : to.id,
    to: from.isInput() ? from.id : to.id,
    synthesizer_id: useSynthesizer().synthesizer.value.id,
    color: 'red'
  }
  const response: ILink = await repositories.links.create(payload);
  useSynthesizer().links.value.push(new Link(response));
  linkCreationState.value.display = false;
}

function canLinkTo(port: Port): boolean {
  return !!linkCreationState.value.startPort?.connectableTo(port);
}

export function magnetize(port: Port) {
  if (!linkCreationState.value.startPort || !canLinkTo(port)) return;
  linkCreationState.value.endPort = port;
  linkCreationState.value.end = { x: port.ax, y: port.ay }
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