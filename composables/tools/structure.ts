import { max, uniq } from "lodash"
import type { Tool } from '~~/types/tools/Tool';
import type { ToolPort } from '~~/types/tools/Port';
import type { ToolParameter } from '~~/types/tools/Parameter';
import type { InnerLink } from '~~/types/tools/InnerLink';
import type { InnerNode } from '~~/types/tools/InnerNode';
import type { Coordinates } from "~/types/utils/Coordinates";

export function parametersFor(node: InnerNode, tool: Tool): string[] {
  return uniq([
    ...parametersFromLinks(node, tool),
    ...parametersFromParams(node, tool)
  ]);
}

export function parametersFromLinks(node: InnerNode, tool: Tool) {
  return tool.links.filter((link: InnerLink) => {
    return link.to.node.includes('.') && link.to.node.split('.')[0] === node.name;
  })
  .map((l: InnerLink) =>l.to.node.split('.')[1]);
}

export function parametersFromParams(node: InnerNode, tool: Tool) {
  return tool.parameters.filter((p: ToolParameter) => {
    return p.targets.includes(node.name)
  })
  .map((p: ToolParameter) => p.field)
}

export function maxIndexFrom(node: InnerNode, tool: Tool): number {
  return max([
    ...tool.links.filter((l: InnerLink) => l.from.node === node.name).map((l: InnerLink) => l.from.index + 1),
    ...tool.ports.filter((p: ToolPort) => p.target === node.name && p.kind === 'output').map((p: ToolPort) => p.index + 1)
  ]) || 0
}

export function maxIndexTo(node: InnerNode, tool: Tool): number {
  return max([
    ...tool.links.filter((l: InnerLink) => l.to.node === node.name).map((l: InnerLink) => l.to.index + 1),
    ...tool.ports.filter((p: ToolPort) => p.target === node.name && p.kind === 'input').map((p: ToolPort) => p.index + 1)
  ]) || 0
}

export function getNodeHeight(node: InnerNode, tool: Tool) {
  const np: number = parametersFor(node, tool).length
  const paramsHeight: number = TITLE_HEIGHT + np * PARAM_HEIGHT;
  const fromPortsHeight: number = PORT_HEIGHT * maxIndexFrom(node, tool) + 15;
  const toPortsHeight: number = PORT_HEIGHT * maxIndexTo(node, tool) + 15;
  return max([paramsHeight, fromPortsHeight, toPortsHeight]);
}

export function getStartCoords(link: InnerLink, tool: Tool): Coordinates {
  const node: InnerNode = getStartNode(link, tool);
  return {
    x: node.x + NODE_WIDTH,
    y: node.y + (20 * (link.from.index + 1))
  }
}

export function getEndCoords(link: InnerLink, tool: Tool): Coordinates {
  const node: InnerNode = getEndNode(link, tool);
  return {
    x: node.x,
    y: node.y + (20 * (link.to.index + 1))
  }
}

export function getStartNode(link: InnerLink, tool: Tool): InnerNode {
  return tool.nodes.find((n: InnerNode) => n.name === link.from.node);
}

export function getEndNode(link: InnerLink, tool: Tool): InnerNode {
  return tool.nodes.find((n: InnerNode) => n.name === link.to.node);
}

export function getParamCoords(link: InnerLink, tool: Tool) {
  const [ nodeName, paramName ]: string[] = link.to.node.split('.');
  const node: InnerNode = tool.nodes.find((n: InnerNode) => n.name === nodeName);
  const idx: number = parametersFor(node, tool).indexOf(paramName);
  return {
    x: node.x + 20,
    y: node.y + TITLE_HEIGHT + PARAM_HEIGHT * idx + 10,
  }
}