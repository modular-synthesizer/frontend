import { max, uniq } from "lodash"
import type { Blueprint } from '~~/types/blueprints/Blueprint';
import type { ToolPort } from '~~/types/blueprints/Port';
import type { ToolParameter } from '~~/types/blueprints/Parameter';
import type { InnerLink } from '~~/types/blueprints/InnerLink';
import type { InnerNode } from '~~/types/blueprints/InnerNode';
import type { Coordinates } from "~/types/utils/Coordinates";

export function parametersFor(node: InnerNode, blueprint: Blueprint): string[] {
  return uniq([
    ...parametersFromLinks(node, blueprint),
    ...parametersFromParams(node, blueprint)
  ]);
}

export function parametersFromLinks(node: InnerNode, blueprint: Blueprint) {
  return blueprint.links.filter((link: InnerLink) => {
    return link.to.node.includes('.') && link.to.node.split('.')[0] === node.name;
  })
  .map((l: InnerLink) =>l.to.node.split('.')[1]);
}

export function parametersFromParams(node: InnerNode, blueprint: Blueprint) {
  return blueprint.parameters.filter((p: ToolParameter) => {
    return p.targets.includes(node.name)
  })
  .map((p: ToolParameter) => p.field)
}

export function maxIndexFrom(node: InnerNode, blueprint: Blueprint): number {
  return max([
    ...blueprint.links.filter((l: InnerLink) => l.from.node === node.name).map((l: InnerLink) => l.from.index + 1),
    ...blueprint.ports.filter((p: ToolPort) => p.target === node.name && p.kind === 'output').map((p: ToolPort) => p.index + 1)
  ]) || 0
}

export function maxIndexTo(node: InnerNode, blueprint: Blueprint): number {
  return max([
    ...blueprint.links.filter((l: InnerLink) => l.to.node === node.name).map((l: InnerLink) => l.to.index + 1),
    ...blueprint.ports.filter((p: ToolPort) => p.target === node.name && p.kind === 'input').map((p: ToolPort) => p.index + 1)
  ]) || 0
}

export function getNodeHeight(node: InnerNode, blueprint: Blueprint) {
  const np: number = parametersFor(node, blueprint).length
  const paramsHeight: number = TITLE_HEIGHT + np * PARAM_HEIGHT;
  const fromPortsHeight: number = PORT_HEIGHT * maxIndexFrom(node, blueprint) + 15;
  const toPortsHeight: number = PORT_HEIGHT * maxIndexTo(node, blueprint) + 15;
  return max([paramsHeight, fromPortsHeight, toPortsHeight]);
}

export function getStartCoords(link: InnerLink, blueprint: Blueprint): Coordinates {
  const node: InnerNode = getStartNode(link, blueprint);
  return {
    x: node.x + NODE_WIDTH,
    y: node.y + (20 * (link.from.index + 1))
  }
}

export function getEndCoords(link: InnerLink, blueprint: Blueprint): Coordinates {
  const node: InnerNode = getEndNode(link, blueprint);
  return {
    x: node.x,
    y: node.y + (20 * (link.to.index + 1))
  }
}

export function getStartNode(link: InnerLink, blueprint: Blueprint): InnerNode {
  return blueprint.nodes.find((n: InnerNode) => n.name === link.from.node);
}

export function getEndNode(link: InnerLink, blueprint: Blueprint): InnerNode {
  return blueprint.nodes.find((n: InnerNode) => n.name === link.to.node);
}

export function getParamCoords(link: InnerLink, blueprint: Blueprint) {
  const [ nodeName, paramName ]: string[] = link.to.node.split('.');
  const node: InnerNode = blueprint.nodes.find((n: InnerNode) => n.name === nodeName);
  const idx: number = parametersFor(node, blueprint).indexOf(paramName);
  return {
    x: node.x + 20,
    y: node.y + TITLE_HEIGHT + PARAM_HEIGHT * idx + 10,
  }
}