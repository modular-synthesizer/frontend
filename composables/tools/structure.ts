import { max, uniq } from "lodash"
import ICoordinates from "~~/lib/interfaces/ICoordinates"
import ITool, { InnerLink, InnerNode, IToolParameter, IToolPort } from "~~/lib/interfaces/ITool"

export function parametersFor(node: InnerNode, tool: ITool): string[] {
  return uniq([
    ...parametersFromLinks(node, tool),
    ...parametersFromParams(node, tool)
  ]);
}

export function parametersFromLinks(node: InnerNode, tool: ITool) {
  return tool.links.filter((link: InnerLink) => {
    return link.to.node.includes('.') && link.to.node.split('.')[0] === node.name;
  })
  .map((l: InnerLink) =>l.to.node.split('.')[1]);
}

export function parametersFromParams(node: InnerNode, tool: ITool) {
  return tool.parameters.filter((p: IToolParameter) => {
    return p.targets.includes(node.name)
  })
  .map((p: IToolParameter) => p.field)
}

export function maxIndexFrom(node: InnerNode, tool: ITool): number {
  return max([
    ...tool.links.filter((l: InnerLink) => l.from.node === node.name).map((l: InnerLink) => l.from.index + 1),
    ...tool.ports.filter((p: IToolPort) => p.target === node.name && p.kind === 'output').map((p: IToolPort) => p.index + 1)
  ]) || 0
}

export function maxIndexTo(node: InnerNode, tool: ITool): number {
  return max([
    ...tool.links.filter((l: InnerLink) => l.to.node === node.name).map((l: InnerLink) => l.to.index + 1),
    ...tool.ports.filter((p: IToolPort) => p.target === node.name&& p.kind === 'input').map((p: IToolPort) => p.index + 1)
  ]) || 0
}

export const TITLE_HEIGHT = 40;
export const PARAM_HEIGHT = 30;
export const PORT_HEIGHT = 20;

export const NODE_WIDTH = 180;

export function getNodeHeight(node: InnerNode, tool: ITool) {
  const np: number = parametersFor(node, tool).length
  const paramsHeight: number = TITLE_HEIGHT + np * PARAM_HEIGHT;
  const fromPortsHeight: number = PORT_HEIGHT * maxIndexFrom(node, tool) + 15;
  const toPortsHeight: number = PORT_HEIGHT * maxIndexTo(node, tool) + 15;
  return max([paramsHeight, fromPortsHeight, toPortsHeight]);
}

export function getStartCoords(link: InnerLink, tool: ITool): ICoordinates {
  const node: InnerNode = getStartNode(link, tool);
  return {
    x: node.x + NODE_WIDTH,
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
    x: node.x + 20,
    y: node.y + TITLE_HEIGHT + PARAM_HEIGHT * idx + 10,
  }
}