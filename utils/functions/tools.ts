import type { Tool } from "~/types/tools/Tool";

export function createEmptyTool(): Tool {
  const category = { id: '', name: '' };
  return { id: '', name: '', category, slots: 2, experimental: true, nodes: [], links: [], parameters: [], ports: [], controls: [] };
}