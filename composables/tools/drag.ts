import ICoordinates from "~~/lib/interfaces/ICoordinates";
import ITool, { InnerNode } from "~~/lib/interfaces/ITool";

let movedNode: InnerNode;

let origin: ICoordinates = {x: 0, y: 0}

export function startInnerNodeDrag($event: MouseEvent, node: InnerNode, tool: ITool, nodes: InnerNode[]) {
  movedNode = node;
  origin = {x: $event.clientX, y: $event.clientY}
  startDragEvent($event, { move, end: () => saveInnerNode(nodes, node, tool) });
}

function move(x: number, y: number) {
  movedNode.x += x - origin.x;
  movedNode.y += y - origin.y;
  origin.x = x;
  origin.y = y;
}