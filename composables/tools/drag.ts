import ICoordinates from "~~/lib/interfaces/ICoordinates";
import { InnerNode } from "~~/lib/interfaces/ITool";

let movedNode: InnerNode | null = null;

let origin: ICoordinates = {x: 0, y: 0}

export function startInnerNodeDrag($event: MouseEvent, node: InnerNode) {
  movedNode = node;
  origin.x = $event.clientX;
  origin.y = $event.clientY;
}

export function stopInnerNodeDrag($event: MouseEvent) {
  movedNode = null;
}

export function moveInnerNodeDrag($event: MouseEvent) {
  if (movedNode === null) return;
  movedNode.x = $event.clientX - origin.x;
  movedNode.y = $event.clientY - origin.y;
}