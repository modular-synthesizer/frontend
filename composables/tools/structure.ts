import ITool, { InnerNode, IToolParameter } from "~~/lib/interfaces/ITool"

export function parametersFor(node: InnerNode, tool: ITool) {
  return tool.parameters.filter((p: IToolParameter) => {
    return p.targets.includes(node.name)
  })
}

export function getNodeHeight(node: InnerNode, tool: ITool) {
  const np: number = parametersFor(node, tool).length
  return 40 + (np * 60) + (np > 0 ? 20 : 0)
}