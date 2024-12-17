import type { Tool } from '~~/types/tools/Tool';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { Coordinates } from '~/types/utils/Coordinates';

let movedNode: InnerNode;

let origin: Coordinates = {x: 0, y: 0}

export function startInnerNodeDrag($event: MouseEvent, node: InnerNode, tool: Tool, nodes: InnerNode[]) {
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