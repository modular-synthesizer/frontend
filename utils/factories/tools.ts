import type { Blueprint } from "~/types/blueprints/Blueprint";

export function createEmptyTool(): Blueprint {
  const category = { id: '', name: '' };
  return { id: '', name: '', category, slots: 2, experimental: true, nodes: [], links: [], parameters: [], ports: [], controls: [], x: 0, y: 0, scale: 1.0 };
}