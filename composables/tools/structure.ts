import { max } from "lodash"
import ITool, { InnerLink, InnerNode, IToolParameter } from "~~/lib/interfaces/ITool"

export function parametersFor(node: InnerNode, tool: ITool) {
  return tool.parameters.filter((p: IToolParameter) => {
    return p.targets.includes(node.name)
  })
}

export function maxIndexFrom(node: InnerNode, tool: ITool): number {
  return max(tool.links.filter((l: InnerLink) => l.from.node === node.name).map((l: InnerLink) => l.from.index + 1)) || 0
}

export function maxIndexTo(node: InnerNode, tool: ITool): number {
  console.log(tool.links.filter((l: InnerLink) => l.to.node === node.name))
  return max(tool.links.filter((l: InnerLink) => l.to.node === node.name).map((l: InnerLink) => l.to.index + 1)) || 0
}

export function getNodeHeight(node: InnerNode, tool: ITool) {
  const np: number = parametersFor(node, tool).length
  const paramsHeight: number = 40 + (np * 60) + (np > 0 ? 20 : 0)
  const fromPortsHeight: number = 20 * (maxIndexFrom(node, tool) + 1);
  const toPortsHeight: number = 20 * (maxIndexTo(node, tool) + 1);
  return max([paramsHeight, fromPortsHeight, toPortsHeight]);
}

export function getStartCoord(link: InnerLink, tool: ITool) {
  const node: InnerNode = getStartNode(link, tool);
}

export function getStartNode(link: InnerLink, tool: ITool): InnerNode {
  return tool.nodes.find((n: InnerNode) => n.name === link.from.node);
}