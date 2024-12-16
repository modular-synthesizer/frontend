import type { Tool } from "~/types/tools/Tool";

export function createEmptyTool(): Tool {
  return { name: '', categoryId: '', slots: 2, experimental: true, nodes: [], links: [], parameters: [], ports: [], controls: [] };
}

export function category(tool: Tool) {
}