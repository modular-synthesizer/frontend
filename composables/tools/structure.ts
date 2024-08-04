import { max, uniq } from "lodash"
import ICoordinates from "~~/lib/interfaces/ICoordinates"
import ITool, { InnerLink, InnerNode, IToolParameter } from "~~/lib/interfaces/ITool"

export function parametersFor(node: InnerNode, tool: ITool): string[] {
  return uniq(tool.links.filter((link: InnerLink) => {
    return link.to.node.includes('.') && link.to.node.split('.')[0] === node.name;
  })
  .map((l: InnerLink) =>l.to.node.split('.')[1]));
}

export function maxIndexFrom(node: InnerNode, tool: ITool): number {
  return max(tool.links.filter((l: InnerLink) => l.from.node === node.name).map((l: InnerLink) => l.from.index + 1)) || 0
}

export function maxIndexTo(node: InnerNode, tool: ITool): number {
  return max(tool.links.filter((l: InnerLink) => l.to.node === node.name).map((l: InnerLink) => l.to.index + 1)) || 0
}

export function getNodeHeight(node: InnerNode, tool: ITool) {
  const np: number = parametersFor(node, tool).length
  const paramsHeight: number = 40 + (np * 60) + (np > 0 ? 20 : 0)
  const fromPortsHeight: number = 20 * (maxIndexFrom(node, tool) + 1);
  const toPortsHeight: number = 20 * (maxIndexTo(node, tool) + 1);
  return max([paramsHeight, fromPortsHeight, toPortsHeight]);
}

export function getStartCoords(link: InnerLink, tool: ITool): ICoordinates {
  const node: InnerNode = getStartNode(link, tool);
  return {
    x: node.x + 180,
    y: node.y + (20 * (link.from.index + 1))
  }
}

export function getEndCoords(link: InnerLink, tool: ITool): ICoordinates {
  const node: InnerNode = getEndNode(link, tool);
  return {
    x: node.x,
    y: node.y + (20 * (link.to.index + 1))
  }
}

export function getStartNode(link: InnerLink, tool: ITool): InnerNode {
  return tool.nodes.find((n: InnerNode) => n.name === link.from.node);
}

export function getEndNode(link: InnerLink, tool: ITool): InnerNode {
  return tool.nodes.find((n: InnerNode) => n.name === link.to.node);
}

export function getParamCoords(link: InnerLink, tool: ITool) {
  const [ nodeName, paramName ]: string[] = link.to.node.split('.');
  const node: InnerNode = tool.nodes.find((n: InnerNode) => n.name === nodeName);
  const idx: number = parametersFor(node, tool).indexOf(paramName);
  return {
    x: node.x + 10,
    y: node.y + 70 + (60 * idx)
  }
}

export const backgroundCallbacks: (() => void)[] = []

export function registerBackgroundClick(callback: () => void) {
  backgroundCallbacks.push(callback)
}

export function triggerBackgroundCallbacks() {
  backgroundCallbacks.forEach((cb: () => void) => cb())
}